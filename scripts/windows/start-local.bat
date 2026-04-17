@echo off
SETLOCAL EnableDelayedExpansion
cd /d "%~dp0..\.."

:: ==============================================================================
:: Local Start Script - Site Amaral
:: ==============================================================================

SET DB_HOST=127.0.0.1
SET DB_PORT=3306
SET DB_USER=root
SET DB_NAME=site_amaral_local

echo ---------------------------------------------------------
echo [1/2] Verificando ambiente...
echo ---------------------------------------------------------

mysql -h %DB_HOST% -P %DB_PORT% -u %DB_USER% -e "SELECT 1;" >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [AVISO] Banco de dados MySQL nao esta acessivel em %DB_HOST%:%DB_PORT%.
    echo Certifique-se de que o Laragon/MySQL esta rodando.
    echo O servidor de backend tentara subir de qualquer forma.
) else (
    echo [OK] MySQL esta rodando.
)

mysql -h %DB_HOST% -P %DB_PORT% -u %DB_USER% -e "USE %DB_NAME%;" >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [SISTEMA] Banco %DB_NAME% nao encontrado. Executando setup inicial...
    call "%~dp0setup-db.bat"
)

echo ---------------------------------------------------------
echo [2/2] Iniciando Frontend e Backend...
echo ---------------------------------------------------------

echo.
echo Pressione CTRL+C para encerrar ambos os servidores.
echo.

npm run dev

pause
