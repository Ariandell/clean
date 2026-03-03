const pool = require('./config/db');
const bcrypt = require('bcryptjs');

const initialServices = [
    {
        title: "Базове прибирання",
        description: "Ідеально для підтримки чистоти. Ми протираємо пил, миємо підлогу та наводимо лад.",
        price: "1500",
        price_label: "від 1500 ₴",
        price_type: 'fixed',
        category: 'apartment',
        gradient: "from-blue-400 to-blue-600",
        features: JSON.stringify(["Сухе та вологе прибирання", "Очищення поверхонь", "Дезінфекція санвузлів", "Виніс сміття"])
    },
    {
        title: "Генеральне прибирання",
        description: "Повне очищення квартири від стелі до підлоги. Включає миття вікон та видалення складних забруднень.",
        price: "3500",
        price_label: "від 3500 ₴",
        price_type: 'sqm',
        category: 'apartment',
        gradient: "from-purple-400 to-purple-600",
        features: JSON.stringify(["Все з базового прибирання", "Миття вікон та рам", "Очищення кухні та жиру", "Хімчистка меблів (опція)"])
    },
    {
        title: "Прибирання після ремонту",
        description: "Видалення будівельного пилу, слідів фарби та цементу. Робимо квартиру придатною для життя.",
        price: "60",
        price_label: "60 ₴/м²",
        price_type: 'sqm',
        category: 'house',
        gradient: "from-orange-400 to-orange-600",
        features: JSON.stringify(["Видалення будівельного пилу", "Миття всіх поверхонь", "Чистка плитки та швів", "Виніс будівельного сміття"])
    }
];

const seed = async () => {
    try {
        console.log('🌱 Seeding database...');


        await pool.query(`
            CREATE TABLE IF NOT EXISTS admins (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS services (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                slug VARCHAR(255) UNIQUE NOT NULL,
                description TEXT,
                price VARCHAR(50),
                price_label VARCHAR(50),
                price_type VARCHAR(20) DEFAULT 'fixed',
                category VARCHAR(50) DEFAULT 'apartment',
                image_url VARCHAR(255),
                gradient VARCHAR(255),
                features TEXT,
                is_active BOOLEAN DEFAULT TRUE,
                is_featured BOOLEAN DEFAULT FALSE,
                order_index INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS leads (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                phone VARCHAR(50) NOT NULL,
                service_title VARCHAR(255),
                service_category VARCHAR(50),
                estimated_price VARCHAR(50),
                area VARCHAR(50),
                status VARCHAR(20) DEFAULT 'new',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS settings (
                id SERIAL PRIMARY KEY,
                key VARCHAR(255) UNIQUE NOT NULL,
                value TEXT,
                category VARCHAR(50),
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);



        await pool.query('DELETE FROM services');
        await pool.query('ALTER SEQUENCE services_id_seq RESTART WITH 1');


        for (const service of initialServices) {
            const slug = service.title.toLowerCase().replace(/ /g, '-') + '-' + Date.now();
            await pool.query(
                'INSERT INTO services (title, slug, description, price, price_label, price_type, category, gradient, features, is_featured) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
                [service.title, slug, service.description, service.price, service.price_label, service.price_type, service.category, service.gradient, service.features, true]
            );
        }


        const passwordHash = await bcrypt.hash('21Twenty_one21', 10);

        await pool.query('DELETE FROM admins WHERE username = $1', ['admin']);
        await pool.query('DELETE FROM admins WHERE username = $1', ['maksym.auto.online@gmail.com']);

        await pool.query('INSERT INTO admins (username, password_hash) VALUES ($1, $2)', ['maksym.auto.online@gmail.com', passwordHash]);


        const defaultSettings = [

            { key: 'phone', value: '+380 XX XXX XX XX', category: 'contact' },
            { key: 'email', value: 'info@cleaning.com', category: 'contact' },
            { key: 'address', value: 'Київ, Україна', category: 'contact' },
            { key: 'hours', value: 'Пн-Нд: 8:00 - 20:00', category: 'contact' },

            { key: 'instagram', value: '', category: 'social' },
            { key: 'facebook', value: '', category: 'social' },
            { key: 'telegram', value: '', category: 'social' },

            { key: 'company_description', value: 'Професійна клінінгова компанія з багаторічним досвідом.', category: 'about' },
            { key: 'team_image_url', value: '', category: 'about' },
            { key: 'mission', value: 'Створювати ідеальну чистоту для наших клієнтів.', category: 'about' },
            { key: 'values', value: 'Якість, Надійність, Професіоналізм', category: 'about' },

            { key: 'meta_title', value: 'Клінінгові послуги в Києві | Професійне прибирання', category: 'seo' },
            { key: 'meta_description', value: 'Професійні клінінгові послуги: генеральне прибирання, прибирання після ремонту, підтримуюче прибирання. Еко-засоби та досвідчена команда.', category: 'seo' },
            { key: 'og_image', value: '', category: 'seo' },
            { key: 'ga_id', value: '', category: 'seo' }
        ];

        for (const setting of defaultSettings) {
            await pool.query(
                'INSERT INTO settings (key, value, category) VALUES ($1, $2, $3) ON CONFLICT (key) DO NOTHING',
                [setting.key, setting.value, setting.category]
            );
        }

        console.log('✅ Database seeded successfully! Admin: maksym.auto.online@gmail.com / 21Twenty_one21');
        process.exit();
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seed();
