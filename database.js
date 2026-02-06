// Banco de dados com MongoDB
const mongoose = require('mongoose');

// Schema para as keys
const KeySchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, index: true },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: null },
  lastUsed: { type: Date, default: null },
  boundDevice: { type: String, default: null }
});

const Key = mongoose.model('Key', KeySchema);

// Conectar ao MongoDB
async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL;
  
  if (!MONGODB_URI) {
    console.warn('⚠️  MONGODB_URI não configurado. Usando fallback para arquivo JSON.');
    return false;
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB conectado!');
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar MongoDB:', error.message);
    return false;
  }
}

// Funções do banco
async function getAllKeys() {
  try {
    return await Key.find({}).sort({ createdAt: -1 });
  } catch (error) {
    console.error('Erro ao buscar keys:', error);
    return [];
  }
}

async function findKeyByValue(keyValue) {
  try {
    return await Key.findOne({ key: keyValue });
  } catch (error) {
    console.error('Erro ao buscar key:', error);
    return null;
  }
}

async function createKey(keyData) {
  try {
    const newKey = new Key(keyData);
    await newKey.save();
    return newKey;
  } catch (error) {
    console.error('Erro ao criar key:', error);
    throw error;
  }
}

async function updateKey(keyValue, updates) {
  try {
    return await Key.findOneAndUpdate(
      { key: keyValue },
      updates,
      { new: true }
    );
  } catch (error) {
    console.error('Erro ao atualizar key:', error);
    throw error;
  }
}

async function deleteKey(keyValue) {
  try {
    return await Key.findOneAndDelete({ key: keyValue });
  } catch (error) {
    console.error('Erro ao deletar key:', error);
    throw error;
  }
}

module.exports = {
  connectDB,
  getAllKeys,
  findKeyByValue,
  createKey,
  updateKey,
  deleteKey,
  Key
};
