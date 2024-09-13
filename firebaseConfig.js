var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "",
});

const db = admin.firestore();
const auth = admin.auth();
const messaging = admin.messaging();
db.settings({ ignoreUndefinedProperties: true }); // Enable ignoreUndefinedProperties
module.exports = { db, auth, messaging };
