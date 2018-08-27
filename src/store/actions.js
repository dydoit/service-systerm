import * as api from '../api';
import * as types from './mutation-types';
import router from '../router';
import socket from '../api/io';
import config from '../config'

//进入页面先登录
export const log = ({ commit, dispatch }, { user, contactName }) => {
  api.getToken(user)
  .then(res => {
    if (res.status === '401') {
      console.log('已过期')
    }
    return res.json()
  })
  .then(res =>{
    //用户登录认证通过，返回token，id，用户名
    if(res.status==1){
      // 注册用户
      api.register({
        username:user.username,
        nickname:user.username,
        avatar :"/system/images/user_avatar_default.jpg",
        password: "000000"
      })
      .then(res =>res.json())
      .then(res =>{
        dispatch('log',{
          user:{
            username:user.username,
            password: "000000"
          },
          contactName

        })
      })
    } else {
      // 后续逻辑
      let { data } = res;
     dispatch('getUserInfo',{data,contactName})
    }

  })
}
//
export const getUserInfo = ({commit,dispatch},{data,contactName}) =>{
  const { token, id, username } = data;
  // 2.通过后请求登录的用户详细信息
  api.getUserInfo(token, username)
  .then(res => {
    return res.json()
  })
  .then(res =>{
    const { user } = res.data
    const { contacts: contactNames } = user //获取用户的联系人名称数组
    const { _id } = user       //登录用户的id
    commit(types.CREATE_USER,{ user,token})

    //连接socket
    socket.connect();

    //如果当前联系人不在该用户的联系人数组里，就添加进去
    if(contactNames.indexOf(contactName)===-1){

      contactNames.push(contactName)
      socket.emit('user_login',{
        username,
        token,
        contactNames: contactNames
      })
      api.creatContact(token,contactName)
      .then(res => {
        socket.emit('add_new_contact',{
          username,
          contactName
        })

      })
    }else{
      socket.emit('user_login',{
        username,
        token,
        contactNames: contactNames
      })
    }
    //根据联系人人名请求所有联系人的详细信息
    dispatch('getContacts', {user, contacts: contactNames, token})
    .then(contacts => {
      let currentContact;
      contacts.forEach((item,index)=>{
        if(item.username===contactName){
          currentContact=item
        }

      })
      let currentSessionId = btoa(currentContact.username>username?username+currentContact.username:currentContact.username+username)
      const sessions = contacts.reduce(function(last,item){
        let id= username>item.username?item.username+username:username+item.username;
        let sessionId = btoa(id)
        return {
          ...last,
          [sessionId]: {
            sessionId,
            contact:{
              _id:item._id,
              avatar:item.avatar,
              username:item.username,
              nickname:item.nickname,
              isOnline:false,//初始值为false2,
              score:'',//评分
              sellNum:'',//在售车辆
              activetyNum:''
            },
            messages: [],
            latestMessage:{},
            pager:{},
            unReadNum:0



          }
        }
      }, {})

      dispatch('get_dealer',currentContact).then(res=>{
          sessions[currentSessionId].contact.activetyNum = res.activityCount;
          sessions[currentSessionId].contact.sellNum = res.onSellCarCount;
          sessions[currentSessionId].contact.score = res.score
      })

     //根据登录用户的id去请求到所有的未读消息
      dispatch('getUnreadMessages',{username})
      .then((res)=>{
        if(res.length){
          res.forEach((item,index)=>{
            let contactId =item.username;
            let id = username>contactId?contactId+username:username+contactId;
            let sessionId = btoa(id);
            if(sessionId!==currentSessionId){//页面初始默认当前session的unReadNum = 0
              sessions[sessionId].unReadNum = item.unReadCount
            }else{
              // sessions[sessionId].unReadNum = 0;
              // api.updateUnread(token,currentContact.username)
            }
          })
        }

      })
      const contactNames = contacts.map(contact => contact.username)
      dispatch('getMessageCount',{contacts,token})
      .then(ress =>{
        let promises = ress.map(item =>{
          let {contact,count} = item;
          let contactId =contact.username;
          let sessionId = username>contactId?contactId+username:username+contactId;
          sessionId = btoa(sessionId)

          let totalNum = count.messageCount
          let itemsPerPage = 10;
          let totalPages = Math.ceil(totalNum/itemsPerPage)
          let pager={
            currentPage:totalPages,
            itemsPerPage
          }
          sessions[sessionId].pager=pager
          //请求最后一页的消息
           // 根据联系人id和该用户token请求所有对话消息
          return api.getMessages(token, contactId,pager).then(res => res.json())
        })
        Promise.all(promises).then(ress =>{
            return ress.map(res => res.data.messages)
        }).then(messages =>{
          let allMessages = messages.reduce((all,current)=>{
            return [...all,...current]
          },[])
          commit(types.GET_ALLMESSAGES,allMessages)
          commit(types.CREATE_SESSIONS,{allMessages,sessions,currentSessionId})
        }).then(()=>{
           //请求联系人在线状态
          socket.emit('check_online_status')
        })
      })


      //存储所有联系人
      commit(types.RECEIVE_CONTACTS,contacts)


    })
  })
}
export const getContacts = (({commit,dispatch}, {contacts, token})=>{
  const contactsPromise = contacts.map(username => api.getUserInfo(token, username).then(res => res.json()))
  return Promise.all(contactsPromise)
  .then(ress => ress.map(res => res.data.user))
  .then(contacts => {
    //返回根据联系人人名请求接口返回的详细联系人列表
    return contacts
  })
})
export const getMessageCount = ({commit},{contacts,token}) =>{
  let allCount = contacts.map(function(contact){
    return api.getMessageCount(token,contact.username).then(res =>{
      return res.json()
    }).then(res =>{
      let count = res.data
      return {
        contact,
        count
      }
    })
  })
  return Promise.all(allCount).then(ress=>{
    return ress
  })


}
//请求未读消息
export const getUnreadMessages = ({commit},{username})=>{
   return api.getUnread(username)
    .then(res=>{
     return res.json()
    })
    .then(res =>{
      return res.data.unreadMessageInfo.detail
    })
}

