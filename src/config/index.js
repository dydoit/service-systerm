export default {
  hostname:'http://119.23.167.197:3000',
  hostname2:'http://119.23.167.197:89',
  global:function(){
    let date = new Date();
    let year = date.getFullYear(),      //年
        month = date.getMonth()+1 > 9 ? date.getMonth()+1 : '0'+(date.getMonth()+1),    //月
        day = date.getDate()>9 ? date.getDate() : '0'+date.getDate(),   //日
        hours = date.getHours()>9 ? date.getHours() : '0'+date.getHours(),    //时
        minutes = date.getMinutes()>9 ? date.getMinutes() : '0'+date.getMinutes(),    //分
        seconds = date.getSeconds()>9 ? date.getSeconds() : '0'+date.getSeconds(),    //秒
        milliseconds = date.getUTCMilliseconds()>99 ? date.getUTCMilliseconds() : (date.getUTCMilliseconds()>9 ? '0'+date.getUTCMilliseconds() : '0'+'0'+date.getUTCMilliseconds()),    //毫秒
        randomNum = parseInt(Math.random()*100000000);  //八位随机数
    return {
      'serialNumber': year+month+day+hours+minutes+seconds+milliseconds+'web'+randomNum,
      'timestamp': year+'-'+month+'-'+day+' '+hours+':'+minutes+':'+seconds
    }
  }
}
