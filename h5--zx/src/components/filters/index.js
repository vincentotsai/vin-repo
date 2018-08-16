import Vue from 'vue'
import * as money from './money'
import * as date from './date'

const filters = Object.assign({},
  money,
  date
)
for (let key in filters) {
  Vue.filter(key, filters[key])
}
