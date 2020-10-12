//const { countReset } = require('console');
const express = require('express');
const http = require('http');
const app = express();
const path = require('path');
const socketio = require('socket.io');
const Filter = require('bad-words');
const { generateFunction, generateLocationFunction } = require('./utills/messages');
const { addUser, removeUser, getUserinRoom, getUser } = require('./utills/users')


const server = http.createServer(app);//for socket.io
const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname,'../public')//make a static web and your web always be index.js if you open the web for the first time (membuat selalu pas server jalan web nya yang di buka pertama kali itu adalah index.js)
const io = socketio(server)

app.use(express.static(publicDirectoryPath));

//let count = 0;
//must same from chat.js like socket,countUpadate,increment,count 
// server (emit) -> client (receive) == countUpdated
// client (emit) -> server (receve) == increment

io.on('connection',(socket)=>{//socket it's object
    console.log('New WebSocket is connection');
    //countUpdated it's just object ( hanya objek untuk mengirim data ke chat.js)
    //incerement hanya object untuk menadapatkan data dari chat.js
    //emit it's function from socketio 
    // socket.emit('countUpdated',count)
    // socket.on('increment',() =>{
    //     count++
    //     //socket.emit('countUpdated',count)
    //     io.emit('countUpdated', count)
    // })

    socket.on('join', ({ username, roomname}, callback) =>{ 
        const {error, user} = addUser({ id:socket.id, username, roomname})
        
        if(error){
            return callback(error)
        }

        socket.join(user.roomname);
        socket.emit('serverSend',generateFunction('Admin','Welcome'));
        socket.broadcast.to(user.roomname).emit('serverSend', generateFunction('Admin',`${user.username} has been join the room!`))
        io.to(user.roomname).emit('roomData', {
            roomname: user.roomname,
            users: getUserinRoom(user.roomname)
        })

        callback()
    })


    socket.on('clientSide',(pesan, callbackpesan)=>{
       const user = getUser(socket.id)
       const filter = new Filter();
        
       if(filter.isProfane(pesan)){
            return callbackpesan('Profanity is not allowed !')

       }

       io.to(user.roomname).emit('serverSend', generateFunction(user.username ,pesan))
       callbackpesan()
    })

    socket.on('disconnect',()=>{
        const user = removeUser(socket.id);
        if(user){
            io.to(user.roomname).emit('serverSend',generateFunction('Admin',`${user.username} has left!`))
            io.to(user.roomname).emit('roomData', {
                roomname: user.roomname,
                users: getUserinRoom(user.roomname)
            })
        }
        
    })

    socket.on('sendLocation',(kordinat, callbackLocation)=>{
        const user = getUser(socket.id)
        io.to(user.roomname).emit('pesanLocation',generateLocationFunction(user.username, `https://google.com/maps?q=${kordinat.latitude},${kordinat.longitude}`))
        callbackLocation()
    })
})

server.listen(port, () =>{
    console.log(`Port berjalan lancar ${port}`)
})