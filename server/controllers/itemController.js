const GroceryItem = require('../models/GroceryItem');

// @desc   Get all items for logged-in user
// @route  GET /api/items
const getItems = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = { user: req.user._id };

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Search filter
    if (search) {
      query.name = { $regex: search, $options: 'i' }; // case-insensitive
    }

    const items = await GroceryItem.find(query).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Add new grocery item
// @route  POST /api/items
const addItem = async (req, res) => {
  const { name, category, quantity, unit, minStock, expiryDate, price, notes } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Item name is required' });
  }

  try {
    const item = await GroceryItem.create({
      user: req.user._id, // Link to logged-in user
      name,
      category,
      quantity,
      unit,
      minStock,
      expiryDate: expiryDate || null,
      price,
      notes,
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Update item
// @route  PUT /api/items/:id
const updateItem = async (req, res) => {
  try {
    const item = await GroceryItem.findOne({ _id: req.params.id, user: req.user._id });

    if (!item) {
      return res.status(404).json({ message: 'Item not found or unauthorized' });
    }

    const updatedItem = await GroceryItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Delete item
// @route  DELETE /api/items/:id
const deleteItem = async (req, res) => {
  try {
    const item = await GroceryItem.findOne({ _id: req.params.id, user: req.user._id });

    if (!item) {
      return res.status(404).json({ message: 'Item not found or unauthorized' });
    }

    await item.deleteOne();
    res.json({ message: 'Item removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Update item quantity (+/-)
// @route  PATCH /api/items/:id/quantity
const updateQuantity = async (req, res) => {
  const { change } = req.body; // +1 or -1

  try {
    const item = await GroceryItem.findOne({ _id: req.params.id, user: req.user._id });

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    const newQty = item.quantity + change;

    if (newQty < 0) {
      return res.status(400).json({ message: 'Quantity cannot go below 0' });
    }

    item.quantity = newQty;
    await item.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get low-stock alerts
// @route  GET /api/items/alerts/lowstock
const getLowStockItems = async (req, res) => {
  try {
    // Find items where current quantity < minimum stock level
    const items = await GroceryItem.find({
      user: req.user._id,
      $expr: { $lt: ['$quantity', '$minStock'] },
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get expiry alerts (items expiring within 7 days)
// @route  GET /api/items/alerts/expiry
const getExpiryAlerts = async (req, res) => {
  try {
    const today = new Date();
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(today.getDate() + 7);

    const items = await GroceryItem.find({
      user: req.user._id,
      expiryDate: {
        $ne: null,
        $gte: today,            // not already expired
        $lte: sevenDaysLater,   // expires within 7 days
      },
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getItems, addItem, updateItem, deleteItem, updateQuantity, getLowStockItems, getExpiryAlerts };