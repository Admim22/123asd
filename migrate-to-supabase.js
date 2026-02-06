// Script para migrar keys do keys.json para Supabase
require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL não configurado no .env');
  process.exit(1);
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function migrate() {
  try {
    console.log('🚀 Iniciando migração...\n');

    // 1. Criar tabela
    console.log('1️⃣ Criando tabela...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS keys (
        id SERIAL PRIMARY KEY,
        key VARCHAR(255) UNIQUE NOT NULL,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP DEFAULT NULL,
        last_used TIMESTAMP DEFAULT NULL,
        bound_device VARCHAR(255) DEFAULT NULL
      );
    `);
    console.log('✅ Tabela criada!\n');

    // 2. Criar índices
    console.log('2️⃣ Criando índices...');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_keys_key ON keys(key)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_keys_active ON keys(active)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_keys_bound_device ON keys(bound_device)');
    console.log('✅ Índices criados!\n');

    // 3. Ler keys.json
    console.log('3️⃣ Lendo keys.json...');
    const keysFile = path.join(__dirname, 'keys.json');
    const data = JSON.parse(fs.readFileSync(keysFile, 'utf8'));
    console.log(`✅ ${data.keys.length} keys encontradas!\n`);

    // 4. Migrar keys
    console.log('4️⃣ Migrando keys...');
    let migrated = 0;
    let skipped = 0;

    for (const keyData of data.keys) {
      try {
        await pool.query(
          `INSERT INTO keys (key, active, created_at, expires_at, last_used, bound_device)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT (key) DO NOTHING`,
          [
            keyData.key,
            keyData.active,
            keyData.createdAt,
            keyData.expiresAt,
            keyData.lastUsed,
            keyData.boundDevice
          ]
        );
        console.log(`  ✅ ${keyData.key}`);
        migrated++;
      } catch (error) {
        console.log(`  ⚠️  ${keyData.key} - Já existe`);
        skipped++;
      }
    }

    console.log(`\n✅ Migração concluída!`);
    console.log(`   - Migradas: ${migrated}`);
    console.log(`   - Ignoradas: ${skipped}`);

    // 5. Verificar
    console.log('\n5️⃣ Verificando...');
    const result = await pool.query('SELECT COUNT(*) FROM keys');
    console.log(`✅ Total de keys no banco: ${result.rows[0].count}\n`);

    await pool.end();
    console.log('🎉 Migração finalizada com sucesso!\n');
  } catch (error) {
    console.error('❌ Erro na migração:', error);
    process.exit(1);
  }
}

migrate();
