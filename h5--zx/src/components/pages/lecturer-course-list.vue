<template>
  <ul class="lecturer-course-list">
    <li class="title">
      <span><i :style="'background:' + title.color"></i>{{title.text}}</span>
    </li>
    <li class="vux-1px-b" v-for="(item, index) in list" :key="index" @click="linkTo(item)">
      <div class="cover">
        <img :src="item.course_url">
        <span v-if="isSeries">系列课</span>
      </div>
      <dl class="info">
        <dt class="ellipsis">{{item.course_title}}</dt>
        <dd v-if="item.charge_type == 1">
          <span>{{item.course_price | moneyFormat}}</span>
          <span class="income">&nbsp;赚&nbsp;{{item.distributer_income | moneyFormat}}</span>
        </dd>
        <dd v-else>免费</dd>
        <dd class="type">{{item.course_type == 1 ? '视频':'音频'}} · {{item.distribute_times}}人已分销</dd>
      </dl>
    </li>
  </ul>
</template>
<script>
export default {
  name: 'lecturer-course-list',
  props: ['title', 'list', 'isSeries'],
  methods: {
    linkTo(course) {
      const nameMap = {
        '0': 'course', //未购买的单品课
        '1': 'series', //未购买的系列课
        '2': 'play', //已购买的单品课
        '3': 'series' //已购买的系列课
      }
      this.$router.push({
        name: nameMap[course.is_bought*2 - this.isSeries ? 1 : 0],
        params: {
          id: course.course_id
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .lecturer-course-list {
    padding: 0 12px;
    margin-top: 10px;
    background: #fff;
    >li {
      padding: 17px 0;
      display: flex;
      flex-flow: wrap;
      &:after {
        border-color: #F4F3F3;
      }
      &:last-child:after {
        border: none;
      }
      &.title {
        padding: 24px 0 8px 0;
        font-size: 16px;
        color: #393D42;
        line-height: 1;
        >span {
          position: relative;
          display: block;
          padding-left: 7px;
          >i {
            position: absolute;
            top: 50%;
            left: 0;
            transform: translate(0, -50%);
            display: block;
            width: 2px;
            height: 13px;
            line-height: 16px;
          }
        }
      }
      >.cover {
        position: relative;
        margin-right: 10px;
        >img {
          display: block;
          width: 100px;
          height: 75px
        }
        >span {
          position: absolute;
          bottom: 3px;
          left: 3px;
          display: block;
          width: 40px;
          height: 15px;
          line-height: 15px;
          opacity: 0.7;
          background: #000000;
          font-size: 10px;
          color: #FFFFFF;
          text-align: center
        }
      }
      >.info {
        flex: 1;
        line-height: 1;
        >dt {
          font-size: 14px;
          color: #393D42;
        }
        >dd {
          margin-top: 19px;
          font-size: 14px;
          color: #393D42;
          >.income {
            color: #FE5252;
          }
        }
        >.type {
          margin-top: 14px;
          font-size: 11px;
          color: #A7A5A6;
          line-height: 1;
        }
      }
    }
  }

</style>
