<template>
  <div class="progress-page">
    <ul class="top vux-1px-b">
      <li v-for="(item,index) in progressData.steps" :class="{'isOn': item.isOn,'current': currentIndex == index}" :key="index">
        {{item.title}}
        <span class="dis"></span>
        <span class="line" :class="{'three':progressData.steps.length == 3}" v-if="index != 0"></span>
      </li>
    </ul>
    <div class="scroll-block">
      <timeline class="bg-fff">
        <timeline-item v-for="(item,index) in progressData.records" :class="{'first': index == 0}" :key="index">
          <p v-for="(t,i) in item.operateDesc" :key="i" :class="{'big-title': i == 0}">
            <span :class="[i == 0 ? 'blod title' : 'text']">{{t.title}}</span>
            <span v-if="t.content" :class="[i == 0 ? 'blod title' : 'text']">{{':' + t.content}}</span>
          </p>
          <p class="addtime" v-if="item.logType == 0">{{item.addTime | dateFormat('yyyy-MM-dd hh:mm:ss')}}</p>
          <button class="return-btn" v-if="item.logType == 1" @click="toLogistics(item)">填写退货物流信息</button>
          <p class="line" v-if="index != progressData.records.length - 1"></p>
        </timeline-item>
      </timeline>
      <div class="info">
        <p>
          <span class="title">售后单号:</span>
          <span class="content">{{afterSalesNo}}</span>
        </p>
        <p>
          <span class="title">申请时间:</span>
          <span class="content">{{progressData.requestTime | dateFormat('yyyy-MM-dd hh:mm')}}</span>
        </p>
      </div>
    </div>
    <!-- <div class="bottombtn vux-1px-t">
      <button @click="toReDetail()">查看详细</button>
    </div> -->
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
      progressData: {},
      afterSalesNo: '',
      flowData: [],
      currentIndex: 0
    }
  },
  activated() {
    this.afterSalesNo = this.$route.query.afterSalesNo,
    this.getProgress()
  },
  methods: {
    getProgress() {
      let params = { afterSalesNo: this.afterSalesNo }
      this.$http.get('order/afterSale_records.do', { params }).then(res => {
        this.progressData = res.data
        for (let i = 0; i < this.progressData.steps.length; i++) {
          if (this.progressData.steps[i].isOn) {
            this.currentIndex = i
          }
        }
        for (let i = 0; i < this.progressData.records.length; i++) {
          try {
            this.progressData.records[i].operateDesc = JSON.parse(
              this.progressData.records[i].operateDesc
            )
          } catch (e) {}
        }
      })
    },
    toReDetail() {
      this.$router.push({
        name: 'reDetail', //售后详情
        query: { orderId: this.afterSalesNo }
      })
    },
    //填写物流信息
    toLogistics(item) {
      this.$router.push({
        name: 'logistics', //填写物流信息
        query: { orderNo: this.afterSalesNo, logId: item.logId }
      })
    }
  }
}
</script>
<style lang="less">
.progress-page {
  .top {
    // position: fixed;
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
        width: 101px;
        left: -76px;
        top: -45px;
        background: #d9d9d9;
      }
      .line.three {
        width: 147px;
        left: -126px;
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
  font-size: 14px;
  height: 100%;
  background: #fafafa;
  position: relative;
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
  // position: absolute;
  // top: 87px;
  // bottom: 70px;
  left: 0px;
  overflow-y: auto;
  .info {
    background: white;
    margin-top: 5px;
    padding: 23px 12px;
    p {
      height: 28px;
      line-height: 28px;
      .title {
        font-size: 12px;
        color: #86898b;
        line-height: 12px;
      }
      .content {
        float: right;
        position: relative;
        top: 9px;
        font-size: 12px;
        color: #86898b;
        letter-spacing: 0;
        text-align: right;
        line-height: 12px;
      }
    }
  }
}
.bottombtn {
  position: fixed;
  height: 59px;
  bottom: 0;
  background: #fff;
  width: 100%;
  z-index: 100;
  text-align: center;
  button {
    height: 42px;
    width: 265px;
    text-align: center;
    background: linear-gradient(217deg, #ff8996 0%, #fc6655 100%);
    box-shadow: 0 2px 10px 0 rgba(255, 76, 138, 0.2);
    border-radius: 100px;
    font-size: 14px;
    color: #ffffff;
    letter-spacing: 0;
    line-height: 42px;
    margin: 10px auto;
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


