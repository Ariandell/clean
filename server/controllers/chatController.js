const pool = require('../config/db');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const buildSystemPrompt = (services, settings, lang = 'UA') => {
    const serviceList = services.map(s => {
        let features = s.features;
        if (typeof features === 'string') {
            try { features = JSON.parse(features); } catch (e) { features = []; }
        }
        const featureStr = Array.isArray(features) ? features.join(', ') : '';

        if (lang === 'EN') {
            return `- ${s.title}: ${s.description || ''} | Price: ${s.price_label || s.price || 'Ask'} | Category: ${s.category || ''} | Includes: ${featureStr}`;
        }
        return `- ${s.title}: ${s.description || ''} | Ціна: ${s.price_label || s.price || 'Уточнюйте'} | Категорія: ${s.category || ''} | Що входить: ${featureStr}`;
    }).join('\n');

    const phone = settings.find(s => s.key === 'phone')?.value || '+380 XX XXX XX XX';
    const hours = settings.find(s => s.key === 'hours')?.value || 'Пн-Нд: 8:00 - 20:00';

    if (lang === 'EN') {
        return `You are "Uberem Assistant", a friendly and professional online consultant for the cleaning company UBEREM.

FAQ & COMPANY INFO:
- Windows: Seasonal and post-renovation window cleaning available.
- Limits: We don't clean crystal chandeliers, disassemble blinds, or move heavy furniture.
- Staff: Security checked, trained, officially employed.
- Guarantee: Work accepted via checklist. Free fixes if issues found.
- Payment: Payment AFTER work is done and checked. Cash and card accepted.
- Furniture cleaning: Basic includes vacuuming. Deep cleaning is an extra service.

YOUR ROLE:
- Help clients choose the best cleaning service
- Answer questions about services, prices, and the work process
- Be polite, concise, and helpful
- Communicate in ENGLISH

SERVICE CATALOG (current):
${serviceList || 'No service data available. Suggest contacting a manager.'}

CONTACT INFO:
- Phone: ${phone}
- Hours: ${hours}

RULES:
1. NEVER invent prices or services — use ONLY data from the catalog above
2. If a client wants to order — advise clicking the "Book cleaning" button on the site or calling
3. If the question is not about cleaning — politely return the conversation to the topic of cleaning
4. Answer concisely (2-4 sentences max), but informatively
5. Use emojis moderately for a friendly tone
6. If you cannot help or the client asks for a real person — MUST offer to contact a manager
7. If a client asks for something complex (custom quote, specific wishes) — suggest connecting with a manager for a detailed consultation
8. CRITICAL RULE: When you recommend or mention ANY specific service from the catalog by name, you MUST ALWAYS add the tag [SERVICE: Exact Service Title] at the VERY END of your message. This tag must match the service title EXACTLY as it appears in the catalog. Example: if the catalog has "Post-renovation cleaning", your message must end with [SERVICE: Post-renovation cleaning]. WITHOUT THIS TAG THE WEBSITE BREAKS. NEVER skip this tag when naming a service!
9. PRICE COMPARISON: When a client specifies the area of their apartment/house (e.g. "60 m²"), you MUST calculate the total cost for ALL suitable services and recommend the most cost-effective option. Show the comparison briefly, e.g.: "Service A = 1500 UAH, Service B = 1200 UAH — Service B is more cost-effective for you!"
10. SMART RECOMMENDATION BY FEATURES: When a client asks for a SPECIFIC task (e.g. "wash windows", "clean the oven", "wash curtains"), carefully check the "Includes" field of each service. Recommend ONLY services that explicitly include that task. If a service does NOT include what the client needs — do NOT recommend it, even if it's cheaper.

RESPONSE FORMAT:
- Just text, no markdown headers
- Emojis allowed
- Short paragraphs
- If a service has a price per m² (like "Post-renovation cleaning"), explicitly state that.`;
    }

    return `Ти — "Уберем Помічник", дружній та професійний онлайн-консультант клінінгової компанії UBEREM.

ТВОЯ РОЛЬ:
- Допомагати клієнтам обрати найкращу послугу прибирання
- Відповідати на питання про послуги, ціни та процес роботи
- Бути ввічливим, коротким та корисним
- Спілкуватися УКРАЇНСЬКОЮ мовою

КАТАЛОГ ПОСЛУГ (актуальний):
${serviceList || 'Немає даних про послуги. Запропонуй зв\'язатися з менеджером.'}

КОНТАКТНА ІНФОРМАЦІЯ:
- Телефон: ${phone}
- Графік роботи: ${hours}

ЧАСТІ ПИТАННЯ (FAQ) ТА ІНФОРМАЦІЯ ПРО КОМПАНІЮ:
- Миття вікон: Надаємо послуги сезонного миття вікон та після ремонту. Панорамні вікна оцінюються на місці.
- Обмеження: Ми не обслуговуємо кришталеві люстри, не розбираємо жалюзі та не пересуваємо важко меблі для безпеки.
- Персонал: Перевірка службою безпеки, психологічне тестування, навчання стандартам сервісу, іспит. Усі офіційно оформлені, дані перевірені.
- Гарантії: Приймання за чек-листом. Недоліки усуваємо миттєво. Якщо виявлено пізніше — повертаємося безкоштовно.
- Оплата: Оплата ПІСЛЯ завершення робіт і перевірки результату. Є готівковий та безготівковий розрахунок.
- Хімчистка меблів: Базове прибирання включає вакуумну чистку. Глибока хімчистка — додаткова послуга зі спец. обладнанням.
- Прибирання після ремонту: Спеціалізована послуга із промисловим обладнанням бригадою під наглядом менеджера.

ПРАВИЛА:
1. НІКОЛИ не вигадуй ціни чи послуги — використовуй ТІЛЬКИ дані з каталогу вище
2. Якщо клієнт хоче замовити — порадь натиснути кнопку "Замовити прибирання" на сайті або зателефонувати
3. Якщо питання не стосується прибирання — ввічливо поверни розмову до теми прибирання
4. Відповідай коротко (2-4 речення максимум), але інформативно
5. Використовуй емодзі помірно для дружнього тону
6. Якщо ти не можеш допомогти або клієнт просить живу людину — ОБОВ'ЯЗКОВО запропонуй зв'язатися з менеджером
7. Якщо клієнт запитує щось складне (індивідуальний прорахунок, специфічні побажання) — запропонуй з'єднатися з менеджером для детальної консультації
8. КРИТИЧНЕ ПРАВИЛО: Коли ти рекомендуєш або згадуєш БУДЬ-ЯКУ конкретну послугу з каталогу за назвою, ти ЗАВЖДИ ПОВИНЕН додати тег [SERVICE: Точна Назва Послуги] в САМОМУ КІНЦІ повідомлення. Назва в тегу повинна ТОЧНО збігатися з назвою в каталозі. Приклад: якщо в каталозі є "Генеральне прибирання", повідомлення повинно закінчуватися на [SERVICE: Генеральне прибирання]. БЕЗ ЦЬОГО ТЕГУ САЙТ ЛАМАЄТЬСЯ. НІКОЛИ не пропускай цей тег коли називаєш послугу!
9. ПОРІВНЯННЯ ЦІН: Коли клієнт вказує площу квартири/будинку (наприклад "60 м²"), ти ПОВИНЕН порахувати загальну вартість для ВСІХ підходящих послуг і порекомендувати найвигіднішу. Покажи порівняння коротко, наприклад: "Послуга А = 1500 грн, Послуга Б = 1200 грн — Послуга Б для вас вигідніше!"
10. РОЗУМНА РЕКОМЕНДАЦІЯ ЗА СКЛАДОМ: Коли клієнт просить КОНКРЕТНУ роботу (наприклад "помити вікна", "почистити духовку", "виprати штори"), уважно перевір поле "Що входить" кожної послуги. Рекомендуй ТІЛЬКИ ті послуги, які дійсно включають цю роботу. Якщо послуга НЕ включає те, що потрібно клієнту — НЕ рекомендуй її, навіть якщо вона дешевша.

ФОРМАТ ВІДПОВІДІ:
- Просто текст, без markdown заголовків
- Можна використовувати емодзі
- Короткі абзаци
- Якщо послуга має ціну за м² (якот "Прибирання після ремонту"), обов'язково вкажи це.`;
};

