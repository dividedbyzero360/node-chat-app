const path=require("path");
const express=require("express");
const socketIO=require("socket.io");
const http=require("http");
const app=express();

const server=http.createServer(app);
var io=socketIO(server);

app.use(express.static(path.join(__dirname,"/../public")))

io.on("connection",(socket)=>{
  console.log("New user connected");
});

io.on("disconnect",(socket)=>{
    console.log("User disconnected");
});

const port=process.env.Port || 3000;
server.listen(port,()=>{
    console.log(`Server started at ${port}`);
})

