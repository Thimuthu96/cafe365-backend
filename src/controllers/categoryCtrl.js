const Category = require("../models/categories");

exports.createCategoryItem = async (req, res) => {
  const { CategoryName, value } = req.body;

  try {
    const newCategoryItem = new Category(CategoryName, value);

    const categoryItemId = await newCategoryItem.createCategoryItem();
    res.status(200).json({
      message: "Category item created successfully!",
      categoryItemId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllCategoryItems = async (_, res) => {
  try {
    const category = await Category.getAllCategoryItems();
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
