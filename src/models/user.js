const { db, auth } = require("../../firebaseConfig");

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
  },
});

class User {
  constructor(name, mobile, city, email) {
    this.name = name;
    this.mobile = mobile;
    this.city = city;
    this.email = email;
  }

  async saveUserInfo() {
    try {
      const newUserRef = await db.collection("user").add({
        name: this.name,
        mobile: this.mobile,
        city: this.city,
        email: this.email,
      });

      // // Load the email template
      // const templateFile = fs.readFileSync(
      //   "src/templates/signupTemplate.html",
      //   "utf8"
      // );
      // const template = handlebars.compile(templateFile);

      // // Prepare email content
      // const emailContent = template({ name: this.name });

      // // Setup email data
      // let mailOptions = {
      //   from: '"Cafe365" <cafe365.workstuff@gmail.com>',
      //   to: this.email,
      //   subject: "Suucessfully landed to food paradize!",
      //   html: emailContent,
      // };

      // // Send email
      // await transporter.sendMail(mailOptions);

      return newUserRef.id;
    } catch (err) {
      console.error("Error saving user : ", err);
      throw err;
    }
  }

  static async sendRegisteredMail(email, name) {
    // Load the email template
    const templateFile = fs.readFileSync(
      "src/templates/signupTemplate.html",
      "utf8"
    );
    const template = handlebars.compile(templateFile);

    // Prepare email content
    const emailContent = template({ name: name });

    // Setup email data
    let mailOptions = {
      from: '"Cafe365" <cafe365.workstuff@gmail.com>',
      to: email,
      subject: "Sucessfully landed to food paradize!",
      html: emailContent,
    };

    // Send email
    await transporter.sendMail(mailOptions);
  }

  static async signupUser(email, password) {
    try {
      const signupUser = await auth.createUser({
        email: email,
        password: password,
      });
      return signupUser.id;
    } catch (err) {
      console.error("Error signup user : ", err);
      throw err;
    }
  }

  static async initializePoints(uuid, points) {
    try {
      const newPointsRef = await db.collection("loyalty-points").add({
        uuid: uuid,
        points: points,
      });
      return newPointsRef.id;
    } catch (err) {
      console.error("Error adding loyalty points : ", err);
      throw err;
    }
  }

  static async updateLoyaltyPoints(id, data) {
    try {
      const snapshot = await db
        .collection("loyalty-points")
        .where("uuid", "==", id)
        .get();
      if (snapshot.empty) {
        throw new Error("User not found.");
      }

      const docId = snapshot.docs[0].id;
      if (docId) {
        await db.collection("loyalty-points").doc(docId).update(data);
        return "Loyalty points updated.";
      }
    } catch (err) {
      console.error("Error updating loyalty points : ", err);
      throw err;
    }
  }

  static async getLoyaltyPoints(uuid) {
    try {
      const snapshot = await db
        .collection("loyalty-points")
        .where("uuid", "==", uuid)
        .get();
      if (snapshot.empty) {
        throw new Error("There are not points");
      }
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (err) {
      console.error("Error getting loyalty points : ", err);
      throw err;
    }
  }

  static async getLoyaltyPointsOnly(uuid) {
    try {
      const snapshot = await db
        .collection("loyalty-points")
        .where("uuid", "==", uuid)
        .get();
      if (snapshot.empty) {
        throw new Error("There are not points");
      }
      const points = snapshot.docs[0].data().points;
      return points;
    } catch (err) {
      console.error("Error getting loyalty points : ", err);
      throw err;
    }
  }

  static async getUserUuid(email) {
    try {
      const snapshot = await db
        .collection("user")
        .where("email", "==", email)
        .get();
      if (snapshot.empty) {
        throw new Error("User not found.");
      }

      const docId = snapshot.docs[0].id;
      return docId;
    } catch (err) {
      console.error("Error getting user : ", err);
      throw err;
    }
  }

  static async getUserName(email) {
    try {
      console.log("***************");
      console.log(email);
      console.log("***************");
      if (!email) {
        throw new Error("UUID is empty or null.");
      }

      const snapshot = await db
        .collection("user")
        .where("email", "==", email)
        .get();
      if (snapshot.empty) {
        throw new Error("User not found.");
      }

      const userData = snapshot.docs[0].data(); // Get the data of the first document
      const userName = userData.name;

      return userName;
    } catch (err) {
      console.error("Error getting user : ", err);
      throw err;
    }
  }
}

module.exports = User;
