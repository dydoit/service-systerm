import axios from 'axios';
import config from '../config'

//获得消息总数
export const getMessageCount = (token, contactId) => fetch(`${config.hostname}/message/count/${contactId}`, {
  headers: {
  'Authorization': `Bearer ${token}`
  }
  })
//获取消息
export const getMessages = (token, contactId, pager) => {
  return fetch(`${config.hostname}/message/${contactId}?currentPage=${pager.currentPage}&itemsPerPage=${pager.itemsPerPage}`, {
  headers: {
  'Authorization': `Bearer ${token}`
  }
  })
  }
//注册一个新用户
export function register(user){
  return fetch(`${config.hostname}/user`,{
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify(user)
  })
}

export function getToken(user) {
  return fetch(`${config.hostname}/auth`,{
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify(user)
  })
}
export function getUserInfo(token, username){
  return fetch(`${config.hostname}/user/${username}`, {
    headers: {
		'Authorization': `Bearer ${token}`
    }
  })
}
export function creatContact(token,contactName){
  return fetch(`${config.hostname}/user/contact`,{
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    method: "POST",
    body: JSON.stringify({contactName})
  })
}
export function getUnread(username){
  return fetch(`${config.hostname}/message/unread/${username}`,{
  })
}
export function updateUnread(token,contactId){
  return fetch(`${config.hostname}/message/makeRead/${contactId}`,{
    headers: {
      'Authorization': `Bearer ${token}`
      }
  })
}
export function readed(token,messageId){
  return fetch(`${config.hostname}/message/makeRead/single/${messageId}`,{
    headers: {
      'Authorization': `Bearer ${token}`
      }
  })
}

export function getDealer(data){
  //`http://119.23.167.197:90/mule/website`  生产环境
  return fetch(`http://119.23.167.197:90/mule/website`,{
    headers: {
      'Content-Type': 'application/json'
    },
    method:'POST',
    body:JSON.stringify(data)
  })
}
