const pool = require('../config/db');
const fs = require('fs');
const path = require('path');

const FALBACK_SERVICES = [
    {
        id: 'default_1',
        title: "Базове прибирання",
        description: "Ідеально для підтримки чистоти. Ми протираємо пил, миємо підлогу та наводимо лад.",
        price: "1500",
        price_label: "від 1500 ₴",
        price_type: 'fixed',
        category: 'apartment',
        gradient: "from-blue-400 to-blue-600",
        features: ["Сухе та вологе прибирання", "Очищення поверхонь", "Дезінфекція санвузлів", "Виніс сміття"],
        is_featured: true
    },
    {
        id: 'default_2',
        title: "Генеральне прибирання",
        description: "Повне очищення квартири від стелі до підлоги. Включає миття вікон та видалення складних забруднень.",
        price: "3500",
        price_label: "від 3500 ₴",
        price_type: 'sqm',
        category: 'apartment',
        gradient: "from-purple-400 to-purple-600",
        features: ["Все з базового прибирання", "Миття вікон та рам", "Очищення кухні та жиру", "Хімчистка меблів (опція)"],
        is_featured: true
    },
    {
        id: 'default_3',
        title: "Прибирання після ремонту",
        description: "Видалення будівельного пилу, слідів фарби та цементу. Робимо квартиру придатною для життя.",
        price: "60",
        price_label: "60 ₴/м²",
        price_type: 'sqm',
        category: 'house',
        gradient: "from-orange-400 to-orange-600",
        features: ["Видалення будівельного пилу", "Миття всіх поверхонь", "Чистка плитки та швів", "Виніс будівельного сміття"],
        is_featured: true
    }
];

exports.getAllServices = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM services WHERE is_active = TRUE ORDER BY order_index ASC');
        // Parse features JSON which might be returned as string or object depending on driver/type
        const services = rows.map(s => {
            let features = s.features;
            // logic to ensure features is an array, Postgres might return it as string or already parsed if JSONB
            if (typeof features === 'string') {
                try { features = JSON.parse(features); } catch (e) { features = []; }
            }
            return { ...s, features: features || [] };
        });

        if (services.length === 0) {
            return res.json(FALBACK_SERVICES);
        }
        res.json(services);
    } catch (error) {
        console.error('DB Error (serving fallback):', error.message);
        res.json(FALBACK_SERVICES);
    }
};

exports.getAdminServices = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM services ORDER BY order_index ASC');
        const services = rows.map(s => {
            let features = s.features;
            if (typeof features === 'string') {
                try { features = JSON.parse(features); } catch (e) { features = []; }
            }
            return { ...s, features: features || [] };
        });
        res.json(services);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.createService = async (req, res) => {
    try {
        let { title, description, price, price_label, price_type, category, features, gradient, is_featured } = req.body;
        const image_url = req.file ? `/uploads/${req.file.filename}` : null;
        const slug = title.toLowerCase().replace(/ /g, '-') + '-' + Date.now();

        // Default is_featured to false if not provided
        is_featured = String(is_featured) === 'true' || String(is_featured) === '1';

        await pool.query(
            'INSERT INTO services (title, slug, description, price, price_label, price_type, category, image_url, gradient, features, is_featured) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
            [title, slug, description, price, price_label, price_type, category, image_url, gradient, features, is_featured]
        );

        res.status(201).json({ message: 'Service created' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateService = async (req, res) => {
    try {
        const { id } = req.params;
        let { title, description, price, price_label, price_type, category, features, gradient, is_active, is_featured } = req.body;
        console.log('Update Service Body:', JSON.stringify(req.body, null, 2));

        // Ensure is_active is boolean. Default to true if undefined/null to prevent disappearance.
        if (is_active === undefined || is_active === null) {
            is_active = true;
        } else {
            is_active = String(is_active) === 'true' || String(is_active) === '1';
        }

        // Handle is_featured
        is_featured = String(is_featured) === 'true' || String(is_featured) === '1';

        let query = 'UPDATE services SET title=$1, description=$2, price=$3, price_label=$4, price_type=$5, category=$6, features=$7, gradient=$8, is_active=$9, is_featured=$10';
        const params = [title, description, price, price_label, price_type, category, features, gradient, is_active, is_featured];

        if (req.file) {
            query += ', image_url=$11';
            params.push(`/uploads/${req.file.filename}`);
        }

        query += ' WHERE id=$' + (params.length + 1);
        params.push(id);

        await pool.query(query, params);
        res.json({ message: 'Service updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteService = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM services WHERE id = $1', [id]);
        res.json({ message: 'Service deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
