# 🎨 DEPLOY NO RENDER - CONFIGURAÇÃO CORRETA

## ⚠️ ERRO COMUM

```
Error: failed to solve: failed to read dockerfile: open Dockerfile: no such file or directory
```

**Causa:** Render está procurando Dockerfile na raiz, mas o projeto está em `painel-admin/`

---

## ✅ SOLUÇÃO CORRETA

### MÉTODO 1: Via Interface Web (Mais Fácil)

#### 1. Acesse o Render
https://render.com/dashboard

#### 2. Criar Novo Web Service
- Clique em **"New +"** → **"Web Service"**

#### 3. Conectar GitHub
- Clique em **"Connect account"** se ainda não conectou
- Autorize o Render a acessar seus repositórios
- Procure e selecione: **`Admim22/123asd`**
- Clique em **"Connect"**

#### 4. Configurar o Serviço

**IMPORTANTE:** Preencha exatamente assim:

```
Name: painel-r7dev
Region: Oregon (US West) ou qualquer outra
Branch: main
Root Directory: painel-admin    ← MUITO IMPORTANTE!
Runtime: Node
Build Command: npm install
Start Command: node server.js
```

#### 5. Escolher Plano
- Selecione: **"Free"** (0$/mês)
- Clique em **"Advanced"** para adicionar variáveis

#### 6. Adicionar Variável de Ambiente

Clique em **"Add Environment Variable"**:

```
Key: ADMIN_PASSWORD
Value: sua-senha-forte-aqui
```

Exemplo: `R7dev@Painel2026!`

#### 7. Criar Web Service
- Clique em **"Create Web Service"**
- Aguarde o deploy (2-3 minutos)

#### 8. Pegar a URL

Quando terminar, você verá a URL:
```
https://painel-r7dev.onrender.com
```

**Copie essa URL!**

---

### MÉTODO 2: Via render.yaml (Automático)

Se preferir configuração automática:

#### 1. O arquivo `render.yaml` já está criado

#### 2. No Render Dashboard:
- New → Blueprint
- Connect repository: `Admim22/123asd`
- Render vai detectar o `render.yaml` automaticamente

#### 3. Configure apenas:
- `ADMIN_PASSWORD` = sua senha

#### 4. Deploy!

---

## 🧪 TESTAR

### 1. Acessar o Painel

Abra a URL no navegador:
```
https://painel-r7dev.onrender.com
```

⚠️ **IMPORTANTE:** Primeira vez pode demorar 30-60 segundos (cold start)

### 2. Fazer Login

Use a senha que você configurou em `ADMIN_PASSWORD`

### 3. Gerar uma Key

1. Digite dias de validade (ou deixe vazio para vitalícia)
2. Clique **"Gerar key"**
3. Copie a key gerada

### 4. Testar API

Teste se a API está funcionando:

```bash
curl -X POST https://painel-r7dev.onrender.com/api/validate \
  -H "Content-Type: application/json" \
  -d '{"licenseKey":"R7D-TESTE","deviceFingerprint":"test123"}'
```

Deve retornar JSON com `valid: false` (key não existe)

---

## 🔧 ATUALIZAR A EXTENSÃO

Agora que o painel está online, atualize a extensão:

### 1. Execute o script:
```
ATUALIZAR_URL_EXTENSAO.bat
```

### 2. Digite a URL:
```
https://painel-r7dev.onrender.com
```

### 3. Reinstale a extensão:
1. Chrome → `chrome://extensions/`
2. Remova a extensão antiga
3. "Carregar sem compactação"
4. Selecione: `Painel r7 dev 01`

### 4. Teste!
1. Clique no ícone da extensão
2. Cole uma key gerada no painel
3. Clique "Ativar Agora"
4. ✅ Deve funcionar!

---

## ⚠️ LIMITAÇÕES DO PLANO FREE

### Sleep Mode (Modo Hibernação)

O plano grátis do Render tem algumas limitações:

