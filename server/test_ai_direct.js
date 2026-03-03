require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function test() {
    console.log("API KEY:", process.env.GEMINI_API_KEY ? "Present" : "Missing");
    if (!process.env.GEMINI_API_KEY) return;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const models = [
        "gemini-exp-1206",
        "gemini-2.0-flash-exp",
        "gemini-2.5-flash-preview-tts"
    ];

    for (const modelName of models) {
        console.log(`Testing model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        try {
            const result = await model.generateContent("Hello!");
            console.log(`SUCCESS with ${modelName}:`, result.response.text());
            return;
        } catch (error) {
            console.error(`FAILED ${modelName}:`, error.message);
            if (error.response) console.error("Status:", error.response.status);
        }
    }
}

test();
