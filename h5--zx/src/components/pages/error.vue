<template>
  <section class="error-stage">
    <div class="img" v-if="$route.meta.type=='404'">
      <img src="../../assets/error/pic_404.png">
      <span>服务器出错，正在修复...</span>
    </div>
    <div class="img" v-if="$route.meta.type=='500'">
      <img src="../../assets/error/pic_500.png">
      <span>当前网络不好，重新加载</span>
    </div>
  </section>
</template>
<script>
export default {
  name: 'error'
}
</script>
<style lang="less" scoped>
.error-stage {
  position: absolute;
  height: 100%;
  width: 100%;
  .img {
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);

    width: 180px;
    height: 133px;

    font-size: 15px;
    color: #A7A5A6;
    img {
      display: block;
      width: 100%;
      height: 100%;
      margin-bottom: 21px;
    }
  }
}
</style>

