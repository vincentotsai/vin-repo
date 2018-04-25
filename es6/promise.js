const log = console.log.bind(console)

log(new Date() + 'go..')

const p = new Promise((resolve, reject) => {
  log(new Date() + 'in promise')
  setTimeout(() => {
    log(new Date() + ' in settimeout')
    resolve('hello')
    return new Promise((resolve,rej)=> {
      setTimeout(() => {
        log(new Date() + 'another')
        resolve(new Date() + 'another p..')
      }, 4000);
    })
  }, 2000);
})

setTimeout(() => {
  p.then(res => {
    log(new Date() + res + ' world！')
  })
}, 1000);