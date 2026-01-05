import mysql from 'mysql2/promise';

const db = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'restaurant_db',
});
console.log('MySQL Connected');
export default db;
