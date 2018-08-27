import Vue from 'vue'
import * as types from './mutation-types'
import router from '../router'
export default {
  //state里创建登录用户
  [types.CREATE_USER] (state,{ user,token}){
    state.user.isLogged=true;
    state.user.id=user._id;
    state.user.avatar=user.avatar;
    state.user.token=token;
    state.user.contacts=user.contacts;
    state.user.username=user.username;
  },
  //state里创建所有联系人
  [types.RECEIVE_CONTACTS] (state,contacts){
    let username=state.user.username;
    state.contacts = contacts.reduce(function(last,contact){
      var id= username>contact.username?contact.username+username:username+contact.username;
      var sessionId = btoa(id)
      return {
        ...last,
        [contact.username]: {
          ...contact,
          'sessionId':sessionId,
          'isOnline':false
        }
      }
    }, {})
  },
  //设置当前session
  [types.SET_CURRENTSESSION] (state,payload){
     let { username } = state.user;
     let {username: contactName} = payload;
     var id= username > contactName ? contactName + username : username + contactName;
     var sessionId = btoa(id)
     state.currentSessionId = sessionId
  },
  //获取所有信息
  [types.GET_ALLMESSAGES](state,messages){
    state.messages=messages.reduce((last,current)=>{
      let id=current._id
      return {
        ...last,
        [id]:current
      }
    },{})
  },
  //创建所有sessions
  [types.CREATE_SESSIONS](state,payload){
    let {id:userId} = state.user
    const {allMessages,sessions,currentSessionId} = payload
    allMessages.forEach(function(item,index){
      if (!sessions[item.sessionId].messages.some(id => id === item._id)) {
        sessions[item.sessionId].messages.push(item._id)
        sessions[item.sessionId].latestMessage = item
      }

    })
    state.sessions = sessions
    setCurrentSession(state,currentSessionId)
  },
  [types.SWITCH_SESSION](state,session){
    session.unReadNum = 0;
    setCurrentSession(state,session.sessionId)
  },
  //更改state里面的contact在线状态
  [types.RECEIVE_ONLINE_STATUS] (state,data) {
    let {username} = state.user;
    let {sessions} = state;
    Object.keys(data).forEach(function(item,index){
      var id= username>item?item+username:username+item;
      var sessionId = btoa(id)
      sessions[sessionId].contact.isOnline = data[item]
    })
  },
  //新增一条消息
  [types.CREATE_MESSAGE] (state,message) {
    const session = state.sessions[message.sessionId]
    if(state.currentSessionId!=message.sessionId){
      session.unReadNum++;
    }
    if (!session.messages.some(id => id === message._id)) {
      session.messages.push(message._id)
      session.latestMessage = message
    }
    Vue.set(state.messages, message._id, message)
   //当前经销商不在线，手动临时添加一条提示消息
    if(!session.contact.isOnline){
       let _message = {
          _id:Math.random(),
          content:'系统提示：尊敬的用户您好，当前客服暂时不在线，您的问题已通知到客服，客服上线后将第一时间为您解答',
          from:session.contact.username,
          to:state.user.username,
          sessionId:message.sessionId,
          type:'TEXT',
          isRead:true,
          timestamp:message.timestamp+300
       }
       setTimeout(function(){
          session.messages.push(_message._id)
          Vue.set(state.messages, _message._id, _message)
       },300)

    }
  },
  //获取更多消息
  [types.GET_MOREMESSAGE] (state,messages) {
    messages.forEach((message,index) =>{
      const session = state.sessions[message.sessionId]
      if (!session.messages.some(id => id === message._id)) {
        session.messages.push(message._id)
      }
      Vue.set(state.messages, message._id, message)
    })
  },
  //新添联系人
  [types.ADD_NEW_CONTACT] (state,{contact,message}) {
    let {username} = state.user
    let contactName = contact.username
    let newSessionId = btoa(username>contactName?contactName+username:username+contactName);
    Vue.set(state.messages, message._id, message)
    state.user.contacts.push(contactName);

    let newContact = contact;
    newContact.isOnline = true
    newContact.sessionId = newSessionId
    Vue.set(state.contacts,contact.username,newContact)

    let newSession = {
        contact:newContact,
        latestMessage:message,
        messages:[message._id],
        pager:{currentPage:0,itemsPerPage:10},
        sessionId:newSessionId,
        unReadNum:0
    }
    Vue.set(state.sessions,newSessionId,newSession)
  },
  [types.FIVE_MINUTES] (state,message){
      const session = state.sessions[message.sessionId]
      let _message = {
          _id:Math.random(),
          content:'系统提示：经销商目前系统忙碌，请您稍作等待。如果您想结束此次对话，请点击<a href="#">立即评价</a>',
          timestamp:message.timestamp+300,
          type:'TEXT',
          isRead:true,
          from:message.to,
          to:message.from
      }
      if(session.contact.isOnline){
        session.messages.push(_message._id)
        Vue.set(state.messages, _message._id, _message)
      }

  }
}
function setCurrentSession(state,id){
  state.currentSessionId = id;
}
