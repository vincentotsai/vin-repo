<template>
  <div class="play-stage">
    <scroller list-name="comment_info_list" :fetch="fetchNotes" :list="notes" @on-fetch-data="onFetchNotes">
      <player :id="id" :cover="course.course_url" :type="course.course_type" :title="course.course_title" :src="course.file_address" :controls="true" :auto-play="true"></player>
      <node-list :notes="notes"></node-list>
    </scroller>
    <play-bottom-bar :is-bought="course.is_bought" @details="toDetails" @share="share" @send="sendMsg"></play-bottom-bar>
  </div>
</template>
<script>
import nodeList from '../common/note-list'
import playBottomBar from '../common/play-bottom-bar'
const fetchData = id => {
  return $http.get(`sharing-server-course/course/vod/${id}`)
}
export default {
  name: 'play-page',
  components: {
    nodeList,
    playBottomBar
  },
  data() {
    return {
      id: '',
      course: {},
      notes: []
    }
  },
  methods: {
    fetchNotes(position) {
      return this.$http.get(`sharing-server-course/course/comment/${this.id}`, {
        params: {
          potision: position || 0,
          is_series: 0
        }
      })
    },
    onFetchData(res) {
      let data = res.data
      this.course = data
    },
    onFetchNotes(res) {
      let data = res.data
      let list = data.comment_info_list
      this.notes.push(...list)
    },
    toDetails() {
      this.$router.push({
        name: 'course',
        params: {
          id: this.id
        }
      })
    },
    share() {
      this.$root.$emit('show-share-card', this.course.share_card)
    },
    sendMsg(send) {
      send().then(comment => {
        if (comment) {
          this.notes.unshift(comment)
        }
      })
    }
  },
  beforeRouteEnter(to, from, next) {
    let id = to.params.id
    fetchData(id).then(res => {
      next(vm => {
        vm.id = id
        vm.onFetchData(res)
        vm.fetchNotes().then(vm.onFetchNotes)
      })
    })
  }
}
</script>
<style lang="less">
.play-stage {
  position: absolute;
  height: 100%;
  width: 100%;
  padding-bottom: 60px;
  > .v-scroller {
    padding-bottom: 10px;
  }
}
</style>
