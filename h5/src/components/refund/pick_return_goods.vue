<template>
  <!-- 选择退回商品 -->
  <div class="return-good-select">
    <div class="empty-tips" v-if="orderGoodsList.length == 0">
      <img class="pic" src="../../assets/empty/getrefund.png" alt="">
      <p>暂无可以申请退货的订单</p>
    </div>
    <div class="no-after-sale" v-else-if="!canAfterSale">
      <img class="pic" src="../../assets/after-sale/image_sqtk@2x.png" alt="">
      <p>你已错过了申请售后的时间段(交易完成15天内)，如果您需要帮助，可以联系在线客服</p>
    </div>
    <div class="good-select" v-else>
      <div class="srvType">
        <p class="title bold">服务类型</p>
        <div class="btns">
          <span class="btn" :class="{'activated': curBtn === idx}" v-for="(item,idx) in btns" :key="idx" @click="curBtn = idx">{{item}}</span>
        </div>
        <p class="desc">不同类型服务请分别申请</p>
      </div>
      <div class="content" v-if="!isBlankPage">
        <p class="page-title">请选择需要退货的商品和数量</p>
        <ul>
          <li v-for="(item,k) in orderGoodsList" :key="k" v-if="item.restNum >0">
            <div class="cart-lis-desc">
              <span class="cart-lis-select" :class="{ active: item.select}" @click="selectGoods(k,item)"></span>
              <div class="cart-lis-image">
                <img v-if="item.skuImage" class="cart-lis-pic" :src="item.skuImage" @error="setErrorImg($event,100,100)" alt="">
              </div>
              <div class="cart-lis-info">
                <div class="cart-lis-name">
                  <span class="bold">{{item.goodsName}}</span>
                </div>
                <div class="cart-lis-bottom">
                  <div class="cart-lis-size">
                    <span>{{item.skuName}}</span>
                  </div>
                  <div class="cart-lis-price-box">
                    <span class="cart-lis-price bold">¥{{(item.singlePrice*item.selectCount).toFixed(2)}}</span>
                  </div>
                  <span class="cart-lis-num-box">
                    <span class="cart-lis-add" @click="addCount(item,1)" :class="{ cart_lis_add_highlight: item.add_high }"></span>
                    <input class="cart-lis-num" v-model="item.selectCount" v-on:blur="num_blur(item)" type="tel">
                    <span class="cart-lis-reduce" @click="addCount(item,-1)" :class="{ cart_lis_reduce_highlight: item.reduce_high }"></span>
                  </span>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="bottom-box vux-1px-t" v-if="!isBlankPage">
        <div class="cart-footer-select-box" @click="selectAllGoods()">
          <span class="cart-select-all" :class="{'active': selectAll }"></span>
          <span class="cart-select-all-text">全选</span>
        </div>
        <p class="conter">合计：￥{{(goodsData.price).toFixed(2)}}</p>
        <button class="right" @click="toRetrunGoods()">下一步</button>
      </div>
    </div>
  </div>

