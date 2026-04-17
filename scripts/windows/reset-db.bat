@echo off
SETLOCAL EnableDelayedExpansion
cd /d "%~dp0..\.."

:: ==============================================================================
:: Reset Database Script - Site Amaral
:: ==============================================================================

SET DB_HOST=127.0.0.1
SET DB_PORT=3306
SET DB_USER=root
SET DB_NAME=site_amaral_local
SET SCHEMA_PATH=%CD%\server\sql\schema.sql

echo.
echo !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
echo   AVISO: ISSO IRA APAGAR TODOS OS DADOS DO BANCO %DB_NAME%
echo !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
echo.

set /p CONFIRM="Voce tem certeza que deseja resetar o banco? (S/N): "
if /i "%CONFIRM%" neq "S" (
    echo Reset cancelado pelo usuario.
    pause
    exit /b 0
)

where mysql >nul 2>nul
if %ERRORLEVEL% neq 0 (
    if exist "C:\laragon\bin\mysql\mysql-8.4.3-winx64\bin\mysql.exe" (
        SET MYSQL_BIN="C:\laragon\bin\mysql\mysql-8.4.3-winx64\bin\mysql.exe"
    ) else (
        echo [ERRO] MySQL nao encontrado. Inicie o Laragon ou adicione ao PATH.
        pause
        exit /b 1
    )
) else (
    SET MYSQL_BIN=mysql
)

echo ---------------------------------------------------------
echo [1/4] Removendo banco de dados antigo...
echo ---------------------------------------------------------

%MYSQL_BIN% -h %DB_HOST% -P %DB_PORT% -u %DB_USER% -e "DROP DATABASE IF EXISTS %DB_NAME%;"
if %ERRORLEVEL% neq 0 (
    echo [ERRO] Falha ao remover o banco de dados.
    pause
    exit /b 1
)

echo ---------------------------------------------------------
echo [2/4] Recriando banco de dados...
echo ---------------------------------------------------------

%MYSQL_BIN% -h %DB_HOST% -P %DB_PORT% -u %DB_USER% -e "CREATE DATABASE %DB_NAME% CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
if %ERRORLEVEL% neq 0 (
    echo [ERRO] Falha ao recriar o banco de dados.
    pause
    exit /b 1
)

echo ---------------------------------------------------------
echo [3/4] Importando estrutura inicial (schema)...
echo ---------------------------------------------------------

%MYSQL_BIN% -h %DB_HOST% -P %DB_PORT% -u %DB_USER% %DB_NAME% < "%SCHEMA_PATH%"
if %ERRORLEVEL% neq 0 (
    echo [ERRO] Falha ao importar o schema.
    pause
    exit /b 1
)

echo ---------------------------------------------------------
echo [4/4] Populando administrador (Seed)...
echo ---------------------------------------------------------

call npm run db:seed-admin
if %ERRORLEVEL% neq 0 (
    echo [AVISO] O seed falhou. Verifique se as dependencias estao instaladas.
)

echo.
echo =========================================================
echo DATABASE RESET CONCLUIDO COM SUCESSO!
echo =========================================================
echo.
pause
