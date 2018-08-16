<template>
  <section class="pay-history-stage">
    <scroller list-name="cost_info_list" position-name="position" :fetch="fetchData" :list="list" @on-fetch-data="onFetchData">
      <ul class="list">
        <li class="vux-1px-b" v-for="(item, i) in list" :key="i">
          <div class="name ellipsis">{{item.shop_name}}</div>
          <div class="price">-{{item.payment | moneyFormat}}</div>
          <div class="desc ellipsis">购买课程：{{item.consumer_behavior}}</div>
          <div class="date">{{item.create_time | dateFormat('YYYY年MM月DD日')}}</div>
        </li>
      </ul>
    </scroller>
  </section>
</template>
<script>
  const fetchData = (position) => {
    return $http.get(`sharing-server-user-common/user/common/myCostList`, {
      params: {
        page_count: 10,
        position: position || 0
      }
    })
  }
  export default {
    name: 'pay-history',
    data() {
      return {
        list: []
      }
    },
    methods: {
      fetchData,
      onFetchData(res) {
        let list = res.data.cost_info_list
        this.list.push(...list)
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
  .pay-history-stage {
    position: absolute;
    height: 100%;
    width: 100%;
    .list {
      padding-top: 10px;
      >li {
        padding: 12px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
        background: #fff;
        &:after {
          border-color: #E9ECEE;
        }
      }
      .name {
        width: 150px;
        font-size: 15px;
        color: #393D42;
      }
      .desc,
      .date {
        margin-top: 10px;
        font-size: 12px;
        color: #80848A;
      }
      .desc {
        width: 230px;
      }
      .price {
        font-size: 15px;
        color: #FE5252;
      }
    }
  }

</style>
