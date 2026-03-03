const TelegramBot = require('node-telegram-bot-api');
const pool = require('../config/db');
const axios = require('axios');

const token = process.env.TELEGRAM_FULL_BOT_TOKEN;

// Initialize bot if token exists
let bot = null;

if (token) {
    bot = new TelegramBot(token, { polling: true });

    bot.onText(/\/start/, (msg) => {
        const chatId = msg.chat.id;
        const welcomeMessage = `
Привіт! Я помічник клінінгової компанії Uberem 🧹✨
Ось що я вмію:
/services - Переглянути наші послуги та ціни
/order - Оформити заявку на прибирання
/contact - Зв'язатися з менеджером
        `;
        bot.sendMessage(chatId, welcomeMessage);
    });

    bot.onText(/\/services/, async (msg) => {
        const chatId = msg.chat.id;
        try {
            const { rows } = await pool.query('SELECT * FROM services WHERE is_active = TRUE ORDER BY order_index ASC');
            if (rows.length === 0) {
                return bot.sendMessage(chatId, 'Наразі немає активних послуг.');
            }

            let message = '<b>Наші послуги:</b>\n\n';
            rows.forEach(service => {
                message += `🔹 <b>${service.title}</b>\n`;
                if (service.description) message += `${service.description}\n`;
                message += `💰 Ціна: ${service.price_label || service.price}\n\n`;
            });
            message += 'Натисніть /order щоб замовити прибирання.';

            bot.sendMessage(chatId, message, { parse_mode: 'HTML' });
        } catch (error) {
            console.error(error);
            bot.sendMessage(chatId, 'Виникла помилка при отриманні списку послуг.');
        }
    });

    // Command to start ordering
    const userStates = {};

    bot.onText(/\/order/, (msg) => {
        const chatId = msg.chat.id;
        userStates[chatId] = { step: 'service' };
        bot.sendMessage(chatId, 'Давайте оформимо заявку! Оберіть або напишіть послугу, яка вас цікавить (наприклад, "Базове прибирання"):');
    });

    bot.on('message', async (msg) => {
        const chatId = msg.chat.id;
        const text = msg.text;

        if (text && text.startsWith('/')) return; // Ignore commands

        const state = userStates[chatId];
        if (!state) return;

        if (state.step === 'service') {
            state.service = text;
            state.step = 'name';
            bot.sendMessage(chatId, 'Як до вас звертатися (ім\'я)?');

        } else if (state.step === 'name') {
            state.name = text;
            state.step = 'phone';
            bot.sendMessage(chatId, 'Будь ласка, введіть ваш номер телефону:');

        } else if (state.step === 'phone') {
            state.phone = text;
            state.step = 'area';
            bot.sendMessage(chatId, 'Яка площа прибирання? Введіть кількість квадратних метрів (або напишіть "Не знаю"):');

        } else if (state.step === 'area') {
            state.area = text;

            // Save to database
            try {
                await pool.query(
                    'INSERT INTO leads (name, phone, service_title, area) VALUES ($1, $2, $3, $4)',
                    [state.name, state.phone, state.service, state.area === 'Не знаю' ? null : state.area]
                );

                bot.sendMessage(chatId, '✅ Дякуємо! Ваша заявка успішно оформлена. Менеджер зв\'яжеться з вами найближчим часом для підтвердження деталей.');

                // Notify via lead notification bot if configured
                const adminBotToken = process.env.TELEGRAM_LEAD_BOT_TOKEN;
                const adminChatId = process.env.TELEGRAM_CHAT_ID;
                if (adminBotToken && adminChatId) {
                    const adminMsg = `
<b>🔔 Нова заявка (Через Телеграм Бот)!</b>

👤 <b>Ім'я:</b> ${state.name}
📞 <b>Телефон:</b> ${state.phone}
🧹 <b>Послуга:</b> ${state.service}
📏 <b>Площа:</b> ${state.area} м²
                    `;
                    await axios.post(`https://api.telegram.org/bot${adminBotToken}/sendMessage`, {
                        chat_id: adminChatId,
                        text: adminMsg,
                        parse_mode: 'HTML'
                    }).catch(console.error);
                }
            } catch (error) {
                console.error('Save lead error:', error);
                bot.sendMessage(chatId, 'Вибачте, сталася помилка при збереженні заявки. Спробуйте пізніше.');
            }

            // Clear state
            delete userStates[chatId];
        }
    });

    bot.onText(/\/contact/, async (msg) => {
        const chatId = msg.chat.id;
        try {
            const { rows } = await pool.query("SELECT value FROM settings WHERE key = 'phone'");
            const phone = rows.length > 0 ? rows[0].value : '+380 XXX XXX XX XX';
            bot.sendMessage(chatId, `Ви можете зв'язатися з нашим менеджером за телефоном:\n${phone}`);
        } catch (error) {
            bot.sendMessage(chatId, `Ви можете зв'язатися з нашим менеджером.`);
        }
    });

    console.log('Telegram Full Functionality Bot initialized (polling mode)');
} else {
    console.log('TELEGRAM_FULL_BOT_TOKEN not provided, interactive bot is disabled.');
}

module.exports = bot;
