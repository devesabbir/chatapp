const express = require('express')
const app = new express()
require('colors')
const path = require('path')
const { createServer } = require('http')
const { Server } = require('socket.io')


const httpServer = createServer(app)
const io = new Server(httpServer)

app.use(express.static(path.join(__dirname, '/public')))

app.get('/', ( req, res ) => {
     res.sendFile(path.join(__dirname, './index.html'))
})


io.on('connection', function(socket) {
    console.log(`client is connected`.bgMagenta);

    socket.on('new-user', function(user){
        socket.broadcast.emit('loginUser', user + ' join this conversation.')
    })

    socket.on('exit-user', function(user){
      socket.broadcast.emit('logout-user', user + ' left this conversation.')
    })

    socket.on('chat', function(chat){
        socket.broadcast.emit('msg', chat)
    })



    socket.on('disconnect', () => {
       console.log(`client disconnected`.bgRed);
      
    })

})



httpServer.listen( 5050, () => {
     console.log(`server is running on 5050 port`.bgCyan.black);
})