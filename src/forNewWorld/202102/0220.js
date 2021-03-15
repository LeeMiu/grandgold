/**
 * link和@import的区别
 * link可以定义RSS、定义Rel等，而@import只能用于加载css
 * 当解析到link时，页面会同步加载所引用的css，@import所引用的需要等到页面加载完才能被加载
 * @import需要ie5以上浏览器
 * link可以通过js动态引入，@import不行
 */

const { fn } = require("moment");

 // 动画css
 transition{
     -duration // 间隔
     -delay // 延迟
     -timing-function // 曲线
 }
 animation{
     -iteration-count // 动画次数
     -iteration-count-infinite // 无数次数，循环播放
     -direction // 方向
     -fill-mode // 禁止模式
     -fill-mode-forward // 停止时保留最后一帧
     -fill-mode-backwards // 停止时回到第一帧
 }

 // 原型prototype：对象的继承属性
 // 构造函数： new 创建一个对象的函数
 // 实例：通过构造函数和new创建出来的对象。实例通过__proto__指向原型，通过constructor知道构造函数

/**
 * 三者关系：
 * 实例.__proto__ === 原型
 * 实例.constructor === 构造函数
 * 原型.constructor === 构造函数
 * 构造函数.prototype === 原型
 * 构造函数.constructor === Function.prototype
 * 原型.__proto__ === Object.prototype
 * Function.prototype.__proto__  === Object.prototype
 * 最终的指向到object，在后面就是null
 * 修改原型上的属性：obj.prototype[key] === value;
 *  */ 
/**
 * 执行上下文EC（Execution Context）
 * 变量对象、作用域链、this指向
 * 类型：全局执行上下文、函数执行上下文、eval执行上下文
 * 代码执行过程：
 * 创建全局执行上下文---全局执行上下文（caller）自上向下执行，遇到函数时，函数执行上下文callee被push到执行栈的顶层
 * ---函数执行上下文被激活，开始执行函数中的代码，caller被挂起---函数执行完，callee被移除执行栈，控制权交还给全局执行上下文caller，继续执行
 */
// scope即为作用域链
 // 作用域即为该上下文中声明的变量和声明的作用范围
 // 特性：提前声明，函数优于变量

 // 闭包可能会产生的问题：多个子函数的scope都指向父级，当父级改变时，所有子函数都收到影响
 // 解决：1、变量通过函数参数传入，避免使用默认的scope向上查找 2、使用块级作用域，让变量成功危机上下文属性，避免共享

 // 手撕new和create
 function myNew (fn, ...args) {
     // 创建一个对象
     let obj = {};
     // 链接到原型
     obj.__proto__ = fn.prototype;
     // 绑定this
     let res = fn.call(obj, ...args);
     // 绑定后res是对象或函数返回，否则返回新对象obj
     return res && ['object', 'function'].includes(typeof res) ? res : obj;
 }
 function myCreate (obj) {
     // 排除传入非object情况，注意typeof null会返回object，这是历史遗留问题
     if(obj === null || typeof obj !== 'object') {
         throw new TypeError('param must be an object!');
     }
     // 建一个空对象，让空对象的__proto__ 指向传进来的obj
     function tempObj () {};
     tempObj.prototype = obj;

     tempObj.prototype.constructor = tempObj;
     // 返回new的对象
     return myNew(tempObj);
 }

 // 继承，原型链的最优化圣杯模式
 function Parent5 () {
    this.name = 'parent5';
    this.play = [1, 2, 3];
  }
  function Child5() {
    Parent5.call(this);
    this.type = 'child5';
  }
  Child5.prototype = Object.create(Parent5.prototype);
  Child5.prototype.constructor = Child5;


 // 一个很稳的类型判断封装
 function getTypeof (obj) {
     if (obj === null) {
         return String(obj);
     }
     let otherTypes = {};
     // 注意下面是object加空格加e，空格一定不能少
     ['Array', 'Date', 'RegExp', 'Object', 'Error'].forEach((e) => otherTypes['[object' + '' + e + ']'] = e.toLowerCase());
     return typeof obj === 'object' ? otherTypes[Object.prototype.toString.call(obj)] || 'object' : typeof obj;
 }

 /**
  * require和import区别
  * require支持动态导入，import不支持
  * require是同步导入，import是异步导入
  * require是值拷贝，导入后源文件变化不会影响导入值，import是内存地址指向，文件变化会影响
  */
 // 防抖函数：将高频操作优化只在最后一次执行，场景：用户输入
 function myDebounce(fn, wait, immediate) {
     let time = null;
     return function () {
         let context = this;
         let args = arguments;
         if (immediate && !time) {
             fn.apply(context, args);
         }
         if (time) clearTimeout(time);
         time = setTimeout(() => {
             fn.apply(context, args);
         }, wait);
     }
 }
 // 节流：规定一定时间内只有一次有效，降低频率：场景：滚动条事件，resize事件
 function myThrottle(fn, wait, immediate) {
     let time = null;
     let callNow = immediate;
     return function () {
         let context = this, args = arguments;
         if (callNow) {
             fn.apply(context, args);
             callNow = false;
         }
         if (!time) {
             time = setTimeout(() => {
                 fn.apply(context, args);
                 time = null;
             }, wait);
         }
     }
 }

 // 修改this绑定：call，apply，bind
 fn.call(this, key1, key2, keyn) === fn.apply(this, [key1, key2, keyn]);
 fn.bind(this, key1, key2, keyn);
 // 非严格模式下，call不传第一个参数默认是window，严格模式下不传第一个参数是undefined
 // apply和call区别在于传参不同，apply是一个数组或类数组
