
// require('dotenv').config({path:path.resolve(__dirname,'./.env')})

const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const colors = require('colors');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const path = require('path');


dotenv.config();
 connectDB();

    const app = express();


    // creating API with express 

app.use(express.json()); //to accept JSON data..taking user details from frontend



app.use('/api/user',userRoutes);
app.use('/api/chat',chatRoutes);    
app.use('/api/message',messageRoutes);

//deployement
const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}


//error handling
app.use(notFound);
app.use(errorHandler); 

const PORT=process.env.PORT ;
const server = app.listen(PORT, console.log(`Server started on port ${PORT}`.yellow.bold));  //custom template
 
const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
      origin: "http://localhost:3000",
      // credentials: true,
    },
  });
  io.on("connection", (socket) => {
    console.log("Connected to socket.io");

    socket.on('setup',(userData)=> {
        socket.join(userData._id);
        socket.emit('connected');
    });
    socket.on("join chat", (room) => {
            socket.join(room);
            console.log("User Joined Room: " + room);
    });
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
    socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;
    
        if (!chat.users) return console.log("chat.users not defined");
    
        chat.users.forEach((user) => {
          if (user._id == newMessageRecieved.sender._id) return;
    
          socket.in(user._id).emit("message recieved", newMessageRecieved);
        });
        

      });

      socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
      });
    
});


