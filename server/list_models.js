const https = require('https');
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        console.log('Status Code:', res.statusCode);
        const parsed = JSON.parse(data);
        if (parsed.error) {
            console.error('Error:', JSON.stringify(parsed.error, null, 2));
        } else {
            const models = parsed.models ? parsed.models.map(m => m.name) : [];
            console.log(`Found ${models.length} models.`);
            models.slice(0, 20).forEach(m => console.log(m));
        }
    });
}).on('error', (err) => {
    console.error('Request Error:', err.message);
});
