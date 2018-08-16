<template>
  <section class="series-stage" :class="{ 'is-bought': series.is_bought }">
    <scroller list-name="s_course_info_list" position-name="s_course_id" :fetch="fetchList" :list="list" @on-fetch-data="onFetchList">
      <player :is-try="!series.is_bought && !!series.test_course_id" :cover="series.course_url" :type="series.course_type" @try-click="tryClick"></player>
      <div class="series-tag">
        <i class="icon-series"></i>
        <span>系列课</span>
      </div>
      <div class="series-info">
        <p>
          <span class="series-type vux-1px" :class="series.course_type == 0 ? 'audio' : 'video'">{{series.course_type == 0 ? '语音': '视频'}}</span>{{series.course_title}}
        </p>
        <div class="info vux-1px-t">
          <i class="icon-saled"></i><span>{{series.sale_total}}人订阅</span>
          <i class="icon-updated"></i><span>{{series.update_status == 0 ? '已' : '共' }}更新{{series.count}}节</span>
          <i class="icon-class"></i><span>{{series.classify_name}}</span>
          <a class="btn-details" v-if="series.is_bought" @click="isShowDetails = !isShowDetails">
            详情
            <i :class="isShowDetails ? 'icon-arrow-down' : 'icon-arrow-up'"></i>
          </a>
        </div>
      </div>
      <course-details v-show="isShowDetails" :course="series" :lecturer="lecturer"></course-details>
      <div class="course-list">
        <div class="title">
          <i style="background: #AF98F7"></i>
          <span>课程列表</span>
        </div>
        <ul class="list">
          <li v-for="(item, index) in list" :key="index" @click="itemClick(item)">
            <img :src="item.course_url">
            <div class="info">
              <p>
                <span class="try-tag vux-1px" v-if="item.is_test == 1">试听</span>
                {{item.course_title}}
              </p>
              <div>
                <i class="icon-visit"></i><span>{{item.visit_times}}</span>
                <i class="icon-comment"></i><span>{{item.comment_count}}</span>
                <span class="time-from-now">{{item.create_time | formatTimeFromNow}}</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </scroller>
    <course-bottom-bar v-if="!series.is_bought" :status="status" :price="series.course_price" :share-url="series.share_card" @btn-handler="btnHandler"></course-bottom-bar>
  </section>
</template>
<script>
  import courseDetails from '../common/course-details.vue'
  import courseBottomBar from '../common/course-bottom-bar'

  const fetchData = (id) => {
    let shopId = sessionStorage.getItem('ZX_H5_SHOP_ID')
    return $http.get(`sharing-server-course/course/series/details/${id}`, {
      params: {
        shop_id: shopId
      }
    })
  }
  const fetchList = (id, position) => {
    return $http.get(`sharing-server-course/course/series/${id}/course_list`, {
      params: {
        page_count: 10,
        last_course_id: position || ''
      }
    })
  }
  export default {
    name: 'series',
    components: {
      courseBottomBar,
      courseDetails
    },
    data() {
      return {
        series: {
          is_bought: 1
        },
        lecturer: {},
        list: [],
        isShowDetails: true
      }
    },
    computed: {
      status() {
        // 0 收费 1 免费 2 已购买
        return this.series.is_bought == 1 ? 2 : this.series.charge_type == 1 ? 0 : 1
      }
    },
    methods: {
      fetchList(position) {
        return fetchList(this.$route.params.id, position)
      },
      onFetchData(res) {
        let data = res.data
        this.series = Object.assign({}, this.series, data.course_info)
        this.lecturer = data.lecturer_info
        this.series.is_bought = data.is_bought
        this.series.test_course_id = data.test_course_id
        this.isShowDetails = data.is_bought == 0
      },
      onFetchList(res) {
        let data = res.data
        let list = data.s_course_info_list
        this.list.push(...list)
      },
      btnHandler() {
        this.series.is_bought = 1
        this.isShowDetails = false
      },
      join(id) {
        //id 表示加入之后的点播课程id
        this.$http.post('sharing-server-course/course/free/join', {
          course_id: this.series.course_id
        }).then(() => {
          this.toPlay(id)
        })
      },
      tryClick() {
        let id = this.series.test_course_id
        if(this.status == 1) {
          this.join(id)
        } else {
          this.toPlay(id)
        }
      },
      itemClick(item) {
        let status = this.status
        if(status == 0) {
          //提示购买
          alert('提示购买')
        } else if(status == 1) {
          this.join(item.s_course_id)
        } else {
          this.toPlay(item.s_course_id)
        }
      },
      toPlay(id) {
        this.$router.push({
          name: 'seriesPlay',
          params: {
            id
          }
        })
      }
    },
    beforeRouteEnter(to, from, next) {
      let id = to.params.id
      fetchData(id).then(res => {
        next(vm => {
          vm.onFetchData(res)
          vm.fetchList().then(vm.onFetchList)
        })
      })
    }
  }

