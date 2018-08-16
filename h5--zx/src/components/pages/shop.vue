<template>
  <section class="shop-stage">
    <scroller list-name="course_info_list" position-name="course_id" :fetch="fetchData" :list="list" @on-fetch-data="onFetchData">
      <div class="header">
        <button class="btn-share" @click="$root.$emit('show-share-card', shopInfo.share_card)">
          <i class="icon-share"></i>
        </button>
        <div class="info">
          <img :src="shopInfo.avatar_address">
          <dl>
            <dt>{{shopInfo.shop_name}}</dt>
            <dd>{{shopInfo.shop_remark || '暂时没有简介'}}</dd>
          </dl>
          <a class="btn-share-public" @click="$root.$emit('show-share-card', shopInfo.public_rq_code_address)">
            <span>公众号</span>
            <i class="icon-arrow-right"></i>
          </a>
        </div>
      </div>
      <ul class="course-list">
        <li v-for="item in list" :key="item.course_id" @click="linkTo(item)">
          <div class="course-cover">
            <img :src="item.course_url">
            <span class="tag-series" v-if="item.is_series == 1">系列课</span>
          </div>
          <p>
            <span class="course-type vux-1px" :class="item.course_type == 0 ? 'audio' : 'video'">{{item.course_type == 0 ? '语音': '视频'}}</span>{{item.course_title}}
          </p>
          <span class="course-price" style="color: #FF7D61" v-if="item.charge_type == 0">免费</span>
          <span class="course-price" v-else>{{item.course_price | moneyFormat}}</span>
          <div class="info">
            <img :src="item.lecturer_avatar_address">
            <span class="lecturer-name">{{item.lecturer_name}}</span>
            <span class="lecturer-info">{{item.lecturer_title}}</span>
            <span class="listen-num">{{item.sale_num}}人听讲</span>
          </div>
        </li>
      </ul>
    </scroller>
    <nav-bar></nav-bar>
  </section>
</template>
<script>
import navBar from '../common/nav-bar'

const fetchData = position => {
  let shopId = sessionStorage.getItem('ZX_H5_SHOP_ID')
  return $http.get(`sharing-server-shop/shop/course/list/${shopId}`, {
    params: {
      page_count: 10,
      last_course_id: position || '',
      share_shop_id: shopId
    }
  })
}

export default {
  name: 'shop',
  components: {
    navBar
  },
  data() {
    return {
      shopInfo: {},
      list: []
    }
  },
  methods: {
    fetchData:fetchData,
    onFetchData(res) {
      let data = res.data
      let list = data.course_info_list
      this.shopInfo = data.shop_info
      this.list.push(...list)
    },
    linkTo(course) {
      const nameMap = {
        '0': 'course', //未购买的单品课
        '1': 'series', //未购买的系列课
        '2': 'play', //已购买的单品课
        '3': 'series' //已购买的系列课
      }
      this.$router.push({
        name: nameMap[course.is_bought * 2 + course.is_series],
        params: {
          id: course.course_id
        }
      })
    }
  },
  beforeRouteEnter(to, from, next) {
    fetchData().then(res => {
      next(vm => {
        vm.onFetchData(res)
      })
    })
  }
}
</script>
<style lang="less" scoped>
.shop-stage {
  position: absolute;
  height: 100%;
  width: 100%;
  padding-bottom: 50px;
  .v-scroller {
    padding-bottom: 10px;
  }
  .header {
    position: relative;
    width: 100%;
    height: 211px;
    background: url('../../assets/bg_shop.png') no-repeat center;
    background-size: cover;
    > .btn-share {
      position: absolute;
      top: 10px;
      right: 10px;
      background: transparent;
    }
    > .info {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 10px;
      background: url('../../assets/bg_shop_shadow.png') no-repeat center;
      background-size: 100%;
      > img {
        float: left;
        display: block;
        width: 32px;
        height: 32px;
        border-radius: 50%;
      }
      > dl {
        float: left;
        width: 70%;

        margin-left: 6px;

        color: #ffffff;
        dt {
          margin-top: 2px;
          font-size: 13px;
          line-height: 12px;
        }
        dd {
          margin-top: 6px;
          font-size: 10px;
          line-height: 10px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
      }
    }

    .btn-share-public {
      position: absolute;
      right: 10px;
      bottom: 12px;
      display: block;
      font-size: 12px;
      color: #ffffff;
      line-height: 12px;
      > span {
        display: inline-block;
        vertical-align: middle;
      }
    }
  }
  .course-list > li {
    padding: 12px;
    background: #fff;
    .course-cover {
      position: relative;
      > img {
        display: block;
        width: 100%;
        height: 198px;
        object-fit: cover;
      }
      .tag-series {
        position: absolute;
        right: 3px;
        bottom: 3px;
        display: block;
        width: 40px;
        height: 15px;
        line-height: 15px;
        background: #000000;
        opacity: 0.7;
        font-size: 10px;
        color: #ffffff;
        text-align: center;
      }
    }
    > p {
      margin: 16px 0;
      font-size: 14px;
      color: #393d42;
      line-height: 24px;
      .course-type {
        padding-top: 1px;
        padding-left: 1px;
        margin-right: 8px;
        display: inline-block;
        width: 37px;
        height: 16px;
        line-height: 16px;
        font-size: 12px;
        text-align: center;
      }
      .audio {
        color: #ff9b22;
        &:before {
          border-color: #ff9b22;
        }
      }
      .video {
        color: #55c3dc;
        &:before {
          border-color: #55c3dc;
        }
      }
    }
    .course-price {
      font-size: 14px;
      color: #393d42;
      line-height: 14px;
    }
    .info {
      margin-top: 13px;
      > img {
        display: inline-block;
        width: 22px;
        height: 22px;
        vertical-align: middle;
        border-radius: 50%;
      }
      .lecturer-name {
        font-size: 13px;
        color: #a7a5a6;
        line-height: 12px;
      }
      .lecturer-info {
        font-size: 10px;
        color: #a7a5a6;
        line-height: 10px;
      }
      .listen-num {
        float: right;
        font-size: 12px;
        color: #a7a5a6;
        line-height: 22px;
      }
    }
  }
}
</style>
