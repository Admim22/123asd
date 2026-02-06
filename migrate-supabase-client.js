// Script para migrar keys do keys.json para Supabase (usando client)
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ SUPABASE_URL ou SUPABASE_KEY não configurado no .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function migrate() {
  try {
    console.log('🚀 Iniciando migração...\n');

    // 1. Ler keys.json
    console.log('1️⃣ Lendo keys.json...');
    const keysFile = path.join(__dirname, 'keys.json');
    const data = JSON.parse(fs.readFileSync(keysFile, 'utf8'));
    console.log(`✅ ${data.keys.length} keys encontradas!\n`);

    // 2. Migrar keys
    console.log('2️⃣ Migrando keys...');
    let migrated = 0;
    let skipped = 0;

    for (const keyData of data.keys) {
      try {
        const { data: inserted, error } = await supabase
          .from('keys')
          .insert([{
            key: keyData.key,
            active: keyData.active,
            created_at: keyData.createdAt,
            expires_at: keyData.expiresAt,
            last_used: keyData.lastUsed,
            bound_device: keyData.boundDevice
          }])
          .select();

        if (error) {
          if (error.code === '23505') { // Duplicate key
            console.log(`  ⚠️  ${keyData.key} - Já existe`);
            skipped++;
          } else {
            throw error;
          }
        } else {
          console.log(`  ✅ ${keyData.key}`);
          migrated++;
        }
      } catch (error) {
        console.log(`  ❌ ${keyData.key} - Erro: ${error.message}`);
        skipped++;
      }
    }

    console.log(`\n✅ Migração concluída!`);
    console.log(`   - Migradas: ${migrated}`);
    console.log(`   - Ignoradas: ${skipped}`);

    // 3. Verificar
    console.log('\n3️⃣ Verificando...');
    const { count, error } = await supabase
      .from('keys')
      .select('*', { count: 'exact', head: true });
    
    if (error) throw error;
    console.log(`✅ Total de keys no banco: ${count}\n`);

    console.log('🎉 Migração finalizada com sucesso!\n');
  } catch (error) {
    console.error('❌ Erro na migração:', error.message);
    process.exit(1);
  }
}

migrate();
