const pool = require('../config/db');
const axios = require('axios');

const TELEGRAM_TOKEN = process.env.TELEGRAM_LEAD_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const sendTelegramMessage = async (message) => {
    if (!TELEGRAM_TOKEN || !CHAT_ID) return;
    try {
        await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            chat_id: CHAT_ID,
            text: message,
            parse_mode: 'HTML'
        });
    } catch (error) {
        console.error('Telegram Error:', error.message);
    }
};

exports.createLead = async (req, res) => {
    const { name, phone, service_title, service_category, estimated_price, area } = req.body;

    try {
        const { rows } = await pool.query(
            'INSERT INTO leads (name, phone, service_title, service_category, estimated_price, area) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
            [name, phone, service_title, service_category, estimated_price, area || null]
        );

        const newLeadId = rows[0].id;

        // Notify via Telegram
        const message = `
<b>🔔 Нова заявка!</b>

👤 <b>Ім'я:</b> ${name}
📞 <b>Телефон:</b> ${phone}
🧹 <b>Послуга:</b> ${service_title || 'Швидка заявка'}
💰 <b>Ціна:</b> ${estimated_price || 'Не вказано'}
${area ? `📏 <b>Площа:</b> ${area} м²` : ''}
        `;
        await sendTelegramMessage(message);

        res.status(201).json({ message: 'Lead created', id: newLeadId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAllLeads = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM leads ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateLead = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        await pool.query(
            'UPDATE leads SET status = $1 WHERE id = $2',
            [status, id]
        );
        res.json({ message: 'Lead updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteLead = async (req, res) => {
    const { id } = req.params;

    try {
        await pool.query('DELETE FROM leads WHERE id = $1', [id]);
        res.json({ message: 'Lead deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
