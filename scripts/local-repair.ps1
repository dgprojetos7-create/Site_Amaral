param(
  [switch]$OpenBrowser = $true,
  [switch]$RunSaveCheck = $true
)

$ErrorActionPreference = 'Stop'

function Write-Step {
  param([string]$Message)
  Write-Host ""
  Write-Host "==> $Message" -ForegroundColor Cyan
}

function Get-RepoRoot {
  Split-Path -Parent $PSScriptRoot
}

function Get-MysqlBinary {
  $command = Get-Command mysql -ErrorAction SilentlyContinue
  if ($command) {
    return $command.Source
  }

  $laragonBinary = Get-ChildItem -Path 'C:\laragon\bin\mysql' -Recurse -Filter 'mysql.exe' -ErrorAction SilentlyContinue |
    Sort-Object FullName -Descending |
    Select-Object -First 1 -ExpandProperty FullName

  if ($laragonBinary) {
    return $laragonBinary
  }

  throw "Nao foi possivel localizar mysql.exe. Verifique o Laragon ou o PATH."
}

function Wait-HttpOk {
  param(
    [Parameter(Mandatory = $true)][string]$Url,
    [int]$Attempts = 30,
    [int]$DelaySeconds = 2
  )

  for ($attempt = 1; $attempt -le $Attempts; $attempt += 1) {
    try {
      $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 5
      return $response
    } catch {
      if ($attempt -eq $Attempts) {
        throw "A URL $Url nao respondeu apos $Attempts tentativas."
      }

      Start-Sleep -Seconds $DelaySeconds
    }
  }
}

function Stop-PortProcess {
  param([int]$Port)

  $connections = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue |
    Select-Object -ExpandProperty OwningProcess -Unique

  foreach ($processId in $connections) {
    if ($processId -and $processId -ne 0) {
      try {
        Stop-Process -Id $processId -Force -ErrorAction Stop
        Write-Host "Processo na porta $Port encerrado: PID $processId" -ForegroundColor Yellow
      } catch {
        Write-Host "Nao foi possivel encerrar o PID $processId na porta ${Port}: $($_.Exception.Message)" -ForegroundColor Yellow
      }
    }
  }
}

function Write-EnvFile {
  param(
    [Parameter(Mandatory = $true)][string]$Path,
    [Parameter(Mandatory = $true)][string]$Content
  )

  Set-Content -Path $Path -Value $Content -Encoding UTF8
}

$repoRoot = Get-RepoRoot
Set-Location $repoRoot

$dbHost = '127.0.0.1'
$dbPort = 3306
$dbUser = 'root'
$dbPassword = ''
$dbName = 'site_amaral_local'
$apiUrl = 'http://127.0.0.1:3001'
$frontendUrl = 'http://localhost:5174'
$adminEmail = 'admin@niltonamaral.com'
$adminPassword = 'ChangeMe123!'
$mysqlBinary = Get-MysqlBinary
$schemaPath = Join-Path $repoRoot 'server\sql\schema.sql'
$envContent = @"
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5174
JWT_SECRET=dev-secret-key-change-me
JWT_EXPIRES_IN=7d

DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=site_amaral_local

ADMIN_SEED_NAME=Administrador
ADMIN_SEED_EMAIL=admin@niltonamaral.com
ADMIN_SEED_PASSWORD=ChangeMe123!
"@

Write-Step "Alinhando .env local"
Write-EnvFile -Path (Join-Path $repoRoot '.env') -Content $envContent
Write-EnvFile -Path (Join-Path $repoRoot '.env.development') -Content $envContent

Write-Step "Parando processos antigos em 3001 e 5174"
Stop-PortProcess -Port 3001
Stop-PortProcess -Port 5174

Write-Step "Garantindo banco local $dbName"
& $mysqlBinary -h $dbHost -P $dbPort -u $dbUser -e "CREATE DATABASE IF NOT EXISTS $dbName CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

Write-Step "Importando schema.sql"
$mysqlImportCommand = "`"$mysqlBinary`" -h $dbHost -P $dbPort -u $dbUser $dbName < `"$schemaPath`""
cmd /c $mysqlImportCommand | Out-Null

Write-Step "Rodando seed do admin"
npm run db:seed-admin

Write-Step "Subindo backend"
Start-Process powershell.exe -ArgumentList '-NoProfile', '-Command', 'npm run dev:server' -WorkingDirectory $repoRoot | Out-Null
Wait-HttpOk -Url "$apiUrl/api/health" | Out-Null

Write-Step "Validando /api/site-sections"
$siteSectionsResponse = Wait-HttpOk -Url "$apiUrl/api/site-sections"
$siteSectionsJson = $siteSectionsResponse.Content | ConvertFrom-Json
if (-not $siteSectionsJson.sections.about) {
  throw "A resposta de /api/site-sections nao trouxe a secao about."
}

if ($RunSaveCheck) {
  Write-Step "Validando save do admin com restauracao automatica"
  $originalAbout = @{
    trajetoria = $siteSectionsJson.sections.about.trajetoria
    transicao = $siteSectionsJson.sections.about.transicao
  }

  $session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
  $loginBody = @{
    email = $adminEmail
    password = $adminPassword
  } | ConvertTo-Json -Compress

  Invoke-WebRequest -Uri "$apiUrl/api/auth/login" -Method POST -UseBasicParsing -ContentType 'application/json' -Body $loginBody -WebSession $session | Out-Null

  $marker = "Codex local save check $(Get-Date -Format 'yyyyMMdd-HHmmss')"
  $testAbout = @{
    trajetoria = "$marker - trajetoria"
    transicao = "$marker - transicao"
  }

  $saveBody = $testAbout | ConvertTo-Json -Compress
  $saveResponse = Invoke-WebRequest -Uri "$apiUrl/api/site-sections/about" -Method PUT -UseBasicParsing -ContentType 'application/json' -Body $saveBody -WebSession $session
  $saveJson = $saveResponse.Content | ConvertFrom-Json

  if ($saveJson.section.trajetoria -ne $testAbout.trajetoria -or $saveJson.section.transicao -ne $testAbout.transicao) {
    throw "O PUT /api/site-sections/about respondeu, mas nao devolveu o payload atualizado."
  }

  $afterSave = (Invoke-WebRequest -Uri "$apiUrl/api/site-sections" -UseBasicParsing -TimeoutSec 5).Content | ConvertFrom-Json
  if ($afterSave.sections.about.trajetoria -ne $testAbout.trajetoria -or $afterSave.sections.about.transicao -ne $testAbout.transicao) {
    throw "A API publica nao refletiu a alteracao salva na secao about."
  }

  $restoreBody = $originalAbout | ConvertTo-Json -Compress
  Invoke-WebRequest -Uri "$apiUrl/api/site-sections/about" -Method PUT -UseBasicParsing -ContentType 'application/json' -Body $restoreBody -WebSession $session | Out-Null
}

Write-Step "Subindo frontend"
Start-Process powershell.exe -ArgumentList '-NoProfile', '-Command', 'npm run dev:client' -WorkingDirectory $repoRoot | Out-Null
Wait-HttpOk -Url $frontendUrl | Out-Null

if ($OpenBrowser) {
  Write-Step "Abrindo o site no navegador"
  Start-Process $frontendUrl | Out-Null
}

Write-Host ""
Write-Host "Ambiente local pronto." -ForegroundColor Green
Write-Host "Frontend: $frontendUrl"
Write-Host "Backend:  $apiUrl"
Write-Host "Login:    $adminEmail"
Write-Host "Senha:    $adminPassword"
