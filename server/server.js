const path=require("path");
const express=require("express");
const socketIO=require("socket.io");
const http=require("http");
const app=express();
const {generateMessage,generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const server=http.createServer(app);
var io=socketIO(server);
app.use(express.static(path.join(__dirname,"/../public")));
io.on("connection",(socket)=>{
 socket.on("join",(params,callback)=>{
  if (!isRealString(params.name) || !isRealString(params.room)) {
    callback('Name and room name are required.');
  }
  socket.join(params.room);
    // socket.leave('The Office Fans');

    // io.emit -> io.to('The Office Fans').emit
    // socket.broadcast.emit -> socket.broadcast.to('The Office Fans').emit
    // socket.emit

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));
    callback();
 });
 socket.on('createMessage', (message, callback) => {
  console.log('createMessage', message);
  io.emit('newMessage', generateMessage(message.from, message.text));
  callback();
});

socket.on('createLocationMessage', (coords) => {
  io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
});

socket.on('disconnect', () => {
  console.log('User was disconnected');
});
});

const port=process.env.Port || 3000;
server.listen(port,()=>{
    console.log(`Server started at ${port}`);
});




// io.on("connection",(socket)=>{
//   console.log("New user connected");
//   socket.emit("newMessage",generateMessage('Admin', 'Welcome to the chat app'));
//   socket.broadcast.emit("newMessage",generateMessage('Admin', 'New user joined'));
//   socket.on("createMessage",function(message,callback){
//    console.log("Create Message", message);
//    io.emit("newMessage", generateMessage(message.from, message.text));
//    callback("Ok from server");
// // socket.broadcast.emit("newMessage",{
// //     from:  message.from,
// //     text: message.text,
// //     createdAt: new Date().getTime()
// // });
//   });
//   socket.on('createLocationMessage', (coords) => {
//     io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
//   });
//   socket.on("disconnect",()=>{
//     console.log("User was disconnected");
//   });
// });