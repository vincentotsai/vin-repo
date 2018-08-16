import Vue from 'vue'
//日志上报
function updateLog(httpData) {
  Vue.http.get('reportform/log.do', { params: httpData }).then(data => {
    // console.log('log.do->',data)
  })
}
export { updateLog }