- ⏰ **Após 15 minutos sem uso, o serviço "dorme"**
- 🐌 **Primeira requisição após dormir demora ~30-60 segundos**
- ✅ **Depois disso, funciona normalmente**

### Como Funciona:

1. **Usuário tenta ativar key:**
   - Se painel está "dormindo" → Demora 30-60s
   - Se painel está "acordado" → Instantâneo

2. **Keys continuam funcionando:**
   - Arquivo `keys.json` é mantido
   - Nada é perdido

### Solução:

Se quiser evitar o sleep mode:

1. **Upgrade para plano pago:** $7/mês (sem sleep)
2. **Usar Railway:** $5 crédito grátis/mês (sem sleep)
3. **Aceitar o delay:** Funciona, mas primeira requisição é lenta

---

## 🔄 ATUALIZAR O CÓDIGO

Quando fizer mudanças:

1. **Commit e push pro GitHub:**
   ```bash
   git add .
   git commit -m "Atualização"
   git push
   ```

2. **Render faz deploy automático!**
   - Vai detectar o push
   - Faz rebuild automaticamente
   - ~2-3 minutos

---

## 📊 MONITORAR

### Ver Logs

1. Render Dashboard
2. Selecione seu serviço
3. Clique em **"Logs"**
4. Veja logs em tempo real

### Ver Métricas

1. Clique em **"Metrics"**
2. Veja CPU, memória, requisições

### Reiniciar Serviço

1. Settings → **"Manual Deploy"**
2. Clique em **"Clear build cache & deploy"**

---

## ❓ PROBLEMAS COMUNS

### Deploy falhou?

**Verifique:**
- ✅ Root Directory está como `painel-admin`?
- ✅ Build Command está como `npm install`?
- ✅ Start Command está como `node server.js`?
- ✅ Variável `ADMIN_PASSWORD` foi adicionada?

### Erro 404 ao acessar?

**Verifique:**
- ✅ Deploy terminou com sucesso?
- ✅ URL está correta?
- ✅ Aguarde 1-2 minutos após deploy

### Erro 401 ao fazer login?

**Verifique:**
- ✅ Senha está correta?
- ✅ Variável `ADMIN_PASSWORD` está configurada?
- ✅ Veja os logs para mais detalhes

### Demora muito para responder?

⏰ **Normal!** Plano free tem sleep mode.
- Primeira requisição: 30-60s
- Próximas: Instantâneo

---

## 💰 CUSTOS

### Plano Free (Atual)
- ✅ $0/mês
- ✅ 750 horas/mês
- ⚠️ Sleep após 15min inatividade
- ✅ Suficiente para testes

### Plano Starter
- 💵 $7/mês
- ✅ Sem sleep mode
- ✅ Mais recursos
- ✅ Recomendado para produção

---

## 🎯 CHECKLIST

- [ ] Render account criada
- [ ] Repositório conectado
- [ ] Root Directory: `painel-admin`
- [ ] Build Command: `npm install`
- [ ] Start Command: `node server.js`
- [ ] Variável `ADMIN_PASSWORD` configurada
- [ ] Deploy concluído com sucesso
- [ ] URL copiada
- [ ] Painel acessível no navegador
- [ ] Login funcionando
- [ ] Key gerada com sucesso
- [ ] Extensão atualizada com URL
- [ ] Key testada na extensão
- [ ] ✅ Tudo funcionando!

---

## 🚀 ALTERNATIVA: RAILWAY

Se o Render não funcionar bem, tente o Railway:

1. https://railway.app
2. Deploy from GitHub
3. Selecione `Admim22/123asd`
4. Root Directory: `painel-admin`
5. Configure `ADMIN_PASSWORD`
6. Gere domínio

**Vantagens do Railway:**
- ✅ Sem sleep mode
- ✅ Mais rápido
- ✅ $5 crédito grátis/mês

---

## ✅ PRONTO!

Agora seu painel está online e as keys vão funcionar em qualquer PC! 🎉

**Próximo passo:** Distribua a extensão atualizada para os usuários.
