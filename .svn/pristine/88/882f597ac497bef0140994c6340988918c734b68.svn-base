import io from 'socket.io-client'
import store from '../store'
import config from '../config'
const socket=io(config.hostname,{
    autoConnect:false
})
socket.on('receive_message',data => {
    store.dispatch('receive_message',data);
})
socket.on('receive_online_status',data => {
    console.log('响应没')
    store.dispatch('receive_online_status',data)
})
socket.on('reconnect',()=>{
   const {username,token,contacts}= store.state.user;
  socket.emit('user_login',{
    username,
    token,
    contactNames: contacts
  })
})
socket.on('receive_new_contact',(contactName)=>{
  console.log(contactName)
  store.dispatch('add_new_contact',contactName)
})
export default socket;
