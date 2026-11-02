const db = require('../config/db');

exports.getAllProduce = async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT p.*, u.name as farmer_name, c.name as category 
            FROM produce p 
            JOIN users u ON p.farmer_id = u.id 
            JOIN categories c ON p.category_id = c.id
            ORDER BY p.created_at DESC
        `);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createProduce = async (req, res) => {
    try {
        const { farmer_id, title, category_id, price, unit, stock, description, image_url } = req.body;
        const [result] = await db.execute(
            `INSERT INTO produce (farmer_id, title, category_id, price, unit, stock, description, image_url, is_approved) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, FALSE)`,
            [farmer_id, title, category_id, price, unit, stock, description, image_url]
        );
        res.status(201).json({ message: 'Produce submitted for approval', id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateProduce = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, price, unit, stock, description, image_url } = req.body;
        await db.execute(
            `UPDATE produce SET title = ?, price = ?, unit = ?, stock = ?, description = ?, image_url = ? WHERE id = ?`,
            [title, price, unit, stock, description, image_url, id]
        );
        res.status(200).json({ message: 'Produce updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteProduce = async (req, res) => {
    try {
        const { id } = req.params;
        await db.execute('DELETE FROM produce WHERE id = ?', [id]);
        res.status(200).json({ message: 'Produce deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.approveProduce = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_approved } = req.body;
        await db.execute('UPDATE produce SET is_approved = ? WHERE id = ?', [is_approved, id]);
        res.status(200).json({ message: 'Produce approval status updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};