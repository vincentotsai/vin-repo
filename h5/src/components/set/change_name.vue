<template>
  <div>
    <input type="text" placeholder="用户昵称" v-model.trim="userName" ref="type" maxlength="9" id="name_input" />
    <i v-on:click="clear"></i>
    <button v-on:click="save">保存修改</button>
  </div>
</template>
<script>
export default {
  name: 'change-name',
  data() {
    return {
      userName: ''
    }
  },
  created() {
    this.userName = this.userData.nickName //from vue prototype
  },
  methods: {
    save() {
      if (this.userName.length < 1) {
        this.showToast('昵称不能为空')
      } else if (this.userName.length > 9) {
        this.showToast('昵称最多为9个字符')
      } else {
        this.change_name()
      }
    },
    change_name() {
      this.$http
        .post('/uc/modifying_user_information.do', { nickName: this.userName })
        .then(res => {
          this.userData.nickName = this.userName
          this.$router.push({
            name: 'set'
          })
        })
    },
    clear() {
      this.userName = ''
    }
  }
}
</script>

<style scoped lang="less">
@import '../../styles/index.less';
input,
button {
  outline: none;
}
#view-content {
  height: 100%;
  position: absolute;
  z-index: 2;
  background: #f5f8f9;
}
input {
  font-size: 14px;
  color: #1b1b1b;
  width: 100%;
  height: 50px;
  .pxrem(text-indent,12);
  padding: 16px 0;
  position: absolute;
  top: 0;
}
i {
  position: absolute;
  .pxrem(width, 12);
  .pxrem(height, 12);
  .pxrem(right, 12);
  .pxrem(top, 18);
  background: url(../../assets/h5_icon_shuruk_cancle.png) no-repeat left top;
  background-size: cover;
}
button {
  display: block;
  width: 265px;
  height: 40px;
  line-height: 40px;
  background: linear-gradient(-196deg, #ff8996 0%, #fc6655 100%);
  box-shadow: 0 4px 13px 0 rgba(255, 151, 69, 0.44);
  border-radius: 51px;
  font-size: 15px;
  color: #ffffff;
  letter-spacing: 0;
  margin: 100px auto;
}
</style>
