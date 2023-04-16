const router = require("express").Router();
const axios = require("axios");
const { Users, formateGotData, db } = require("../helper/firebase");
var admin = require("firebase-admin");
var serviceAccount = require("../doconcall-firebase-details.json");
const { log } = require("firebase-functions/logger");

if (!admin?.apps?.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://doconcall-2cec4-default-rtdb.firebaseio.com"
    });
}

router.post('/', async (req, res) => {
    console.log("ran...");
    console.log(req.body);
    if(!req.body.email || req.body.isDoc===undefined){ 
      res.status(400).json("Details are not present");
      return;
    }
    Users.add(req.body)
        .then((r)=>{
            res.json("User added successfully");
        })
        .catch(err=>{
            console.log(err);
            res.json("User didn't added");
        })
});

router.get("/",async (req,res)=>{
    const all_users = await Users.get();
    res.json(formateGotData(all_users));
})


router.get("/active",async (req,res)=>{
    const all_users = await db.collection("Active").get();
    res.json(formateGotData(all_users));
});

router.post("/active",async (req,res)=>{
    try{
        console.log("active ran...");
        const email = req?.body?.email;
        const socketId = req?.body?.socketId;
        if(!email || !socketId) return;
        const user = await db.collection('Active').doc(email).set({
            email:email,
            socketId:socketId
        });
        res.json("activated");
    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }
});

router.post("/deactive",async (req,res)=>{
    try{
        console.log("deactive ran...");
        const email = req?.body?.email;
        if(!email) return;
        const user = db.collection('Active').doc(email).delete();
        res.json("deactivated");
    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }
});


module.exports = router;