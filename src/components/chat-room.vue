<template>
  <div id="chatRoom">
        <div v-if="currentSessionId">
               <div class="title">
                <div v-if="currentSession.contact.isOnline" class="left" :class="{online:currentSession.contact.isOnline}">
                  您正在与 {{currentSession.contact.nickname}}对话
                </div>
                <div v-else class="left">
                    {{currentSession.contact.nickname}}不在线
                </div>
                <div class="right"><img src="../images/time.png"><span>人工客服：09:00-17:00</span></div>
            </div>
                    <div class="room-wrapper">
                <div class="room-left">
                    <div class="chat-room" ref="list">
                        <div v-if="currentSession.pager.currentPage>=2" class="hint" :style="{cursor:pointer}" @click="getMore(currentSession)">点击加载更多</div>
                        <div v-if="currentSession.pager.currentPage<2" class="hint">没有更多记录</div>
                        <ul class="chat-list" >
                          <!-- 遍历所得 -->
                          <li v-show="item.type!='SYSTEM_ADD_CONTACT'" v-for="item in currentMessages" :key="item._id" :class="[item.from==userName?'li-right':'li-left']">
                                <div class="head-img">
                                  <img :src="item.from==userName?hostname+userImg:hostname+currentSession.contact.avatar"/>

                                </div>
                                <div class="what-say" v-if="item.type=='TEXT'" v-html="item.content">

                                </div>

                                <div class="what-say" v-else-if="item.type=='IMAGE'">
                                    <img :src="hostname+item.content"/>
                                </div>
                                <div class="what-say" v-else-if="item.type==='FILE'">
                                      <div v-if="item.content.split('.')[item.content.split('.').length-1].toLowerCase()==='jpg' ||
                                      item.content.split('.')[item.content.split('.').length-1].toLowerCase()==='png'||
                                      item.content.split('.')[item.content.split('.').length-1].toLowerCase()==='jpeg'||
                                      item.content.split('.')[item.content.split('.').length-1].toLowerCase()==='gif'">
                                        <img class="file-img" :src="hostname+item.content" @click="showBig(hostname+item.content)">
                                      </div>
                                      <div v-else class="file-wrapper">
                                          <div v-if="item.content.split('.')[item.content.split('.').length-1].toLowerCase() ==='pdf'"  class="icon-wrapper">
                                            <i class="icon-pdf"></i>
                                          </div>
                                          <div v-else-if="item.content.split('.')[item.content.split('.').length-1].toLowerCase() ==='docx'||
                                          item.content.split('.')[item.content.split('.').length-1].toLowerCase()==='doc'">
                                            <i class="icon-docx"></i>
                                          </div>
                                          <div v-else-if="item.content.split('.')[item.content.split('.').length-1].toLowerCase() ==='xls'||
                                          item.content.split('.')[item.content.split('.').length-1].toLowerCase()==='xlsx'">
                                            <i class="icon-xlsx"></i>
                                          </div>
                                          <div v-else-if="item.content.split('.')[item.content.split('.').length-1].toLowerCase() ==='ppt'||
                                          item.content.split('.')[item.content.split('.').length-1].toLowerCase()==='pptx'">
                                            <i class="icon-pptx"></i>
                                          </div>
                                          <div v-else-if="item.content.split('.')[item.content.split('.').length-1].toLowerCase() ==='txt'">
                                            <i class="icon-txt"></i>
                                          </div>
                                          <div v-else>
                                            <i class="icon-defaut">

                                            </i>
                                          </div>
                                          <div class="cont">
                                              <p v-for="(v,i,index) in item.meta" :key="index" :class="{file_title:i=='name'}">
                                                {{v}}
                                                  <a v-if="index===1" :href="hostname+item.content" download>下载</a>
                                              </p>
                                          </div>
                                      </div>
                                </div>
                                <div v-if="item.hasLine" class="over-line">
                                      <span>{{item.timestamp | timeTranslate}}</span>
                                </div>
                          </li>
                        </ul>
                        <div class="hint" v-if="!currentSession.contact.isOnline">系统提示：{{currentSession.contact.nickname}}不在线，您可以给TA留言</div>

                    </div>
                    <div class="chat-input">
                        <div class="face">
                            <div @click="faceClicked=!faceClicked">
                                <img src="../images/face.png" alt="">
                                <div class="gif-images" v-show="faceClicked">
                                      <ul>
                                          <li>
                                              <img src="../images/gif/baiyan.gif" data-src="/system/gif/baiyan.gif" alt="" @click="sendMessage('IMAGE', $event)">
                                              <p>[白眼]</p>
                                          </li>
                                           <li>
                                              <img src="../images/gif/baobao.gif" data-src="/system/gif/baobao.gif"  alt="" @click="sendMessage('IMAGE', $event)">
                                              <p>[抱抱]</p>
                                          </li>
                                           <li>
                                              <img src="../images/gif/daku.gif" data-src="/system/gif/daku.gif" alt="" @click="sendMessage('IMAGE', $event)">
                                              <p>[大哭]</p>
                                          </li>
                                           <li>
                                              <img src="../images/gif/deyi.gif" data-src="/system/gif/deyi.gif" alt="" @click="sendMessage('IMAGE', $event)">
                                              <p>[得意]</p>
                                          </li>
                                           <li>
                                              <img src="../images/gif/fangle.gif" data-src="/system/gif/fangle.gif"  alt="" @click="sendMessage('IMAGE', $event)">
                                              <p>[烦了]</p>
                                          </li>
                                           <li>
                                              <img src="../images/gif/fennu.gif" data-src="/system/gif/fennu.gif"  alt="" @click="sendMessage('IMAGE', $event)">
                                              <p>[愤怒]</p>
                                          </li>
                                           <li>
                                              <img src="../images/gif/ganga.gif" data-src="/system/gif/ganga.gif" alt="" @click="sendMessage('IMAGE', $event)">
                                              <p>[尴尬]</p>
                                          </li>
                                           <li>
                                              <img src="../images/gif/haixiu.gif" data-src="/system/gif/haixiu.gif" alt="" @click="sendMessage('IMAGE', $event)">
                                              <p>[害羞]</p>
                                          </li>
                                           <li>
                                              <img src="../images/gif/heng.gif" data-src="/system/gif/heng.gif"alt="" @click="sendMessage('IMAGE', $event)">
                                              <p>[哼]</p>
                                          </li>
                                           <li>
                                              <img src="../images/gif/jiayou.gif" data-src="/system/gif/jiayou.gif" alt="" @click="sendMessage('IMAGE', $event)">
                                              <p>[加油]</p>
                                          </li>
                                           <li>
                                              <img src="../images/gif/jingya.gif" data-src="/system/gif/jingya.gif" alt="" @click="sendMessage('IMAGE', $event)">
                                              <p>[惊讶]</p>
                                          </li>
                                           <li>
                                              <img src="../images/gif/kaixin.gif" data-src="/system/gif/kaixin.gif" alt="" @click="sendMessage('IMAGE', $event)">
                                              <p>[开心]</p>
                                          </li>
                                           <li>
                                              <img src="../images/gif/leng.gif" data-src="/system/gif/leng.gif" alt="" @click="sendMessage('IMAGE', $event)">
                                              <p>[冷]</p>
                                          </li>
                                           <li>
                                              <img src="../images/gif/lengmo.gif" data-src="/system/gif/lengmo.gif" alt="" @click="sendMessage('IMAGE', $event)">
                                              <p>[冷漠]</p>
                                          </li>
                                           <li>
                                              <img src="../images/gif/qie.gif" data-src="/system/gif/qie.gif" alt="" @click="sendMessage('IMAGE', $event)">
                                              <p>[切]</p>
                                          </li>
                                           <li>
                                              <img src="../images/gif/renshu.gif" data-src="/system/gif/renshu.gif" alt="" @click="sendMessage('IMAGE', $event)">
                                              <p>[认输]</p>
                                          </li>
                                           <li>
                                              <img src="../images/gif/shiluo.gif" data-src="/system/gif/shiluo.gif" alt="" @click="sendMessage('IMAGE', $event)">
                                              <p>[失落]</p>
                                          </li>
                                           <li>
                                              <img src="../images/gif/weiqu.gif" data-src="/system/gif/weiqu.gif" alt="" @click="sendMessage('IMAGE', $event)">
                                              <p>[委屈]</p>
                                          </li>
                                           <li>
                                              <img src="../images/gif/weixiao.gif" data-src="/system/gif/weixiao.gif" alt="" @click="sendMessage('IMAGE', $event)">
                                              <p>[微笑]</p>
                                          </li>
                                           <li>
                                              <img src="../images/gif/yiwen.gif" data-src="/system/gif/yiwen.gif" alt="" @click="sendMessage('IMAGE', $event)">
                                              <p>疑问]</p>
                                          </li>
                                           <li>
                                              <img src="../images/gif/yuema.gif" data-src="/system/gif/yuema.gif" alt="" @click="sendMessage('IMAGE', $event)">
                                              <p>[约吗]</p>
                                          </li>
                                           <li>
                                              <img src="../images/gif/zaijian.gif" data-src="/system/gif/zaijian.gif" alt="" @click="sendMessage('IMAGE', $event)">
                                              <p>[再见]</p>
                                          </li>
                                           <li>
                                              <img src="../images/gif/zaima.gif" data-src="/system/gif/zaima.gif" alt="" @click="sendMessage('IMAGE', $event)">
                                              <p>[在吗]</p>
                                          </li>
                                           <li>
                                              <img src="../images/gif/zhenjing.gif" data-src="/system/gif/zhenjing.gif" alt="" @click="sendMessage('IMAGE', $event)">
                                              <p>[正经]</p>
                                          </li>

                                      </ul>
                                </div>
                            </div>
                            <a href="javascript:;">
                                <input type="file" @change="sendFile"/>
                            </a>
                        </div>
                      <!--内容输入区域-->
                      <div class="edit-area">
                          <textarea name="" ref="textErea" v-model="text">请输入想要咨询的问题</textarea>
                      </div>
                      <!--发送按钮-->
                      <div class="send-btn">
                              <button @click="sendMessage('TEXT', $event)">发送</button>
                      </div>
                    </div>
                </div>
              <!-- 右边经销商详情-->
                <div class="room-right">
                    <!--经销商-->
                    <div class="right-dealer">
                        <h3><a :href="hostname2+'/dealerhome?dealerCode='+currentSession.contact.username.toUpperCase()" target="_blank">{{currentSession.contact.nickname}}</a></h3>
                        <div class="gold"></div>
                          <!--商家评分-->
                          <div class="grade-wrapper">
                              <div>商家评分：</div>
                              <div class="star-container left">
                                  <div class="grey-star">
                                    <span v-for="num in 5" :key="num"></span>
                                  </div>
                                  <div :style="'width:' + currentSession.contact.score*85/5 + 'px'" class="star-overflow">
                                    <div class="red-star">
                                      <span v-for="num in 5" :key="num"></span>
                                    </div>

                                  </div>
                              </div>
                          </div>
                          <!--在售车辆-->
                          <div class="dealer-car">
                              <dl class="selling-num">
                                  <dt><a :href="hostname2+'/dealerhome?dealerCode='+currentSession.contact.username.toUpperCase()+'&type=car'" target="_blank">{{currentSession.contact.sellNum}}</a>辆</dt>
                                  <dd>在售车量
                                  </dd>
                              </dl>
                              <dl class="activity-num">
                                  <dt><a :href="hostname2+'/dealerhome?dealerCode='+currentSession.contact.username.toUpperCase()+'&type=act'" target="_blank">{{currentSession.contact.activetyNum}}</a>个</dt>
                                  <dd>店铺活动
                                  </dd>
                              </dl>
                          </div>
                    </div>
                    <!--热门活动-->
                    <div class="right-activity">
                        <h3>当前店铺没有热门活动</h3>
                        <a :href="hostname2+'/dealerhome?dealerCode='+currentSession.contact.username.toUpperCase()+'&type=act'" target="_blank">点击查看更多 <img src="../images/sanjiao_s.png"></a>
                    </div>
                    <!-- 投诉按钮-->
                    <div class="complain">投诉此店铺</div>
                </div>
            </div>
            <!-- 遮罩层 -->
            <div class="mask" v-show="isShowBig">
                <div class="img-wrapper">
                    <i @click="isShowBig=false">X</i>
                    <img :src="bigImgSrc" >
                </div>
            </div>
        </div>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import * as types from '../store/mutation-types';
