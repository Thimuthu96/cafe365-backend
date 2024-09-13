const Cart = require("../models/cart");

exports.getCartItemAvailability = async (req, res) => {
  const { userId, itemId } = req.params;
  try {
    const cart = await Cart.checkItemAvailability(userId, itemId);
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCartItems = async (req, res) => {
  const { userId } = req.params;
  try {
    const cart = await Cart.getCartItems(userId);
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCartPrices = async (req, res) => {
  const { userId } = req.params;
  try {
    const cart = await Cart.getCartPrice(userId);
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createCartItem = async (req, res) => {
  const { UserId, ItemName, ItemImage, Price, Quantity, ItemId } = req.body;

  try {
    const newCartItem = new Cart(
      UserId,
      ItemName,
      ItemImage,
      Price,
      Quantity,
      ItemId
    );

    const cartItemId = await newCartItem.createCartItem();
    res.status(200).json({
      message: "Cart item created successfully!",
      cartItemId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCartItem = async (req, res) => {
  const { id, qnt } = req.params;

  try {
    await Cart.cartItemUpdate(id, qnt);
    res.status(200).json({ message: "Cart item successfully updated." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteCartItem = async (req, res) => {
  const { id } = req.params;

  try {
    await Cart.cartItemDelete(id);
    res.status(200).json({ message: "Cart item successfully removed." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.cartClean = async (req, res) => {
  const { uuid } = req.params;

  try {
    await Cart.cartClean(uuid);
    res.status(200).json({ message: "Cart items removed." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
