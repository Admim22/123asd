# 🚂 INSTALAR RAILWAY CLI - WINDOWS

## 📥 OPÇÃO 1: NPM (Mais Fácil)

```bash
npm install -g @railway/cli
```

Depois teste:
```bash
railway --version
```

---

## 📥 OPÇÃO 2: PowerShell (Recomendado)

Abra o PowerShell como **Administrador** e rode:

```powershell
iwr https://railway.app/install.ps1 | iex
```

Depois teste:
```bash
railway --version
```

---

## 📥 OPÇÃO 3: Scoop

Se você tem Scoop instalado:

```bash
scoop install railway
```

---

## 🚀 DEPOIS DE INSTALAR

### 1. Login
```bash
railway login
```

Vai abrir o navegador para você fazer login.

### 2. Criar Projeto
```bash
cd painel-admin
railway init
```

Escolha:
- "Create a new project"
- Digite um nome: `painel-r7dev`

### 3. Deploy
```bash
railway up
```

### 4. Configurar Senha
```bash
railway variables set ADMIN_PASSWORD=sua-senha-forte
```

### 5. Pegar URL
```bash
railway domain
```

Vai gerar uma URL tipo: `https://painel-r7dev.up.railway.app`

---

## ✅ PRONTO!

Seu painel está no ar! 🎉

Acesse a URL e faça login com a senha que você configurou.
