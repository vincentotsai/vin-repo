<template>
  <!-- 无内容 -->
  <div class="no-content" :style="{background: bgcolor, 'margin-top': mt}">
    <div class="box" :style="{height: h,'padding-top': pt}">
      <i class="pic"></i>
      <!-- <img class="pic" :src="bgUrl"> -->
      <div class="txt">{{desc}}</div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    h: String,
    pt: String,
    bgUrl: {
      type: String,
      default: '../../assets/image_tjspxxh.png'
    },
    desc: {
      type: String,
      default: '此页面暂无内容~'
    },
    bgcolor: String,
    mt: String
  }
}
</script>
<style lang="less" scoped>
.no-content {
  font-size: 13px;
  background-color: #fafafa;
  width: 100%;
  .box {
    height: 356px;
    width: 100%;
    margin: auto;
    padding-top: 200px;
    text-align: center;
    .pic {
      display: block;
      width: 169px;
      height: 123px;
      margin: auto;
      background: url('../../assets/empty/nogoods.png') no-repeat;
      background-size: cover;
      background-position: center;
    }
    .txt {
      font-size: 14px;
      color: #c7cbcd;
      margin-top: 26px;
    }
  }
}
</style>

