const { db } = require("../../firebaseConfig");

class MobileOrders {
  constructor(orderUuid, details, totalPrice, time, date, state, _uid) {
    this.orderUuid = orderUuid;
    this.details = details;
    this.totalPrice = totalPrice;
    this.time = time;
    this.date = date;
    this.state = state;
    this._uid = _uid;
  }

  //Create order
  async createOrder() {
    try {
      const newOrder = await db.collection("mobile-order").add({
        OrderId: this.orderUuid,
        details: this.details,
        totalPrice: this.totalPrice,
        time: this.time,
        date: this.date,
        state: this.state,
        _uid: this._uid,
      });
      // return newOrder.id;

      //make fast moving list
      if (newOrder.id != null || newOrder.id != "") {
        const items = [];
        this.Details.forEach((item) => {
          items.push(item.Id);
        });

        await db.collection("fast-moving-items").add({
          Date: this.Date,
          Items: items,
        });
        return newOrder.id;
      }
    } catch (err) {
      console.error("Error adding new order : ", err);
      throw err;
    }
  }
}

module.exports = MobileOrders;
