<template>
  <div class="refund-goods">
    <div class="srvType">
      <p class="title bold">服务类型</p>
      <div class="btns">
        <span class="btn" :class="{'activated': curBtn === idx}" v-for="(item,idx) in btns" :key="idx" @click="curBtn = idx">{{item}}</span>
      </div>
      <p class="desc">不同类型服务请分别申请</p>
    </div>
    <div class="goods" v-for="(item,k) in goodsList" :key="k">
      <div class="info">
        <div class="pic">
          <img :src="item.goods.skuImage" @error="setErrorImg($event,100,100)">
        </div>
        <div class="title bold">{{item.goods.goodsName}}</div>
        <div class="guige">
          <span>{{item.goods.skuName}}</span>
          <span class="pull-right">x{{item.count}}</span>
        </div>
        <div class="price bold">￥{{item.goods.singlePrice*item.count}}</div>
      </div>
      <div class="reason">
        <span class="title">
          <span class="required">*</span>退货原因
        </span>
        <span class="xuanze" v-if="goodsList[k]" @click="showDialog(k)">
          {{goodsList[k].reason == '' ? '请选择换货原因' : goodsList[k].reason}}
          <img src="../../assets/icon_gengduo@2x.png">
        </span>
      </div>
      <div class="explain">
        <span class="title">
          <span class="required">*</span>问题说明
        </span>
        <textarea v-if="goodsList[k]" placeholder="请输入问题说明" cols="30" rows="10" v-model="goodsList[k].explain"></textarea>
      </div>
      <div class="updata">
        <span class="title">图片凭证</span>
        <span class="warning">可上传3张图片</span>
        <form class="img-form" enctype="multipart/form-data" :id="'imgForm' + k">
          <ul v-if="goodsList[k]">
            <li v-for="(imgItem,key) in goodsList[k].imgList" :key="key" v-show="imgItem">
              <input v-show="false" type="file" name="files" class='inputStyle' @change="changeImg(k,key)" :id='"addImg"+k+"-"+key'>
              <div class="img-box"><img :src="imgItem" @load="onLoad"></div>

              <i @click="deleteImg(goodsList[k],key,k)" v-if="imgItem"></i>
            </li>
            <li v-if="!goodsList[k].isHide">
              <img src="../../assets/icon_tjtp@2x.png" alt="" @click="addImg(k)">
            </li>
          </ul>
        </form>
      </div>
    </div>
    <div class="bottom-btn vux-1px-t">
      <div class="submit-btn" @click="submit()">提 交</div>
    </div>

    <div v-transfer-dom>
      <popup class="pop-dialog" v-model="isDialog" position="bottom" max-height="60%">
        <div class="popup-item popup-top">
          <p class="title">请选择原因</p>
          <p class="reason" v-for="(item,idx) in dialogData" :key="idx" @click="selectReason(item)">{{item.reason}}</p>
        </div>
        <div class="popup-item popup-down" @click="isDialog=false">取消</div>
      </popup>
    </div>
  </div>
