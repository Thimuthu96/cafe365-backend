const User = require("../models/user");

exports.createUser = async (req, res) => {
  const { name, mobile, city, email, password } = req.body;

  try {
    //------ user signup
    await User.signupUser(email, password);

    try {
      const newUser = new User(name, mobile, city, email);

      const userId = await newUser.saveUserInfo();
      if (userId) {
        await User.initializePoints(userId, 50);
        res.status(200).json({
          message: "User registered successfully!",
          userId,
        });
        User.sendRegisteredMail(email, name);
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateUserLoyaltyPoints = async (req, res) => {
  const { uuid, points } = req.params;
  try {
    await User.updateLoyaltyPoints(uuid, { points: points });
    res.status(200).json({ message: "Loyalty points updated!" });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

exports.getUserUuid = async (req, res) => {
  const { email } = req.params;
  try {
    const userId = await User.getUserUuid(email);
    res.status(200).json(userId);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

exports.getUserName = async (req, res) => {
  const { email } = req.params;
  try {
    const userName = await User.getUserName(email);
    res.status(200).json(userName);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

exports.getUserPoints = async (req, res) => {
  const { uuid } = req.params;
  try {
    const points = await User.getLoyaltyPointsOnly(uuid);
    res.status(200).json(points);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

exports.getUserLoyaltyPoints = async (req, res) => {
  const { uuid } = req.params;
  try {
    const points = await User.getLoyaltyPoints(uuid);
    res.status(200).json(points);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
