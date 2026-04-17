@echo off
SETLOCAL EnableDelayedExpansion
cd /d "%~dp0..\.."

:: ==============================================================================
:: Backup Database Script - Site Amaral
:: ==============================================================================

SET DB_HOST=127.0.0.1
SET DB_PORT=3306
SET DB_USER=root
SET DB_NAME=site_amaral_local
SET BACKUP_DIR=%CD%\database-backups

for /f %%I in ('powershell -NoProfile -Command "Get-Date -Format yyyy-MM-dd-HHmmss"') do set TIMESTAMP=%%I
SET FILENAME=%BACKUP_DIR%\backup-%TIMESTAMP%.sql

where mysqldump >nul 2>nul
if %ERRORLEVEL% neq 0 (
    if exist "C:\laragon\bin\mysql\mysql-8.4.3-winx64\bin\mysqldump.exe" (
        SET DUMP_BIN="C:\laragon\bin\mysql\mysql-8.4.3-winx64\bin\mysqldump.exe"
    ) else (
        echo [ERRO] mysqldump nao encontrado.
        pause
        exit /b 1
    )
) else (
    SET DUMP_BIN=mysqldump
)

echo ---------------------------------------------------------
echo Iniciando backup do banco: %DB_NAME%
echo Destino: %FILENAME%
echo ---------------------------------------------------------

if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

%DUMP_BIN% -h %DB_HOST% -P %DB_PORT% -u %DB_USER% %DB_NAME% > "%FILENAME%"

if %ERRORLEVEL% neq 0 (
    echo [ERRO] Falha ao gerar o backup. Verifique se o mysqldump esta no seu PATH.
    pause
    exit /b 1
)

echo [OK] Backup gerado com sucesso em: %FILENAME%
echo.
pause
