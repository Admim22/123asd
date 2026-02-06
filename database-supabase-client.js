// Banco de dados com Supabase Client (mais simples!)
const { createClient } = require('@supabase/supabase-js');

let supabase = null;

// Conectar ao Supabase
function connectDB() {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_KEY;
  
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.warn('⚠️  SUPABASE_URL ou SUPABASE_KEY não configurado. Usando fallback para arquivo JSON.');
    return false;
  }

  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log('✅ Supabase conectado!');
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar Supabase:', error.message);
    return false;
  }
}

// Testar conexão
async function testConnection() {
  try {
    const { data, error } = await supabase.from('keys').select('count');
    if (error) throw error;
    console.log('✅ Teste de conexão OK');
    return true;
  } catch (error) {
    console.error('❌ Erro no teste de conexão:', error.message);
    return false;
  }
}

// Buscar todas as keys
async function getAllKeys() {
  try {
    const { data, error } = await supabase
      .from('keys')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar keys:', error);
    return [];
  }
}

// Buscar key específica
async function findKeyByValue(keyValue) {
  try {
    const { data, error } = await supabase
      .from('keys')
      .select('*')
      .eq('key', keyValue)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  } catch (error) {
    console.error('Erro ao buscar key:', error);
    return null;
  }
}

// Criar nova key
async function createKey(keyData) {
  try {
    const { data, error } = await supabase
      .from('keys')
      .insert([{
        key: keyData.key,
        active: keyData.active !== undefined ? keyData.active : true,
        created_at: keyData.createdAt || new Date().toISOString(),
        expires_at: keyData.expiresAt || null,
        last_used: keyData.lastUsed || null,
        bound_device: keyData.boundDevice || null
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao criar key:', error);
    throw error;
  }
}

// Atualizar key
async function updateKey(keyValue, updates) {
  try {
    const updateData = {};
    
    if (updates.active !== undefined) updateData.active = updates.active;
    if (updates.expiresAt !== undefined) updateData.expires_at = updates.expiresAt;
    if (updates.lastUsed !== undefined) updateData.last_used = updates.lastUsed;
    if (updates.boundDevice !== undefined) updateData.bound_device = updates.boundDevice;

    const { data, error } = await supabase
      .from('keys')
      .update(updateData)
      .eq('key', keyValue)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao atualizar key:', error);
    throw error;
  }
}

// Deletar key
async function deleteKey(keyValue) {
  try {
    const { data, error } = await supabase
      .from('keys')
      .delete()
      .eq('key', keyValue)
      .select()
      .single();
    
    if (error) throw error;
    return data;
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
