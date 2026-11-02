const db = require('./db');

async function saveContactMessage(req, res) {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({ status: 'error', message: 'All fields are required.' });
        }

        const sql = "INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)";
        await db.execute(sql, [name, email, subject, message]);

        res.json({ status: 'success', message: 'Support message saved successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Failed to save message to database.' });
    }
}

module.exports = saveContactMessage;