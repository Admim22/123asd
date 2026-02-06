@echo off
echo ========================================
echo   DEPLOY DO PAINEL r7dev
echo ========================================
echo.

REM Verificar se está no diretório correto
if not exist "server.js" (
    echo [ERRO] Execute este script dentro da pasta painel-admin
    pause
    exit /b 1
)

echo Escolha a plataforma de deploy:
echo.
echo 1) Railway (Recomendado - mantem keys.json)
echo 2) Vercel (Rapido - precisa adaptar)
echo 3) Heroku (Tradicional)
echo.
set /p choice="Digite o numero (1-3): "

if "%choice%"=="1" goto railway
if "%choice%"=="2" goto vercel
if "%choice%"=="3" goto heroku
echo [ERRO] Opcao invalida
pause
exit /b 1

:railway
echo.
echo ========================================
echo   DEPLOY NO RAILWAY
echo ========================================
echo.

REM Verificar se Railway CLI está instalado
where railway >nul 2>nul
if %errorlevel% neq 0 (
    echo Instalando Railway CLI...
    npm install -g @railway/cli
)

echo Fazendo login...
railway login

echo Inicializando projeto...
railway init

echo Fazendo deploy...
railway up

echo.
set /p password="Digite a senha do painel: "
railway variables set ADMIN_PASSWORD=%password%

echo.
echo Configurando dominio...
railway domain

echo.
echo ========================================
echo   DEPLOY CONCLUIDO!
echo ========================================
echo.
echo Acesse a URL exibida acima
goto end

:vercel
echo.
echo ========================================
echo   DEPLOY NA VERCEL
echo ========================================
echo.

REM Verificar se Vercel CLI está instalado
where vercel >nul 2>nul
if %errorlevel% neq 0 (
    echo Instalando Vercel CLI...
    npm install -g vercel
)

echo Fazendo login...
vercel login

echo Fazendo deploy...
vercel

echo.
set /p password="Digite a senha do painel: "
echo %password% | vercel env add ADMIN_PASSWORD production

echo Deploy para producao...
vercel --prod

echo.
echo ========================================
echo   DEPLOY CONCLUIDO!
echo ========================================
echo.
echo [IMPORTANTE] Configure Vercel KV ou MongoDB para persistir keys
goto end

:heroku
echo.
echo ========================================
echo   DEPLOY NO HEROKU
echo ========================================
echo.

REM Verificar se Heroku CLI está instalado
where heroku >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERRO] Heroku CLI nao instalado
    echo Instale em: https://devcenter.heroku.com/articles/heroku-cli
    pause
    exit /b 1
)

echo Fazendo login...
heroku login

set /p appname="Nome do app (ex: painel-keys-r7dev): "

echo Criando app...
heroku create %appname%

echo Fazendo deploy...
git init
git add .
git commit -m "Deploy inicial"
git push heroku main

echo.
set /p password="Digite a senha do painel: "
heroku config:set ADMIN_PASSWORD=%password%

echo.
echo ========================================
echo   DEPLOY CONCLUIDO!
echo ========================================
echo.
echo URL: https://%appname%.herokuapp.com
goto end

:end
echo.
echo ========================================
echo   PROXIMOS PASSOS
echo ========================================
echo.
echo 1. Acesse a URL do seu painel
echo 2. Faca login com a senha configurada
echo 3. Atualize config.js da extensao com a nova URL
echo 4. Teste gerando uma key
echo.
echo Pronto para usar!
echo.
pause
