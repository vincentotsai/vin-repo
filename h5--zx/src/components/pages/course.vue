<template>
  <section class="course-stage">
    <scroller>
      <player :is-try="course.is_bought == 0" :cover="course.course_url" :type="course.course_type" :src="course.free_file_address"></player>
      <div class="course-info">
        <p>
          <span class="course-type vux-1px" :class="course.course_type == 0 ? 'audio' : 'video'">{{course.course_type == 0 ? '语音': '视频'}}</span>{{course.course_title}}
        </p>
        <div class="info vux-1px-t">
          <i class="icon-duration"></i><span>课程时长{{course.course_duration | durationFormat}}分</span>
          <i class="icon-user"></i><span>{{course.sale_total}}人听讲</span>
          <i class="icon-class"></i><span>{{course.classify_name}}</span>
        </div>
      </div>
      <course-details :course="course" :lecturer="lecturer"></course-details>
    </scroller>
    <course-bottom-bar :status="status" :price="course.course_price" :share-url="course.share_card" @btn-handler="toPlay"></course-bottom-bar>
  </section>
</template>
<script>
  import courseDetails from '../common/course-details.vue'
  import courseBottomBar from '../common/course-bottom-bar'

  const fetchData = (id) => {
    let shopId = sessionStorage.getItem('ZX_H5_SHOP_ID')
    return $http.get(`sharing-server-course/course/details/${id}`, {
      params: {
        shop_id: shopId
      }
    })
  }
  export default {
    name: 'course',
    components: {
      courseBottomBar,
      courseDetails
    },
    data() {
      return {
        course: {
          is_bought: 1
        },
        lecturer: {}
      }
    },
    computed: {
      status() {
        // 0 收费 1 免费 2 已购买
        let course = this.course
        if(course.is_bought == 1) {
          return 2
        } else if(course.charge_type == 1) {
          return 0
        } else {
          return 1
        }
      }
    },
    methods: {
      onFetchData(res) {
        let data = res.data
        let course = data.course_info
        course.is_bought = data.is_bought
        this.course = course

        this.lecturer = {
          avatar_address: course.lecturer_avatar_address,
          lecturer_name: course.lecturer_name,
          lecturer_title: course.lecturer_title,
          lecturer_remark: course.lecturer_remark,
          lecturer_id: course.lecturer_id
        }
      },
      toPlay() {
        this.$router.push({
          name: 'play',
          params: {
            id: this.course.course_id,
          }
        })
      }
    },
    beforeRouteEnter(to, from, next) {
      let id = to.params.id
      fetchData(id).then(res => {
        next(vm => {
          vm.onFetchData(res)
        })
      })
    }
  }

</script>
<style lang="less" scoped>
  .course-stage {
    position: absolute;
    height: 100%;
    width: 100%;
    padding-bottom: 46px;
    .v-scroller {
      padding-bottom: 10px;
    }
    .course-info {
      padding: 15px 12px;
      margin-bottom: 10px;
      background: #fff;
      overflow: hidden;
      >p {
        font-size: 14px;
        color: #393D42;
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
      }
    }
  }

</style>
