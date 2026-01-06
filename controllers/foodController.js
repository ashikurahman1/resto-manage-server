import db from '../db/mysql.js';

// Get all foods
export const getFoods = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM foods');
    res.json(rows || []);
  } catch (error) {
    console.error('Fetch Foods Error:', error);
    res.json([]);
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
      is_available,
      allergens,
    } = req.body;

    if (!name || !price) {
      return res.status(400).json({
        message: 'Food name and price are required',
      });
    }

    const query = `
      INSERT INTO foods
      (name, category, price, description, main_image, calories, protein, prep_time, spiciness_level, is_bestseller, is_available, allergens)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // Robustly handle numeric fields (prevent "" from breaking INT columns)
    const toNum = (val) => (val === undefined || val === '' || isNaN(val)) ? null : parseFloat(val);
    const toBool = (val) => (val === true || val === 'true' || val === 1 || val === '1');

    await db.execute(query, [
      name,
      category,
      parseFloat(price),
      description,
      main_image,
      toNum(calories),
      toNum(protein),
      toNum(prep_time),
      toNum(spiciness_level) || 1,
      toBool(is_bestseller) ? 1 : 0,
      is_available === undefined ? 1 : (toBool(is_available) ? 1 : 0),
      allergens,
    ]);

    res.status(201).json({ message: 'Food added successfully' });
  } catch (error) {
    console.error('Create Food Error:', error);
    res.status(500).json({ message: 'Failed to add food', error: error.message });
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

    // Robustly handle numeric fields (prevent "" from breaking INT columns)
    const toNum = (val) => (val === undefined || val === '' || isNaN(val)) ? null : parseFloat(val);
    const toBool = (val) => (val === true || val === 'true' || val === 1 || val === '1');

    await db.execute(query, [
      name,
      category,
      parseFloat(price),
      description,
      main_image,
      toNum(calories),
      toNum(protein),
      toNum(prep_time),
      toNum(spiciness_level) || 1,
      toBool(is_bestseller) ? 1 : 0,
      toBool(is_available) ? 1 : 0,
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
