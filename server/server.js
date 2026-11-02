const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// 1. Initialize 'app' first before using it
const app = express();
const PORT = process.env.PORT || 3000;

// 2. Middlewares
app.use(cors());
app.use(express.json());

// 3. Serve Static Frontend files
app.use(express.static(path.join(__dirname, '../public')));

// 4. API Routes (Now 'app' is safely initialized)
const apiRoutes = require('./routes/apiRoutes');
app.use('/api', apiRoutes);

// 5. Fallback to SPA Index
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// 6. Start Server
app.listen(PORT, () => {
    console.log(`AgriConnect Server running on http://localhost:${PORT}`);
});


// Parse incoming request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



// API endpoint for the contact form
const saveMessage = require('./config/save_message');
app.post('/api/contact', saveMessage);

