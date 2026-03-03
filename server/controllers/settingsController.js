const pool = require('../config/db');

exports.getAllSettings = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM settings ORDER BY category, key');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getPublicSettings = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT key, value, category FROM settings');

        // Format as key-value object for easier frontend consumption
        const settings = rows.reduce((acc, row) => {
            acc[row.key] = row.value;
            return acc;
        }, {});

        res.json(settings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateSettings = async (req, res) => {
    const updates = req.body; // Array of { key, value }

    try {
        for (const { key, value } of updates) {
            await pool.query(
                'UPDATE settings SET value = $1, updated_at = CURRENT_TIMESTAMP WHERE key = $2',
                [value, key]
            );
        }

        res.json({ message: 'Settings updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
