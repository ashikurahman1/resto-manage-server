import db from '../db/mysql.js';

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const user_id = req.user.id;

    const { items, address, phone } = req.body;

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
      'INSERT INTO orders (user_id, total_price, status, address, phone) VALUES (?, ?, ?, ?, ?)',
      [user_id, total_price, 'Pending', address, phone]
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

// Get user orders
export const getUserOrders = async (req, res) => {
  try {
    const user_id = req.user.id;
    const [orders] = await db.execute(`
            SELECT o.id, o.total_price, o.status, o.created_at, o.address, o.phone,
                   JSON_ARRAYAGG(
                     JSON_OBJECT(
                       'food_id', oi.food_id,
                       'quantity', oi.quantity,
                       'price', oi.price,
                       'food_name', COALESCE(f.name, 'Unavailable'),
                       'food_image', COALESCE(f.main_image, '')
                     )
                   ) as items
            FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
            LEFT JOIN foods f ON oi.food_id = f.id
            WHERE o.user_id = ?
            GROUP BY o.id
            ORDER BY o.created_at DESC
        `, [user_id]);

    // Handle JSON_ARRAYAGG potential issues (some MySQL versions return it as a string)
    const processedOrders = orders.map(order => ({
      ...order,
      items: typeof order.items === 'string' ? JSON.parse(order.items) : (order.items || [])
    })).filter(order => order.id !== null);

    res.json(processedOrders);
  } catch (error) {
    console.error('Fetch Orders Error:', error);
    res.json([]); // Return empty array instead of 500
  }
};

// Get all orders (admin only)
export const getOrders = async (req, res) => {
  try {
    const [orders] = await db.execute(`
            SELECT o.id, o.user_id, o.total_price, o.status, o.created_at,
                   u.name as user_name
            FROM orders o
            LEFT JOIN users u ON o.user_id = u.id
            ORDER BY o.created_at DESC
        `);

    res.json(orders);
  } catch (error) {
    console.error('Fetch All Orders Error:', error);
    res.json([]); // Return empty array instead of 500
  }
};

// update order status (admin only)
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await db.execute('UPDATE orders SET status = ? WHERE id = ?', [status, id]);

    res.json({ message: 'Order status updated successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to update order status', error: error.message });
  }
};
