const express = require('express')
const app = new express()
require('colors')
const fs = require('fs')
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
    
    let userDb = JSON.parse(fs.readFileSync(path.join(__dirname, './public/user.json')).toString())

    let chatDb = JSON.parse(fs.readFileSync(path.join(__dirname, './public/chat.json')).toString())  
     
    socket.on('new-user', function(user){   
        userDb.push(user)
        fs.writeFileSync(path.join(__dirname, './public/user.json'), JSON.stringify(userDb))     
        let newUser = userDb.find( i => i === user)
        socket.broadcast.emit('loginUser', newUser + ' join this conversation.')
    })
  
    socket.on('exit-user', function(user){
      let newUser = userDb.find( i => i === user)
      socket.broadcast.emit('logout-user', newUser + ' left this conversation.')
    })
 
    socket.on('chat', function(chat){
        chatDb.push(chat)
        fs.writeFileSync(path.join(__dirname, './public/chat.json'), JSON.stringify(chatDb))  
        socket.broadcast.emit('msg', chatDb)
    })




    socket.on('disconnect', () => {
       console.log(`client disconnected`.bgRed);
      
    })

})



httpServer.listen( 5050, () => {
     console.log(`server is running on 5050 port`.bgCyan.black);
})