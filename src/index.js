import Vue from 'vue'
import app from './app.vue'

Vue.config.productionTip = false

new Vue({
  el: '#root',
  render: h => h(app)
})
