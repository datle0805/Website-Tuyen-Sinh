
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env
dotenv.config({ path: path.join(__dirname, '.env') });

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/admissions";

async function createAdmin() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB");

        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;

        if (!email || !password) {
            console.error("ADMIN_EMAIL or ADMIN_PASSWORD not found in .env");
            return;
        }

        const salt = await bcrypt.genSalt(12);
        const hash = await bcrypt.hash(password, salt);

        const UserSchema = new mongoose.Schema({
            email: { type: String, lowercase: true, trim: true },
            passwordHash: String,
            name: String,
            role: String
        });

        const User = mongoose.models.User || mongoose.model("User", UserSchema);

        const existing = await User.findOne({ email });
        if (existing) {
            existing.role = 'admin';
            existing.passwordHash = hash; // Ensure password matches request
            await existing.save();
            console.log("User updated to Admin successfully");
        } else {
            await User.create({
                email,
                passwordHash: hash,
                name: "Admin Caca",
                role: "admin"
            });
            console.log("Admin user created successfully");
        }

    } catch (error) {
        console.error("Error creating admin:", error);
    } finally {
        await mongoose.connection.close();
    }
}

createAdmin();
