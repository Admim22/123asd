// Banco de dados com Supabase (PostgreSQL)
const { Pool } = require('pg');

let pool = null;

// Conectar ao Supabase/PostgreSQL
function connectDB() {
  const DATABASE_URL = process.env.DATABASE_URL || process.env.SUPABASE_URL;
  
  if (!DATABASE_URL) {
    console.warn('⚠️  DATABASE_URL não configurado. Usando fallback para arquivo JSON.');
    return false;
  }

  try {
    pool = new Pool({
      connectionString: DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });
    
    console.log('✅ Supabase/PostgreSQL conectado!');
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar Supabase:', error.message);
    return false;
  }
}

// Testar conexão
async function testConnection() {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Teste de conexão OK:', result.rows[0].now);
    return true;
  } catch (error) {
    console.error('❌ Erro no teste de conexão:', error.message);
    return false;
  }
}

// Buscar todas as keys
async function getAllKeys() {
  try {
    const result = await pool.query(
      'SELECT * FROM keys ORDER BY created_at DESC'
    );
    return result.rows;
  } catch (error) {
    console.error('Erro ao buscar keys:', error);
    return [];
  }
}

// Buscar key específica
async function findKeyByValue(keyValue) {
  try {
    const result = await pool.query(
      'SELECT * FROM keys WHERE key = $1',
      [keyValue]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Erro ao buscar key:', error);
    return null;
  }
}

// Criar nova key
async function createKey(keyData) {
  try {
    const result = await pool.query(
      `INSERT INTO keys (key, active, created_at, expires_at, last_used, bound_device)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        keyData.key,
        keyData.active !== undefined ? keyData.active : true,
        keyData.createdAt || new Date().toISOString(),
        keyData.expiresAt || null,
        keyData.lastUsed || null,
        keyData.boundDevice || null
      ]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Erro ao criar key:', error);
    throw error;
  }
}

// Atualizar key
async function updateKey(keyValue, updates) {
  try {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (updates.active !== undefined) {
      fields.push(`active = $${paramCount++}`);
      values.push(updates.active);
    }
    if (updates.expiresAt !== undefined) {
      fields.push(`expires_at = $${paramCount++}`);
      values.push(updates.expiresAt);
    }
    if (updates.lastUsed !== undefined) {
      fields.push(`last_used = $${paramCount++}`);
      values.push(updates.lastUsed);
    }
    if (updates.boundDevice !== undefined) {
      fields.push(`bound_device = $${paramCount++}`);
      values.push(updates.boundDevice);
    }

    if (fields.length === 0) {
      return await findKeyByValue(keyValue);
    }

    values.push(keyValue);
    const query = `UPDATE keys SET ${fields.join(', ')} WHERE key = $${paramCount} RETURNING *`;
    
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Erro ao atualizar key:', error);
    throw error;
  }
}

// Deletar key
async function deleteKey(keyValue) {
  try {
    const result = await pool.query(
      'DELETE FROM keys WHERE key = $1 RETURNING *',
      [keyValue]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Erro ao deletar key:', error);
    throw error;
  }
}

module.exports = {
  connectDB,
  testConnection,
  getAllKeys,
  findKeyByValue,
  createKey,
  updateKey,
  deleteKey
};
