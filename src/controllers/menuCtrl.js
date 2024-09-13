const Menu = require("../models/menu");

exports.createMenuItem = async (req, res) => {
  const { Id, ItemImage, ItemName, Category, Price, Availability } = req.body;

  try {
    const newMenuItem = new Menu(
      Id,
      ItemImage,
      ItemName,
      Category,
      Price,
      Availability
    );

    const menuItemId = await newMenuItem.createMenuItem();
    res.status(200).json({
      message: "Menu item created successfully!",
      menuItemId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateMenuItemData = async (req, res) => {
  const { id } = req.params;
  const { ItemName, Category, Price } = req.body;

  try {
    await Menu.menuItemUpdate(id, {
      ItemName,
      Category,
      Price,
    });
    res.status(200).json({ message: "Menu item successfully updated." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateMenuItemAvailability = async (req, res) => {
  const { id, availbility } = req.params;

  try {
    await Menu.menuItemAvailabilityUpdate(id, availbility);
    res.status(200).json({ message: "Menu item successfully updated." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllMenuItems = async (_, res) => {
  try {
    const menu = await Menu.getAllMenuItems();
    res.status(200).json(menu);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMenuItemsByCategory = async (req, res) => {
  const { category1, category2, category3 } = req.params;
  try {
    const menu = await Menu.getMenuItemsByCategory(
      category1,
      category2,
      category3
    );
    res.status(200).json(menu);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProductsByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const menu = await Menu.getProductsByCategory(category);
    res.status(200).json(menu);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProductsBySearch = async (req, res) => {
  const { name } = req.params;
  try {
    const menu = await Menu.getProductsBySearch(name);
    res.status(200).json(menu);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFastMovingItems = async (req, res) => {
  const { code } = req.params;
  try {
    const fastMoveItems = await Menu.getFastMovingMenuItems(code);
    res.status(200).json(fastMoveItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.menuItemRemove = async (req, res) => {
  const { id } = req.params;
  try {
    await Menu.removeMenuItem(id);
    res.status(200).json({ message: "menu item removed!" });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};
