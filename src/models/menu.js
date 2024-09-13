const { db } = require("../../firebaseConfig");

class Menu {
  constructor(Id, ItemImage, ItemName, Category, Price, Availability) {
    this.Id = Id;
    this.ItemImage = ItemImage;
    this.ItemName = ItemName;
    this.Category = Category;
    this.Price = Price;
    this.Availability = Availability;
  }

  //Create menu item
  async createMenuItem() {
    try {
      const newMenuItem = await db.collection("menu").add({
        Id: this.Id,
        ItemImage: this.ItemImage,
        ItemName: this.ItemName,
        Category: this.Category,
        Price: this.Price,
        Availability: this.Availability,
      });
      return newMenuItem.id;
    } catch (err) {
      console.error("Error adding new menu item : ", err);
      throw err;
    }
  }

  //Update menu item
  static async menuItemUpdate(id, data) {
    try {
      await db.collection("menu").doc(id).update(data);
      return "Menu item updated.";
    } catch (err) {
      console.error("Error updating menu data : ", err);
      throw err;
    }
  }

  //Update menu item availability
  static async menuItemAvailabilityUpdate(id, availability) {
    try {
      await db.collection("menu").doc(id).update({
        Availability: !availability,
      });
      return "Menu item updated.";
    } catch (err) {
      console.error("Error updating menu data : ", err);
      throw err;
    }
  }

  //Get menu data
  static async getAllMenuItems() {
    try {
      const snapshot = await db
        .collection("menu")
        .where("Availability", "==", true)
        .get();
      if (snapshot.empty) {
        throw new Error("There are not menu items");
      }
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (err) {
      console.error("Error getting menu data : ", err);
      throw err;
    }
  }

  //Get fast moving menu data
  static async getFastMovingMenuItems(item) {
    // const foodItems = [];
    // console.log("===============");
    // console.log(items);
    // console.log("===============");
    try {
      // for (const element of items["data"]) {
      const snapshot = await db
        .collection("menu")
        .where("Id", "==", item)
        .where("Availability", "==", true)
        .get();
      if (snapshot.empty) {
        throw new Error("Menu item not found");
      }
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // }
      return foodItems;
    } catch (err) {
      console.error("Error getting menu data : ", err);
      throw err;
    }
  }

  //Get menu data by categories
  static async getMenuItemsByCategory(category1, category2, category3) {
    try {
      const snapshot = await db
        .collection("menu")
        .where("Category", "in", [category1, category2, category3])
        .get();
      if (snapshot.empty) {
        throw new Error("There are not menu items");
      }
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (err) {
      console.error("Error getting menu data : ", err);
      throw err;
    }
  }

  //Get products by category
  static async getProductsByCategory(category) {
    try {
      const snapshot = await db
        .collection("menu")
        .where("Category", "==", category)
        .where("Availability", "==", true)
        .get();
      if (snapshot.empty) {
        throw new Error("There are not menu items");
      }
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (err) {
      console.error("Error getting menu data : ", err);
      throw err;
    }
  }

  //Get products by name or category search
  static async getProductsBySearch(name) {
    try {
      const categoryQuery = db
        .collection("menu")
        .where("Availability", "==", true)
        .where("Category", "==", name);
      const itemNameQuery = db
        .collection("menu")
        .where("Availability", "==", true)
        .where("ItemName", ">=", name)
        .where("ItemName", "<=", name + "\uf8ff");

      const [categorySnapshot, itemNameSnapshot] = await Promise.all([
        categoryQuery.get(),
        itemNameQuery.get(),
      ]);

      if (categorySnapshot.empty && itemNameSnapshot.empty) {
        throw new Error("There are no menu items");
      }

      const categoryDocs = categorySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const itemNameDocs = itemNameSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return [...categoryDocs, ...itemNameDocs];
    } catch (err) {
      console.error("Error getting menu data: ", err);
      throw err;
    }
  }

  //Delete menu data
  static async removeMenuItem(id) {
    try {
      await db.collection("ormenuder").doc(id).delete();
      return "Menu item removed.";
    } catch (err) {
      console.error("Error removing menu item data : ", err);
      throw err;
    }
  }
}

module.exports = Menu;