</template>
<script>
export default {
  data() {
    return {
      Pnum: 0, //无用变量用来触发页面渲染
      btns: ['退货', '换货', '维修'],
      curBtn: 0,
      orderGoodsList: [],
      isBlankPage: false,
      goodsData: {
        price: 0,
        skus: [],
        counts: []
      },
      selectAll: false,
      canAfterSale: 0
    }
  },
  created() {
    this.getOrderDetail()
  },
  methods: {
    getOrderDetail() {
      let httpData = {
        params: { orderNo: this.$route.query.id }
      }
      this.$http
        .get('order/apply_after_sale_confirm.do', httpData)
        .then(res => {
          let data = res.data
          let list = data.orderObj.orderGoodsList
          let count = 0
          for (let i = 0; i < list.length; i++) {
            if (list[i].afterSaleService == 1) {
              list[i].restNum = list[i].skuCount - list[i].goodsAfterSale
              list[i].selectCount = list[i].restNum
              list[i].singlePrice = (
                list[i].payPrice / list[i].skuCount
              ).toFixed(2)
              this.btnAvailable(list[i])
              count += list[i].restNum
              this.orderGoodsList.push(list[i])
              this.canAfterSale = 1
            }
          }
          this.isBlankPage = count == 0
        })
    },
    selectGoods(k, item) {
      this.$set(item, 'select', !item.select ? true : false)
      let scount = 0
      for (let i = 0; i < this.orderGoodsList.length; i++) {
        if (this.orderGoodsList[i].select) {
          scount++
        }
      }
      if (scount == this.orderGoodsList.length) {
        this.selectAll = true
      } else {
        this.selectAll = false
      }
      this.getAllGoods()
    },
    selectAllGoods() {
      this.selectAll = !this.selectAll
      for (let i = 0; i < this.orderGoodsList.length; i++) {
        if (this.selectAll) {
          this.orderGoodsList[i].select = true
        } else {
          this.orderGoodsList[i].select = false
        }
      }
      this.getAllGoods()
    },
    getAllGoods() {
      this.goodsData = { price: 0, skus: [], counts: [] }
      for (let i = 0; i < this.orderGoodsList.length; i++) {
        if (this.orderGoodsList[i].select) {
          this.goodsData.price +=
            this.orderGoodsList[i].singlePrice *
            this.orderGoodsList[i].selectCount
          this.goodsData.skus.push(this.orderGoodsList[i].skuId)
          this.goodsData.counts.push(this.orderGoodsList[i].selectCount)
        }
      }
    },
    toRetrunGoods() {
      if (this.goodsData.skus.length == 0) {
        this.$vux.toast.text('请选择商品')
        return
      }
      this.$router.push({
        name: 'reGoods',
        query: {
          counts: this.goodsData.counts.join(','),
          ids: this.goodsData.skus.join(','),
          id: this.$route.query.id,
          srvType: this.curBtn
        }
      })
    },
    addCount(item, num) {
      this.$set(item, this.Pnum, (item.selectCount += num))
      if (item.selectCount < 1) {
        item.selectCount = 1
      }
      if (item.selectCount > item.restNum) {
        item.selectCount = item.restNum
      }
      this.getAllGoods()
      this.btnAvailable(item)
      this.Pnum++
    },
    //增加、减少按钮是否可用
    btnAvailable(goods) {
      if (goods.selectCount >= goods.restNum) {
        goods.add_high = false
      } else {
        goods.add_high = true
      }
      if (goods.selectCount <= 1) {
        goods.reduce_high = false
      } else {
        goods.reduce_high = true
      }
    },
    //输入框失去焦点
    num_blur(goods) {
      if (goods.selectCount < 1) {
        goods.selectCount = 1
      }
      if (goods.selectCount > goods.restNum) {
        goods.selectCount = goods.restNum
      }
      this.$set(goods, this.Pnum, goods.selectCount)
      this.Pnum++
      this.btnAvailable(goods)
    }
  }
}
</script>
<style lang="less" scoped>
.return-good-select {
  font-size: 16px;
  height: 100%;
  .no-after-sale {
    background: #fff;
    text-align: center;
    height: 100%;
    img {
      width: 161px;
      height: 82px;
      margin-top: 150px;
    }
    p {
      padding: 20px 40px;
      font-size: 14px;
      color: #86898b;
      line-height: 20px;
    }
  }
  .empty-tips {
    background: #fff;
    text-align: center;
    height: 100%;
    img {
      height: 170px;
      width: 216px;
      margin-top: 150px;
    }
    p {
      padding: 20px 40px;
      font-size: 14px;
      color: #86898b;
      line-height: 20px;
    }
  }
  .good-select {
    height: 100%;
  }
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
  .content {
    overflow: hidden;
    background: #fff;
    padding-bottom: 50px;
    -webkit-overflow-scrolling: touch;
  }
  .empty_order {
    height: 100%;
    background: #fff;
    overflow: hidden;
    .empty {
      display: block;
      margin: 0 auto;
      margin-top: 110px;
      width: 216px;
      height: 144px;
    }
    .empty-tips {
      margin: 39px;
      text-align: center;
      font-size: 14px;
      color: #cecece;
    }
  }
}
.content {
  > p {
    font-size: 12px;
    color: #1b1b1b;
    margin-left: 15px;
    margin-top: 30px;
  }
  li {
    padding: 0 12px;
  }
  .page-title {
    font-size: 12px;
    color: #86898b;
    letter-spacing: 0;
    text-align: left;
    line-height: 12px;
  }
}

