<template>
  <div>
      <div v-if="visible">
  			<div id="wrap">
          <div id="product">
             <!-- <img id="pic" v-bind:src="pic">-->
              <div id="infobox">
                  <div class="info"><span class="title">订单状态</span>{{status}}</div>
                  <div class="info"><span class="title">承运公司</span>{{shipname}}</div>
                  <div class="info"><span class="title">运单编号</span>{{shipcode}}</div>
                  <div class="info"><span class="title">商品数目</span>{{num}}</div>
              </div>
          </div>
          <!--时间线S-->
          <div id="detail-wrap">
              <div class="news" v-for="(item, index) in ship_list" :key="index">
                  <span class="timeicon" v-bind:class="[{ select: index==0 }]"></span>
                  <div class="content-wrap">
                      <div class="ship-content" v-bind:class="[{ ship_act: index==0 }]">{{item.content}}</div>
                      <div class="ship-time current">{{item.time}}</div>
                  </div>
              </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pic: '', //商品图片
      status: '', //物流状态
      shipname: '', //承运公司
      shipcode: '', //运单编号
      num: '', //商品数目
      order_id: '', //订单id
      ship_list: '' //物流信息记录列表
    }
  },
  computed: {
    visible() {
      return ['/set/logistics'].indexOf(this.$route.path) > -1
    }
  },
  created() {
    this.setTitle('物流详情')
    this.weixin_init()
    this.order_id = this.$route.query.id
    this.get_ship()
  },
  methods: {
    getStatus(index) {
      switch (index) {
        case '-1':
          this.status = '待出库'
          break
        case '110':
          this.status = '已出库'
          break
        case '111':
          this.status = '配送中'
          break
        case '112':
          this.status = '已完成'
          break
      }
    },
    get_ship() {
      this.$http
        .post('order/confirm_goods_received.do', {
          orderNo: this.$route.query.id
        })
        .then(res => {})
    }
  }
}
</script>
<style scoped lang="less">
@import '../../styles/index.less';
#view {
  width: 100%;
  height: 100%;
  > div {
    width: 100%;
    height: 100%;
    background: #f5f8fb;
  }
}
#product {
  clear: both;
  overflow: hidden;
  width: 100%;
  margin: 0 auto;
  text-align: left;
  .pxrem(height,156);
  .pxrem(padding-left, 12);
  /*.px2rem(padding-top, 23);
    .px2rem(padding-bottom, 23);*/
  background: #fff;
}
#pic {
  .px2rem(width, 180);
  .px2rem(height, 180);
  float: left;
}
#infobox {
  width: 100%;
  display: inline-block;
  font-size: 14px;
}

.news {
  .pxrem(min-height, 78);
  .pxrem(margin-left, 20);
  border-left: 1px dashed #efefef;
}
.new:first-child {
  .pxrem(margin-top,20);
}
.news:last-child {
  .pxrem(min-height, 58);
  border: 0;
}
.news:last-child .content-wrap {
  border: 0;
}
.timeicon {
  width: 10px;
  height: 10px;
  /*.px2rem(width, 20);
    .px2rem(height, 20);*/
  // .pxrem(margin-top,4);
  background: #e9f0f4;
  border-radius: 50%;
  display: block;
  //.px2rem(margin-top, 65);
  .px2rem(margin-left, -10);
  position: absolute;
}
.timeicon.select {
  width: 16px;
  height: 16px;
  //.pxrem(margin-top,4);
  //.px2rem(margin-top, 65);
  .pxrem(margin-left, -9);
  background: url('../../assets/h5_my_icon_logistics_new@2x.png') no-repeat;
  background-size: 100% auto;
}
#wrap {
  background: #f5f8fb;
  overflow: hidden;
}
#detail-wrap {
  background: #fff;
  .px2rem(margin-top, 20);
  .pxrem(padding-top,20);
  overflow-y: scroll;
  font-size: 15px;
  color: #798196;
  margin-bottom: 10%;
}

.info {
  //.px2rem(height, 65);
  //.px2rem(line-height, 65);
  .pxrem(margin-top,15);
  font-size: 14px;
  color: #272728;
  letter-spacing: 0;
  line-height: 16px;
}
.info:first-child {
  .pxrem(margin-top,24);
}
.ship-content {
  font-size: 13px;
  color: #46494d;
  .px2rem(line-height, 40);
}
.ship_act {
  font-size: 14px;
  color: #ff6532;
  line-height: 16px;
}
.ship-time {
  font-size: 12px;
  color: #838388;
  .pxrem(margin,7, 0, 18, 0);
  //.px2rem(bottom, 10);
  /*position: absolute;*/
}
.content-wrap {
  .pxrem(width,319);
  border-bottom: 1px solid #efefef;
  .px2rem(margin-left, 45);
  height: 100%;
  position: relative;
}
.title {
  font-size: 14px;
  .pxrem(margin-right,24);
  color: #838388;
  letter-spacing: 0;
  line-height: 16px;
}
</style>
