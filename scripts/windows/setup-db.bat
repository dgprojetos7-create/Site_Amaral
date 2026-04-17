@echo off
SETLOCAL EnableDelayedExpansion
cd /d "%~dp0..\.."

:: ==============================================================================
:: Setup Database Script - Site Amaral (Laragon/Local)
:: ==============================================================================

SET DB_HOST=127.0.0.1
SET DB_PORT=3306
SET DB_USER=root
SET DB_NAME=site_amaral_local
SET SCHEMA_PATH=%CD%\server\sql\schema.sql

echo ---------------------------------------------------------
echo [1/4] Verificando conexao com MySQL...
echo ---------------------------------------------------------

where mysql >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [AVISO] 'mysql' nao esta no PATH Global. Tentando localizar Laragon...
    if exist "C:\laragon\bin\mysql\mysql-8.4.3-winx64\bin\mysql.exe" (
        SET MYSQL_BIN="C:\laragon\bin\mysql\mysql-8.4.3-winx64\bin\mysql.exe"
        echo [OK] MySQL do Laragon encontrado.
    ) else (
        echo [ERRO] Laragon MySQL nao encontrado em C:\laragon.
        echo Por favor, adicione o bin do MySQL ao seu PATH ou inicie o Laragon.
        pause
        exit /b 1
    )
) else (
    SET MYSQL_BIN=mysql
)

echo ---------------------------------------------------------
echo [2/4] Criando banco de dados: %DB_NAME%
echo ---------------------------------------------------------

%MYSQL_BIN% -h %DB_HOST% -P %DB_PORT% -u %DB_USER% -e "CREATE DATABASE IF NOT EXISTS %DB_NAME% CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
if %ERRORLEVEL% neq 0 (
    echo [ERRO] Falha ao criar o banco de dados.
    pause
    exit /b 1
)
echo [OK] Banco de dados criado ou ja existente.

echo ---------------------------------------------------------
echo [3/4] Importando schema: %SCHEMA_PATH%
echo ---------------------------------------------------------

if not exist "%SCHEMA_PATH%" (
    echo [ERRO] Arquivo de schema nao encontrado em: %SCHEMA_PATH%
    pause
    exit /b 1
)

%MYSQL_BIN% -h %DB_HOST% -P %DB_PORT% -u %DB_USER% %DB_NAME% < "%SCHEMA_PATH%"
if %ERRORLEVEL% neq 0 (
    echo [ERRO] Falha ao importar o schema.sql.
    pause
    exit /b 1
)
echo [OK] Tabelas importadas com sucesso.

echo ---------------------------------------------------------
echo [4/4] Criando usuario administrador (Seed)
echo ---------------------------------------------------------

call npm run db:seed-admin
if %ERRORLEVEL% neq 0 (
    echo [AVISO] O seed falhou. Verifique se as dependencias (npm install) foram instaladas.
) else (
    echo [OK] Usuario administrador configurado.
)

echo.
echo =========================================================
echo CONFIGURACAO CONCLUIDA COM SUCESSO!
echo =========================================================
echo.
echo Frontend: http://localhost:5174
echo Backend: http://localhost:3001
echo.
echo Pressione qualquer tecla para sair...
pause >nul
