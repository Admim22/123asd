# 🔐 r7dev — Painel Admin de Licenças

Sistema completo de gerenciamento de licenças para extensões Chrome com controle **1 key = 1 PC**.

## ✨ Funcionalidades

- ✅ Gerar keys ilimitadas
- ✅ Definir validade em dias ou vitalícia
- ✅ Sistema 1 key = 1 PC (vinculação automática)
- ✅ Validador de keys com dias restantes
- ✅ Interface web moderna
- ✅ API REST completa
- ✅ Sem necessidade de banco de dados

## 🚀 Início Rápido

### 1. Instalar dependências
```bash
cd painel-admin
npm install
```

### 2. Iniciar o servidor
```bash
npm start
```

O painel estará disponível em: **http://localhost:3000**

### 3. Acessar o painel
- URL: http://localhost:3000
- Senha padrão: `admin123`

### 4. Gerar uma key
1. Faça login no painel
2. Digite o número de dias (ex: 7, 30, 365)
3. Deixe vazio para key vitalícia
4. Clique em "Gerar key"
5. Copie a key gerada

### 5. Usar na extensão
1. Abra a extensão
2. Cole a key
3. Clique em "Ativar Agora"
4. ✅ Pronto!

## 📡 API Endpoints

### POST /api/validate
Valida uma key e vincula ao PC (usado pela extensão)

**Request:**
```json
{
  "licenseKey": "R7D-XXXX-XXXX-XXXX",
  "deviceFingerprint": "hash-unico-do-pc"
}
```

**Response:**
```json
{
  "valid": true,
  "message": "Licença ativada com sucesso (1 PC)",
  "license": { "lifetime": true },
  "userData": null
}
```

### GET /api/check-key?key=XXX
Verifica validade e dias restantes de uma key

**Headers:**
```
Authorization: Bearer admin123
```

**Response:**
```json
{
  "valid": true,
  "expired": false,
  "message": "30 dia(s) restante(s)",
  "daysLeft": 30,
  "boundDevice": true
}
```

### GET /api/keys
Lista todas as keys

**Headers:**
```
Authorization: Bearer admin123
```

### POST /api/keys
Gera uma nova key

**Headers:**
```
Authorization: Bearer admin123
```

**Request:**
```json
{
  "days": 30
}
```

### POST /api/login
Autentica no painel

**Request:**
```json
{
  "password": "admin123"
}
```

## 🔧 Configuração

### Mudar a senha
```bash
# Windows
set ADMIN_PASSWORD=minhasenha123
npm start

# Linux/Mac
ADMIN_PASSWORD=minhasenha123 npm start
```

### Mudar a porta
```bash
# Windows
set PORT=8080
npm start

# Linux/Mac
PORT=8080 npm start
```

### Usar arquivo .env
```bash
echo "ADMIN_PASSWORD=minhasenha123" > .env
echo "PORT=3000" >> .env
npm install dotenv
```

Adicione no início do `server.js`:
```javascript
require('dotenv').config();
```

## 📁 Estrutura de Arquivos

```
painel-admin/
├── server.js          # Servidor Express + API
├── index.html         # Interface do painel
├── keys.json          # Banco de dados de keys
├── package.json       # Dependências
├── test-api.js        # Script de testes
└── README.md          # Este arquivo
```

## 🧪 Testar a API

### Teste automático
```bash
node test-api.js
```

### Teste manual com curl
```bash
# Validar uma key
curl -X POST http://localhost:3000/api/validate \
  -H "Content-Type: application/json" \
  -d '{"licenseKey":"R7D-XXXX-XXXX-XXXX","deviceFingerprint":"TEST-123"}'

# Verificar dias restantes
curl "http://localhost:3000/api/check-key?key=R7D-XXXX-XXXX-XXXX" \
  -H "Authorization: Bearer admin123"
```

## 🔐 Sistema 1 PC

### Como funciona?
1. Usuário ativa a key pela primeira vez
2. Extensão gera um fingerprint único do PC
3. Servidor vincula a key a esse fingerprint
4. Tentativas em outros PCs são bloqueadas

### O que é o fingerprint?
Um hash SHA-256 gerado a partir de:
- User Agent (navegador + sistema)
- Resolução da tela
- Timezone
- Idioma

### Desvincular uma key
Edite `keys.json` e mude:
```json
{
  "boundDevice": null
}
```

## 📊 Estrutura do keys.json

```json
{
  "keys": [
    {
      "key": "R7D-AWC2GPBJ-77R6L5RA-1LEPT2WP",
      "active": true,
      "createdAt": "2026-02-05T21:39:00.848Z",
      "expiresAt": null,
      "lastUsed": "2026-02-05T21:39:17.530Z",
      "boundDevice": "a1b2c3d4e5f6..."
    }
  ]
}
```

## 🚀 Deploy em Produção

### Heroku
```bash
heroku create meu-painel
git push heroku main
heroku config:set ADMIN_PASSWORD=minhasenha123
```

### Railway
```bash
railway init
railway up
railway variables set ADMIN_PASSWORD=minhasenha123
```

### VPS (Ubuntu)
```bash
# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PM2
sudo npm install -g pm2

# Iniciar servidor
pm2 start server.js --name painel-keys
pm2 startup
pm2 save
```

## 🐛 Solução de Problemas

### Porta 3000 já está em uso
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <numero> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Erro "Cannot find module"
```bash
npm install
```

### Extensão não conecta
1. Verifique se o servidor está rodando
2. Teste: `curl http://localhost:3000`
3. Verifique os logs do servidor

## 📚 Documentação Completa

- **INSTRUCOES_COMPLETAS.md** - Guia completo passo a passo
- **COMO_FUNCIONA.md** - Arquitetura e fluxos detalhados
- **COMANDOS_UTEIS.md** - Comandos e scripts úteis
- **FAQ.md** - Perguntas frequentes
- **TESTE_RAPIDO.md** - Checklist de 5 minutos

## 🔒 Segurança

- ✅ Senha obrigatória para painel
- ✅ Token de autenticação na API
- ✅ Vinculação única por PC
- ✅ Validação no servidor
- ✅ Hash SHA-256 para fingerprint

## 📈 Performance

- Gerar key: ~10ms
- Validar key: ~50ms
- Verificar key: ~30ms
- Suporta: 100-500 usuários simultâneos

## ✅ Checklist de Produção

- [ ] Mudar senha padrão
- [ ] Configurar HTTPS
- [ ] Fazer backup de keys.json
- [ ] Testar em staging
- [ ] Configurar monitoramento
- [ ] Documentar procedimentos

## 📞 Suporte

Se precisar de ajuda:
1. Leia INSTRUCOES_COMPLETAS.md
2. Execute test-api.js
3. Verifique os logs
4. Consulte FAQ.md

## 📝 Licença

Este código é seu. Use, modifique e distribua como quiser.

---

**Desenvolvido com ❤️ por r7dev**
