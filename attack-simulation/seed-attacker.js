import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config({ path: '../backend_secure/.env' });

// User Schema (matching backend)
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    department: { type: String, default: null },
    clearance: { type: String, default: 'public' }
});

const User = mongoose.model('User', userSchema);

async function seedAttacker() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Check if attacker already exists
        const existingAttacker = await User.findOne({ username: 'attacker' });

        if (existingAttacker) {
            console.log('⚠️  Attacker user already exists. Deleting...');
            await User.deleteOne({ username: 'attacker' });
        }

        // Create attacker user with minimal privileges
        const hashedPassword = await bcrypt.hash('attacker123', 10);

        const attacker = new User({
            username: 'attacker',
            password: hashedPassword,
            role: 'user',           // Basic user role (not admin)
            department: null,        // No department assigned
            clearance: 'public'      // Lowest clearance level
        });

        await attacker.save();

        console.log('✅ Attacker user created successfully!');
        console.log('\n📋 Attacker Profile:');
        console.log('   Username: attacker');
        console.log('   Password: attacker123');
        console.log('   Role: user (not admin)');
        console.log('   Department: null (no department)');
        console.log('   Clearance: public (lowest level)');
        console.log('\n🎯 This user will be used to demonstrate unauthorized access attempts.');
        console.log('   In vulnerable system: Will succeed in stealing data');
        console.log('   In secure system: Will be blocked by RBAC/ABAC policies\n');

    } catch (error) {
        console.error('❌ Error seeding attacker:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
    }
}

seedAttacker();
