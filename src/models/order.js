const { db } = require("../../firebaseConfig");
const axios = require("axios");
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");

let transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "cafe365.workstuff@gmail.com",
    pass: "oztnsipwdbsplcot",
    // pass: "oawxylpiijfdasnm", 
  },
});

class Order {
  constructor(
    OrderId,
    Price,
    State,
    Table,
    Details,
    Date,
    Time,
    _uid,
    remark,
    isMobile
  ) {
    this.OrderId = OrderId;
    this.Price = Price;
    this.State = State;
    this.Table = Table;
    this.Details = Details;
    this.Date = Date;
    this.Time = Time;
    this._uid = _uid;
    this.remark = remark;
    this.isMobile = isMobile;
  }

  //Create order
  async createOrder() {
    try {
      const newOrder = await db.collection("order").add({
        OrderId: this.OrderId,
        Price: this.Price,
        State: this.State,
        Table: this.Table,
        Details: this.Details,
        Date: this.Date,
        Time: this.Time,
        _uid: this._uid,
        remark: this.remark,
        isMobile: this.isMobile,
      });
      // return newOrder.id;

      //make fast moving list
      if (newOrder.id != null || newOrder.id != "") {
        const items = [];
        this.Details.forEach((item) => {
          items.push(item.Id || item.ItemId);
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

  //order success mail
  static async sendOrderSuccessMail(
    email,
    name,
    OrderId,
    orderDate,
    orderPrice
  ) {
    // Load the email template
    const templateFile = fs.readFileSync(
      "src/templates/orderCreateTemplate.html",
      "utf8"
    );
    const template = handlebars.compile(templateFile);

    // Prepare email content
    const emailContent = template({
      name: name,
      OrderId: OrderId,
      orderDate: orderDate,
      orderPrice: orderPrice,
    });

    // Setup email data
    let mailOptions = {
      from: '"Cafe365" <cafe365.workstuff@gmail.com>',
      to: email,
      subject: "Order Successfully - Cafe 365!",
      html: emailContent,
    };

    // Send email
    await transporter.sendMail(mailOptions);
  }

  //order confirm mail
  static async sendOrderConfirmMail(email, OrderId, orderPrice) {
    // Load the email template
    const templateFile = fs.readFileSync(
      "src/templates/orderConfirmed.html",
      "utf8"
    );
    const template = handlebars.compile(templateFile);

    // Prepare email content
    const emailContent = template({
      OrderId: OrderId,
      orderPrice: orderPrice,
    });

    // Setup email data
    let mailOptions = {
      from: '"Cafe365" <cafe365.workstuff@gmail.com>',
      to: email,
      subject: "YAY!!! Your Order Confirmed - Cafe 365!",
      html: emailContent,
    };

    // Send email
    await transporter.sendMail(mailOptions);
  }

  //order delivered mail
  static async sendOrderDeliverMail(email, OrderId, orderPrice) {
    // Load the email template
    const templateFile = fs.readFileSync(
      "src/templates/orderDelivered.html",
      "utf8"
    );
    const template = handlebars.compile(templateFile);

    // Prepare email content
    const emailContent = template({
      OrderId: OrderId,
      orderPrice: orderPrice,
    });

    // Setup email data
    let mailOptions = {
      from: '"Cafe365" <cafe365.workstuff@gmail.com>',
      to: email,
      subject: "YAY!!! Your Order Will Deliver Soon - Cafe 365!",
      html: emailContent,
    };

    // Send email
    await transporter.sendMail(mailOptions);
  }

  //Get order data
  static async getOrders(State) {
    try {
      const snapshot = await db
        .collection("order")
        .where("State", "==", State)
        .get();
      if (snapshot.empty) {
        throw new Error("There are not orders");
      }
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (err) {
      console.error("Error getting order data : ", err);
      throw err;
    }
  }

  //Get order data by user
  static async getOrdersByUser(State, _uid) {
    try {
      const snapshot = await db
        .collection("order")
        .where("State", "==", State)
        .where("_uid", "==", _uid)
        .get();
      if (snapshot.empty) {
        throw new Error("There are not orders");
      }
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (err) {
      console.error("Error getting order data : ", err);
      throw err;
    }
  }

  static async getOrderStatusByUser(_uid) {
    try {
      const snapshot = await db
        .collection("order")
        .where("uuid", "==", _uid)
        .get();
      if (snapshot.empty) {
        throw new Error("There are not orders");
      }
      return snapshot.docs.map((doc) => ({
        OrderId: doc.data().OrderId,
        Price: doc.data().Price,
        State: doc.data().State,
      }));
    } catch (err) {
      console.error("Error getting order data : ", err);
      throw err;
    }
  }

  //Get fast moving item by date
  // static async getFastMovingItems(date) {
  //   try {
  //     const snapshot = await db
  //       .collection("fast-moving-items")
  //       .where("Date", "==", date)
  //       .get();
  //     if (snapshot.empty) {
  //       throw new Error("There are no fast moving items for this date");
  //     }

  //     let allItems = [];
  //     snapshot.forEach((doc) => {
  //       const items = doc.data().Items;
  //       allItems = allItems.concat(items);
  //     });

  //     const itemCounts = allItems.reduce((acc, item) => {
  //       acc[item] = (acc[item] || 0) + 1;
  //       return acc;
  //     }, {});

  //     const sortedItems = Object.entries(itemCounts)
  //       .filter(([, count]) => count >= 2)
  //       .sort(([, countA], [, countB]) => countB - countA)
  //       .map(([item]) => item);

  //     // Convert sortedItems array to a comma-separated string
  //     const sortedItemsString = sortedItems.join(",");

  //     return { sortedItems: sortedItemsString };
  //   } catch (err) {
  //     console.error("Error getting fast moving items count : ", err);
  //     throw err;
  //   }
  // }
  static async getFastMovingItems(date) {
    try {
      const snapshot = await db
        .collection("fast-moving-items")
        .where("Date", "==", date)
        .get();
      if (snapshot.empty) {
        throw new Error("There are no fast moving items for this date");
      }

      let allItems = [];
      snapshot.forEach((doc) => {
        const items = doc.data().Items;
        allItems = allItems.concat(items);
      });

      const itemCounts = allItems.reduce((acc, item) => {
        acc[item] = (acc[item] || 0) + 1;
        return acc;
      }, {});

      const sortedItems = Object.entries(itemCounts)
        .filter(([, count]) => count >= 2)
        .sort(([, countA], [, countB]) => countB - countA)
        .map(([item]) => item);

      return sortedItems;
    } catch (err) {
      console.error("Error getting fast moving items count : ", err);
      throw err;
    }
  }

  static async getAlltimePopularItems() {
    try {
      const snapshot = await db.collection("fast-moving-items").get();
      if (snapshot.empty) {
        throw new Error("There are no any orders yet");
      }

      let allItems = [];
      snapshot.forEach((doc) => {
        const items = doc.data().Items;
        allItems = allItems.concat(items);
      });

      const itemCounts = allItems.reduce((acc, item) => {
        acc[item] = (acc[item] || 0) + 1;
        return acc;
      }, {});

      const sortedItems = Object.entries(itemCounts)
        .filter(([, count]) => count >= 2)
        .sort(([, countA], [, countB]) => countB - countA)
        .map(([item]) => item);

      return sortedItems;
    } catch (err) {
      console.error("Error getting fast moving items count : ", err);
      throw err;
    }
  }

  // static async getFastMovingItems(date) {
  //   try {
  //     const snapshot = await db
  //       .collection("fast-moving-items")
  //       .where("Date", "==", "22-01-2024")
  //       .get();
  //     if (snapshot.empty) {
  //       throw new Error("There are not fast moving items");
  //     }
  //     return snapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     }));
  //   } catch (err) {
  //     console.error("Error getting item data : ", err);
  //     throw err;
  //   }
  // }

  //Update order state
  static async orderStateChange(state, id) {
    try {
      await db.collection("order").doc(id).update({
        State: state,
      });
      return "Order state changed.";
    } catch (err) {
      console.error("Error updating order data : ", err);
      throw err;
    }
  }

  //Delete order data
  static async removeOrder(id) {
    try {
      await db.collection("order").doc(id).delete();
      return "Order removed.";
    } catch (err) {
      console.error("Error removing order data : ", err);
      throw err;
    }
  }
}

module.exports = Order;
