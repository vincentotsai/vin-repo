<template>
  <div class="series-play-stage">
    <scroller list-name="comment_info_list" :fetch="fetchNotes" :list="notes" @on-fetch-data="onFetchNotes">
      <player :id="id" :cover="course.course_url" :type="course.course_type" :title="course.course_title" :src="course.file_path" :controls="true"
        :auto-play="true" :list="playIds" @change-play="changePlay"></player>
      <node-list :notes="notes"></node-list>
    </scroller>
    <play-bottom-bar :is-bought="course.is_bought" :list="playList" @details="toDetails" @share="share" @send="sendMsg"></play-bottom-bar>
  </div>
</template>
<script>
  import nodeList from '../common/note-list'
  import playBottomBar from '../common/play-bottom-bar'
  const fetchData = (id) => {
    return $http.get(`sharing-server-course/course/series/vod/${id}`)
  }
  export default {
    name: 'series-play-page',
    components: {
      nodeList,
      playBottomBar
    },
    data() {
      return {
        id: '',
        course: {},
        notes: [],
        playIds: [],
        playList: []
      }
    },
    methods: {
      fetchNotes(position) {
        return this.$http.get(`sharing-server-course/course/comment/${this.id}`, {
          params: {
            potision: position || 0,
            is_series: 1
          }
        })
      },
      fetchPlayIds(id) {
        this.$http.get(`sharing-server-course/course/series/${id}/s_course_id_list`).then(res => {
          this.playIds = res.data.s_course_ids_list
        })
      },
      onFetchData(res) {
        let data = res.data
        this.course = data
        this.fetchPlayIds(data.course_id)
      },
      onFetchNotes(res) {
        let data = res.data
        let list = data.comment_info_list
        this.notes.push(...list)
      },
      changePlay(play) {
        this.$router.replace({
          name: 'seriesPlay',
          params: {
            id: play.s_course_id
          }
        })
      },
      toDetails() {
        this.$router.push({
          name: 'series',
          params: {
            id: this.course.course_id
          }
        })
      },
      share() {
        this.$root.$emit('show-share-card', this.course.share_card)
      },
      sendMsg(send) {
        send(1).then(comment => {
          if(comment) {
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
    },
    watch: {
      $route() {
        location.reload()
      }
    }
  }

</script>
<style lang="less">
  .series-play-stage {
    position: absolute;
    height: 100%;
    width: 100%;
    padding-bottom: 60px;
    >.v-scroller {
      padding-bottom: 10px;
    }
  }

</style>