</template>
<script>
import { TransferDom, Popup } from 'vux'
import { qiniuToken, imgUpdate } from '../../util/imgUpdate'
export default {
  directives: {
    TransferDom
  },
  components: {
    Popup
  },
  data() {
    return {
      dialogData: [], //退货原因们
      isDialog: false, //显示退货原因弹框
      skuIds: this.$route.query.ids.split(','),
      counts: this.$route.query.counts.split(','),
      orderDetail: {}, //订单详情
      orderGoodsList: [],
      goodsList: [], //用来保存用户填写的信息 和 orderGoodsList 索引对应
      selectIndex: 0,
      btns: ['退货', '换货', '维修'],
      curBtn: this.$route.query.srvType || 0,
      loadData: { show: true, text: '' }
    }
  },
  created() {
    this.getOrderDetail()
    this.getDialogReasons()
  },
  methods: {
    onLoad(e) {
      let w = e.srcElement.width
      let h = e.srcElement.height
      if (w > h) {
        e.srcElement.style.height = '81px'
        e.srcElement.style.width = 81 * w / h + 'px'
      } else {
        e.srcElement.style.width = '81px'
        e.srcElement.style.height = 81 * h / w + 'px'
      }
    },
    getOrderDetail() {
      this.$http
        .get('order/order_details.do', {
          params: { orderNo: this.$route.query.id }
        })
        .then(res => {
          let data = res.data
          this.orderDetail = data.orderObj
          this.orderGoodsList = data.orderObj.orderGoodsList
          for (let i = 0; i < this.orderGoodsList.length; i++) {
            this.orderGoodsList[i].singlePrice = (
              this.orderGoodsList[i].payPrice / this.orderGoodsList[i].skuCount
            ).toFixed(2)
            for (var k = 0; k < this.skuIds.length; k++) {
              if (this.orderGoodsList[i].skuId == this.skuIds[k]) {
                this.goodsList.push({
                  goods: this.orderGoodsList[i],
                  imgList: [null, null, null],
                  reason: '',
                  reasonId: '',
                  explain: '',
                  isHide: false,
                  count: this.counts[k]
                })
              }
            }
          }
        })
    },
    getDialogReasons() {
      this.$http.get('order/afterSale_reasons.do').then(res => {
        this.dialogData = res.data
      })
    },
    addImg(k) {
      for (let i = 0; i < this.goodsList[k].imgList.length; i++) {
        if (!this.goodsList[k].imgList[i]) {
          document.getElementById('addImg' + k + '-' + i).click()
          if (i >= 2) {
            this.goodsList[k].isHide = true
          }
          return
        }
      }
      this.goodsList[k].isHide = true
    },
    deleteImg(arr, key, k) {
      arr.isHide = false
      this.$set(arr.imgList, key, null)
      let fileDom = document.getElementById('addImg' + k + '-' + key)
      fileDom.type = 'text'
      fileDom.type = 'file'
    },
    changeImg(k, key) {
      let self = this
      let reader = new FileReader()
      reader.readAsDataURL(
        document.getElementById('addImg' + k + '-' + key).files[0]
      )
      reader.onloadend = function(e) {
        self.$set(self.goodsList[k].imgList, key, e.target.result)
      }
    },
    showDialog(k) {
      this.selectIndex = k
      this.isDialog = true
    },
    selectReason(item) {
      this.isDialog = false
      this.goodsList[this.selectIndex].reason = item.reason
      this.goodsList[this.selectIndex].reasonId = String(item.reasonId)
    },
    submit() {
      let num = 0
      let self = this
      qiniuToken(function(res) {
        verifyPar(res)
      })
      function verifyPar(qnData) {
        for (let i = 0; i < self.goodsList.length; i++) {
          let item = self.goodsList[i]
          if (item.reason == '') {
            self.$vux.toast.text(`请填写第${i + 1}件商品的退货原因`)
            return false
          }
          if (item.explain == '') {
            self.$vux.toast.text(`请填写第${i + 1}件商品的问题说明`)
            return false
          }
        }
        for (let i = 0; i < self.goodsList.length; i++) {
          let item = self.goodsList[i]
          self.updataImg(i, qnData, function(res) {
            item.urlList = res
            num++
            if (num >= self.goodsList.length) {
              self.$vux.loading.show({
                text: '提交中'
              })
              self.afterSaleRequest()
            }
          })
        }
      }
    },
    updataImg(i, qnData, cb) {
      let files = $('#imgForm' + i)[0].files
      let _arr = []
      for (let n = 0; n < files.length; n++) {
        let _f = files[n]
        if (_f.value != '') {
          _arr.push(_f.files[0])
        }
      }
      if (_arr.length > 0) {
        this.$vux.loading.show({
          text: '上传中'
        })
        imgUpdate(_arr, qnData.uploadToken, '', res => {
          let new_arr = res.map(element => {
            return qnData.accessPrefixUrl + '/' + element.key
          })
          cb(new_arr)
        })
      } else {
        cb([])
      }
      return
    },
    afterSaleRequest() {
      let httpData = {
        orderNo: this.$route.query.id,
        requestList: [],
        type: String(this.curBtn) //申请类型：0退货1换货2维修
      }
      for (let i = 0; i < this.goodsList.length; i++) {
        let item = {
          imgs: this.goodsList[i].urlList || [],
          reason: this.goodsList[i].reason,
          reasonId: this.goodsList[i].reasonId,
          remark: this.goodsList[i].explain,
          skuCount: this.goodsList[i].count + '',
          skuId: this.goodsList[i].goods.skuId + ''
        }
        httpData.requestList.push(item)
      }
      this.$http.post('order/afterSale_request.do', httpData).then(res => {
        this.$vux.loading.hide()
        this.$router.push({
          path: 'reSubmited', //售后申请成功
          query: { afterSaleId: res.data.afterSaleNo, orderId: this.$route.query.id }
        })
      })
    }
  }
}
</script>
<style lang="less">
.weui-loading_toast {
  font-size: 14px;
}
</style>

