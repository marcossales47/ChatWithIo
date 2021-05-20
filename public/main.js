const socket = io();
let User='';
let userList=[];

let loginPage=document.querySelector('#loginPage');
let userName=document.querySelector('#loginNameInput');

let chatPage=document.querySelector('#chatPage');
let chatInput=document.querySelector('#chatTextInput');

chatPage.style.display='none';
loginPage.style.display='flex';

/*Below is the function that allow the render of the Users List at the
side of the Chat-Page*/
function updateUserList() {
    let ul=document.querySelector('.userList');

    ul.innerHTML='';

    userList.forEach((item)=>{
        ul.innerHTML +='<li>'+item+'</li>'
    });
}
/*This function allow the messages on the screen*/
function addMessage (type, user, msg){
    let ul=document.querySelector('.chatList');
    switch(type){
        case 'status':
            ul.innerHTML +='<li class="m-status">' + msg + '</li>'
            break;
        
        case 'msg':
            if(user == userName){
            ul.innerHTML +='<li class="m-txt"><span class="me">' + user +'</span>'+msg+'</li>'
            }else{
            ul.innerHTML +='<li class="m-txt"><span>' + user +'</span>'+msg+'</li>'
            }
            break;            
    }
    //This send the 'scroll' to the end of the page
    ul.scrollTop = ul.scrollHeight;
}

userName.addEventListener('keyup', (key)=>{

    if(key.keyCode===13){

        let name = userName.value.trim();

        if(name != ''){

            userName=name;
            document.title='Chat ('+userName+')';

            /*Below it emits the name os chat user for the server*/
            socket.emit('join-request', userName)
            }
        }
    }
);
/*Below lies the event that show message on message-board*/
chatInput.addEventListener('keyup', (e)=>{
    if(e.keyCode===13){
        let txt = chatInput.value.trim();
        chatInput.value='';

        if(txt != ''){
            addMessage('msg', userName, txt)
            socket.emit('client-message', txt);
        }
    }
})

socket.on('user-ok', (list)=>{
    chatPage.style.display='flex';
    loginPage.style.display='none';
        addMessage('status', null, 'Conectado !')
    userList=list;
    updateUserList();
})

socket.on('list-update', (data)=>{
    if(data.joined){
        addMessage('status', null, data.joined + ' entrou !')
    }
    if(data.left){
        addMessage('status', null, data.left + ' saiu !')
    }
    
    userList=data.list;
    updateUserList();
    
})
socket.on('server-message', (obj)=>{
    addMessage('msg',obj.username,obj.message);
})
socket.on('connect_error', ()=>{
    addMessage('status', null, 'Tentando reconectar...')
})
socket.on('disconnect', ()=>{
    addMessage('status', null, 'Você foi desconectado')
})