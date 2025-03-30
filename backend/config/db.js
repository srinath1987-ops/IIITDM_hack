// const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

/* 
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});
*/

// Mock database module to avoid database errors
module.exports = {
  query: (text, params) => {
    console.log('Mock DB query:', text, params);
    return Promise.resolve({ rows: [{ id: Math.floor(Math.random() * 1000) }] });
  },
  pool: {
    on: () => console.log('Mock pool event listener')
  }
}; 