//  bind和call语法一摸一样，只是call是立即执行，bind是等待执行

// let/const ：块级作用域，不存在变量提升，暂时性死区，不允许重复声明，其中const为声明常量，无法修改

// 函数柯里化，首先填充几个参数，然后返回一个新的函数的技术，可以归纳函数调用的参数
// 如实现add(1)(2) = 3,add(2)(3)(4) = 9
function addArgs (...args) {
    return args.reduce((a, b) => a + b);
};
function CurryFn (fn) {
    let argArr = [];
    function resFn (...arguments) {
        if (arguments.length) {
            argArr = [...argArr, ...arguments];
            return resFn;
        } else {
            let val = fn.apply(this, argArr);
            argArr = [];
            return val;
        }
    }
    return resFn;
}
// 数组常用方法：
// map：遍历数组并返回值是一个新的数组
// push、pop、shift、unshift、sort、reverse， splice会改变原数组


// 浏览器
/**
 * 会触发回流的操作：
 * 页面初次渲染、浏览器窗口大小变化、元素尺寸、位置、内容变化、添加或删除可见的dom元素，激活css伪类；
 * 浏览器有渲染队列的优化，会将多次修改优化成一次回流。但是遇到以下：
 * offsetTop、offsetLeft、offsetWidth、offsetHeight
    clientTop、clientLeft、clientWidth、clientHeight
    scrollTop、scrollLeft、scrollWidth、scrollHeight
   getComputedStyle()（IE中currentStyle）会强制立即执行渲染更新队列
优化：读写分离，先读后写；避免使用table布局，js尽量使用class进行样式修改，极限优化时，修改样式将其display：none后再修改
 */
/**
 * web worker是现代浏览器为js创造的多线程环境，可以新建并将部分任务分配到worker线程和js并行运行、
 * 两个线程可独立运行，互不干扰，可通过自带的消息机制相互通信
 * 基本用法如下：
 */
// 创建 worker
const worker = new Worker('work.js');

// 向 worker 线程推送消息
worker.postMessage('Hello World');

// 监听 worker 线程发送过来的消息
worker.onmessage = function (event) {
  console.log('Received message ' + event.data);
}
// 缺陷
// 1、同源限制；2、无法使用document、window、alert等；3、无法加载本地资源

// 常见状态码
/**
 * 1xx: 接受，继续处理
200: 成功，并返回数据
201: 已创建
202: 已接受
203: 成为，但未授权
204: 成功，无内容
205: 成功，重置内容
206: 成功，部分内容
301: 永久移动，重定向
302: 临时移动，可使用原有URI
304: 资源未修改，可使用缓存
305: 需代理访问
400: 请求语法错误
401: 要求身份认证
403: 拒绝请求
404: 资源不存在
500: 服务器错误
 */
// 协商缓存：
// 唯一标识方案: Etag(response 携带) & If-None-Match(request携带，上一次返回的 Etag): 服务器判断资源是否被修改，
// 最后一次修改时间: Last-Modified(response) & If-Modified-Since (request，上一次返回的Last-Modified)
// Etag优先级高于Last-Modified


