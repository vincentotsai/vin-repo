<template>
  <div class="player">
    <div class="cover" v-if="cover">
      <img :src="cover">
      <a class="btn-try icon-try" v-if="isTry" :class="{'video': isVideo, 'audio': !isVideo, 'playing': playing, 'loading': loading}"
        @click="tryPlay"></a>
    </div>
    <div class="audio-player" v-if="!isVideo" v-show="controls">
      <div class="title">{{title}}</div>
      <div class="duration-range">
        <span>{{currentTimeValue | secondsFormat}}</span>
        <range ref="range" class="input-range" v-model="currentTimeValue" decimal :step="1" :min="0" :max="durationValue"></range>
        <span>{{durationValue | secondsFormat}}</span>
      </div>
      <div class="button-box">
        <a @click="changeDuration(-15)">
          <i class="icon-last-15s" :class="{ 'disabled': disabledLast15s }"></i>
        </a>
        <a @click="last">
          <i class="icon-last" :class="{ 'disabled': disabledLast }"></i>
        </a>
        <a @click="play()">
          <i class="icon-play" :class="{ 'playing': playing, 'loading': loading }"></i>
        </a>
        <a @click="next">
          <i class="icon-next" :class="{ 'disabled': disabledNext }"></i>
        </a>
        <a @click="changeDuration(15)">
          <i class="icon-next-15s" :class="{ 'disabled': disabledNext15s }"></i>
        </a>
      </div>
    </div>
  </div>
