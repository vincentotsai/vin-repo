<template>
  <div id="app">
    <div v-show="loading">加载中。。。</div>
    <div>播放时间：{{currentTime}}</div>
    <button @click="last" v-show="index > 0"><<</button>
    <button @click="play">{{ paused ? 'play' : 'pause'}}</button>
    <button @click="next" v-show="index < source.length - 1">>></button>
  </div>
</template>

<script>
export default {
  name: 'app',
  myOpt:'app tot..',
  data () {
    return {
      source: [
        'http://audio.qnhdlive.tsingning.com/ljRojWYiSVSF70NJjzLXnkwCs7kM',
        'http://audio.qnhdlive.tsingning.com/ltwCZJa1O_oG4geG-JJZSwdbgVUm',
        'http://audio.qnhdlive.tsingning.com/ljQShlfLlDFgLd8fPdRlJz38j16L'
      ],
      index: 0,
      paused: true,
      loading: true,
      currentTime: 0
    }
  },
  mounted() {
    this.audio.ontimeupdate = () => {
      let minutes = Math.floor(this.audio.currentTime / 60)
      let seconds = Math.floor(this.audio.currentTime - minutes * 60)
      let minuteValue,secondValue;
      if (minutes < 10) {
        minuteValue = '0' + minutes
      } else {
        minuteValue = minutes
      }
      if (seconds < 10) {
        secondValue = '0' + seconds
      } else {
        secondValue = seconds
      }
      this.currentTime = minuteValue + ':' + secondValue
    }
    this.audio.onended = () => {
      this.next()
    }
    this.audio.oncanplaythrough = () => {
      this.loading = false
      if (this.paused) {
        this.play()
      }
    }

    this.loadSrc()

    document.addEventListener("WeixinJSBridgeReady", () => {
      this.loadSrc()
    }, false);

  },
  computed: {
    audio() {
      return window.audio
    }
  },
  methods: {
    loadSrc() {
      this.paused = true
      this.loading = true
      this.currentTime = 0
      this.audio.src = this.source[this.index]
      this.audio.load()
    },
    last() {
      this.index = this.index - 1
    },
    next() {
      this.index = this.index + 1
    },
    play() {
      this.paused = !this.paused
    }
  },
  watch: {
    index(v) {
      console.log(v)
      this.loadSrc()
    },
    paused(v) {
      if(v) {
        this.audio.pause()
      } else {
        this.audio.play()

      }
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  font-size: 28px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}
button {
  height: 60px;
  width: 150px;
  font-size: 28px;

}

a {
  color: #42b983;
}
</style>
