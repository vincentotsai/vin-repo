<template>
  <ul class="note-list">
    <li class="header">
      <i class="icon-note-small"></i>
      <h1>笔记</h1>
      <span>写下笔记，记录此刻的想法</span>
    </li>
    <li class="note-item" v-for="(item, index) in notes" :key="index">
      <div class="info">
        <img class="avatar" :src="item.user_info.avatar_address">
        <span class="name ellipsis">{{item.user_info.nick_name}}</span>
        <span class="time">{{item.create_time | formatTimeFromNow}}</span>
      </div>
      <p class="content vux-1px-b">{{item.content}}</p>
    </li>
  </ul>
</template>
<script>
export default {
  name: 'note-list',
  props: ['notes']
}
</script>
<style lang="less" scoped>
.note-list {
  padding: 0 13px;
  background: #fff;
  > .header {
    display: flex;
    align-items: flex-end;
    padding: 23px 0;
    font-size: 12px;
    color: #a7a5a6;
    line-height: 16px;
    > .icon-note,
    > span {
      display: block;
    }
    > h1 {
      margin-left: 5px;
      margin-right: 7px;
      font-size: 16px;
      font-weight: normal;
      color: #393d42;
      line-height: 18px;
    }
  }
  > .note-item {
    > .info {
      display: flex;
      align-items: center;
      padding: 12px 0 10px 0;
    }
    .avatar {
      display: block;
      width: 26px;
      height: 26px;
      border-radius: 50%;
    }
    .name {
      flex: 1;
      display: block;
      padding: 0 8px;
      font-size: 13px;
      color: #80848a;
      line-height: 16px;
    }
    .time {
      display: block;
      font-size: 11px;
      color: #a7a5a6;
      line-height: 12px;
    }
    > .content {
      margin-left: 34px;
      padding-bottom: 14px;
      font-size: 13px;
      color: #393d42;
      line-height: 21px;
      &:after {
        border-color: #f4f3f3;
      }
    }
  }
}
</style>


