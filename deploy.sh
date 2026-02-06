#!/bin/bash

echo "🚀 DEPLOY DO PAINEL r7dev"
echo ""

# Verificar se está no diretório correto
if [ ! -f "server.js" ]; then
    echo "❌ Erro: Execute este script dentro da pasta painel-admin"
    exit 1
fi

echo "Escolha a plataforma de deploy:"
echo "1) Railway (Recomendado - mantém keys.json)"
echo "2) Vercel (Rápido - precisa adaptar)"
echo "3) Heroku (Tradicional)"
echo ""
read -p "Digite o número (1-3): " choice

case $choice in
    1)
        echo ""
        echo "📦 DEPLOY NO RAILWAY"
        echo ""
        
        # Verificar se Railway CLI está instalado
        if ! command -v railway &> /dev/null; then
            echo "Instalando Railway CLI..."
            npm install -g @railway/cli
        fi
        
        echo "Fazendo login..."
        railway login
        
        echo "Inicializando projeto..."
        railway init
        
        echo "Fazendo deploy..."
        railway up
        
        echo ""
        read -p "Digite a senha do painel: " password
        railway variables set ADMIN_PASSWORD="$password"
        
        echo ""
        echo "Configurando domínio..."
        railway domain
        
        echo ""
        echo "✅ Deploy concluído!"
        echo "🌐 Acesse a URL exibida acima"
        ;;
        
    2)
        echo ""
        echo "⚡ DEPLOY NA VERCEL"
        echo ""
        
        # Verificar se Vercel CLI está instalado
        if ! command -v vercel &> /dev/null; then
            echo "Instalando Vercel CLI..."
            npm install -g vercel
        fi
        
        echo "Fazendo login..."
        vercel login
        
        echo "Fazendo deploy..."
        vercel
        
        echo ""
        read -p "Digite a senha do painel: " password
        vercel env add ADMIN_PASSWORD production <<< "$password"
        
        echo "Deploy para produção..."
        vercel --prod
        
        echo ""
        echo "✅ Deploy concluído!"
        echo "⚠️  IMPORTANTE: Configure Vercel KV ou MongoDB para persistir keys"
        ;;
        
    3)
        echo ""
        echo "🔷 DEPLOY NO HEROKU"
        echo ""
        
        # Verificar se Heroku CLI está instalado
        if ! command -v heroku &> /dev/null; then
            echo "❌ Heroku CLI não instalado"
            echo "Instale em: https://devcenter.heroku.com/articles/heroku-cli"
            exit 1
        fi
        
        echo "Fazendo login..."
        heroku login
        
        read -p "Nome do app (ex: painel-keys-r7dev): " appname
        
        echo "Criando app..."
        heroku create "$appname"
        
        echo "Fazendo deploy..."
        git init
        git add .
        git commit -m "Deploy inicial"
        git push heroku main
        
        echo ""
        read -p "Digite a senha do painel: " password
        heroku config:set ADMIN_PASSWORD="$password"
        
        echo ""
        echo "✅ Deploy concluído!"
        echo "🌐 URL: https://$appname.herokuapp.com"
        ;;
        
    *)
        echo "❌ Opção inválida"
        exit 1
        ;;
esac

echo ""
echo "📝 PRÓXIMOS PASSOS:"
echo "1. Acesse a URL do seu painel"
echo "2. Faça login com a senha configurada"
echo "3. Atualize config.js da extensão com a nova URL"
echo "4. Teste gerando uma key"
echo ""
echo "🎉 Pronto para usar!"
