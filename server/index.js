require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.get('/', (req, res) => {
    res.json({ message: 'Uberem Cleaning API is running' });
});


app.use('/api/auth', require('./routes/auth'));
app.use('/api/services', require('./routes/services'));
app.use('/api/leads', require('./routes/leads'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/chat', require('./routes/chat'));

// Initialize Telegram Full Functionality Bot
require('./bot/telegramBot');

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