</script>
<style lang="less" scoped>
  .series-stage {
    position: absolute;
    height: 100%;
    width: 100%;
    padding-bottom: 46px;
    &.is-bought {
      padding-bottom: 0;
    }
    .series-tag {
      position: absolute;
      left: 0;
      top: 4px;
      z-index: 99;

      display: flex;
      align-items: center;
      padding: 0 5px;
      height: 20px;
      border-top-right-radius: 10px;
      border-bottom-right-radius: 10px;

      background: #FFFFFF;
      opacity: 0.95;
      >span {
        margin-left: 4px;
        display: inline-block;
        line-height: 9px;
        font-size: 10px;
        color: #393D42;
      }
    }
    .v-scroller {
      position: relative;
      padding-bottom: 10px;
    }
    .series-info {
      padding: 15px 12px;
      margin-bottom: 10px;
      background: #fff;
      overflow: hidden;
      >p {
        font-size: 14px;
        color: #393D42;
        line-height: 24px;
        .series-type {
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
          color: #FF9B22;
          &:before {
            border-color: #FF9B22;
          }
        }
        .video {
          color: #55C3DC;
          &:before {
            border-color: #55C3DC;
          }
        }
      }
      .info {
        position: relative;
        margin-top: 16px;
        padding-top: 16px;
        font-size: 11px;
        color: #A7A5A6;
        line-height: 11px;
        &:before {
          border-color: #F4F3F3;
        }
        >i {
          margin-right: 6px;
        }
        >span {
          margin-right: 16px;
          display: inline-block;
          vertical-align: middle;
        }
        .btn-details {
          position: absolute;
          bottom: -10px;
          right: 0;

          display: block;
          padding: 10px;
          padding-right: 0;
          font-size: 12px;
          color: #80848A;
          line-height: 1.2;
        }
      }
    }
    .course-list {
      padding: 16px 12px;
      background: #fff;
      >.title {
        line-height: 1;
        margin-bottom: 9px;
        >i {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          vertical-align: middle;
        }
        >span {
          display: inline-block;
          font-size: 15px;
          color: #393D42;
          line-height: 20px;
          vertical-align: middle;
        }
      }
      >.list li {
        display: flex;
        padding: 9px 0;
        >img {
          display: block;
          width: 100px;
          height: 75px;
          margin-right: 10px;
        }
        >.info {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          >p {
            font-size: 14px;
            color: #393D42;
            line-height: 20px;
            >.try-tag {
              padding-top: 1px;
              padding-left: 1px;
              margin-right: 8px;
              display: inline-block;
              width: 32px;
              height: 14px;
              line-height: 14px;
              font-size: 12px;
              color: #5AD2A1;
              text-align: center;
              &:before {
                border-color: #5AD2A1;
              }
            }
          }
          >div {
            font-size: 12px;
            color: #A7A5A6;
            line-height: 10px;
            >i {
              float: left;
              margin-right: 5px;
              display: block;
            }
            >span {
              float: left;
              margin-right: 12px;
              display: block;
            }
            >.time-from-now {
              margin: 0;
              float: right;
            }
          }
        }
      }
    }
  }

</style>