<style lang="less" scoped>
.refund-goods {
  font-size: 16px;
  height: 100%;
  overflow-y: auto;
  padding-bottom: 50px;
  -webkit-overflow-scrolling: touch;

  // padding-bottom: 51px;
  .srvType {
    background: white;
    margin-bottom: 5px;
    height: 131px;
    width: 100%;
    padding: 20px 12px;
    .title {
      font-size: 14px;
      color: #1b1b1b;
      line-height: 18px;
    }
    .btns {
      margin: 17px 0;
      .btn {
        width: 78px;
        height: 28px;
        line-height: 28px;
        display: inline-block;
        border: 1px solid #1b1b1b;
        border-radius: 14px;
        text-align: center;
        font-size: 12px;
        color: #1b1b1b;
        letter-spacing: 0;
        margin-right: 20px;
      }
      .activated {
        border: 1px solid #fc6655;
        color: #fc6655;
      }
    }
    .desc {
      font-size: 12px;
      color: #cccccc;
      line-height: 12px;
    }
  }
  .info {
    width: 100%;
    height: 160px;
    overflow: hidden;
    background: #fff;
    margin-bottom: 1px;
    .pic {
      width: 100px;
      height: 100px;
      margin: 30px 12px;
      float: left;
      > img {
        width: 100%;
        height: 100%;
      }
    }
    .title {
      margin-top: 30px;
      margin-bottom: 10px;
      padding-right: 12px;
      font-size: 14px;
      color: #1b1b1b;
      line-height: 22px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .guige {
      padding-right: 12px;
      font-size: 12px;
      font-size: 11px;
      color: #86898b;
      line-height: 11px;
      margin-bottom: 20px;
      .pull-right {
        float: right;
      }
    }
    .price {
      font-size: 16px;
      color: #fc6655;
      letter-spacing: 0;
      line-height: 16px;
    }
  }
  .reason {
    display: flex;
    justify-content: space-between;
    height: 56px;
    margin-bottom: 1px;
    padding: 0 12px;
    line-height: 56px;
    background: #fff;
    position: relative;
    .title {
      font-size: 14px;
      color: #1b1b1b;
      font-weight: 600;
      .required {
        color: red;
        position: relative;
        top: -4px;
      }
    }
    .xuanze {
      font-size: 12px;
      color: #86898b;
      right: 12px;
      line-height: 56px;
      width: 200px;
      text-align: right;
      img {
        margin-left: 10px;
        width: 6px;
        height: 12px;
      }
    }
  }
  .explain {
    padding: 12px;
    display: flex;
    margin-bottom: 1px;
    background-color: #fff;
    .title {
      font-size: 14px;
      color: #1b1b1b;
      margin-right: 20px;
      font-weight: 600;
      .required {
        color: red;
        position: relative;
        top: -4px;
      }
    }
    textarea {
      font-size: 12px;
      line-height: 18px;
      flex: 1;
      height: 80px;
    }
  }
  .updata {
    overflow: hidden;
    padding: 20px 12px;
    background: #fff;
    margin-bottom: 5px;
    .title {
      font-size: 14px;
      color: #1b1b1b;
      letter-spacing: 0;
      font-weight: 600;
    }
    .warning {
      font-size: 12px;
      color: #86898b;
      letter-spacing: 0;
      line-height: 14px;
    }
    .img-form {
      margin: 12px 0;
      li {
        float: left;
        position: relative;
        width: 81px;
        height: 81px;
        margin: 5px;
        .inputStyle {
          width: 100%;
          height: 68px;
          opacity: 0;
          filter: alpha(opacity=0);
          position: absolute;
          bottom: 0;
          left: 0;
          z-index: 1;
        }
        > img {
          width: 81px;
          height: 81px;
        }
        .img-box {
          width: 81px;
          height: 81px;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 2;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        > i {
          position: absolute;
          top: 0;
          right: 0;
          display: block;
          background-image: url('../../assets/delete@2x.png');
          background-size: 100%;
          width: 15px;
          height: 15px;
          z-index: 10;
        }
      }
    }
  }
  .bottom-btn {
    position: fixed;
    height: 59px;
    bottom: 0;
    background: #fff;
    width: 100%;
    z-index: 100;
    .submit-btn {
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
}

.pop-dialog {
  background: rgba(0, 0, 0, 0) !important;
  z-index: 1000;
  p {
    padding: 10px 0;
    border-top: solid 1px #eee;
  }
  .popup-item {
    background: white;
    margin: 5px;
    border-radius: 10px;
    font-size: 18px;
    text-align: center;
    .title {
      border-top: none;
      font-size: 14px;
    }
    .reason {
      font-size: 14px;
    }
  }
  .popup-top {
    background: white;
  }
  .popup-down {
    padding: 10px 0;
  }
}
</style>

