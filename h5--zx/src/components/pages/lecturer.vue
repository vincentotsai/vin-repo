<template>
  <section class="lecturer-stage">
    <scroller list-name="course_info_list" position-name="course_id" :fetch="fetchSingleList" :list="singleList" @on-fetch-data="onFetchSingleList">
      <div class="lecturer-info">
        <img :src="lecturer.avatar_address">
        <dl>
          <dt class="ellipsis">{{lecturer.lecturer_name}}</dt>
          <dd class="ellipsis">{{lecturer.lecturer_title}}</dd>
        </dl>
        <div class="sale-num vux-1px">{{lecturer.sale_num_total}}人订阅</div>
        <div class="remark-box" :class="{ expand: expand, more: moreRemark }">
          <p ref="remark" :class="{ expand: expand, collapse: !expand }">{{lecturer.lecturer_remark || '这个讲师很懒，什么也没有写~'}}</p>
          <a @click="expand = !expand">
            <i class="icon-expand"></i>
          </a>
        </div>
      </div>
      <course-list v-if="seriesList.length > 0" :is-series="true" :title="{text: '系列课列表', color: '#FF7D61'}" :list="seriesList"></course-list>
      <a v-if="!noMoreSeries && seriesList.length > 0" class="btn-more" @click="fetchSeriesList">
        <span>查看更多</span>
        <i class="icon-more"></i>
      </a>
      <a v-if="noMoreSeries && seriesList.length > seriesSize" class="btn-more-collapse" @click="collapse">
        <span>收起</span>
        <i class="icon-more-collapse"></i>
      </a>
      <course-list v-if="singleList.length > 0" :title="{text: '课程列表', color: '#22CF91'}" :list="singleList"></course-list>
    </scroller>
  </section>
</template>
<script>
  import courseList from './lecturer-course-list'
  const fetchInfo = (id) => {
    return $http.get(`sharing-server-user-common/user/common/lecturer/${id}/info`)
  }
  const fetchSingleList = (id, position) => {
    return $http.get(`sharing-server-course/course/lecturer/${id}/single_list`, {
      params: {
        last_course_id: position
      }
    })
  }
  export default {
    name: 'lecturer',
    components: {
      courseList
    },
    data() {
      return {
        lecturer: {},
        singleList: [],
        seriesList: [],
        noMoreSeries: false,
        seriesSize: 4,

        moreRemark: false,
        expand: false
      }
    },
    methods: {
      onFetchInfo(res) {
        this.lecturer = res.data.lecturer_info
      },
      fetchSeriesList() {
        let lastCourseId = 0
        let list = this.seriesList
        if (list.length > 0) {
          lastCourseId = list[list.length - 1].course_id
        }
        this.$http.get(`sharing-server-course/course/lecturer/${this.$route.params.id}/series_list`, {
          params: {
            last_course_id: lastCourseId,
            page_count: this.seriesSize
          }
        }).then(res => {
          let data = res.data
          let list = data.course_info_list
          if (list && list.length > 0) {
            this.seriesList.push(...list)
            if (list.length < this.seriesSize) {
              this.noMoreSeries = true
            }
          }
        })
      },
      fetchSingleList(position) {
        return fetchSingleList(this.$route.params.id, position)
      },
      onFetchSingleList(res) {
        let data = res.data
        let list = data.course_info_list
        this.singleList.push(...list)
      },
      collapse() {
        this.seriesList = this.seriesList.splice(0, 4)
        this.noMoreSeries = false
      }
    },
    beforeRouteEnter(to, from, next) {
      let id = to.params.id
      fetchInfo(id).then(res => {
        next(vm => {
          vm.onFetchInfo(res)
          vm.fetchSeriesList()
          vm.fetchSingleList().then(vm.onFetchSingleList)
        })
      })
    },
    updated() {
      if(!this.moreRemark) {
        this.moreRemark = this.$refs.remark.scrollHeight > this.$refs.remark.clientHeight
      }
    }
  }

</script>
<style lang="less" scoped>
  .lecturer-stage {
    position: absolute;
    height: 100%;
    width: 100%;
    .lecturer-info {
      display: flex;
      flex-flow: wrap;
      align-items: center;
      padding: 23px 12px 21px 12px;
      background: #fff;
      >img {
        display: block;
        width: 52px;
        height: 52px;
        border-radius: 50%;
      }
      >dl {
        flex: 1;
        padding: 0 12px;
        overflow: hidden;
        >dt {
          margin-bottom: 9px;
          font-size: 17px;
          color: #393D42;
          line-height: 17px;
        }
        >dd {
          font-size: 11px;
          color: #A7A5A6;
          line-height: 11px;
        }
      }
      >.sale-num {
        padding: 0 9px;
        height: 22px;
        line-height: 22px;
        font-size: 11px;
        color: #FF7D61;
        &:before {
          border-color: #FF7D61;
          border-radius: 100px;
        }
      }
      >.remark-box {
        position: relative;
        margin-top: 26px;
        width: 100%;
        transition: all 1s ease 0;
        &.more {
          margin-bottom: 29px;
          >a {
            display: block;
          }
        }
        >p {
          display: -webkit-box;
          font-size: 14px;
          color: #666666;
          line-height: 24px;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-box-orient: vertical;
          &.expand {
            -webkit-line-clamp: 0;
          }
          &.collapse {
            -webkit-line-clamp: 2;
          }
        }
        >a {
          position: absolute;
          bottom: -39px;
          left: 50%;
          transform: translate(-50%, 0);
          display: none;
          padding: 10px;
        }
      }
    }
    .btn-more, .btn-more-collapse {
      display: block;
      height: 48px;
      line-height: 48px;

      background: #fff;
      font-size: 12px;
      color: #A7A5A6;
      text-align: center;
      >span {
        margin-right: 4px;
        display: inline-block;
        vertical-align: middle;
      }
    }
  }

</style>
