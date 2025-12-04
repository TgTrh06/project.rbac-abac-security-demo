import axios from 'axios';
import chalk from 'chalk';

// Configuration
const VULNERABLE_API = 'http://localhost:5001';
const SECURE_API = 'http://localhost:5002';

// Attacker credentials (user with minimal privileges)
const ATTACKER = {
    username: 'attacker',
    password: 'attacker123'
};

// Attack targets
const ATTACK_TARGETS = [
    { endpoint: '/api/resource/admin', name: 'Admin Resource', description: 'Admin-only data' },
    { endpoint: '/api/resource/department', name: 'Department Resource', description: 'IT Department data' },
    { endpoint: '/api/resource/top-secret', name: 'Top Secret Data', description: 'Highest clearance required' },
    { endpoint: '/api/resource/secret', name: 'Secret Data', description: 'Secret clearance required' },
    { endpoint: '/api/resource/work-hours', name: 'Work Hours Resource', description: 'Time-restricted data' },
    { endpoint: '/api/resource/office-ip', name: 'Office IP Resource', description: 'IP-restricted data' }
];

// Utility functions
const printHeader = (text) => {
    console.log('\n' + chalk.bold.cyan('═'.repeat(80)));
    console.log(chalk.bold.cyan(`  ${text}`));
    console.log(chalk.bold.cyan('═'.repeat(80)) + '\n');
};

const printSubHeader = (text) => {
    console.log(chalk.bold.yellow(`\n▶ ${text}`));
    console.log(chalk.yellow('─'.repeat(80)));
};

const printSuccess = (text) => {
    console.log(chalk.green('✓ ') + text);
};

const printError = (text) => {
    console.log(chalk.red('✗ ') + text);
};

const printWarning = (text) => {
    console.log(chalk.yellow('⚠ ') + text);
};

const printData = (data) => {
    console.log(chalk.gray('  → ') + chalk.white(JSON.stringify(data, null, 2)));
};

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
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data || { message: error.message },
            status: error.response?.status
        };
    }
}

// Main attack simulation
async function runAttackSimulation() {
    printHeader('🎭 ATTACK SIMULATION - Unauthorized Data Access Attempt');

    console.log(chalk.bold('Attacker Profile:'));
    console.log(chalk.gray(`  Username: ${ATTACKER.username}`));
    console.log(chalk.gray(`  Password: ${ATTACKER.password}`));
    console.log(chalk.gray(`  Role: None (or minimal)`));
    console.log(chalk.gray(`  Department: None`));
    console.log(chalk.gray(`  Clearance: None/Public`));
    console.log(chalk.gray(`  Objective: Steal sensitive data from both systems\n`));

    // Attack Vulnerable System
    printSubHeader('🔓 ATTACKING VULNERABLE SYSTEM (No RBAC/ABAC)');
    console.log(chalk.gray(`Target: ${VULNERABLE_API}\n`));

    let vulnerableToken;
    try {
        vulnerableToken = await login(VULNERABLE_API, ATTACKER);
        printSuccess(`Logged in successfully`);
        printData({ token: vulnerableToken.substring(0, 30) + '...' });
    } catch (error) {
        printError(`Login failed: ${error.message}`);
        console.log(chalk.red('\n⚠️ Cannot proceed with vulnerable system attack\n'));
    }

    if (vulnerableToken) {
        console.log(chalk.bold.yellow('\n📊 Attack Results on Vulnerable System:\n'));
        let successCount = 0;

        for (const target of ATTACK_TARGETS) {
            const result = await attemptAttack(VULNERABLE_API, vulnerableToken, target);

            if (result.success) {
                successCount++;
                printSuccess(`${target.name}: ${chalk.bold.red('DATA STOLEN!')}`);
                printData(result.data);
            } else {
                printError(`${target.name}: Access Denied`);
                printData(result.error);
            }
        }

        console.log(chalk.bold.red(`\n🚨 VULNERABLE SYSTEM BREACH SUMMARY:`));
        console.log(chalk.red(`   ${successCount}/${ATTACK_TARGETS.length} resources compromised!`));
        console.log(chalk.red(`   Success Rate: ${(successCount / ATTACK_TARGETS.length * 100).toFixed(1)}%`));
    }

    // Attack Secure System
    printSubHeader('🔒 ATTACKING SECURE SYSTEM (With RBAC/ABAC)');
    console.log(chalk.gray(`Target: ${SECURE_API}\n`));

    let secureToken;
    try {
        secureToken = await login(SECURE_API, ATTACKER);
        printSuccess(`Logged in successfully`);
        printData({ token: secureToken.substring(0, 30) + '...' });
    } catch (error) {
        printError(`Login failed: ${error.message}`);
        console.log(chalk.red('\n⚠️ Cannot proceed with secure system attack\n'));
    }

    if (secureToken) {
        console.log(chalk.bold.yellow('\n📊 Attack Results on Secure System:\n'));
        let successCount = 0;

        for (const target of ATTACK_TARGETS) {
            const result = await attemptAttack(SECURE_API, secureToken, target);

            if (result.success) {
                successCount++;
                printWarning(`${target.name}: ${chalk.bold.red('DATA STOLEN!')}`);
                printData(result.data);
            } else {
                printSuccess(`${target.name}: ${chalk.bold.green('PROTECTED!')}`);
                printData(result.error);
            }
        }

        console.log(chalk.bold.green(`\n✅ SECURE SYSTEM DEFENSE SUMMARY:`));
        console.log(chalk.green(`   ${ATTACK_TARGETS.length - successCount}/${ATTACK_TARGETS.length} resources protected!`));
        console.log(chalk.green(`   Defense Rate: ${((ATTACK_TARGETS.length - successCount) / ATTACK_TARGETS.length * 100).toFixed(1)}%`));
    }

    // Final Summary
    printHeader('📋 ATTACK SIMULATION SUMMARY');

    console.log(chalk.bold('Key Findings:\n'));
    console.log(chalk.red('❌ Vulnerable System:'));
    console.log(chalk.gray('   • No role-based access control (RBAC)'));
    console.log(chalk.gray('   • No attribute-based access control (ABAC)'));
    console.log(chalk.gray('   • Any authenticated user can access ANY resource'));
    console.log(chalk.gray('   • Critical data exposure risk\n'));

    console.log(chalk.green('✅ Secure System:'));
    console.log(chalk.gray('   • RBAC enforces role-based permissions'));
    console.log(chalk.gray('   • ABAC enforces attribute-based policies (clearance, department, time, IP)'));
    console.log(chalk.gray('   • Unauthorized access attempts are blocked and logged'));
    console.log(chalk.gray('   • Data remains protected\n'));

    console.log(chalk.bold.cyan('Recommendation:'));
    console.log(chalk.cyan('   Implement RBAC and ABAC to prevent unauthorized data access!'));
    console.log(chalk.cyan('   Check audit logs for detailed attack attempts.\n'));
}

// Run simulation
runAttackSimulation().catch(error => {
    console.error(chalk.red('\n❌ Simulation Error:'), error.message);
    process.exit(1);
});
