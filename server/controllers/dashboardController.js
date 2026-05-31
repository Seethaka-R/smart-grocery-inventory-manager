const GroceryItem = require('../models/GroceryItem');

const getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date();
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(today.getDate() + 7);

    // Total items count
    const totalItems = await GroceryItem.countDocuments({ user: userId });

    // Low stock count
    const lowStockCount = await GroceryItem.countDocuments({
      user: userId,
      $expr: { $lt: ['$quantity', '$minStock'] },
    });

    // Expiry soon count
    const expirySoonCount = await GroceryItem.countDocuments({
      user: userId,
      expiryDate: { $ne: null, $gte: today, $lte: sevenDaysLater },
    });

    // Count items by category for chart
    const categoryData = await GroceryItem.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Recent 5 items added
    const recentItems = await GroceryItem.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalItems,
      lowStockCount,
      expirySoonCount,
      categoryData: categoryData.map(c => ({ name: c._id, value: c.count })),
      recentItems,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardData };