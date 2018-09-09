const path=require("path");
const express=require("express");
const socketIO=require("socket.io");
const http=require("http");
const app=express();
const {generateMessage,generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} =require('./utils/Users');
const server=http.createServer(app);
var users=new Users();


var io=socketIO(server);
app.use(express.static(path.join(__dirname,"/../public")));
io.on("connection",(socket)=>{
 socket.on("join",(params,callback)=>{
  if (!isRealString(params.name) || !isRealString(params.room)) {
    return callback('Name and room name are required.');
  }
  socket.join(params.room);
  users.removeUser(socket.id);
  users.addUser(socket.id,params.name,params.room);
  io.to(params.room).emit("updateUserList",users.getUserList(params.room));
    // socket.leave('The Office Fans');

    // io.emit -> io.to('The Office Fans').emit
    // socket.broadcast.emit -> socket.broadcast.to('The Office Fans').emit
    // socket.emit

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));
    callback();
 });
 socket.on('createMessage', (message, callback) => {
  var user=users.getUser(socket.id);
  if(user && isRealString(message.text)){
    io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
  }
  
  callback();
});

socket.on('createLocationMessage', (coords) => {
  var user=users.getUser(socket.id);
  if(user){
    io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
  }
});

socket.on('disconnect', () => {
  var user=users.removeUser(socket.id);
  io.to(user.room).emit("updateUserList",users.getUserList(user.room));
  io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
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