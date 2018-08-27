<template>
<!-- 联系人列表 -->
  <div id="concat_list">
      <h3>最近联系的经销商</h3>
      <ul>
                <li v-for="item in sessions" :key="item._id" :class="{active:item.sessionId==currentSessionId}" @click="switchSession(item)">
                    <div>
                        <img :src="hostname+item.contact.avatar">
                         <i v-if="item.unReadNum > 0 ">{{item.unReadNum}}</i>
                         <i v-if="item.unReadNum>99" class="more">...</i>
                         <!-- <i>1</i> -->
                    </div>
                    <span>{{item.contact.nickname}}</span>

                </li>
      </ul>
  </div>
</template>
<script>
import socket from '../api/io';
import {mapState,mapGetters, mapActions} from 'vuex';
import config from '../config'
export default {
  data(){
      return{
        hostname:config.hostname
      }
  },
  computed:{
       ...mapGetters({
            sessions:'sessions',
            currentSessionId: 'currentSessionId'
        }),
        ...mapState([
          'user'
        ])
  },
  mounted(){

  },
  methods:{
     switchSession(id){
         this.$store.dispatch('switchSession', id);
     }
  }
}
</script>
<style lang="less" scoped>
@import url('../common/variable.less');
    #concat_list{
        position:relative;
        float:left;
        width:210px;
        height: 100%;
        background-color: @concat-list-bg;
        >h3{
            line-height:55px;
            background-color: #d6d6d6;
            text-align: center;
            font-size:16px;
            font-weight:600;
            color:#000;
        }
        >ul{
            position:absolute;
            width:100%;
            top:55px;
            left:0;
            bottom:0;
            overflow:auto;
            padding-left: 2px;
            box-sizing: border-box;
            li{
               box-sizing: border-box;
                padding-left: 25px;
                height:67px;
                line-height: 67px;
                border-bottom:1px solid #ddd;
                font-size:0;
                color:#333;
                cursor: pointer;
                &:hover{
                    background-color: #dedede;
                }
                >div{
                    position: relative;
                    display:inline-block;
                    box-sizing: border-box;
                    width:37px;
                    height: 37px;
                    border-radius: 50%;
                    margin-right:15px;
                     i{
                        position: absolute;
                        top:5px;
                        width:16px;
                        height:16px;
                        line-height: 16px;
                        text-align: center;
                        font-size:10px;
                        border-radius:50%;
                        background-color: #e62e2e;
                        color:#fff;
                        &.more{
                          line-height: 10px;
                        }
                     }
                }
                img{
                    width:37px;
                    height: 37px;
                    border-radius: 50%;
                    vertical-align: middle;
                }
                span{
                    display:inline-block;
                    vertical-align: middle;
                    width:60px;
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                    font-size:14px;
                }
                &.active{
                    position: relative;
                    background-color: #fff;
                    color:#cc0033;
                    &::after{
                        position: absolute;
                        right:26px;
                        top:50%;
                        transform:translateY(-50%);
                        content:'';
                        width:8px;
                        height: 11px;
                        background: url('../images/service-active.png');
                    }
                }
            }

        }

    }

</style>


