# 🔧 COMO USAR O ARQUIVO .env

## 📝 O QUE É O .env?

O arquivo `.env` guarda suas configurações secretas (senhas, chaves, etc) de forma segura.

**Vantagens:**
- ✅ Não precisa colocar senha direto no código
- ✅ Cada ambiente (local, produção) tem suas próprias configurações
- ✅ Mais seguro (não vai pro GitHub)

---

## 🚀 USAR LOCALMENTE

### 1. Instalar dotenv

Já está instalado! Mas se precisar:

```bash
npm install dotenv
```

### 2. Configurar sua senha

Abra o arquivo `.env` e mude a senha:

```env
ADMIN_PASSWORD=MinhaSenh@Forte123!
PORT=3000
NODE_ENV=development
```

### 3. Rodar o servidor

```bash
npm start
```

Pronto! O servidor vai usar a senha do `.env`

---

## 🌐 USAR EM PRODUÇÃO

### Railway

1. Acesse: https://railway.app/dashboard
2. Selecione seu projeto
3. Variables → New Variable
4. Adicione:
   ```
   ADMIN_PASSWORD=sua-senha-forte
   PORT=3000
   NODE_ENV=production
   ```

### Vercel

1. Acesse: https://vercel.com/dashboard
2. Settings → Environment Variables
3. Adicione:
   ```
   ADMIN_PASSWORD=sua-senha-forte
   NODE_ENV=production
   ```

### Render

1. Acesse: https://render.com/dashboard
2. Environment → Environment Variables
3. Adicione:
   ```
   ADMIN_PASSWORD=sua-senha-forte
   PORT=3000
   NODE_ENV=production
   ```

---

## 🔐 VARIÁVEIS DISPONÍVEIS

### ADMIN_PASSWORD (obrigatória)
Senha para acessar o painel admin.

**Exemplo:**
```env
ADMIN_PASSWORD=MinhaSenha@123!
```

### PORT (opcional)
Porta onde o servidor vai rodar. Padrão: 3000

**Exemplo:**
```env
PORT=3000
```

### NODE_ENV (opcional)
Ambiente de execução. Valores: `development` ou `production`

**Exemplo:**
```env
NODE_ENV=production
```

---

## 📋 EXEMPLO COMPLETO

Arquivo `.env`:

```env
# Senha do painel (MUDE!)
ADMIN_PASSWORD=R7dev@Painel2026!

# Porta do servidor
PORT=3000

# Ambiente
NODE_ENV=development
```

---

## ⚠️ IMPORTANTE

### ✅ FAZER:
- Mudar a senha padrão `admin123`
- Usar senha forte (letras, números, símbolos)
- Manter o `.env` no `.gitignore`
- Criar `.env` diferente para cada ambiente

### ❌ NÃO FAZER:
- Subir `.env` pro GitHub
- Usar senhas fracas
- Compartilhar o arquivo `.env`
- Commitar senhas no código

---

## 🧪 TESTAR

### 1. Verificar se está funcionando

```bash
npm start
```

Deve aparecer:
```
Painel r7dev rodando em http://localhost:3000
```

### 2. Acessar o painel

Abra: http://localhost:3000

### 3. Fazer login

Use a senha que você colocou no `.env`

---

## 🔄 MUDAR SENHA

### Localmente:
1. Edite `.env`
2. Mude `ADMIN_PASSWORD`
3. Reinicie o servidor (`Ctrl+C` e `npm start`)

### Em produção:
1. Acesse a plataforma (Railway/Vercel/Render)
2. Edite a variável `ADMIN_PASSWORD`
3. Salve (redeploy automático)

---

## 📁 ESTRUTURA DE ARQUIVOS

```
painel-admin/
├── .env              ← Suas configurações (NÃO VAI PRO GIT)
├── .env.example      ← Modelo (VAI PRO GIT)
├── .gitignore        ← Protege o .env
├── server.js         ← Usa as variáveis do .env
└── package.json
```

---

## 🎯 RESUMO

1. ✅ Arquivo `.env` criado
2. ✅ Protegido no `.gitignore`
3. ✅ Mude a senha padrão
4. ✅ Rode `npm start`
5. ✅ Acesse http://localhost:3000
6. 🎉 Funciona!

---

## ❓ DÚVIDAS

### O .env vai pro GitHub?
❌ Não! Está no `.gitignore`

### E se eu perder o .env?
✅ Use o `.env.example` como base e crie um novo

### Preciso do .env em produção?
❌ Não! Use as variáveis de ambiente da plataforma

### Como sei se está funcionando?
✅ Se conseguir fazer login no painel, está funcionando!
