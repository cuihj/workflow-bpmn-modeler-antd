
import Vue from 'vue'
import App from './Lib.vue'
// import ElementUI from 'element-ui'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css';

Vue.config.productionTip = false

Vue.use(Antd)

new Vue({
  render: h => h(App)
}).$mount('#app')
