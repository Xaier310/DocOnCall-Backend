const firebase = require("firebase");


const firebaseConfig = {
    apiKey: "AIzaSyCurhlB7H2tZsgmTg6mh4fptx4KSaLcNHc",
    authDomain: "doconcall-2cec4.firebaseapp.com",
    projectId: "doconcall-2cec4",
    storageBucket: "doconcall-2cec4.appspot.com",
    messagingSenderId: "665262627858",
    appId: "1:665262627858:web:ed9b4f5e037ceeb7f80ccb",
    measurementId: "G-LJ1C7KY9PW"
};

const formateGotData = (data) => {
    return data.docs.map((doc)=>({ id:doc.id,...doc.data() }));
}


// Initialize Firebase
const App = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const Users = db.collection("Users");

module.exports.App = App;
module.exports.firebaseConfig = firebaseConfig;
module.exports.db = db;
module.exports.Users = Users;
module.exports.formateGotData  = formateGotData;

