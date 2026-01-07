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

    // 1. Fetch Orders
    const [orders] = await db.execute(
      'SELECT id, total_price, status, created_at, address, phone FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [user_id]
    );

    if (orders.length === 0) {
      return res.json([]);
    }

    // 2. Fetch all items for these orders
    const orderIds = orders.map(o => o.id);
    const [items] = await db.execute(`
      SELECT oi.order_id, oi.food_id, oi.quantity, oi.price, 
             f.name as food_name, f.main_image as food_image
      FROM order_items oi
      LEFT JOIN foods f ON oi.food_id = f.id
      WHERE oi.order_id IN (${orderIds.join(',')})
    `);

    // 3. Map items to orders
    const processedOrders = orders.map(order => ({
      ...order,
      items: items.filter(item => item.order_id === order.id)
    }));

    res.json(processedOrders);
  } catch (error) {
    console.error('Fetch Orders Error:', error);
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
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
