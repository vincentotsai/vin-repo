<template>
  <div class="payprogress-page">
    <ul class="top1">
      <li v-for="(item,index) in proData.steps" :class="{'isOn':item.isOn,'current':currentIndex==index}" :key="index">
        {{item.title}}
        <span class="dis"></span>
        <span class="line" v-if="index!=0"></span>
      </li>
    </ul>
    <div>
      <timeline class="bg-fff">
        <timeline-item v-for="(item,index) in proData.records" :class="{'first':index==0}" :key="index">
          <p v-for="(t,i) in item.operateDesc" :key="i">
            <span :class="[i==0 ?'blod title':'text']">{{t.title}}</span>
            <span v-if="t.content" :class="[i==0 ?'blod title':'text']">{{':'+ t.content}}</span>
          </p>
          <p class="addtime" v-if="item.logType==0">{{item.addTime | dateFormat('yyyy-MM-dd hh:mm:ss')}}</p>
          <p class="line" v-if="index != proData.records.length-1"></p>
        </timeline-item>
      </timeline>
    </div>
    <div class="bottom1" v-if="proData.applyTime">
      <p>申请时间：{{ proData.applyTime | dateFormat('yyyy-MM-dd hh:mm') }}</p>
    </div>
  </div>
</template>
<script>
import { Timeline, TimelineItem } from 'vux'
export default {
  components: {
    Timeline,
    TimelineItem
  },
  data() {
    return {
      proData: {},
      orderNo: this.$route.query.orderNo,
      currentIndex: 0
    }
  },
  created() {
    this.getPro()
  },
  methods: {
    getPro() {
      this.$http
        .get('order/order_refund_records.do', {
          params: { orderNo: this.orderNo }
        })
        .then(res => {
          this.proData = res.data
          for (let i = 0; i < this.proData.steps.length; i++) {
            if (this.proData.steps[i].isOn) {
              this.currentIndex = i
            }
          }
          for (let i = 0; i < this.proData.records.length; i++) {
            try {
              this.proData.records[i].operateDesc = JSON.parse(
                this.proData.records[i].operateDesc
              )
            } catch (e) {}
          }
        })
    }
  }
}
</script>
<style lang="less">
.payprogress-page {
  .top1 {
    height: 82px;
    padding: 50px 13px 19px;
    background: #fff;
    margin-bottom: 5px;
    display: flex;
    justify-content: space-between;
    li {
      position: relative;
      font-size: 12px;
      color: #cbcbcb;
      font-weight: 600;
      .dis {
        width: 17px;
        height: 17px;
        display: block;
        border-radius: 100%;
        background: linear-gradient(-146deg, #eeeeee 0%, #d8d8d8 97%);
        position: absolute;
        bottom: 27px;
        left: 50%;
        margin-left: -8px;
        z-index: 10;
      }
      .line {
        position: absolute;
        content: '';
        height: 1px;
        width: 150px;
        left: -120px;
        top: -45px;
        background: #d9d9d9;
      }
    }
    li.isOn {
      color: #1b1b1b;
      .dis {
        background: linear-gradient(-140deg, #ffa2c2 3%, #fc6655 99%);
      }
      .line {
        background-color: #fc6655;
      }
    }
    li.isOn.current {
      color: #fc6655;
      .dis {
        width: 22px;
        height: 22px;
        border: 2px solid #ffa2c2;
        bottom: 22px;
        margin-left: -12px;
      }
    }
  }
  .bottom1 {
    height: 49px;
    background: #fff;
    font-size: 14px;
    color: #1b1b1b;
    font-weight: 600;
    padding-left: 12px;
    line-height: 49px;
  }
  font-size: 14px;
  height: 100%;
  background: #fafafa;
  .bg-fff {
    background: #fff;
  }

  .blod {
    font-weight: bold;
  }
  .big-title {
    margin-bottom: 5px;
  }
  .title {
    font-size: 14px;
    color: #272728;
    line-height: 22px;
  }
  .text {
    font-size: 12px;
    line-height: 18px;
    color: #86898b;
    line-height: 22px;
  }
  .line {
    height: 1px;
    background: rgba(236, 236, 236, 0.5);
    margin-top: 23px;
  }
  .return-btn {
    border: 1px solid rgba(27, 27, 27, 0.5);
    border-radius: 1px;
    background: #fff;
    font-size: 10px;
    padding: 3px 5px;
    margin-top: 10px;
  }
  .addtime {
    font-size: 12px;
    color: #86898b;
    line-height: 18px;
  }
  .first {
    .text {
      color: #fc6655;
    }
    .title {
      color: #fc6655;
    }
    .addtime {
      color: #fc6655;
    }
  }
}
.scroll-block {
  width: 100%;
  position: absolute;
  top: 87px;
  bottom: 70px;
  left: 0px;
  overflow-y: auto;
}
.bottom {
  width: 100%;
  box-sizing: border-box;
  position: absolute;
  bottom: 0;
  left: 0;
  background: #fff;
  font-size: 12px;
  color: #1b1b1b;
  line-height: 18px;
  font-weight: 600;
  padding: 12px;
  p:last-child {
    margin-top: 10px;
  }
  .content {
    margin-left: 17px;
  }
  button {
    border: 1px solid #1b1b1b;
    border-radius: 2px;
    padding: 3px 9px;
    background: #fff;
  }
}
.vux-timeline.bg-fff {
  padding: 20px;
}
.vux-timeline-item-head-first {
  width: 14px !important;
  height: 14px !important;
  left: -2px !important;
  top: 3px !important;
  border-radius: 50% !important;
  background: linear-gradient(-140deg, #ffa2c2 3%, #fc6655 99%);
  > i {
    display: none;
  }
}
.vux-timeline-item-head {
  background: #d6d8da !important;
  width: 8px !important;
  height: 8px !important;
  border-radius: 50% !important;
  left: 1px !important;
  top: 3px !important;
}
.vux-timeline-item-tail {
  background: #cecece !important;
  width: 1px !important;
}
.vux-timeline-item-content {
  padding: 0 0 23px 22px !important;
}
</style>


