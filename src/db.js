import { Pool } from 'pg';
import 'dotenv/config';
import { hashPassword } from './utils/encrypt';
// import 'make-runnable';

const { DATABASE_URL } = process.env;
const pool = new Pool({
  connectionString: DATABASE_URL,
});

pool.on('connect', () => {
  console.log('connected to the db');
});

const userTableSQL = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(50) NOT NULL UNIQUE,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    is_admin BOOL  DEFAULT 'f' NOT NULL,
    password TEXT NOT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
const adminData = ['Yusuff', 'Mustapha', 'officialwebdev@gmail.com', true];
const createUserTable = async () => {
  pool.query(userTableSQL)
    .then(async () => {
      // Check if admin exists
      const { rows } = await pool.query('SELECT * FROM users WHERE email = $1;', ['officialwebdev@gmail.com']);
      if (!rows[0]) {
        adminData.push(await hashPassword('admin123')); // Attach password
        // Admin doesnt exist, seed the new admin
        await pool.query('INSERT INTO users(first_name, last_name, email, is_admin, password)VALUES($1,$2,$3,$4,$5) RETURNING *', adminData)
          .then(() => console.log('Admin created successfully'))
          .catch((error) => { throw error; });
      } else { console.log('Admin already exists'); }
      await pool.end();
    }).catch((err) => { throw err; });
};

module.exports = {
  query: (text, params) => pool.query(text, params),
  createUserTable,
};
require('make-runnable');
