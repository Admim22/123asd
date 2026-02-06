-- Schema SQL para Supabase (PostgreSQL)
-- Tabela de licenças/keys

CREATE TABLE IF NOT EXISTS keys (
    id SERIAL PRIMARY KEY,
    key VARCHAR(255) UNIQUE NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP DEFAULT NULL,
    last_used TIMESTAMP DEFAULT NULL,
    bound_device VARCHAR(255) DEFAULT NULL
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_keys_key ON keys(key);
CREATE INDEX IF NOT EXISTS idx_keys_active ON keys(active);
CREATE INDEX IF NOT EXISTS idx_keys_bound_device ON keys(bound_device);

-- Comentários
COMMENT ON TABLE keys IS 'Tabela de licenças/keys do sistema';
COMMENT ON COLUMN keys.key IS 'Chave de licença única (formato: R7D-XXXX-XXXX-XXXX)';
COMMENT ON COLUMN keys.active IS 'Se a key está ativa';
COMMENT ON COLUMN keys.created_at IS 'Data de criação da key';
COMMENT ON COLUMN keys.expires_at IS 'Data de expiração (NULL = vitalícia)';
COMMENT ON COLUMN keys.last_used IS 'Última vez que a key foi usada';
COMMENT ON COLUMN keys.bound_device IS 'Fingerprint do dispositivo vinculado (1 key = 1 PC)';
