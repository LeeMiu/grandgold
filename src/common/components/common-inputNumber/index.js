/*
 * @Author: Tang Biao
 * @Date: 2019-03-21
 * @Last Modified by:
 * @Last Modified time: 2019-03-21
 * Ps: iview 的inputNumber输入框真是谁用谁知道
 */

 import XoneInputNumber from './src/xone-input-number.vue'

XoneInputNumber.install = function (Vue) {
  Vue.component(XoneInputNumber.name, XoneInputNumber)
}

export default XoneInputNumber