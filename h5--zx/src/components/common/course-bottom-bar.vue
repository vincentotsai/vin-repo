<template>
  <ul class="course-bottom-bar vux-1px-t">
    <li class="btn-join" @click="join">
      <span>{{textMapping[status]}}</span>
      <span v-if="status == 0"> {{price | moneyFormat}}</span>
    </li>
    <li @click="share">
      <i class="icon-share-black"></i>
      <span>分享</span>
    </li>
    <router-link tag="li" to="/my">
      <i class="icon-my-black"></i>
      <span>我的</span>
    </router-link>
    <router-link tag="li" to="/shop">
      <i class="icon-shop-black"></i>
      <span>店铺</span>
    </router-link>
  </ul>
</template>
<script>
  export default {
    name: 'course-bottom-bar',
    props: ['shareUrl', 'status', 'price'],
    data() {
      return {
        textMapping: ['付费加入', '免费加入', '进入课程']
      }
    },
    methods: {
      join() {
        let id = this.$route.params.id
        let status = this.status
        if(status == 0) {
          this.$wx.pay(id, () => {
            this.$emit('btn-handler')
          })
        } else if(status == 1) {
          this.$http.post('sharing-server-course/course/free/join', {
            course_id: id
          }).then(() => {
            this.$emit('btn-handler')
          })
        } else {
          this.$emit('btn-handler')
        }
      },
      share() {
        this.$root.$emit('show-share-card', this.shareUrl)
      }
    }
  }

</script>
<style lang="less" scoped>
  .course-bottom-bar {
    position: fixed;
    bottom: 0;
    width: 100%;
    display: flex;
    &:before {
      border-color: #F4F3F3;
    }
    .btn-join {
      flex: 3;
      background: #FE5252;
      height: 46px;
      line-height: 46px;
      font-size: 16px;
      color: #FFFFFF;
      >span {
        display: inline;
        margin: 0;
      }
    }
    >li {
      flex: 1;
      text-align: center;
      background: #fff;
      font-size: 11px;
      color: #393D42;
      line-height: 14px;
      >i {
        margin-top: 7px;
      }
      >span {
        margin-top: 5px;
        display: block;
      }
    }
  }

</style>
