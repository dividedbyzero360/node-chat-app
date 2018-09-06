const path=require("path");
const express=require("express");
const socketIO=require("socket.io");
const http=require("http");
const app=express();

const server=http.createServer(app);
var io=socketIO(server);
app.use(express.static(path.join(__dirname,"/../public")));
io.on("connection",(socket)=>{
  console.log("New user connected");
  socket.on("createMessage",function(message){
   console.log("Create Message", message);
   io.emit("newMessage",{
    from:  message.from,
    text: message.text,
    createdAt: new Date().getTime()
   });
  });

  socket.on("disconnect",()=>{
    console.log("User was disconnected");
  });
});

const port=process.env.Port || 3000;
server.listen(port,()=>{
    console.log(`Server started at ${port}`);
});

