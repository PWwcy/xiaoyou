import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './assets/styles/element-variables.scss'

import '@/assets/styles/index.scss' // global css
import '@/assets/styles/ruoyi.scss' // ruoyi css
import App from './App'
import store from './store'
import router from './router'
import permission from './directive/permission'

import './assets/icons' // icon
import './permission' // permission control
import { getDicts } from "@/api/system/dict/data";
import { getConfigKey } from "@/api/system/config";
import { parseTime, resetForm, addDateRange, selectDictLabel, download } from "@/utils/ruoyi";
import myConst from "@/utils/const"
import Pagination from "@/components/Pagination";
import ElImageViewer from 'element-ui/packages/image/src/image-viewer';

// 全局方法挂载
Vue.prototype.getDicts = getDicts
Vue.prototype.getConfigKey = getConfigKey
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.download = download

// 上传文件路径
Vue.prototype.uploadFileUrl = myConst.uploadFileApi;
// 金额单位
Vue.prototype.moneyUnit = myConst.moneyUnit;
// 游豆单位
Vue.prototype.beanUnit = myConst.beanUnit;
// 次数单位
Vue.prototype.numUnit = myConst.numUnit;
// 时间单位
Vue.prototype.dayUnit = myConst.dayUnit;
Vue.prototype.minUnit = myConst.minUnit;
// 得分单位
Vue.prototype.scoreUnit = myConst.scoreUnit;


Vue.prototype.msgSuccess = function (msg) {
    this.$message({ showClose: true, message: msg, type: "success" });
}

Vue.prototype.msgError = function (msg) {
    this.$message({ showClose: true, message: msg, type: "error" });
}

Vue.prototype.msgInfo = function (msg) {
    this.$message.info(msg);
}

// 全局组件挂载
Vue.component('Pagination', Pagination)
Vue.component('ElImageViewer', ElImageViewer)

Vue.use(permission)

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

Vue.use(Element, {
    size: Cookies.get('size') || 'medium' // set element-ui default size
})

Vue.config.productionTip = false

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})