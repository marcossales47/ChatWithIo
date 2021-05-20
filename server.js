const express=require('express')
const app=express();
const path=require('path')
const http=require('http');
const socketIo=require('socket.io');
const { text } = require('express');


app.use(express.static(path.join(__dirname , './public')));

const server=http.createServer(app);
const io=socketIo(server);
server.listen(7777)

let connectedUsers=[];

io.on('connection', (socket)=>{
    console.log('Conexão detectada...');
  
    socket.on('join-request', (username)=>{
        socket.username=username;
        connectedUsers.push(username);
        console.log(connectedUsers);

        socket.emit('user-ok', connectedUsers);          
        
        socket.broadcast.emit('list-update', {
            joined:username,
            list:connectedUsers
        })

        socket.on('disconnect', ()=>{
            connectedUsers=connectedUsers.filter( (u)=> u != socket.username );
            console.log(connectedUsers);

            socket.broadcast.emit('list-update', {
                left:socket.username,
                list:connectedUsers
            })
        })
    }); 
    
        socket.on('client-message', (txt)=>{
            let obj={
                username:socket.username,
                message:txt
            }

            socket.broadcast.emit('server-message', obj);

            /*socket.emit('server-message', obj)  --! This emit is used just in alternative case--*/
        })
  })

