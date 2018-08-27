export const userName= state => state.user.username
export const getContactNames = state =>{
  return state.contacts;
}
export const userImg = state => state.user.avatar
export const isLogged=state=>state.user.isLogged;
export const sessions = state =>{
  var sessions = state.sessions;
  return Object.keys(sessions).reduce(function(last,current){
         return [
               ...last,
               sessions[current]
             ]
         },[]).sort(function(a,b){
           return b.latestMessage.timestamp-a.latestMessage.timestamp
         })
}
export const currentSessionId=state =>state.currentSessionId
export const currentSession=state => {
  return state.currentSessionId
  ? state.sessions[state.currentSessionId]
  : {}
}
export const currentMessages = state => {
  const session = currentSession(state)
  return session.messages
    ? session.messages.map(id => state.messages[id])
    : []
}
