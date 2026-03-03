const { Client } = require('pg');
require('dotenv').config();

const passwords = [
    'postgres',
    'admin',
    'root',
    '1234',
    '12345',
    '',
    process.env.DB_PASSWORD,
    'password'
];

const uniquePasswords = [...new Set(passwords)];

const user = process.env.DB_USER || 'postgres';
const host = process.env.DB_HOST || 'localhost';
const database = process.env.DB_NAME || 'uberem_db';
const port = process.env.DB_PORT || 5432;

console.log(`Testing passwords for user: ${user} on ${host}:${port}/${database}`);

async function test() {
    for (const password of uniquePasswords) {
        if (password === undefined) continue;
        const passDisplay = password === '' ? '(empty)' : password;
        process.stdout.write(`Trying "${passDisplay}"... `);

        const client = new Client({ user, host, database, password, port });
        try {
            await client.connect();
            console.log('SUCCESS!');
            console.log(`FOUND_PASSWORD_MARKER:${password}`);
            await client.end();
            process.exit(0);
        } catch (err) {
            console.log(`Failed (${err.code})`);
            try { await client.end(); } catch (e) { }
        }
    }
    console.log('All passwords failed.');
    process.exit(1);
}

test();
