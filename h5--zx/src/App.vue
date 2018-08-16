<template>
  <div id="apps">
    <router-view></router-view>
    <share-card></share-card>
    <player-status></player-status>
    <player-media></player-media>
  </div>
</template>

<script>
import shareCard from './components/common/share-card'
import playerStatus from './components/common/player-status'
import playerMedia from './components/common/player-media'

export default {
  name: 'app',
  components: {
    shareCard,
    playerStatus,
    playerMedia
  }
}
</script>
<style lang="less">
@import '~vux/src/styles/reset.less';
@import '~vux/src/styles/1px.less';
@import './style/index.less';
</style>
