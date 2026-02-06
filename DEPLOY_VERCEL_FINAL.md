# 🚀 DEPLOY VERCEL + SUPABASE - COMPLETO E FUNCIONAL

## ✅ O QUE VAI FUNCIONAR:

- ✅ Painel admin na Vercel
- ✅ Keys salvas no Supabase (PostgreSQL)
- ✅ Sistema 1 key = 1 PC funcionando
- ✅ Keys antigas migradas automaticamente
- ✅ 100% funcional e grátis!

---

## 📋 PASSO A PASSO COMPLETO

### 1️⃣ CONFIGURAR SUPABASE (5 minutos)

#### A. Criar Tabela

1. Acesse: https://supabase.com/dashboard/project/kuohmmusmiayjwirchkx
2. **SQL Editor** (menu lateral)
3. **New Query**
4. Cole e execute:

```sql
CREATE TABLE IF NOT EXISTS keys (
    id SERIAL PRIMARY KEY,
    key VARCHAR(255) UNIQUE NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP DEFAULT NULL,
    last_used TIMESTAMP DEFAULT NULL,
    bound_device VARCHAR(255) DEFAULT NULL
);

CREATE INDEX IF NOT EXISTS idx_keys_key ON keys(key);
CREATE INDEX IF NOT EXISTS idx_keys_active ON keys(active);
CREATE INDEX IF NOT EXISTS idx_keys_bound_device ON keys(bound_device);
```

5. Clique **"Run"**
6. ✅ Deve aparecer "Success. No rows returned"

#### B. Pegar Connection String

1. **Settings** → **Database**
2. **Connection String** → **URI**
3. Copie a string (exemplo):
   ```
   postgresql://postgres.kuohmmusmiayjwirchkx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```

⚠️ **IMPORTANTE:** Substitua `[YOUR-PASSWORD]` pela senha do seu banco!

Se não lembra a senha:
- Settings → Database → Reset Database Password
- Copie a nova senha
- Substitua na connection string

---

### 2️⃣ MIGRAR KEYS EXISTENTES (2 minutos)

#### A. Configurar .env Local

Crie/edite o arquivo `.env`:

```env
DATABASE_URL=postgresql://postgres.kuohmmusmiayjwirchkx:SUA-SENHA@aws-0-us-east-1.pooler.supabase.com:6543/postgres
ADMIN_PASSWORD=admin123
```

#### B. Rodar Migração

```bash
cd painel-admin
node migrate-to-supabase.js
```

Deve aparecer:
```
🚀 Iniciando migração...
1️⃣ Criando tabela...
✅ Tabela criada!
2️⃣ Criando índices...
✅ Índices criados!
3️⃣ Lendo keys.json...
✅ 4 keys encontradas!
4️⃣ Migrando keys...
  ✅ R7D-AWC2GPBJ-77R6L5RA-1LEPT2WP
  ✅ R7D-QWSG7PAB-GD4DVWPX-RF1S7F5K
  ✅ R7D-EXPIRADA-TESTE-KEY
  ✅ R7D-3QM0KHZ2-ZFOCR0UY-AMHNFHV3
✅ Migração concluída!
   - Migradas: 4
   - Ignoradas: 0
5️⃣ Verificando...
✅ Total de keys no banco: 4
🎉 Migração finalizada com sucesso!
```

---

### 3️⃣ DEPLOY NA VERCEL (3 minutos)

#### A. Fazer Push pro GitHub

```bash
cd painel-admin
git add .
git commit -m "Supabase integration - ready for Vercel"
git push
```

#### B. Configurar na Vercel

1. Acesse: https://vercel.com/dashboard
2. **Import Project**
3. Selecione: `Admim22/123asd`
4. **Configure:**
   - Root Directory: `painel-admin`
   - Framework Preset: Other
   - Build Command: `npm install`
   - Output Directory: (deixe vazio)
   - Install Command: `npm install`

5. **Environment Variables** (IMPORTANTE!):

```
DATABASE_URL = postgresql://postgres.kuohmmusmiayjwirchkx:SUA-SENHA@aws-0-us-east-1.pooler.supabase.com:6543/postgres

ADMIN_PASSWORD = sua-senha-forte-aqui
```

