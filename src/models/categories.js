const { db } = require("../../firebaseConfig");

class Categories {
  constructor(CategoryName, value) {
    this.CategoryName = CategoryName;
    this.value = value;
  }

  //Create menu item
  async createCategoryItem() {
    try {
      const newCategoryItem = await db.collection("category").add({
        CategoryName: this.CategoryName,
        value: this.value,
      });
      return newCategoryItem.id;
    } catch (err) {
      console.error("Error adding new category item : ", err);
      throw err;
    }
  }

  //Get menu data
  static async getAllCategoryItems() {
    try {
      const snapshot = await db.collection("category").get();
      if (snapshot.empty) {
        throw new Error("There are not category items");
      }
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (err) {
      console.error("Error getting category data : ", err);
      throw err;
    }
  }
}

module.exports = Categories;
