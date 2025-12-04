import axios from 'axios';
import fs from 'fs';
import path from 'path';

// Configuration
const VULNERABLE_API = 'http://localhost:5001';
const SECURE_API = 'http://localhost:5002';

// Attacker credentials
const ATTACKER = {
    username: 'attacker',
    password: 'attacker123'
};

// Attack targets
const ATTACK_TARGETS = [
    { endpoint: '/api/resource/admin', name: 'Admin Resource' },
    { endpoint: '/api/resource/department', name: 'Department Resource' },
    { endpoint: '/api/resource/top-secret', name: 'Top Secret Data' },
    { endpoint: '/api/resource/secret', name: 'Secret Data' },
    { endpoint: '/api/resource/work-hours', name: 'Work Hours Resource' },
    { endpoint: '/api/resource/office-ip', name: 'Office IP Resource' }
];

// Login function
async function login(apiUrl, credentials) {
    try {
        const response = await axios.post(`${apiUrl}/api/login`, credentials);
        return response.data.token;
    } catch (error) {
        throw new Error(`Login failed: ${error.response?.data?.message || error.message}`);
    }
}

// Attack function
async function attemptAttack(apiUrl, token, target) {
    try {
        const response = await axios.get(`${apiUrl}${target.endpoint}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data || { message: error.message },
            status: error.response?.status
        };
    }
}

// Generate report
async function generateReport() {
    const report = {
        timestamp: new Date().toISOString(),
        attacker: ATTACKER.username,
        vulnerable: { results: [], successCount: 0 },
        secure: { results: [], successCount: 0 }
    };

    console.log('🎭 Running Attack Simulation...\n');

    // Attack Vulnerable System
    try {
        const vulnerableToken = await login(VULNERABLE_API, ATTACKER);
        console.log('✓ Logged into Vulnerable System');

        for (const target of ATTACK_TARGETS) {
            const result = await attemptAttack(VULNERABLE_API, vulnerableToken, target);
            report.vulnerable.results.push({
                target: target.name,
                success: result.success,
                data: result.data,
                error: result.error
            });
            if (result.success) report.vulnerable.successCount++;
        }
    } catch (error) {
        console.error('✗ Vulnerable system error:', error.message);
    }

    // Attack Secure System
    try {
        const secureToken = await login(SECURE_API, ATTACKER);
        console.log('✓ Logged into Secure System');

        for (const target of ATTACK_TARGETS) {
            const result = await attemptAttack(SECURE_API, secureToken, target);
            report.secure.results.push({
                target: target.name,
                success: result.success,
                data: result.data,
                error: result.error
            });
            if (result.success) report.secure.successCount++;
        }
    } catch (error) {
        console.error('✗ Secure system error:', error.message);
    }

    // Save report
    const reportPath = path.join(process.cwd(), 'attack-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📄 Report saved to: ${reportPath}`);

    // Generate summary
    console.log('\n' + '='.repeat(80));
    console.log('📊 ATTACK SIMULATION SUMMARY');
    console.log('='.repeat(80));
    console.log(`\n🔓 Vulnerable System:`);
    console.log(`   Compromised: ${report.vulnerable.successCount}/${ATTACK_TARGETS.length}`);
    console.log(`   Success Rate: ${(report.vulnerable.successCount / ATTACK_TARGETS.length * 100).toFixed(1)}%`);

    console.log(`\n🔒 Secure System:`);
    console.log(`   Protected: ${ATTACK_TARGETS.length - report.secure.successCount}/${ATTACK_TARGETS.length}`);
    console.log(`   Defense Rate: ${((ATTACK_TARGETS.length - report.secure.successCount) / ATTACK_TARGETS.length * 100).toFixed(1)}%`);
    console.log('\n' + '='.repeat(80) + '\n');

    return report;
}

// Run
generateReport().catch(console.error);
