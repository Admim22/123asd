// Script de teste da API
// Execute: node test-api.js

const API_URL = 'http://localhost:3000';
const ADMIN_PASSWORD = 'admin123';

async function testAPI() {
    console.log('🧪 TESTANDO API DO PAINEL ADMIN\n');
    
    // Teste 1: Login
    console.log('1️⃣ Testando login...');
    try {
        const loginRes = await fetch(`${API_URL}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: ADMIN_PASSWORD })
        });
        const loginData = await loginRes.json();
        
        if (loginData.token) {
            console.log('✅ Login funcionando! Token:', loginData.token);
        } else {
            console.log('❌ Login falhou!');
            return;
        }
    } catch (e) {
        console.log('❌ Erro ao conectar:', e.message);
        console.log('⚠️  Certifique-se que o servidor está rodando: npm start');
        return;
    }
    
    // Teste 2: Gerar key
    console.log('\n2️⃣ Testando geração de key...');
    try {
        const genRes = await fetch(`${API_URL}/api/keys`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ADMIN_PASSWORD}`
            },
            body: JSON.stringify({ days: 7 })
        });
        const genData = await genRes.json();
        
        if (genData.key) {
            console.log('✅ Key gerada:', genData.key);
            console.log('   Expira em:', genData.expiresAt);
            
            // Teste 3: Validar key
            console.log('\n3️⃣ Testando validação de key...');
            const valRes = await fetch(`${API_URL}/api/validate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    licenseKey: genData.key,
                    deviceFingerprint: 'TEST-PC-123'
                })
            });
            const valData = await valRes.json();
            
            if (valData.valid) {
                console.log('✅ Validação funcionando!');
                console.log('   Mensagem:', valData.message);
            } else {
                console.log('❌ Validação falhou:', valData.message);
            }
            
            // Teste 4: Verificar key
            console.log('\n4️⃣ Testando verificação de key...');
            const checkRes = await fetch(`${API_URL}/api/check-key?key=${genData.key}`, {
                headers: { 'Authorization': `Bearer ${ADMIN_PASSWORD}` }
            });
            const checkData = await checkRes.json();
            
            if (checkData.valid) {
                console.log('✅ Verificação funcionando!');
                console.log('   Dias restantes:', checkData.daysLeft);
                console.log('   Vinculada a PC:', checkData.boundDevice);
            } else {
                console.log('❌ Verificação falhou:', checkData.message);
            }
            
            // Teste 5: Tentar usar em outro PC
            console.log('\n5️⃣ Testando bloqueio de outro PC...');
            const val2Res = await fetch(`${API_URL}/api/validate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    licenseKey: genData.key,
                    deviceFingerprint: 'OUTRO-PC-456'
                })
            });
            const val2Data = await val2Res.json();
            
            if (!val2Data.valid) {
                console.log('✅ Bloqueio funcionando!');
                console.log('   Mensagem:', val2Data.message);
            } else {
                console.log('❌ ERRO: Deveria bloquear outro PC!');
            }
            
        } else {
            console.log('❌ Falha ao gerar key!');
        }
    } catch (e) {
        console.log('❌ Erro:', e.message);
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('🎉 TESTES CONCLUÍDOS!');
    console.log('='.repeat(50));
}

testAPI();
