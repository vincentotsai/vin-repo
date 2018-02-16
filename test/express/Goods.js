const express = require('express')
const app = express()
const router = express.Router()


let log = console.log.bind(console)

const jsonData = require('./goods.json')

log(jsonData)

router.get('/goods',(req, res)=>{
  log('req->>',req)
  res.json({
    data: jsonData
  })
})

app.use('/api', router)

app.listen(8888)