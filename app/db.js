const { Pool } = require('pg');

const pool = new Pool({
    user: 'Connect',
    host: 'postgres_Connect_db',
    database: 'Connect_DB',
    password: 'Connect',
    port: 5432, 
});

pool.connect(err => {
    if (err) {
        console.error('Connection error', err.stack);
    } else {
        console.log('Connected to PostgreSQL');
    }
});

module.exports = pool;