import socket from '../api/io'
import config from '../config'
import store from '../store'
var timer = null
export default {
   data(){
       return{
         hostname: config.hostname,
         pointer:'pointer',
         faceClicked:false,
         currentIndex:1,
         text:'',
         hostname2:config.hostname2,
         bigImgSrc:'',
         isShowBig:false
       }
   },
   computed:{
       ...mapGetters({
            userName:'userName',
            messages:'currentMessages',
            userImg: 'userImg',
            currentSession:'currentSession',
            currentSessionId:'currentSessionId'
        }),
        currentMessages(){
          let _messages = this.messages
            .slice()
            .sort((a, b) => a.timestamp - b.timestamp)
          for(let i = 0;i<_messages.length-1;i++){
            if((_messages[i+1].timestamp-_messages[i].timestamp)>3600000){
              _messages[i].hasLine = true;
            }
          }
           return _messages
        }
    },
    filters:{
        timeTranslate(val){
            let date = new Date(val);
            let format = 'yyyy-MM-dd hh:mm:ss'
            let o = {
		            "M+" : date.getMonth()+1, //month
		            "d+" : date.getDate(),    //day
		            "h+" : date.getHours(),   //hour
		            "m+" : date.getMinutes(), //minute
		            "s+" : date.getSeconds(), //second
		            "q+" : Math.floor((date.getMonth()+3)/3),  //quarter
		            "S" : date.getMilliseconds() //millisecond
		        }
		        if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
		                (date.getFullYear()+"").substr(4- RegExp.$1.length));
		        for(var k in o)if(new RegExp("("+ k +")").test(format))
		            format = format.replace(RegExp.$1,RegExp.$1.length==1? o[k] :("00"+ o[k]).substr((""+ o[k]).length));
		        return format;
        }
    },
    methods:{
      showBig(src){
        this.bigImgSrc = src;
        this.isShowBig = true;
      },
       sendMessage(type,e){
           let fromId=this.userName;
           let toId=this.currentSession.contact.username;
           let sessionId=this.currentSessionId;
           let content;
           switch(type){
             case 'TEXT':
                 content=this.text;
                 if(content.trim()){
                  socket.emit('send_message', {
                  sessionId:sessionId,
                  from: fromId,
                  to: toId,
                  content: content,
                  type:'TEXT',
                  timestamp: Date.now()
                  });
                  this.text='';
                 }
                  break;
            case 'IMAGE':
                 content=e.target.getAttribute('data-src');
                 socket.emit('send_message', {
                    sessionId:sessionId,
                    from: fromId,
                    to: toId,
                    content: content,
                    type:'IMAGE',
                    timestamp: Date.now()
                 });
           }

       },
       sendFile(e){
         var formData = new FormData();
         var file=e.target.files[0];
         console.log(file)
         formData.append('file', file);
         const size=file.size/1024/1024;
         if(size<10){
            fetch(`${config.hostname}/file`,{
           method:"POST",
           body:formData
         }).then(res => res.json()).then(res =>{
              if(res.status=='5'){
                alert(`上传失败${res.message}`)
                return;
              }else{
                  let fromId=this.userName;
                  let toId=this.currentSession.contact.username;
                  console.log(toId)
                  let sessionId=this.currentSessionId;
                  let content=res.data.filePath;
                  socket.emit('send_message', {
                          sessionId:sessionId,
                          from: fromId,
                          to: toId,
                          meta:{
                            name:file.name,
                            size:file.size
                          },
                          content: content,
                          type:'FILE',
                          timestamp: Date.now()
                  });
              }
           })
         }else{
           alert('发送失败，文件大小不能超过10M')
         }
       },
       getMore(session){
          console.log(session)
          session.pager.currentPage--;
          this.$store.dispatch('getMore',session)
       }
    },
    watch: {
      'currentSession.latestMessage':function(){
          let _this = this;
          let message = this.currentSession.latestMessage
          clearTimeout(timer);
          this.$nextTick(() => {
            const div = this.$refs.list
            div.scrollTop = div.scrollHeight
            if(message.from == this.userName){
               timer = setTimeout(function(){
                    store.commit(types.FIVE_MINUTES,message)
               },300000)
            }

          })
      }
    }
}
</script>
<style  lang="less" scoped>
    #chatRoom{
        position: relative;
        float:right;
        width:859px;
        height:100%;
        .mask{
            position: fixed;
            z-index: 999;
            top:0;
            left: 0;
            width:100%;
            height:100%;
            background-color: rgba(0,0,0,.6);
            i{
              position: absolute;
              right: 0;
              top:0;
              padding:6px;
              cursor: pointer;
            }
            .img-wrapper{
              position: absolute;
              left:50%;
              top:50%;
              transform: translate(-50%,-50%);
              max-height:80%;
              max-width: 90%;
              border-radius: 14px;
              text-align: center;
              padding:30px;
              overflow-x: auto;
              overflow-y: auto;
              background-color: #fff;

          }
        }
        .title{
            position: absolute;
            top:0;
            left:0;
            width:100%;
            box-sizing: border-box;
            padding-left: 34px;
            height: 55px;
            line-height: 55px;
            background-color: #000;
            color:#fff;
            >div.left{
                 float:left;
                 width:70%;
                 box-sizing: border-box;
                 padding-left: 4px;
                 font-size:18px;
                 &::before{
                     content:'';
                     display: inline-block;
                     width:10px;
                     height: 10px;
                     border-radius: 50%;
                     background-color: #666;
                 }
            }
            >div.online{
                &::before{
                  background-color: #cd0138;
                }
            }
            >div.right{
                float:right;
                width:30%;
                box-sizing: border-box;
                padding-right: 20px;
                font-size:14px;
                text-align: right;
                img{
                    vertical-align: middle;
                }
                span{
                    display: inline-block;
                    vertical-align: middle;
                }
            }
        }
        .no-choose{
          width:100%;
          height: 100%;
          text-align:center;
          line-height:30px;
          background:#f5f5f5;
        }
    }
    .room-wrapper{
        position:absolute;
        top:55px;
        bottom:0;
        left:0;
        width:859px;
        .room-left{
            position:relative;
            float:left;
            box-sizing: border-box;
            width:561px;
            height:100%;
            border-right:1px solid #e6e6e6;
        }
        .room-right{
            position:relative;
            float: left;
            box-sizing: border-box;
            width:298px;
            height: 100%;
            border-left:1px solid #e6e6e6;
            border-right:2px solid #e6e6e6;
        }
    }
     //聊天显示框
    .chat-room{
        position:absolute;
        box-sizing: border-box;
        top:0;
        bottom:170px;
        left:0;
        width:100%;
        padding-bottom: 20px;
        overflow: auto;
        border-bottom:1px solid #e6e6e6;
        >.hint{
            margin:18px auto 0 auto;
            text-align: center;
            font-size:12px;
            color:#aaa;
        }
    }
    //聊天内容
    .chat-list{
        padding:0 15px 20px 15px;
        >li{
            position: relative;
            margin-top:20px;
             .file-wrapper{
                       >div{
                         display:table-cell;
                         vertical-align: top;
                         i{
                           display: block;
                           width:76px;
                           height: 76px;
                           background: url(../images/file-type.png) no-repeat;
                           &.icon-pdf{
                             background-position: -228px -246px;
                           }
                           &.icon-docx{
                             background-position: -76px -246px;
                           }
                           &.icon-txt{
                             background-position: 0 -322px;
                           }
                           &.icon-xlsx{
                             background-position: -152px -246px;
                           }
                           &.icon-pptx{
                             background-position: 0 -246px;
                           }
                           &.icon-defaut{
                             background-position: -346px -152px;
                           }
                         }
                         &.cont{
                            padding-left:10px;
                            .file_title{
                              text-overflow: -o-ellipsis-lastline;
                              overflow: hidden;
                              text-overflow: ellipsis;
                              display: -webkit-box;
                              -webkit-line-clamp: 2;
                              -webkit-box-orient: vertical;
                              font-size:14px;
                              margin-bottom:10px;
                            }
                            a{
                              text-decoration: none;
                              font-size:14px;
                            }
                         }

                       }
                    }
            .head-img{
                 img{
                    width:48px;
                    height: 48px;
                    border-radius:50%;
                 }
            }
            &.li-right{
                >div{
                    float:right;
                    img{
                        max-width:150px;
                        max-height:100px;
                    }
                }
                >.what-say{
                    position: relative;
                    box-sizing: border-box;
                    max-width: 258px;
                    margin-top: 8px;
                    margin-right: 18px;
                    padding: 8px;
                    border-radius:10px;
                    text-align: justify;
                    background-color: #9be354;
                    font-size: 14px;
                    word-break: break-all;
                    line-height: 1.4;
                    color:#333;
                    &::after{
                        content:' ';
                        position: absolute;
                        right:-9px;
                        top:12px;
                        width:0;
                        height: 0;
                        border-top: 7px solid transparent;
                        border-left: 10px solid #9be354;
                        border-bottom: 7px solid transparent;
                    }
                    .file-img{
                      cursor: pointer;
                    }


                }
            }
            &.li-left{
                >div{
                    float:left;
                    img{
                        max-width:150px;
                        max-height:100px;
                    }
                }
                >.what-say{
                    position: relative;
                    box-sizing: border-box;
                    max-width: 258px;
                    margin-top: 8px;
                    margin-left: 18px;
                    padding: 10px;
                    border-radius:10px;
                    text-align: justify;
                    background-color: #ececec;
                    font-size: 14px;
                    word-break: break-all;
                    line-height: 1.4;
                    color:#333;
                    &::after{
                        content:' ';
                        position:absolute;
                        left:-10px;
                        top:14px;
                        width:0;
                        height: 0;
                        border-top: 7px solid transparent;
                        border-right: 10px solid #ececec;
                        border-bottom: 7px solid transparent;
                    }
                }
            }
            .over-line{
              width:100%;
              position: relative;
              margin:14px 0;
              height: 1px;
              background-color: rgba(204, 204, 204, .6);
              span{
                  position: absolute;
                  padding: 8px;
                  left: 50%;
                  transform: translate(-50%,-50%);
                  background-color: #fff;
                  font-size:12px;
                  line-height: 1;
                  color: #a2a2a2;
              }
            }
            &::after{
              content:'';
              display: table;
              clear: both;
              height: 0;
              width:0;
            }
        }
    }
    //输入栏
    .chat-input{
        position:absolute;
        bottom:0;
        box-sizing: border-box;
        width:100%;
        height:170px;
        border-top:1px solid #e6e6e6;
        padding-left: 22px;
        >.face{
            box-sizing: border-box;
            padding-top: 8px;
            >a{
                position:relative;
                display:inline-block;
                 box-sizing: border-box;
                width:26px;
                height:26px;
                background: url('../images/picture.png') no-repeat center center;
                cursor: pointer;
                overflow: hidden;
                vertical-align: middle;
                input {
                    position:absolute;
                    right:0;
                    top:0;
                    z-index:1;
                    opacity: 0;
                    filter: alpha(opacity=0);

                }
            }
            >div{
                position:relative;
                display:inline-block;
                 box-sizing: border-box;
                margin-right:14px;
                cursor: pointer;
            }
            .gif-images{
                position:absolute;
                box-sizing: border-box;
                top:-196px;
                left:-10px;
                width:434px;
                height:186px;
                background-color:#fff;
                border:1px solid #dedede;
                >ul{
                    width:100%;
                    height:186px;
                    overflow:auto;
                    >li{
                        float:left;
                        margin-left:10px;
                        img{
                            width:60px;
                        }
                        p{
                          text-align: center;
                          font-size:14px;
                        }
                    }
                }
                &:before{
                    content:'';
                    position:absolute;
                    z-index:2;
                    left:13px;
                    top:100%;
                    border:8px solid transparent;
                    border-top-color:#cfcfcf;
                }
                &::after{
                    content:'';
                    position:absolute;
                    margin-top:-1px;
                    z-index:3;
                    top:100%;
                    left:13px;
                    width:0;
                    height: 0;
                    border: 8px solid transparent;
                    border-top-color: #fff;
                }
            }
        }
        >.edit-area{
            width:100%;
            height:80px;
            box-sizing: border-box;
            padding-right:12px;
            padding-top:8px;
            textarea{
                width:100%;
                height:80px;
                border:none;
                outline:none;
                font-size:14px;
                line-height:18px;
            }
        }
        >.send-btn{
            text-align:right;
            >button{
                display:inline-block;
                border:none;
                outline: none;
                cursor: pointer;
                width:92px;
                line-height:30px;
                margin:10px 10px 0 0;
                text-align:center;
                color:#fff;
                background:#000;
            }
        }
    }
    //右边经销商详情
    .room-right{
        >.right-dealer{
            border-bottom:1px solid #e6e6e6;
            text-align:center;
           >h3{
                max-width:240px;
                margin:20px auto;
                overflow:hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
                &:hover{
                  color:#c03;
                  a{
                    color:#c03;
                  }
                }
                a{
                     font-size:18px;
                     color:#000;
                }
            }
            >.gold{
                width:20px;
                height:27px;
                margin:20px auto;
                background:url('../images/gold.png') no-repeat;
            }
            //商家评分
            .grade-wrapper{
                width:180px;
                line-height: 24px;
                margin:-4px auto 15px auto;
                overflow:hidden;
                font-size:16px;
                color:#333;
                >div{
                    display:inline-block;
                    box-sizing: border-box;
                    vertical-align: middle;
                    &:first-child{
                        margin-right:4px;
                    }
                }
            }
            //五星评论
            .star-container{
                position: relative;
                width:85px;
                .grey-star{
                    position: absolute;
                    width:85px;
                    left:0;
                    span{
                        display: inline-block;
                        width:14px;
                        height:14px;
                        margin-right: 3px;
                        background: url(../images/rate-grey.png) no-repeat center center;
                    }
                }
                .star-overflow{
                    position: relative;
                    overflow: hidden;
                    height:24px;

                }
                .red-star{
                    position: absolute;
                    width:85px;
                    left:0;
                    span{
                        display: inline-block;
                        width:14px;
                        height:13px;
                        margin-right: 3px;
                        background: url(../images/rate-red.png) no-repeat;
                    }
	            }
            }


        }
        >.complain{
            position:absolute;
            bottom:0;
            left:0;
            width:100%;
            line-height:42px;
            text-align:center;
            background:#e5e5e5;
            font-size:16px;
            color:#666;
        }
    }
     //在售车辆
    .dealer-car{
        width:168px;
        overflow:hidden;
        margin:15px auto;
        >dl{
            float:left;
            box-sizing: border-box;
            text-align:center;
            width:84px;
            dt{
                margin-bottom:6px;
                font-size:20px;
                line-height:30px;
                font-weight:600;

                a{
                    color:#c03;
                    margin-right:6px;
                }
            }
            dd{
                font-size:14px;
                line-height:1;
            }
        }
        >.selling-num{
             border-right:1px solid #e6e6e6;
        }
        >.activity-num{
            border-left:1px solid #e6e6e6;
        }
    }
    //热门活动
    .right-activity{
        padding-left: 20px;
        h3{
            margin-top:25px;
            margin-bottom:38px;
            font-size:18px;
            line-height:30px;
            font-weight:700;
            color:#000;
        }
        >a{
          color:#cd0138;
          img{
            vertical-align: middle;
          }
        }
    }
</style>


