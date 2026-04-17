@echo off
SETLOCAL EnableDelayedExpansion

:: ==============================================================================
:: Backup Database Script - Site Amaral
:: ==============================================================================

:: Configuration
SET DB_HOST=127.0.0.1
SET DB_PORT=3306
SET DB_USER=root
SET DB_NAME=site_amaral_local
SET BACKUP_DIR=database-backups

:: Timestamp calculation (YYYY-MM-DD-HHmm)
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
set TIMESTAMP=%datetime:~0,4%-%datetime:~4,2%-%datetime:~6,2%-%datetime:~8,2%%datetime:~10,2%

SET FILENAME=%BACKUP_DIR%\backup-%TIMESTAMP%.sql

:: Check mysqldump Path
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

:: Create dir if missing (safety check)
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
