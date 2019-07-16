import '@babel/polyfill';
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

const tripTableSQL = `
  CREATE TABLE IF NOT EXISTS trips (
    id SERIAL PRIMARY KEY,
    bus_id INTEGER NOT NULL,
    origin VARCHAR(150) NOT NULL,
    destination VARCHAR(150) NOT NULL,
    trip_date TEXT NOT NULL,
    fare NUMERIC NOT NULL, 
    status VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
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
const busTableSQL = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    number_plate VARCHAR(15) NOT NULL UNIQUE,
    manufacturer VARCHAR(30) NOT NULL,
    year VARCHAR(5) NOT NULL,
    MODEL VARCHAR(15),
    CAPACITY INTEGER NOT NULL,
    )
  `;

const buses = {
  0: ['NRK-54AZL', 'Toyota', '2016', 'Hiace', 18],
  1: ['LRN-54KKL', 'Honda', '2016', 'Coaster', 28],
  2: ['KJA-67BLK', 'Toyota', '2016', 'Hiace', 22],
};

const createTripTable = async () => {
  await pool.query('DROP TABLE IF EXISTS trips');
  await pool.query(tripTableSQL)
    .then(async () => {
      // Create table now
      console.log('Trip Table created successfully');
    })
    .catch((error) => { throw error; });
  // await pool.end();
};
const createBusTable = async () => {
  await pool.query('DROP TABLE IF EXISTS buses');
  await pool.query(busTableSQL)
    .then(async () => {
      // Create table now
      console.log('Bus Table created successfully');
      buses.forEach(element => {
        pool.query('INSERT INTO buses(number_plate, manufacturer, year, model, capacity)VALUES($1,$2,$3,$4,$5)', Object.values(element))
          .then(() => console.log('All buses uploaded successfully!'));
          .catch((error) => { throw error; });
      });
    })
    .catch((error) => { throw error; });
  // await pool.end();
};

const adminData = ['Yusuff', 'Mustapha', 'officialwebdev@gmail.com', true];
const createUserTable = async () => {
  await pool.query('DROP TABLE IF EXISTS users');
  await pool.query(userTableSQL)
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
      // await pool.end();
    }).catch((err) => { throw err; });
};

const createAllTables = async () => {
  await createUserTable();
  await createTripTable();
  await createBusTable();
};

module.exports = {
  query: (text, params) => pool.query(text, params),
  createAllTables,
};
require('make-runnable');
