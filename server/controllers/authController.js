const db = require('../config/db');
const bcrypt = require('bcrypt');

exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, role, location } = req.body;
        if (!name || !email || !password || !role) {
            return res.status(400).json({ error: 'Missing required registration details.' });
        }
        
        const [existing] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'User with this email already exists.' });
        }

        // Hash the password securely before saving
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const [result] = await db.execute(
            'INSERT INTO users (name, email, password_hash, role, location) VALUES (?, ?, ?, ?, ?)',
            [name, email, hashedPassword, role, location || 'Nairobi']
        );

        res.status(201).json({
            message: 'User registered successfully',
            user: { id: result.insertId, name, email, role, location: location || 'Nairobi' }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        
        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const user = users[0];

        // Compare the submitted password with the stored bcrypt hash
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        delete user.password_hash;
        res.status(200).json({ message: 'Login successful', user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email, new_password } = req.body;
        if (!email || !new_password) {
            return res.status(400).json({ error: 'Email and new password are required.' });
        }

        // Check if user exists
        const [users] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(404).json({ error: 'No account found with this email address.' });
        }

        // Hash the new password 
        const hashedPassword = await bcrypt.hash(new_password, 10);

        // Update database
        await db.execute('UPDATE users SET password_hash = ? WHERE email = ?', [hashedPassword, email]);

        res.status(200).json({ status: 'success', message: 'Password successfully updated.' });
    } catch (err) {
        console.error('Forgot password error:', err);
        res.status(500).json({ error: 'Internal server error during password reset.' });
    }
};