⚠️ **Marque:** Production, Preview, Development

6. **Deploy!**

---

### 4️⃣ PEGAR A URL DA VERCEL

Após o deploy:

1. Vercel vai gerar uma URL:
   ```
   https://123asd-xxx.vercel.app
   ```

2. **Copie essa URL!**

---

### 5️⃣ ATUALIZAR A EXTENSÃO

Execute o script:

```bash
ATUALIZAR_URL_EXTENSAO.bat
```

Digite a URL da Vercel quando pedir.

Ou edite manualmente:
- Arquivo: `Painel r7 dev 01/config.js`
- Linha 8: Mude para `https://123asd-xxx.vercel.app/api/validate`

---

### 6️⃣ REINSTALAR EXTENSÃO

1. Chrome → `chrome://extensions/`
2. Remover extensão antiga
3. "Carregar sem compactação"
4. Selecionar: `Painel r7 dev 01`

---

## 🧪 TESTAR TUDO

### 1. Testar Painel

1. Acesse: `https://123asd-xxx.vercel.app`
2. Login com sua senha
3. Deve ver as 4 keys antigas!
4. Gere uma nova key
5. ✅ Deve funcionar!

### 2. Testar Extensão

1. Clique no ícone
2. Use uma das keys
3. ✅ Deve ativar!

### 3. Testar 1 Key = 1 PC

1. Use a mesma key em outro navegador/PC
2. ❌ Deve bloquear: "Chave já em uso em outro computador"

---

## 💰 CUSTOS

### Supabase FREE
- ✅ $0/mês
- ✅ 500 MB de banco
- ✅ Suficiente para milhares de keys

### Vercel FREE
- ✅ $0/mês
- ✅ 100 GB de banda
- ✅ Sem sleep mode!

**TUDO GRÁTIS! 🎉**

---

## 🔧 COMANDOS ÚTEIS

### Ver keys no Supabase

1. Supabase → Table Editor
2. Selecione tabela `keys`
3. Veja todas as keys!

### Adicionar key manualmente

```sql
INSERT INTO keys (key, active, created_at, expires_at, last_used, bound_device)
VALUES ('R7D-TESTE-MANUAL-KEY', true, NOW(), NULL, NULL, NULL);
```

### Limpar todas as keys

```sql
DELETE FROM keys;
```

### Ver estatísticas

```sql
SELECT 
  COUNT(*) as total,
  COUNT(CASE WHEN active THEN 1 END) as ativas,
  COUNT(CASE WHEN bound_device IS NOT NULL THEN 1 END) as vinculadas
FROM keys;
```

---

## ⚠️ IMPORTANTE

### Segurança

1. **Nunca compartilhe:**
   - DATABASE_URL (tem senha do banco!)
   - ADMIN_PASSWORD
   - Service Role Key do Supabase

2. **Use senhas fortes:**
   - Mínimo 12 caracteres
   - Letras, números, símbolos

3. **Backup:**
   - Supabase faz backup automático
   - Você pode exportar via SQL Editor

---

## 🎯 CHECKLIST FINAL

- [ ] Tabela criada no Supabase
- [ ] Connection string copiada
- [ ] Senha substituída na connection string
- [ ] Keys migradas (rodou `migrate-to-supabase.js`)
- [ ] Código commitado no GitHub
- [ ] Deploy feito na Vercel
- [ ] Variáveis configuradas na Vercel
- [ ] URL da Vercel copiada
- [ ] Extensão atualizada com URL
- [ ] Extensão reinstalada
- [ ] Painel testado e funcionando
- [ ] Keys antigas aparecendo
- [ ] Nova key gerada com sucesso
- [ ] Key testada na extensão
- [ ] Sistema 1 key = 1 PC testado
- [ ] ✅ TUDO FUNCIONANDO!

---

## 🚀 PRONTO!

Agora você tem:
- ✅ Painel na Vercel (rápido, sem sleep)
- ✅ Keys no Supabase (persistentes, seguras)
- ✅ Sistema completo funcionando
- ✅ 100% grátis!

**Distribua a extensão e comece a gerar keys!** 🎉