export const receive_message=({commit,state},data) =>{
    if(state.currentSessionId=== data.sessionId){
      api.readed(state.user.token,data._id)
      commit(types.CREATE_MESSAGE, {
        ...data,
        isRead: true//
      })
      return
    }
   commit(types.CREATE_MESSAGE,data)
}

export const switchSession = ({ commit,state,dispatch}, session) => {
  let id = session.contact.username;
  let token = state.user.token;
  let {contact} = session
  api.updateUnread(token,id)
  if(contact.sellNum ===''){
    dispatch('get_dealer',contact).then(res =>{
      session.contact.activetyNum = res.activityCount;
      session.contact.sellNum = res.onSellCarCount;
      session.contact.score = res.score
      commit(types.SWITCH_SESSION, session)
    })
  }else{
    commit(types.SWITCH_SESSION, session)
  }


}
export const receive_online_status = ({commit},payload) => {
  commit(types.RECEIVE_ONLINE_STATUS,payload)
}
//点击加载更多
export const getMore = ({commit,state},session) => {
  let contactId = session.contact.username;
  let {token} = state.user;
  let {pager} = session;
  api.getMessages(token, contactId,pager).then(res => res.json())
  .then(ress =>{
    let messages = ress.data.messages
    commit(types.GET_MOREMESSAGE,messages)
    return ress.data.messages
  })
}
export const add_new_contact = ({commit,state,dispatch},contactName) =>{
    let { token ,username} = state.user
    api.getUserInfo(token, contactName)
    .then(res =>{
      return res.json()
    })
    .then(res => {
      return res.data.user
    })
    .then(contact => {
      api.getMessages(token, contactName,{
        currentPage:0,
        itemsPerPage:10
      })
      .then(res => {
        return res.json()
      })
      .then(res =>{
        return res.data.messages[0]
      })
      .then(message => {
        commit(types.ADD_NEW_CONTACT,{contact,message})
      })
    })

}
export const five_minutes = ({commit,state},message) =>{
  console.log(message)
}
export const get_dealer = ({commit,state},dealerCode) =>{
  let {username} = dealerCode;
  username = username.toUpperCase()
  //请求当前店铺的信息
  let dealerData = {
    "serviceName":"web.cust.dealerDetail",
    "timestamp":config.global().timestamp,
    "serialNumber":config.global().serialNumber,
    "request_data":{
          "dealerCode":username,
          "workType":"1"
    }
  }
  return api.getDealer(dealerData).then(res => {
     return res.json()
   })
   .then(res =>{
      return res.response_data.entity
   })
}
