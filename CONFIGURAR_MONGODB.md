# 🗄️ CONFIGURAR MONGODB (BANCO DE DADOS)

## ⚠️ POR QUE PRECISA?

O Render (e outras plataformas serverless) **NÃO salvam arquivos**!

- ❌ `keys.json` é perdido quando o servidor reinicia
- ❌ Keys geradas desaparecem
- ✅ **MongoDB salva tudo permanentemente!**

---

## 🚀 CRIAR BANCO GRÁTIS (5 minutos)

### 1. Criar Conta no MongoDB Atlas

1. Acesse: **https://www.mongodb.com/cloud/atlas/register**
2. Crie uma conta (grátis)
3. Confirme o email

---

### 2. Criar Cluster (Banco de Dados)

1. **Após login, clique em "Build a Database"**

2. **Escolha o plano FREE:**
   - Shared (FREE)
   - M0 Sandbox
   - Clique em **"Create"**

3. **Configurar:**
   - **Cloud Provider:** AWS
   - **Region:** Escolha a mais próxima (ex: São Paulo, Virginia)
   - **Cluster Name:** `painel-r7dev` (ou qualquer nome)
   - Clique em **"Create Cluster"**

---

### 3. Criar Usuário do Banco

1. **Security Quickstart** vai aparecer

2. **Authentication Method:** Username and Password

3. **Criar usuário:**
   ```
   Username: admin
   Password: [GERE UMA SENHA FORTE]
   ```
   
   **IMPORTANTE:** Anote essa senha! Você vai precisar dela.

4. Clique em **"Create User"**

---

### 4. Liberar Acesso (IP Whitelist)

1. **Where would you like to connect from?**

2. **Escolha:** "My Local Environment"

3. **IP Access List:**
   - Clique em **"Add IP Address"**
   - Selecione **"Allow Access from Anywhere"**
   - IP: `0.0.0.0/0`
   - Clique em **"Add Entry"**

4. Clique em **"Finish and Close"**

---

### 5. Pegar a Connection String

1. No dashboard, clique em **"Connect"** no seu cluster

2. Escolha: **"Connect your application"**

3. **Driver:** Node.js
   **Version:** 4.1 or later

4. **Copie a Connection String:**
   ```
   mongodb+srv://admin:<password>@painel-r7dev.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

5. **IMPORTANTE:** Substitua `<password>` pela senha que você criou!

   Exemplo:
   ```
   mongodb+srv://admin:MinhaSenh@123@painel-r7dev.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

---

## 🔧 CONFIGURAR NO RENDER

### 1. Acesse seu serviço no Render

https://dashboard.render.com

### 2. Selecione seu Web Service

Clique no serviço `painel-r7dev` (ou o nome que você deu)

### 3. Adicionar Variável de Ambiente

1. Clique em **"Environment"** no menu lateral

2. Clique em **"Add Environment Variable"**

3. **Adicione:**
   ```
   Key: MONGODB_URI
   Value: mongodb+srv://admin:SuaSenha@painel-r7dev.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   
   **Cole a connection string que você copiou!**

4. Clique em **"Save Changes"**

### 4. Redeploy

O Render vai fazer redeploy automaticamente.

Aguarde 2-3 minutos.

---

## ✅ TESTAR

### 1. Ver Logs

1. No Render, clique em **"Logs"**

2. Procure por:
   ```
   ✅ MongoDB conectado!
   Painel r7dev rodando em http://localhost:3000
   ```

3. Se aparecer isso, **FUNCIONOU!** 🎉

### 2. Gerar uma Key

1. Acesse: https://one23asd-1.onrender.com

2. Faça login

3. Gere uma key

4. **Agora a key vai ser salva no MongoDB!**

### 3. Testar na Extensão

1. Reinstale a extensão (se ainda não fez)

2. Use a key gerada

3. ✅ **Deve funcionar!**

---

## 🔄 VERIFICAR NO MONGODB

### Ver as Keys Salvas

1. Acesse: https://cloud.mongodb.com

2. Clique em **"Browse Collections"** no seu cluster

3. Você vai ver:
   - Database: `test` (ou o nome configurado)
   - Collection: `keys`
   - Documents: Suas keys!

---

## 💰 CUSTOS

### Plano FREE (M0 Sandbox)

- ✅ **$0/mês** (grátis para sempre!)
- ✅ 512 MB de armazenamento
- ✅ Suficiente para **milhares de keys**
- ✅ Sem cartão de crédito necessário

### Exemplo de Capacidade:

- 1 key = ~200 bytes
- 512 MB = ~2.5 MILHÕES de keys! 🤯

---

## ⚠️ IMPORTANTE

### Segurança

1. **Nunca compartilhe a connection string!**
   - Ela contém sua senha
   - Qualquer um com ela pode acessar seu banco

2. **Use senhas fortes:**
   - Mínimo 12 caracteres
   - Letras, números, símbolos
   - Exemplo: `R7dev@Mongo2026!`

3. **Backup:**
   - MongoDB Atlas faz backup automático
   - Você pode exportar os dados quando quiser

---

## 🎯 CHECKLIST

- [ ] Conta MongoDB Atlas criada
- [ ] Cluster FREE criado
- [ ] Usuário do banco criado
- [ ] IP `0.0.0.0/0` liberado
- [ ] Connection string copiada
- [ ] Senha substituída na connection string
- [ ] Variável `MONGODB_URI` adicionada no Render
- [ ] Redeploy feito
- [ ] Logs mostram "MongoDB conectado"
- [ ] Key de teste gerada
- [ ] Key testada na extensão
- [ ] ✅ Tudo funcionando!

---

## ❓ PROBLEMAS COMUNS

### Erro: "MongoServerError: bad auth"

**Causa:** Senha errada na connection string

**Solução:**
1. Verifique se substituiu `<password>` pela senha correta
2. Se a senha tem caracteres especiais (@, #, etc), codifique eles:
   - `@` → `%40`
   - `#` → `%23`
   - `$` → `%24`

### Erro: "MongoNetworkError: connection refused"

**Causa:** IP não está liberado

**Solução:**
1. MongoDB Atlas → Network Access
2. Adicione `0.0.0.0/0`
3. Aguarde 2-3 minutos

### Logs mostram: "Usando keys.json como banco de dados (fallback)"

**Causa:** `MONGODB_URI` não está configurado ou está errado

**Solução:**
1. Verifique se a variável `MONGODB_URI` existe no Render
2. Verifique se a connection string está correta
3. Redeploy

---

## 🚀 AGORA SIM VAI FUNCIONAR!

Com MongoDB:
- ✅ Keys são salvas permanentemente
- ✅ Não são perdidas quando o servidor reinicia
- ✅ Funciona em qualquer plataforma (Render, Railway, Vercel)
- ✅ Grátis para sempre!

**Próximo passo:** Configure o MongoDB e teste! 🎉
