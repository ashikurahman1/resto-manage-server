import db from '../db/mysql.js';

// Get all foods
export const getFoods = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM foods');
    res.json(rows);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to fetch foods', error: error.message });
  }
};

// Create a new food item
export const createFood = async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      description,
      main_image,
      calories,
      protein,
      prep_time,
      spiciness_level,
      is_bestseller,
      allergens,
    } = req.body;

    if (!name || !price) {
      return res.status(400).json({
        message: 'Food name and price are required',
      });
    }

    const query = `
      INSERT INTO foods
      (name, category, price, description, main_image, calories, protein, prep_time, spiciness_level, is_bestseller, allergens)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await db.execute(query, [
      name,
      category,
      price,
      description,
      main_image,
      calories,
      protein,
      prep_time,
      spiciness_level,
      is_bestseller,
      allergens,
    ]);

    res.status(201).json({ message: 'Food added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add food' });
  }
};
