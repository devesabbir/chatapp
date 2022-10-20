//  socket io
function chatApp(){
    const socket = io();
    const app = document.querySelector('.messenger')
    let exitBtn = app.querySelector('#exit-chat')
    let joinBtn = app.querySelector('#join-user')

    let userName; 
    
  joinBtn.addEventListener('click', function(e){
       let chatScreen = app.querySelector('.screen.chat-screen')
       let joinScreen = app.querySelector('.screen.join-screen')
       userName = app.querySelector('#username').value

       chatScreen.classList.add('active')
       joinScreen.classList.remove('active') 
        
       socket.emit('new-user', userName) 

       socket.on('loginUser', function(userData){
          renderMessage('update', userData)
       })

     })

    let sendBtn = app.querySelector('.typebox #send-message') 
    let inputMessage;

    sendBtn.addEventListener('click', function(){
      inputMessage = app.querySelector('#input-message').value
    
       socket.emit('chat', {
          user:userName,
          text:inputMessage
       })

       renderMessage('my', {
         user:userName,
         text:inputMessage
       })

       app.querySelector('#input-message').value = ''
      
    })

     exitBtn.addEventListener('click', function(e) {
        socket.emit('exit-user', userName) 
        window.location.href = window.location.href

     })

     socket.on('logout-user', function(userData){
        renderMessage('update', userData)  
     })

    socket.on('msg', function(chatMsg){
        renderMessage('other', chatMsg)
    })

    function renderMessage(type, msg){
        let msgContainer =  app.querySelector('.messages')
        if( type == 'my') {
            let el = document.createElement('div')
            el.setAttribute('class', 'message my-message')
            el.innerHTML = `
               <div class="name">You</div>   
               <div class="text">${msg.text}</div> 
            
            `
            msgContainer.appendChild(el)

        } else if (type == 'other') {
            let el = document.createElement('div')
            el.setAttribute('class', 'message other-message')
            el.innerHTML = `
               <div class="name">${msg.user}</div>   
               <div class="text">${msg.text}</div> 
            
            `
            msgContainer.appendChild(el) 

        } else if ( type == 'update') {
            let el = document.createElement('div')
            el.setAttribute('class', 'update')
            el.innerText = msg
            msgContainer.appendChild(el)  
        }

       msgContainer.scrollTop = msgContainer.scrollHeight - msgContainer.clientHeight
    }
    

}

chatApp()
