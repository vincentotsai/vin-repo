<template>
  <ul class="course-details">
    <li class="lecturer-info" v-if="lecturer.lecturer_id">
      <div class="title">
        <i style="background: #99D6FF"></i>
        <span>讲师介绍</span>
      </div>
      <router-link class="avatar" tag="img" :to="{ name: 'lecturer', params: { id: lecturer.lecturer_id } }" :src="lecturer.avatar_address">
      </router-link>
      <div class="name">{{lecturer.lecturer_name}}</div>
      <div class="desc">{{lecturer.lecturer_title}}</div>
      <p class="content">{{lecturer.lecturer_remark}}</p>
    </li>
    <li v-if="remark">
      <div class="title">
        <i style="background: #FF9B22"></i>
        <span>课程简介</span>
      </div>
      <div class="content">
        <p v-if="remark.length > 0 && remark[0].content">{{remark[0].content}}</p>
        <template v-for="(item, index) in remark" v-if="index != 0">
          <p v-if="item.type == 0" :key="index">{{item.content}}</p>
          <img v-else :src="item.content" :key="index">
        </template>
      </div>
    </li>
    <li v-if="course.target_user">
      <div class="title">
        <i style="background: #BDEE9E"></i>
        <span>适应人群</span>
      </div>
      <p class="content">{{course.target_user}}</p>
    </li>
    <li>
      <div class="title">
        <i style="background: #E694C3"></i>
        <span>购买须知</span>
      </div>
      <p class="content">{{course.buy_tips}}</p>
    </li>
  </ul>
</template>
<script>
  export default {
    name: 'course-details',
    props: {
      course: {
        type: Object,
        default: {}
      },
      lecturer: {
        type: Object,
        default: {}
      }
    },
    computed: {
      remark() {
        return this.$util.toJSON(this.course.course_remark)
      }
    }
  }

</script>
<style lang="less" scoped>
  .course-details {
    background: #fff;
    >li {
      padding: 16px 12px;
      >.title {
        line-height: 1;
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
      >.content {
        margin-top: 12px;
        font-size: 14px;
        color: #666666;
        line-height: 24px;
        >p,
        >img {
          width: 100%;
          margin-bottom: 15px;
          display: block;
        }
      }
    }
    >.lecturer-info {
      .avatar {
        margin: 15px auto 10px auto;
        display: block;
        width: 80px;
        height: 80px;
        border-radius: 50%;
        object-fit: cover;
      }
      .name {
        font-size: 15px;
        color: #0D0D0D;
        line-height: 22px;
        text-align: center;
      }
      .desc {
        margin-top: 4px;
        margin-bottom: 14px;
        font-size: 11px;
        color: #A7A5A6;
        line-height: 1;
        text-align: center;
      }
    }
  }

</style>