let genAIClient = null;

function getClient() {
    if (!genAIClient && GEMINI_API_KEY) {
        genAIClient = new GoogleGenerativeAI(GEMINI_API_KEY);
    }
    return genAIClient;
}

const MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-flash-latest'];

async function tryGenerate(ai, modelName, contents, systemPrompt) {
    const model = ai.getGenerativeModel({
        model: modelName,
        systemInstruction: systemPrompt
    });

    const result = await model.generateContent({
        contents: contents,
        generationConfig: {
            temperature: 0.7,
            topP: 0.9,
            topK: 40,
            maxOutputTokens: 1500,
        }
    });

    const response = await result.response;
    return response.text();
}

exports.chat = async (req, res) => {
    try {
        const { message, history = [], lang = 'UA' } = req.body;
        console.log(`Incoming chat request: "${message}" (Lang: ${lang})`);

        if (!message || typeof message !== 'string') {
            return res.status(400).json({ message: 'Message is required' });
        }

        if (!GEMINI_API_KEY) {
            return res.status(500).json({ message: 'AI service not configured' });
        }

        // Fetch live data from DB
        let services = [];
        let settings = [];
        try {
            const servicesResult = await pool.query('SELECT * FROM services WHERE is_active = TRUE ORDER BY order_index ASC');
            services = servicesResult.rows;
        } catch (e) {
            console.error('DB services fetch error:', e.message);
        }

        // Fallback data if DB fails or returns empty
        if (services.length === 0) {
            services = [
                { title: "Базове прибирання", price: 1500, price_label: "від 1500 ₴", features: ["Сухе та вологе прибирання", "Очищення поверхонь", "Дезінфекція санвузлів", "Виніс сміття"] },
                { title: "Генеральне прибирання", price: 3500, price_label: "від 3500 ₴", features: ["Все з базового прибирання", "Миття вікон та рам", "Очищення кухні та жиру", "Хімчистка меблів (опція)"] },
                { title: "Прибирання після ремонту", price: 60, price_label: "60 ₴/м²", features: ["Видалення будівельного пилу", "Миття всіх поверхонь", "Чистка плитки та швів", "Виніс будівельного сміття"] }
            ];
        }

        try {
            const settingsResult = await pool.query('SELECT key, value FROM settings');
            settings = settingsResult.rows;
        } catch (e) {
            console.error('DB settings fetch error:', e.message);
        }

        // Fallback settings
        if (settings.length === 0) {
            settings = [
                { key: 'phone', value: '+380 99 999 99 99' },
                { key: 'telegram_bot_name', value: 'UberemBot' }
            ];
        }

        const systemPrompt = buildSystemPrompt(services, settings, lang);

        // Build conversation contents for the SDK
        // Convert 'role' -> 'user'/'model' to match SDK expectations
        // Filter out empty messages
        const contents = history.slice(-10).map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
        })).filter(c => c.parts[0].text);

        contents.push({
            role: 'user',
            parts: [{ text: message }]
        });

        const ai = getClient();
        if (!ai) {
            throw new Error("Failed to initialize GoogleGenerativeAI client");
        }

        // Try each model until one works
        let aiText = null;
        let lastError = null;

        for (const model of MODELS) {
            try {
                console.log(`Trying model: ${model}`);
                aiText = await tryGenerate(ai, model, contents, systemPrompt);
                if (aiText) {
                    console.log(`Success with model: ${model}`);
                    break;
                }
            } catch (e) {
                lastError = e;
                const is429 = e.message?.includes('429') || e.message?.includes('RESOURCE_EXHAUSTED');
                console.error(`Model ${model} failed:`, e.message); // Log full error message
                if (!is429) break;
            }
        }

        if (!aiText) {
            const is429 = lastError?.message?.includes('429') || lastError?.message?.includes('RESOURCE_EXHAUSTED');
            if (is429) {
                return res.status(429).json({
                    message: 'Вибачте, зараз багато запитів 😅 Спробуйте через хвилину або зв\'яжіться з менеджером.',
                    retryAfter: 60
                });
            }
            throw lastError || new Error('No response from AI');
        }

        console.log(`Sending reply (${aiText.length} chars)`);
        console.log('AI Reply Preview:', aiText.substring(0, 100) + '...');
        res.json({ reply: aiText });

    } catch (error) {
        console.error('Chat error:', error.message || error);
        // Fallback response to prevent "eternal loading" on frontend
        res.json({
            reply: 'Вибачте, зараз я трохи перевантажений 😅. Спробуйте запитати мене ще раз через хвилинку, або зателефонуйте менеджеру, якщо питання термінове!'
        });
    }
};
