<template>
  <div class="page" v-if="Object.keys(deliver).length">
    <div class="goods">
      <img v-if="deliver.coverImage" :src="deliver.coverImage+imageSize(70,70,2)" @error="setErrorImg($event,70,70)">
      <div class="cover" v-if="deliver.goodsCountTotal">共{{deliver.goodsCountTotal}}件商品</div>
      <div class="fr">
        <p class="goods-name ellipse">{{deliver.goodsName}}</p>
        <p class="status" v-if="deliver.deliverStatus">{{deliver.deliverStatus ? "物流状态："+deliver.deliverStatus : "暂无订单信息"}}</p>
        <p class="deliver-info" v-if="deliver.logisCompanyName" >
          {{deliver.logisCompanyName}}：{{deliver.logisNo}}
          <span class="copy" v-if="!isAndroid" v-clipboard:copy="deliver.logisNo" v-clipboard:success="onCopyOk" v-clipboard:error="onCopyError">复制</span>
        </p>
      </div>
    </div>
    <div class="infos">
      <div class="info" v-for="(item,index) in deliver.list" :key="index">
         <p :class="[{ active: index==0 }]" class="desc">{{item.logisInfo}}</p>
         <p :class="[{ active: index==0 }]" class="time">{{item.dealTime}}</p>
         <div class="disc"></div>
         <div class="first" v-if="index==0"></div>
         <div class="last" v-if="index == deliver.list.length-1"></div>
         <img v-if="index==0" src="../../assets/user_icon_wuliu_kuaidi@2x.png" alt="">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      deliver: {},
      deliverNo: this.$route.query.deliverNo
    }
  },
  created() {
    this.getDetail()
  },
  methods: {
    getDetail() {
      let params = {
        orderNo: this.$route.query.id,
        deliverNo: this.deliverNo
      }
      this.$http.get('order/get_logis_info.do', { params }).then(res => {
        this.deliver = res.data
      })
    },
    onCopyOk(e) {
      this.showToast('运单编号已复制到您的粘贴板中')
    },
    onCopyError(e) {
      this.showToast('复制失败')
    }
  }
}
</script>

<style scoped lang="less">
@import '../../styles/index.less';
.page {
  background: #fafafa;
}
.goods {
  padding: 32px 12px 30px;
  overflow: hidden;
  margin-bottom: 5px;
  background: #fff;
  img {
    float: left;
    width: 50px;
    height: 50px;
  }
  .cover {
    background:rgba(3, 3, 3, 0.5);
    color: white;
    font-size: 12px;
    float: left;
    position: relative;
    top: 50px;
    left: -50px;
  }
  .fr {
    float: left;
    margin-left: 12px;
    .goods-name {
      font-size: 14px;
      color: #1b1b1b;
      width: 260px;
      line-height: 20px;
      font-weight: 600;
    }
    .status {
      font-size: 11px;
      color: #86898b;
      line-height: 11px;
      margin-top: 13px;
    }
    .deliver-info {
      font-size: 11px;
      color: #1b1b1b;
      line-height: 11px;
      margin-top: 19px;
      .copy {
        float: right;
        display: block;
        width: 40px;
        height: 18px;
        border: 1px solid #1b1b1b;
        border-radius: 2px;
        margin-top: -5px;
        text-align: center;
        line-height: 18px;
      }
    }
  }
}
.infos {
  background: #fff;
  padding-top: 20px;
  .info {
    height: 78px;
    margin: 0 22px;
    border-left: 1px dashed #d6d8da;
    position: relative;
    .desc {
      padding-top: 20px;
      margin-left: 22px;
      font-size: 14px;
      color: #86898b;
      line-height: 18px;
    }
    .desc.active {
      color: #1b1b1b;
    }
    .time.active {
      color: #1b1b1b;
    }
    .time {
      margin-top: 12px;
      margin-left: 22px;
      font-size: 12px;
      color: #86898b;
      line-height: 12px;
    }
    .disc {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #d6d8da;
      position: absolute;
      top: 23px;
      left: -4px;
    }
    > img {
      width: 22px;
      height: 22px;
      position: absolute;
      top: 17px;
      left: -11px;
    }
    .first {
      background: #fff;
      height: 20px;
      width: 2px;
      position: absolute;
      left: -1px;
      top: 0;
    }
    .last {
      background: #fff;
      height: 47px;
      width: 2px;
      position: absolute;
      left: -1px;
      bottom: 0;
    }
  }
}
</style>
