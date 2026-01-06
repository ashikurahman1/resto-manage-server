import mysql from 'mysql2/promise';

async function migrate() {
  const db = await mysql.createConnection({
    host: 'mysql-29ada942-ashikurahmantuhin-8c3e.l.aivencloud.com',
    user: 'avnadmin',
    password: 'AVNS_cMnhwNa9-FcgWPSFXw6',
    database: 'defaultdb',
    port: 28273,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Connected! Creating tables...');
    await db.execute('CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100), email VARCHAR(100) UNIQUE, password VARCHAR(255), role ENUM("member", "admin") DEFAULT "member", created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)');
    await db.execute('CREATE TABLE IF NOT EXISTS foods (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100), category VARCHAR(100), price DECIMAL(10,2), description TEXT, main_image TEXT, calories INT, protein INT, prep_time INT, spiciness_level INT DEFAULT 1, is_bestseller TINYINT(1) DEFAULT 0, is_available TINYINT(1) DEFAULT 1, allergens TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)');
    await db.execute('CREATE TABLE IF NOT EXISTS orders (id INT AUTO_INCREMENT PRIMARY KEY, user_id INT, total_price DECIMAL(10,2), status ENUM("Pending", "Cooking", "Completed", "Cancelled") DEFAULT "Pending", address TEXT, phone VARCHAR(20), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id))');
    await db.execute('CREATE TABLE IF NOT EXISTS order_items (id INT AUTO_INCREMENT PRIMARY KEY, order_id INT, food_id INT, quantity INT, price DECIMAL(10,2), FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE, FOREIGN KEY (food_id) REFERENCES foods(id))');
    console.log('Done!');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await db.end();
  }
}

migrate();
