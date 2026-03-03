require('dotenv').config();
const pool = require('./config/db');

async function checkServices() {
    try {
        const res = await pool.query('SELECT id, title, price, price_type, price_label FROM services');
        console.log(JSON.stringify(res.rows, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

checkServices();
