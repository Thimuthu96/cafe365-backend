const Order = require("../models/order");

exports.createOrder = async (req, res) => {
  const { OrderId, Price, State, Table, Details, Date, Time, _uid } = req.body;

  try {
    const newOrder = new Order(
      OrderId,
      Price,
      State,
      Table,
      Details,
      Date,
      Time,
      _uid
    );

    const orderRefId = await newOrder.createOrder();
    res.status(200).json({
      message: "Order created successfully!",
      orderRefId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.sendOrderSuccessMail = async (req, res) => {
  const { email, name, OrderId, orderDate, orderPrice } = req.params;
  try {
    await Order.sendOrderSuccessMail(
      email,
      name,
      OrderId,
      orderDate,
      orderPrice
    );
    res.status(200).json("Successfully Send Mail");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.sendOrderConfirmedMail = async (req, res) => {
  const { email, OrderId, orderPrice } = req.params;
  try {
    console.log('#######');
    console.log(email);
    console.log(OrderId);
    console.log(orderPrice);
    console.log('#######');
    
    await Order.sendOrderConfirmMail(email, OrderId, orderPrice);
    res.status(200).json("Successfully Send Mail");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.sendOrderDeliverMail = async (req, res) => {
  const { email, OrderId, orderPrice } = req.params;
  try {
    await Order.sendOrderDeliverMail(email, OrderId, orderPrice);
    res.status(200).json("Successfully Send Mail");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllOrders = async (req, res) => {
  const { State } = req.params;
  try {
    const orders = await Order.getOrders(State);
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllOrdersByUser = async (req, res) => {
  const { State, uid } = req.params;
  try {
    const orders = await Order.getOrdersByUser(State, uid);
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllOrderStatusByUser = async (req, res) => {
  const { uid } = req.params;
  try {
    const orders = await Order.getOrderStatusByUser(uid);
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFastMovingItems = async (req, res) => {
  const { date } = req.params;
  try {
    const fastMoveItems = await Order.getFastMovingItems(date);
    res.status(200).json(fastMoveItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllTimePopularItems = async (req, res) => {
  try {
    const fastMoveItems = await Order.getAlltimePopularItems();
    res.status(200).json(fastMoveItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.orderStateChange = async (req, res) => {
  const { state, id } = req.params;
  try {
    await Order.orderStateChange(state, id);
    res.status(200).json({ message: "Order state changed!" });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

exports.orderRemoved = async (req, res) => {
  const { id } = req.params;
  try {
    await Order.removeOrder(id);
    res.status(200).json({ message: "Order removed!" });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};
