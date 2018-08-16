<template>
  <section class="my-course-stage">
    <scroller list-name="course_info_list" position-name="course_id" :fetch="fetchData" :list="list" @on-fetch-data="onFetchData">
      <ul class="list">
        <router-link tag="li" v-for="item in list" :key="item.course_id" :to="{ name: item.is_series == 0 ? 'play' : 'series', params: { id: item.course_id }}">
          <div class="course vux-1px-b">
            <div class="course-cover">
              <img :src="item.course_url">
              <span v-if="item.is_series == 1">系列课</span>
            </div>
            <div class="info">
              <div class="title">{{item.course_title}}</div>
              <div class="desc">
                <span>{{item.course_type == 0 ? '语音': '视频'}} • {{item.lecturer_name}}</span>
                <span class="count" v-if="item.is_series == 1">已更新{{item.count}}节</span>
                <span class="duration" v-else>{{formatDuration(item.course_duration)}}分钟</span>
              </div>
            </div>
          </div>
        </router-link>
      </ul>
    </scroller>
  </section>
</template>
<script>
  const fetchData = (position) => {
    return $http.get(`sharing-server-user-common/user/common/myCourseList/get`, {
      params: {
        page_count: 10,
        last_course_id: position || 0
      }
    })
  }
  export default {
    name: 'my-course',
    data() {
      return {
        list: []
      }
    },
    methods: {
      fetchData,
      onFetchData(res) {
        let list = res.data.course_info_list
        this.list.push(...list)
      },
      formatDuration(duration) {
        if (duration) {
          let intDuration = parseInt(duration / 60)
          if (intDuration > 1) {
            duration = intDuration
          } else {
            duration = 1
          }
        }
        return duration
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
  .my-course-stage {
    position: absolute;
    height: 100%;
    width: 100%;
    .list>li {
      padding: 0 12px;
      background: #fff;
      &:last-child>.course:after {
        border: none;
        height: 0;
      }
      >.course {
        padding: 17px 0;
        display: flex;
        &:after {
          border-color: #F4F3F3;
        }
      }
      .course-cover {
        position: relative;
        >img {
          display: block;
          width: 100px;
          height: 75px;
          object-fit: cover;
        }
        >span {
          position: absolute;
          left: 3px;
          bottom: 3px;
          display: block;
          width: 40px;
          height: 15px;
          background: #000;
          opacity: 0.7;
          font-size: 10px;
          color: #FFFFFF;
          line-height: 15px;
          text-align: center;
        }
      }
      .info {
        padding-left: 10px;
        flex: 1;
        >.title {
          height: 65px;
          font-size: 14px;
          color: #393D42;
          line-height: 14px;
        }
        >.desc {
          font-size: 11px;
          color: #A7A5A6;
          line-height: 10px;
          .count,
          .duration {
            float: right;
          }
        }
      }
    }
  }

</style>
