const { db } = require("../../firebaseConfig");

class Checkout {
  constructor(UserId, Name, Mobile, HouseAddress, Town) {
    this.UserId = UserId;
    this.Name = Name;
    this.Mobile = Mobile;
    this.HouseAddress = HouseAddress;
    this.Town = Town;
  }

  //Add
  async addressAdd() {
    try {
      const newAddress = await db.collection("checkout-info").add({
        UserId: this.UserId,
        Name: this.Name,
        Mobile: this.Mobile,
        HouseAddress: this.HouseAddress,
        Town: this.Town,
      });
      return newAddress.id;
    } catch (err) {
      console.error("Error adding new address : ", err);
      throw err;
    }
  }
}

module.exports = Checkout;
