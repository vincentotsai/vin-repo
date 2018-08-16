import { dateFormat as format } from 'vux'

const getTimeObject = (value) => {
  if(!value) {
    return null
  }
  let d,h,m,s,t = Math.round(parseInt(value * 100)) ;
  d = parseInt(t / (24 * 360000))
  t = t % (24 * 360000)
  h = parseInt(t / 360000)
  t = t % 360000
  m = parseInt(t/ 6000)
  s = Math.round((t % 6000) / 100)
  return {
    d, h, m, s
  }
}

export const dateFormat = (value, formatStr) => {
  return format(new Date(Number(value)), formatStr)
}
export const durationFormat = (value) => {
  let i = value % 60 > 0 ? 1 : 0
  return parseInt(value / 60) + i
}
export const secondsFormat = (value) => {
  if(!value) {
      return '00:00'
  }

  let {h, m, s} = getTimeObject(value)

  let r = []
  if(h > 0) {
    r.push(h > 9 ? h : ('0' + h))
  }
  r.push(m > 9 ? m : ('0' + m))
  r.push(s > 9 ? s : ('0' + s))
  return r.join(':')
}
export const formatTimeFromNow = (value) => {
  let today = new Date()
  let date = new Date(Number(value))
  if(today.getFullYear() == date.getFullYear()) {
    if(today.getMonth() == date.getMonth()) {
      let { d, h, m, s } = getTimeObject((today.getTime() - date.getTime()) / 1000)
      if(d == 1) {
        return '昨天 ' + format(date, 'HH:mm')
      }
      if(d == 0) {
        if(h > 0) {
          return h + '小时之前'
        }
        if(m > 0) {
          return m + '分钟之前'
        }
        return '刚刚'
      }
    }
    return format(date, 'MM-DD HH:mm')
  }
  return format(date, 'YYYY-MM-DD HH:mm')
}
