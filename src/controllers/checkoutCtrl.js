const Checkout = require("../models/checkout");

exports.addCheckoutInfo = async (req, res) => {
  const { UserId, Name, Mobile, HouseAddress, Town } = req.body;

  try {
    const newCheckoutItem = new Checkout(
      UserId,
      Name,
      Mobile,
      HouseAddress,
      Town
    );

    const checkoutItemId = await newCheckoutItem.addressAdd();
    res.status(200).json({
      message: "Checkout info added successfully!",
      checkoutItemId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
