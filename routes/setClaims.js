const router = require("express").Router();
const axios = require("axios");
const functions = require('firebase-functions');
const firebase = require("firebase");
const { firebaseConfig } = require("../helper/firebase");
var admin = require("firebase-admin");
var serviceAccount = require("../doconcall-firebase-details.json");


if (!admin?.apps?.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://doconcall-2cec4-default-rtdb.firebaseio.com"
  });
}

router.post('/', async (req, res) => {
    const uid = req.body.uid;
    delete req.body.uid;
    if(!uid){ 
      res.status(400).json("Uid is not present");
      return;
    }
    admin.auth().setCustomUserClaims(uid,req.body)
      .then(()=>{
        res.json("successfully claim done");
      });
});


module.exports = router;