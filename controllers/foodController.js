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

// update food item
export const updateFood = async (req, res) => {
  try {
    const { id } = req.params;

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
      is_available,
      allergens,
    } = req.body;

    const query = `
      UPDATE foods SET
      name = ?, category = ?, price = ?, description = ?, main_image = ?,
      calories = ?, protein = ?, prep_time = ?, spiciness_level = ?,
      is_bestseller = ?, is_available = ?, allergens = ?
      WHERE id = ?
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
      is_available,
      allergens,
      id,
    ]);
    res.status(200).json({ message: 'Food updated successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to update food', error: error.message });
  }
};

// delete food item
export const deleteFood = async (req, res) => {
  try {
    const { id } = req.params;

    await db.execute('DELETE FROM foods WHERE id = ?', [id]);
    res.status(200).json({ message: 'Food deleted successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to delete food', error: error.message });
  }
};
