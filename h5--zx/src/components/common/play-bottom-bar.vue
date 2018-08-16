<template>
  <div class="play-bottom-bar">
    <ul>
      <li @click="input">
        <i class="icon-note"></i>
        <span>笔记</span>
      </li>
      <li v-if="list && list.length>0" @click="isShowList=true">
        <i class="icon-list"></i>
        <span>列表</span>
      </li>
      <li @click="$emit('details')">
        <i class="icon-details"></i>
        <span>详情</span>
      </li>
      <li @click="$emit('share')">
        <i class="icon-share-b"></i>
        <span>分享</span>
      </li>
    </ul>
    <popup v-model="inputing" class="input-box">
      <group gutter="0">
        <div class="button-bar">
          <a @click="inputing=false">取消</a>
          <a :class="'btn-send' + (msg ? ' active' : '')" @click="send">发送</a>
        </div>
        <x-textarea ref="textarea" v-model="msg" placeholder="说点什么呢…" :max="140" :height="156" :show-counter="false"></x-textarea>
      </group>
    </popup>
  </div>
</template>
<script>
  import { Popup, Group, XTextarea } from 'vux'
  export default {
    name: 'play-bottom-bar',
    components: {
      Popup,
      Group,
      XTextarea
    },
    props: ['isBought', 'list'],
    data() {
      return {
        inputing: false,
        isShowList: false,
        msg: ''
      }
    },
    methods: {
      input() {
        if (this.isBought == 1) {
          this.inputing = true
          this.$nextTick(() => {
            this.$refs.textarea.focus();
          })
        } else {
          this.$vux.toast.show({
            type: 'text',
            text: '购买课程后才可记录笔记'
          })
        }
      },
      send() {
        let content = this.msg
        if (content != '') {
          this.$emit('send', (isSeries) => {
            return this.$http.post(`sharing-server-course/course/comment/new/${this.$route.params.id}`, {
              content,
              is_series: isSeries || 0
            }).then(() => {
              this.msg = ''
              this.inputing = false
              var user = JSON.parse(sessionStorage.getItem('ZX_H5_USER')) || {}
              var comment = {
                content,
                create_time: Date.parse(new Date()),
                user_info: {
                  avatar_address: user.avatar_address,
                  nick_name: user.nick_name
                }
              }
              return comment
            })
          })
        }
      }
    }
  }

</script>
<style lang="less">
  .play-bottom-bar {
    ul {
      position: fixed;
      bottom: 0;
      width: 100%;
      background: #FFFFFF;
      box-shadow: 0 -2px 10px 0 rgba(0, 0, 0, 0.04);
      display: flex;
      justify-content: space-around;
      align-items: center;
      >li {
        padding: 10px 15px;
        font-size: 11px;
        color: #666666;
        text-align: center;
        >i {
          display: block;
          margin: 0 auto 6px auto;
        }
      }
    }
  }
  .input-box {
    .vux-x-textarea.weui-cell {
      padding: 0 15px;
      &:before {
        border: none;
      }
    }
    textarea {
      font-size: 14px;
      color: #393D42;
    }
    .button-bar {
      overflow: hidden;
    }
    a {
      position: relative;
      float: left;
      display: block;
      padding: 12px;

      font-size: 15px;
      color: #80848A;
      text-align: center;
    }
    .btn-send {
      float: right;
      color: #cacaca;
      &.active {
        color: #FE5252;
      }
    }
  }

</style>
