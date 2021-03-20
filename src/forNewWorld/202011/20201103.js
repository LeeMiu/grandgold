/**
 * Vue中定义全局方法
 * 1、挂载在vue.prototype上
 * Vue.prototype.globalFunc = function Func (args) {
 *  // do somethings
 *  console.log(args);
 * }
 * 缺点：调用该方法时没有提示
 * 2、利用全局混入mixin，将方法写在mixin中的methods中，
 * //mixin.js
 * export const mixin = {
 *  data () {
 *      key: 'someValue',
 *   },
 *   methods: {
 *      func (params, key = this.key) {
 *  // do somethings
 *          console.log(params, key);
 *      }
 *   }
 * }
 * 
 * import mixinFunc from '@/mixin.js'
 * 其他文件就是：
 * Vue.mixin(mixinFunc)或者export default { mixins[mixinFunc, mixinFunc1], components: {...}, data () {...} }
 * this.func()即可调用该方法
 * 优点：mixin中的methods会和创建的每个单文件组件合并，在调用这个方法时会有提醒。
 * 3、使用plugin方式，
 * plugin中install方法，在install中通过Vue.prototypes
 * const plugin = {
 *      install: function(Vue) {
 *          Vue.prototype.$pluginFunc = function (val) { // do somethings },
 *      }
 *  }
 *  Vue.use(plugin)
 * 4、任意文件中写全局函数
 * this.$root.$on('func', function(){}); // 注册全局方法
 * this.$root.$emit('func'); // 调用全局方法
 * this.$root.$off('func'); // 销毁全局方法
 */
/**
 * 单文本居中、多文本居左显示
 * display: flex;
 * flex-direction: row;
 * justify-content: center;
 */

 /**
  * 我想实现一段动画，我有哪些可选的实现方式？一段流畅的动画帧与帧之间间隔有什么要求？
  * html5动画，js动画，CSS3动画（transition）。多数情况下最高的绘制频率只能是每秒60帧(frame per second)，
  * 对应于显示器的60Hz，低于这个频率，肉眼感觉画面卡顿不流畅，高于这个频率，及其耗费性能。
  * 因此通常采用的时间间隔就是1/60,也就是16.7ms。
  */

  /**
   * Promise实现异步的原理：Promise 也还是使用回调函数，只不过是把回调封装在了内部，使用上一直通过 then 方法的链式调用，
   * 使得多层的回调嵌套看起来变成了同一层的，书写上以及理解上会更直观和简洁一些。调用 Promise 对象的 then 方法注册异步
   * 操作完成后的 onFulfilled，最后当异步操作完成时，调用 resolve(value)， 执行 then 方法注册的 onFulfilled。then 
   * 方法注册的 onFulfilled 是存在一个数组中，可见 then 方法可以调用多次，注册的多个onFulfilled 会在异步操作完成后根据添加的顺序依次执行
   * 
   * 为什么resolve后的代码可以继续执行：因为resolve后返回的还是一个Promise，可以继续调用执行。
   */

  /**
   * React中的setState什么时候是同步的什么时候是异步的？为什么原生方法和事件能实现同步？
   * 答：setState 只在合成事件和钩子函数中是“异步”的，在原生事件和setTimeout 中都是同步的。
   * setState 的“异步”并不是说内部由异步代码实现，其实本身执行的过程和代码都是同步的，
   * 只是合成事件和钩子函数的调用顺序在更新之前，导致在合成事件和钩子函数中没法立马拿到更新后的值，
   * 形成了所谓的“异步”，当然可以通过第二个参数 setState(partialState, callback) 中的callback拿到更新后的结果。
   * 
   * setState 的批量更新优化也是建立在“异步”（合成事件、钩子函数）之上的，在原生事件和setTimeout 中不会批量更新，
   * 在“异步”中如果对同一个值进行多次setState，setState的批量更新策略会对其进行覆盖，取最后一次的执行，
   * 如果是同时setState多个不同的值，在更新时会对其进行合并批量更新。
   */

   /**
    * nextTick作用和实现一个nextTick
    * nextTick在vue官网叙述：在下次 DOM 更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM。
    * 场景：在vue的created生命周期时，dom并没有进行任何渲染，需要放到nextTick中去获取，与其对于得到生命周期mounted
    * 浅谈event-loop事件循环
    * js是单线程执行，执行栈分宏任务（macro-task）和微任务（micro-task）
    * 宏任务主要有：setTimeout、I/O、setInterval、setImmediate、主线程、MessageChannel
    * 微任务主要有：Primse的then、catch、finally；$nextTick；MutationObserver
    * 实现：
    *   //1、声明macroTask, macroToask, callbasks, useMacroTask等,
        //2、各种环境侦测下建立宏任务与微任务
            第一轮侦测:
            a、先检查是否存在setImmediate,有则建立宏任务
            b、否则检查是否存在MessageChannel,有则建立宏任务
            c、否则使用setTimeout建立宏任务
            
            第二轮侦测:
            a、检查是否存在promise，有则建立微任务
            b、否则微任务等于宏任务.
        //3、暴露withMacroTask ,可以往宏任务推入回调
        //4、暴露nextTick：可以将回调推入微/宏任务等待执行。
    */
   // 回调列表
   const callbacks = [];
   let pending = false;
   // 执行回调并清空列表
   function flushCBs() {
       pending = false;
       const cbs = callbacks.slice(0);
       callbacks.length = 0;
       for(let i = 0; i < cbs.length; i++) {
           cbs[i]();
       }
   }

   //-------------------
    // 增加宏任务判定
    let macroTaskFunc = function () {
        // do somethings
    }
    let userMacroTask = false;

    export function widthMacroTask (fn) {
        return fn._withTask || (fn._withTask = function () {
            userMacroTask = true;
            const res = fn.apply(null, arguments);
            userMacroTask = false;
            return res;
        })
    }
   //--------------

   let microTaskFunc;
   const p = Promise.resolve();
   // 添加微任务
   microTaskFunc = () => {
       p.then(flushCBs);
   }
   export function myNextTick (cb, context) {
       // 将回调加入回调列表
       callbacks.push(() => {
           if (cb) {
               cb.call(context);
           }
       });
       // 第一次进入，添加微任务
       if (!pending) {
           pending = true;
           // -----
           widthMacroTask(cb);
           if (userMacroTask) {
               macroTaskFunc();
           } else {
               microTaskFunc();
           }
           // -----
       }
   }

   /**
    * vue和react数据变化的设计理念：Vue使用的是可变数据，而React更强调数据的不可变，
    * 两者没有好坏之分，Vue更加简单，而React构建大型应用的时候更加鲁棒。
    * vue通过getter和setter和函数劫持实现监听并更新数据的变化。
    * react则通过diff算法进行vdom的重新渲染
    */