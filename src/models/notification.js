const { db, messaging } = require("../../firebaseConfig");

class Notification{
    static async sendNotification(token, title, body){
        const message = {
            token: token,
            notification:{
                title:title,
                body:body
            }
        }

        try{
            messaging.send(message);
            // res.status(200).send({ success: true, response });
        }catch(err){
            console.log('Something went wrong when send notification!');
            console.log('*********');
            console.log(err);
            console.log('*********');
        }
    }
}

module.exports = Notification;