const firebase = require("firebase");
const express = require("express");
require("dotenv").config();
const setClaimRoute = require("./routes/setClaims");
const usersRoute = require("./routes/users");
const checkoutRoute = require("./routes/stripe");
const http = require("http");
const cors = require("cors");
const axios = require("axios");

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

app.use("/api/setclaims", setClaimRoute);
app.use("/api/users", usersRoute);
app.use("/api/create-checkout-session", checkoutRoute);


var Users = {};

const io = require("socket.io")(server,{
	cors:{
		origin:`${process.env.FrontendAPI}`,
		methods: ["GET", "POST"]
	}
});

io.on("connection", (socket)=>{
    socket.emit("me", socket.id);
    console.log("connected->"+socket.id);

	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded");
		const email = Users[`${socket.id}`];
		delete Users[`${socket.id}`];
		if(!email) return;
		axios.post(`${process.env.BackendAPI}/api/users/deactive`,{email})
		.then((res)=>console.log("successfully Deactivated", socket.id))
		.catch((err)=>console.log(err));
	})

	socket.on("callUser", (data) => {
		io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name })
	})

	socket.on("answerCall", (data) => {
		console.log("data.to",data.to);
		io.to(data.to).emit("callAccepted", data.signal);
	})

	socket.on("leavecall",(id)=>{
		socket.to(id).emit("leavecall");
	})

	socket.on("active",({email,socketId})=>{
		if(!email || !socketId) return;
		Users[`${socketId}`] = email;
		axios.post(`${process.env.BackendAPI}/api/users/active`,{email,socketId})
		.then((res)=>console.log("successfully activated", socketId))
		.catch((err)=>console.log(err));
	})

	socket.on("sendid",()=>{
		socket.emit("me",socket.id);
	});

})



const PORT = process.env.PORT || 8000;
app.get("/", (req, res) => {
  res.send(`Backend running fine on port ${PORT}`);
});

server.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});

module.exports.server = server;