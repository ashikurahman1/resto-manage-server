import mysql from 'mysql2/promise';

const db = await mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '1234',
  database: process.env.DB_NAME || 'restaurant_db',
  port: process.env.DB_PORT || 3306,
  ssl: {
    rejectUnauthorized: false
  }
});
console.log('MySQL Connected');
export default db;