.cart-lis-desc {
  padding: 20px 0;
}
.cart-lis-select {
  float: left;
  width: 16px;
  height: 100px;
  background: url('../../assets/cart/btn_sle_black@2x.png') no-repeat;
  background-size: 16px;
  background-position: center;
  vertical-align: middle;
}

.cart-lis-image {
  float: left;
  width: 100px;
  height: 100px;
  margin: 0 12px;
  position: relative;
}

.cart-lis-pic {
  width: 100%;
  height: 100%;
  vertical-align: middle;
}
.cart-lis-info {
  width: 211px;
  height: 100px;
  display: inline-block;
  vertical-align: middle;
  position: relative;
}
.cart-lis-name {
  font-size: 14px;
  color: #1b1b1b;
  font-weight: bold;
  line-height: 24px;
  margin-bottom: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-wrap: break-word;
  word-break: break-all;
}
.cart-lis-bottom {
  width: 100%;
  font-size: 13px;
  position: relative;
}

.cart-lis-size {
  font-size: 11px;
  color: #86898b;
  margin-bottom: 16px;
  margin-top: 7px;
  text-overflow: ellipsis;
  display: flex;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  word-wrap: break-word;
  word-break: break-all;
  > span {
    flex: 1;
    height: 16px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.cart-lis-price-box {
  width: 100%;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
}

.cart-lis-price {
  font-size: 16px;
  color: #fc6655;
  font-weight: 600;
}

.cart-lis-num-box {
  position: absolute;
  right: 0;
  bottom: 0;
  display: inline-block;
  font-size: 12px;
  color: #1b1b1b;
}

.cart-lis-reduce {
  background: url('../../assets/cart/h5_icon_less.png') no-repeat;
  background-position: center;
  background-size: 10px;
}
.cart-lis-add {
  background: url('../../assets/cart/h5_icon_add.png') no-repeat;
  background-position: center;
  background-size: 10px;
}
.cart_lis_reduce_highlight {
  background: url('../../assets/cart/h5_icon_less_hight.png') no-repeat;
  background-position: center;
  background-size: 10px;
}
.cart_lis_add_highlight {
  background: url('../../assets/cart/h5_icon_add_hight.png') no-repeat;
  background-position: center;
  background-size: 10px;
}
.cart-lis-add,
.cart-lis-reduce,
.cart-lis-num,
.cart-lis-add-highlight,
.cart-lis-reduce-highlight {
  width: 21px;
  height: 21px;
  line-height: 22px;
  background-color: #fff;
  text-align: center;
  float: right;
  font-size: 12px;
  color: #b9b9b9;
  border: 1px solid #c7cbcd;
  box-sizing: border-box;
}
.cart-lis-num {
  margin: 0 -1px;
  color: #272728;
  width: 30px;
}

.cart-select-all {
  width: 16px;
  height: 16px;
  display: inline-block;
  background: url('../../assets/cart/btn_sle_black@2x.png') no-repeat;
  background-size: 100%;
  vertical-align: middle;
  margin-left: 12px;
}
.active {
  background: url('../../assets/cart/btn_sle_black_pre@2x.png') no-repeat;
  background-size: 16px;
  background-position: center;
}

.cart-select-all-text {
  font-size: 14px;
  color: #1b1b1b;
  font-weight: bold;
}
.cart-footer-select-box {
  display: inline-block;
  width: 74px;
  height: 17px;
  line-height: 17px;
  float: left;
  margin-top: 17px;
}

.bottom-box {
  overflow: hidden;
  height: 49px;
  line-height: 49px;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #fff;
  z-index: 100;
  .conter {
    float: left;
    font-size: 16px;
    color: #fc6655;
    letter-spacing: 0;
    line-height: 16px;
    padding: 0 10px;
    margin-top: 18px;
  }
  .right {
    float: right;
    width: 74px;
    height: 28px;
    margin: 0 10px;
    margin-top: 10px;
    font-size: 12px;
    color: white;
    background-image: linear-gradient(90deg, #ff8996 0%, #fc6655 100%);
    box-shadow: 0 4px 13px 0 rgba(252, 102, 85, 0.31);
    border-radius: 51px;
  }
}
</style>



