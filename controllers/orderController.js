import db from '../db/mysql.js';

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const user_id = req.user.id;

    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order items are required' });
    }

    // calculate total price
    let total_price = 0;
    for (const item of items) {
      const [food] = await db.execute('SELECT price FROM foods WHERE id = ?', [
        item.food_id,
      ]);
      if (food.length === 0) {
        return res
          .status(400)
          .json({ message: `Food item with id ${item.food_id} not found` });
      }
      total_price += food[0].price * item.quantity;
    }

    const [orderResult] = await db.execute(
      'INSERT INTO orders (user_id, total_price, status) VALUES (?, ?, ?)',
      [user_id, total_price]
    );
    const order_id = orderResult.insertId;

    for (let item of items) {
      const [food] = await db.execute('SELECT price FROM foods WHERE id = ?', [
        item.food_id,
      ]);
      await db.execute(
        'INSERT INTO order_items (order_id, food_id, quantity, price) VALUES (?, ?, ?, ?)',
        [order_id, item.food_id, item.quantity, food[0].price]
      );
    }
    res.status(201).json({ message: 'Order created successfully', order_id });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to create order', error: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const [orders] = await db.execute(`
            SELECT o.id, o.user_id, o.total_price, o.status, o.created_at,
                   u.name as user_name
            FROM orders o
            JOIN users u ON o.user_id = u.id
            ORDER BY o.created_at DESC
        `);

    res.json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to fetch orders', error: error.message });
  }
};
