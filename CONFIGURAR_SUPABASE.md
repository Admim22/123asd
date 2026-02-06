# 🗄️ CONFIGURAR SUPABASE - GUIA RÁPIDO

## 🔑 SUAS CREDENCIAIS

**URL:** `https://kuohmmusmiayjwirchkx.supabase.co`

**Project:** `kuohmmusmiayjwirchkx`

---

## 📋 PASSO 1: CRIAR TABELA (2 minutos)

1. **Acesse:** https://supabase.com/dashboard/project/kuohmmusmiayjwirchkx

2. **SQL Editor** (menu lateral esquerdo)

3. **New Query**

4. **Cole este SQL:**

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

5. **Clique "Run"** (ou Ctrl+Enter)

6. ✅ Deve aparecer: **"Success. No rows returned"**

---

## 📋 PASSO 2: PEGAR CONNECTION STRING (1 minuto)

1. **Settings** (ícone de engrenagem no menu lateral)

2. **Database**

3. **Connection String** → Selecione **"URI"**

4. **Copie a string completa:**
   ```
   postgresql://postgres.kuohmmusmiayjwirchkx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```

5. **⚠️ IMPORTANTE:** Substitua `[YOUR-PASSWORD]` pela senha do banco!

### Não lembra a senha?

1. **Settings** → **Database**
2. **Reset Database Password**
3. **Copie a nova senha**
4. **Substitua na connection string**

Exemplo final:
```
postgresql://postgres.kuohmmusmiayjwirchkx:MinhaSenh@123@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

---

## 📋 PASSO 3: MIGRAR KEYS (2 minutos)

### A. Configurar .env

Crie o arquivo `.env` na pasta `painel-admin`:

```env
DATABASE_URL=postgresql://postgres.kuohmmusmiayjwirchkx:SUA-SENHA@aws-0-us-east-1.pooler.supabase.com:6543/postgres
ADMIN_PASSWORD=admin123
```

### B. Rodar Migração

```bash
cd painel-admin
node migrate-to-supabase.js
```

✅ **Deve aparecer:**
```
🚀 Iniciando migração...
✅ Tabela criada!
✅ Índices criados!
✅ 4 keys encontradas!
✅ Migração concluída!
🎉 Migração finalizada com sucesso!
```

---

## 📋 PASSO 4: VERIFICAR (1 minuto)

1. **Supabase** → **Table Editor**

2. **Selecione a tabela "keys"**

3. ✅ **Deve ver suas 4 keys:**
   - R7D-AWC2GPBJ-77R6L5RA-1LEPT2WP
   - R7D-QWSG7PAB-GD4DVWPX-RF1S7F5K
   - R7D-EXPIRADA-TESTE-KEY
   - R7D-3QM0KHZ2-ZFOCR0UY-AMHNFHV3

---

## 🎯 PRONTO!

Agora você tem:
- ✅ Tabela criada no Supabase
- ✅ Keys antigas migradas
- ✅ Banco configurado e funcionando

**Próximo passo:** Deploy na Vercel!

Veja o guia completo em: `DEPLOY_VERCEL_FINAL.md`
