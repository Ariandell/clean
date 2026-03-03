require('dotenv').config();
const chatController = require('./controllers/chatController');

const req = {
    body: {
        message: "У мене квартира 30 метрів, скільки коштуватиме прибирання після ремонту?",
        history: []
    }
};

const res = {
    status: (code) => {
        console.log(`STATUS: ${code}`);
        return res;
    },
    json: (data) => {
        console.log('--- RESPONSE DATA ---');
        console.log(JSON.stringify(data, null, 2));
        if (data.error) {
            console.log('--- ERROR DETAILS ---');
            console.log(data.error);
        }
        return res;
    }
};

console.log("Starting debug...");
chatController.chat(req, res).then(() => {
    console.log("Finished.");
    // Force exit after a few seconds if DB keeps it open
    setTimeout(() => process.exit(0), 1000);
}).catch(err => {
    console.error("CRITICAL FAILURE:", err);
    process.exit(1);
});
