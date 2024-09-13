const { db } = require("../../firebaseConfig");

class Cart {
  constructor(UserId, ItemName, ItemImage, Price, Quantity, ItemId) {
    this.UserId = UserId;
    this.ItemName = ItemName;
    this.ItemImage = ItemImage;
    this.Price = Price;
    this.Quantity = Quantity;
    this.ItemId = ItemId;
  }

  //Check cart item availability
  static async checkItemAvailability(userId, itemId) {
    try {
      const snapshot = await db
        .collection("cart")
        .where("UserId", "==", userId)
        .where("ItemId", "==", itemId)
        .get();
      if (snapshot.empty) {
        throw new Error("There is not cart item");
      }
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (err) {
      console.error("Error getting cart item : ", err);
      throw err;
    }
  }

  //get cart item items
  static async getCartItems(userId) {
    try {
      const snapshot = await db
        .collection("cart")
        .where("UserId", "==", userId)
        .get();
      if (snapshot.empty) {
        throw new Error("There is not cart item");
      }
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (err) {
      console.error("Error getting cart item : ", err);
      throw err;
    }
  }

  //get prices
  static async getCartPrice(userId) {
    try {
      const snapshot = await db
        .collection("cart")
        .where("UserId", "==", userId)
        .get();

      const snapshot1 = await db
        .collection("loyalty-points")
        .where("uuid", "==", userId)
        .get();

      if (snapshot.empty) {
        throw new Error("There is not cart item");
      }

      const prices = snapshot.docs.map((doc) =>
        parseFloat(doc.data().Price * doc.data().Quantity)
      );

      const sum = prices.reduce((acc, price) => acc + price, 0);
      const [firstElement] = snapshot1.docs.map((doc) => ({
        id: doc.id,
        points: doc.data().points,
      }));

      const pointsValue = firstElement.points;
      console.log("################");
      console.log(sum.toFixed(2).toString());
      console.log(pointsValue.toString());
      console.log((sum.toFixed(2) - pointsValue).toFixed(2).toString());
      console.log("################");
      const data = [
        {
          SubTotal: sum.toFixed(2).toString(),
          discount: pointsValue.toString(),
          Total: (sum.toFixed(2) - pointsValue).toFixed(2).toString(),
        },
      ];

      return data;
    } catch (err) {
      console.error("Error getting cart item : ", err);
      throw err;
    }
  }

  //Add to cart
  async createCartItem() {
    try {
      const newCartItem = await db.collection("cart").add({
        UserId: this.UserId,
        ItemName: this.ItemName,
        ItemImage: this.ItemImage,
        Price: this.Price,
        Quantity: this.Quantity,
        ItemId: this.ItemId,
      });
      return newCartItem.id;
    } catch (err) {
      console.error("Error adding new cart item : ", err);
      throw err;
    }
  }

  //Update cart item
  static async cartItemUpdate(id, qnt) {
    try {
      await db
        .collection("cart")
        .doc(id)
        .update({
          Quantity: parseInt(qnt),
        });
      return "Cart item updated.";
    } catch (err) {
      console.error("Error updating cart data : ", err);
      throw err;
    }
  }

  //Delete cart item
  static async cartItemDelete(id) {
    try {
      await db.collection("cart").doc(id).delete();
      return "Cart item removed.";
    } catch (err) {
      console.error("Error deleting cart data : ", err);
      throw err;
    }
  }

  //Delete cart items
  static async cartClean(uuid) {
    try {
      const querySnapshot = await db
        .collection("cart")
        .where("UserId", "==", uuid)
        .get();

      querySnapshot.forEach(async (doc) => {
        await db.collection("cart").doc(doc.id).delete();
        console.log(`Document with ID ${doc.id} deleted successfully.`);
      });

      return "Cart item cleaned.";
    } catch (err) {
      console.error("Error deleting cart data : ", err);
      throw err;
    }
  }
}

module.exports = Cart;