</template>
<script>
  import { Range } from 'vux'
  export default {
    name: 'player',
    components: {
      Range
    },
    props: {
      id: [String, Number],
      isTry: Boolean,  //是否有试听课
      type: Number,    //0 音频 1视频
      cover: String,   //封面
      src: String,     //音视频地址
      title: String,   //音频控制器需要显示课程名称
      controls: Boolean,  //是否显示控制器（默认不显示，只显示封面）
      list: Array,   //播放列表
      onTryBtnClick: Function   //点击试听试播按钮的触发器（主要用于系列课的试听试播，因为系列课需要特殊处理，而不是当前页播放）
    },
    data() {
      return {
        isInit: false,
        loading: false,
        playing: false,
        dragging: false,
        currentTimeValue: 0,
        durationValue: 0,
        lastPlay: null,
        nextPlay: null
      }
    },
    computed: {
      disabledLast15s() {
        return this.loading || !this.currentTimeValue || this.currentTimeValue <= 15
      },
      disabledNext15s() {
        return this.loading || !this.currentTimeValue || this.durationValue - this.currentTimeValue <= 15
      },
      disabledLast() {
        return this.loading || !this.lastPlay
      },
      disabledNext() {
        return this.loading || !this.nextPlay
      },
      isVideo() {
        return this.type == 1
      },
      player() {
        return this.isVideo ? window.video : window.audio
      },
      autoPlay() {
        return this.controls
      },
      showVideo() {
        return this.isVideo && (this.controls || this.playing)
      }
    },
    methods: {
      initPlayer() {
        if (!this.isInit) {
          let player = this.player
          //判断是否已经全局播放，如果是，则暂停（之后会继续执行自动播放流程），否则直接覆盖src
          if(!window.audio.paused) {
            window.audio.pause()
          }
          if(!window.video.paused) {
            window.video.pause()
          }
          if(player.src != this.src) {   //不同课程即使源文件相同，src也是不同的，所以只需要判断src即可
            player.src = this.src
          }

          player.onplaying = () => {
            this.playing = true
            this.loading = false
          }
          player.ontimeupdate = () => {
            if (!this.dragging) {
              this.currentTimeValue = player.currentTime || 0
              this.durationValue = player.duration || 0
            }
          }
          player.onended = () => {
            this.currentTimeValue = this.durationValue
            this.playing = false
            this.$emit('ended')
          }
          player.onwaiting = () => {
            this.playing = false
            this.loading = true
          }
          player.oncanplay = () => {
            if (this.autoPlay && player.paused) {
              player.play()
            }
          }
          player.oncanplaythrough = () => {
            if (this.autoPlay && player.paused) {
              player.play()
            }
          }
          if(!this.isVideo) {
            this.$nextTick(() => {
              let handle = this.$refs.range.range.handle
              handle.addEventListener('touchstart', (e) => {
                this.dragging = true
                e.stopPropagation()
              })
              handle.addEventListener('touchmove', (e) => {
                e.stopPropagation()
              })
              handle.addEventListener('touchend', () => {
                player.currentTime = this.currentTimeValue
                this.dragging = false
              })
            })
          }
        }
        this.isInit = true
      },
      play() {
        if (!this.src || this.loading) {
          return
        }
        this.initPlayer()
        if (this.player.paused && !this.playing) {
          this.player.play()
        } else {
          this.stopPlay()
        }
      },
      tryPlay() {
        this.$emit('try-click')
        if (!this.playing) {
          this.player.src = this.src
        }
        this.play()
        this.$root.$emit('hide-playing')
      },
      stopPlay() {
        if (!this.player.paused && this.playing) {
          this.playing = false
          this.player.pause()
        }
      },
      getLastAndNext() {
        let list = this.list
        this.lastPlay = null
        this.nextPlay = null
        if (list && list.length > 1) {
          list.map((o, i) => {
            if (o.s_course_id == this.id) {
              this.lastPlay = list[i - 1] || null
              this.nextPlay = list[i + 1] || null
            }
          })
        }
      },
      last() {
        this.lastPlay && this.$emit('change-play', this.lastPlay)
      },
      next() {
        this.nextPlay && this.$emit('change-play', this.nextPlay)
      },
      changeDuration(num) {
        if(num < 0 && this.disabledLast15s) {
          return
        }
        if(num > 0 && this.disabledNext15s) {
          return
        }
        this.player.currentTime = this.player.currentTime + num
      }
    },
    beforeDestroy() {
      let isPlaying = this.player && !this.player.paused && this.playing
      if(isPlaying) {
        if(this.isTry) {
          this.stopPlay()
        } else {
          this.$root.$emit('show-playing', this.id)
        }
      }
      this.$root.$emit('video-show-or-hide', false)
    },
    watch: {
      src(v) {
        this.$nextTick(() => {
          if (this.autoPlay && v) {
            this.play()
          }
        })
      },
      list(v) {
        this.$nextTick(() => {
          this.getLastAndNext()
        })
      },
      showVideo(v) {
        this.$root.$emit('video-show-or-hide', v)
      }
    }
  }

</script>
<style lang="less">
  .player {
    position: relative;
    .cover {
      position: relative;
      height: 211px;

      >img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .btn-try {
        position: absolute;
        right: 0;
        bottom: 0;
      }
      audio {
        width: 0;
        height: 0;
        overflow: hidden;
      }
    }
    .audio-player {
      padding: 14px 24px;
      margin-bottom: 10px;
      background: #fff;
      >.title {
        margin-bottom: 34px;
        font-size: 14px;
        color: #393D42;
        line-height: 22px;
      }
      .duration-range {
        display: flex;
        justify-content: space-between;
        padding: 7px 0;
        margin-bottom: 23px;
        font-size: 12px;
        color: #80848A;
        line-height: 14px;
        .input-range {
          margin: 0 !important;
          padding: 7px 10px;
          width: 100%;
          line-height: 0;
          .range-min,
          .range-max {
            display: none;
          }
          .range-handle {
            top: -5px !important;
            background: #FE5252;
            border-radius: 27px;
            width: 4px;
            height: 10px;
            box-shadow: none;
            &:before {
              content: '';
              position: absolute;
              width: 80px;
              height: 40px;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              z-index: 99;
            }
          }
          .range-quantity {
            background: #FE5252;
          }
        }
      }
      .button-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        >a {
          position: relative;
          display: block;
          height: 50px;
          width: 50px;
          >i {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        }
        >.big {
          padding: 20px;
        }
      }
    }
  }

</style>
