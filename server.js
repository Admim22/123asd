require('dotenv').config();

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const db = require('./database-supabase-client');

const app = express();
const PORT = process.env.PORT || 3000;
const KEYS_FILE = path.join(__dirname, 'keys.json');
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

let USE_DATABASE = false;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Inicializar banco de dados
async function initDB() {
  USE_DATABASE = db.connectDB();
  if (USE_DATABASE) {
    console.log('✅ Usando Supabase como banco de dados');
    await db.testConnection();
  } else {
    console.log('⚠️  Usando keys.json como banco de dados (fallback)');
  }
}

// Funções de compatibilidade
function loadKeys() {
  try {
    const data = fs.readFileSync(KEYS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    return { keys: [] };
  }
}

function saveKeys(data) {
  fs.writeFileSync(KEYS_FILE, JSON.stringify(data, null, 2), 'utf8');
}

async function getAllKeysDB() {
  if (USE_DATABASE) {
    const keys = await db.getAllKeys();
    return { keys };
  } else {
    return loadKeys();
  }
}

async function findKeyDB(keyValue) {
  if (USE_DATABASE) {
    return await db.findKeyByValue(keyValue);
  } else {
    const data = loadKeys();
    return data.keys.find(k => k.key === keyValue);
  }
}

async function saveKeyDB(keyData) {
  if (USE_DATABASE) {
    return await db.createKey(keyData);
  } else {
    const data = loadKeys();
    data.keys.push(keyData);
    saveKeys(data);
    return keyData;
  }
}

async function updateKeyDB(keyValue, updates) {
  if (USE_DATABASE) {
    return await db.updateKey(keyValue, updates);
  } else {
    const data = loadKeys();
    const item = data.keys.find(k => k.key === keyValue);
    if (item) {
      Object.assign(item, updates);
      saveKeys(data);
    }
    return item;
  }
}

function generateKey() {
  const seg = () => Math.random().toString(36).substring(2, 10);
  return `R7D-${seg().toUpperCase()}-${seg().toUpperCase()}-${seg().toUpperCase()}`;
}

// API: validar key — 1 key = 1 PC (vincula pelo deviceFingerprint no primeiro uso)
app.post('/api/validate', async (req, res) => {
  const { licenseKey, deviceFingerprint } = req.body || {};
  const key = (licenseKey || '').trim();
  const fingerprint = (deviceFingerprint || '').trim();
  
  const item = await findKeyDB(key);
  
  if (!item || !item.active) {
    return res.json({
      valid: false,
      message: 'Chave inválida ou expirada.'
    });
  }
  if (item.expiresAt && new Date(item.expiresAt) < new Date()) {
    return res.json({
      valid: false,
      message: 'Chave expirada.'
    });
  }
  // 1 PC por key: no primeiro uso vincula ao dispositivo; depois só esse PC passa
  if (!item.boundDevice) {
    await updateKeyDB(key, {
      boundDevice: fingerprint,
      lastUsed: new Date().toISOString()
    });
    return res.json({
      valid: true,
      message: 'Licença ativada com sucesso (1 PC).',
      license: { lifetime: true },
      userData: null
    });
  }
  if (item.boundDevice !== fingerprint) {
    return res.json({
      valid: false,
      message: 'Chave já em uso em outro computador. Uma key vale apenas para 1 PC.'
    });
  }
  await updateKeyDB(key, {
    lastUsed: new Date().toISOString()
  });
  return res.json({
    valid: true,
    message: 'Licença ativada com sucesso.',
    license: { lifetime: true },
    userData: null
  });
});

// API: checar key (validador por dias — protegido por senha)
app.get('/api/check-key', async (req, res) => {
  const auth = req.headers.authorization || '';
  const token = auth.replace('Bearer ', '');
  if (token !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Não autorizado' });
  }
  const key = (req.query.key || '').trim();
  if (!key) {
    return res.json({ valid: false, error: 'Informe a key.' });
  }
  const item = await findKeyDB(key);
  if (!item) {
    return res.json({
      valid: false,
      expired: false,
      message: 'Chave não encontrada.',
      daysLeft: null,
      expiresAt: null,
      boundDevice: false
    });
  }
  if (!item.active) {
    return res.json({
      valid: false,
      expired: false,
      message: 'Chave desativada.',
      daysLeft: null,
      expiresAt: item.expiresAt || null,
      boundDevice: !!item.boundDevice
    });
  }
  const now = new Date();
  const exp = item.expiresAt ? new Date(item.expiresAt) : null;
  const isExpired = exp && exp < now;
  let daysLeft = null;
  if (exp && !isExpired) {
    daysLeft = Math.max(0, Math.ceil((exp - now) / (24 * 60 * 60 * 1000)));
  }
  return res.json({
    valid: !isExpired,
    expired: isExpired,
    message: isExpired ? 'Chave expirada.' : (daysLeft !== null ? `${daysLeft} dia(s) restante(s).` : 'Vitalícia.'),
    daysLeft,
    expiresAt: item.expiresAt || null,
    boundDevice: !!item.boundDevice,
    createdAt: item.createdAt
  });
});

// API: listar keys (protegido por senha)
app.get('/api/keys', async (req, res) => {
  const auth = req.headers.authorization || '';
  const token = auth.replace('Bearer ', '');
  if (token !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Não autorizado' });
  }
  const data = await getAllKeysDB();
  res.json(data.keys);
});

// API: gerar nova key (protegido por senha)
app.post('/api/keys', async (req, res) => {
  const auth = req.headers.authorization || '';
  const token = auth.replace('Bearer ', '');
  if (token !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Não autorizado' });
  }
  const { days } = req.body || {};
  const key = generateKey();
  const numDays = typeof days === 'number' && days > 0 ? days : (typeof days === 'string' ? parseInt(days, 10) : null);
  const expiresAt = (numDays && numDays > 0) ? new Date(Date.now() + numDays * 24 * 60 * 60 * 1000).toISOString() : null;
  
  const keyData = {
    key,
    active: true,
    createdAt: new Date().toISOString(),
    expiresAt,
    lastUsed: null,
    boundDevice: null
  };
  
  await saveKeyDB(keyData);
  res.json({ key, expiresAt });
});

// API: login (retorna token para usar nas outras rotas)
app.post('/api/login', (req, res) => {
  const { password } = req.body || {};
  if (password === ADMIN_PASSWORD) {
    return res.json({ token: ADMIN_PASSWORD });
  }
  res.status(401).json({ error: 'Senha incorreta' });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar servidor
initDB().then(() => {
  app.listen(PORT, () => {
    console.log('Painel r7dev rodando em http://localhost:' + PORT);
  });
});
