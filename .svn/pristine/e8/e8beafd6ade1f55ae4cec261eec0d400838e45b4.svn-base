<template>
<!-- 聊天大容器 -->
  <div id="chat">
    <contactList></contactList>
    <chatRoom></chatRoom>
  </div>
</template>
<script>
import contactList from 'components/contact-list.vue';
import chatRoom from 'components/chat-room.vue';
import {mapState,mapGetters, mapActions} from 'vuex';
export default {
  data(){
    return {
      params:{}
    }
  },
  created(){
    this.getParams()
  },
  mounted(){
    this.log()
  },
  components:{
    contactList,
    chatRoom
  },
  methods:{
    getParams(){
       var url = location.search;
       if(url.indexOf("?") != -1) {
              var strs = url.substr(1).split("&");
              for(var i = 0; i < strs.length; i ++) {
                  this.params[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
              }
       }
    },
     log(){
        var _this = this;
        this.$store.dispatch('log',{
            user:{
              username: _this.params.customer,
              password: "000000"
            },
            contactName:_this.params.dealer.toLowerCase()
          })
      }
  }
}
</script>
<style lang="less" scoped>
  #chat{
    position:relative;
    box-sizing: border-box;
    width:1070px;
    height:100%;
    min-height: 700px;
    max-height:900px;
    margin:0 auto;
    border:1px solid #ddd;
    border-right:none;
  }
</style>



