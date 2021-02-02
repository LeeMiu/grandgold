const { isArray } = require("core-js/fn/array");
const { reject } = require("core-js/fn/promise");
const { AnchorLink } = require("iview");
const { value } = require("numeral");

/*有一堆整数，请把他们分成三份，确保每一份和尽量相等（11，42，23，4，5，6 4 5 6 11 23 42 56 78 90） */
function depart(list, discount = 3) {
    if (list.length < discount) {
        throw new TypeError('Error');
    }
    if (list.length === discount) return list;
    const avg = list.reduce((a, b) => a + b) / discount;
    const result = Array(discount).fill([]);
    function getChildArr(list) {
      let length = list.length;
      let tempTotal = list[length - 1], firstArr = [list[length - 1]];
      let delIndexArr = [length - 1];
      // 获取第一份数组
      for(let i = length -2 ; i > 0; i--){
        const item = list[i];
        // 每次拿最大的值相加，然后与平均数作比较
        tempTotal+=item;
        firstArr.push(item);
        delIndexArr.push(i);
        if (tempTotal === avg) { // 刚好与平均值相等则跳出循环
          break;
        } else if (tempTotal > avg) { // 超过了平均值则减回去
          tempTotal-=item;
          firstArr.pop();
          delIndexArr.pop();
        } else if (tempTotal < avg) { // 小于avg，处理边界问题
          let next = tempTotal + list[i + 1];
          // 当前总值比上一个总值大; 这里是临界值, 说明上一个总值肯定是一个比最大值大, 所以这里需要和绝对值比较
          if(avg - tempTotal < Math.abs(avg - next)){
            // 如果下一个平局值和总值相减, 比数组第一个数还大, 说明还可以继续走下去;
            if (avg - tempTotal > list[0]){
              continue;
            } else {
              break;
            }
          }
        }
      }
      for (let i =0; i < delIndexArr.length; i++) {
        list.splice(delIndexArr[i], 1); // 将第一个数据中的数据删除掉
      }
      return firstArr;
    }
    for (let key = 0; key < discount; key++) {
      result[key] = getChildArr(list, key);
    }

    return result;
}

/*
实现lodash的_.get 
_.get(source, key, defaultValue)
*/
function myGet(source, key, defaultValue = undefined) {
    // a[3].b -> a.3.b -> [a,3,b]
   // key 中也可能是数组的路径，全部转化成 . 运算符并组成数组
    const paths = key.replace(/\[(\d+)\]/g, ".$1").split("."); // 此是重中之重
    let result = source;
    for (const p of paths) {
      // 注意 null 与 undefined 取属性会报错，所以使用 Object 包装一下。
      result = Object(result)[p];
      if (result == undefined) {
        return defaultValue;
      }
    }
    return result;
}

/**
 * promise特性、优缺点：
 * 特性：
 * 1、有三种状态：pending进行中、fulfilled已接受、rejected已拒绝
 * 2、接受一个函数作为回调，该回调接受两个参数（成功resolve、失败reject），其中resolve可以是正常值，也可以是一个promise实例对象
 * reject通常是一个error对象实例
 * 3、then方法返回的是一个新的promise实例，接受两个参数onResolved和onRejected
 * 4、catch方法返回一个新的promise实例
 * 5、finally方法不管promise状态如何都会执行、该方法不接受任何参数
 * 6、promise.all()实际是将多个promise实例包装成一个新的promise实例，通常接受一个promise对象数组，多个promise只要有一个实例
 * 出发了catch方法，都会触发promise.all()的catch方法。promise.race()同理，多个实例中有一个改变状态都会触发
 * 7、Promise.resolve()将现有对象转为Promise对象，如果该方法的参数为一个Promise对象，Promise.resolve()将不做任何处理；
 * 如果参数thenable对象(即具有then方法)，Promise.resolve()将该对象转为Promise对象并立即执行then方法；
 * 如果参数是一个原始值，或者是一个不具有then方法的对象，则Promise.resolve方法返回一个新的Promise对象，
 * 状态为fulfilled，其参数将会作为then方法中onResolved回调函数的参数，
 * 如果Promise.resolve方法不带参数，会直接返回一个fulfilled状态的 Promise 对象。
 * 需要注意的是，立即resolve()的 Promise 对象，是在本轮“事件循环”（event loop）的结束时执行，而不是在下一轮“事件循环”的开始时。
 * 8、Promise.reject()同样返回一个新的Promise对象，状态为rejected，无论传入任何参数都将作为reject()的参数
 * 优点：
 * 1、异步API，可用于浏览器的异步操作处理
 * 2、与事件相比：promise更适合处理一次性的结果；也可以链式处理；事件不可以链式处理
 * 3、解决了回调地狱的问题，将异步操作以同步的流程表达出来
 * 4、拥有很好的错误处理方式，包含了异常处理
 * 缺点：
 * 1、无法取消，一旦建立会立即执行，不会中途取消
 * 2、不设回调函数promise内部抛出的错误不会反应到外部
 * 3、在pending状态时无法知道是刚开始还是即将完成阶段
 * 4、promise执行回调时，定义promise部分已经走完了，promise报错堆栈上下文不友好
 */
// 面试版基础：
function myPromise(construct) {
  let self = this;
  self.status = 'pending';
  self.reason = undefined;
  self.value = undefined;
  // 存储状态对应的函数
  self.onFulfilledCallback = [];
  self.onRejectedCallback = [];
  function resolve(value) {
    if (value instanceof Promise) {
      return value.then(resolve, reject);
    }
    if(self.status === 'pending') {
      self.value = value;
      self.status = 'resolved';
      self.onFulfilledCallback.forEach(cb => cb(self.value));
    }
  }
  function reject(reason) {
    if(self.status === 'pending') {
      self.reason = reason;
      self.status = 'rejected';
      self.onRejectedCallback.forEach(cb => cb(self.value));
    }
  }
  // 捕获构造异常
  try{
    construct(resolve, reject);
  }catch(e){
    reject(e);
  }
}
myPromise.prototype.then = function(onFulfilled, onRejected){
  let self = this;
  // 处理回调参数默认值，保证后续可以正常执行
  onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
  onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason; };
  switch(self.status) {
    case 'resolved':
      onFulfilled(self.value);
      break;
    case 'rejected':
      onRejected(self.reason);
      break;
    case 'pending':
      return newPromise = new Promise((resolve, reject) => {
        self.onFulfilledCallback.push((value) => {
          try{
            onFulfilled(value);
          }catch(e){
            reject(e);
          }
        })
        self.onRejectedCallback.push((reason) => {
          try{
            onRejected(reason);
          }catch(e){
            reject(e);
          }
        })
      })
    default:
  }
}
/**
 * promise.all()
 * 
接收一个 Promise 实例的数组或具有 Iterator 接口的对象作为参数
②这个方法返回一个新的 promise 对象，
③遍历传入的参数，用Promise.resolve()将参数"包一层"，使其变成一个promise对象
④参数所有回调成功才是成功，返回值数组与参数顺序一致
⑤参数数组其中一个失败，则触发失败状态，第一个触发失败的 Promise 错误信息作为 Promise.all 的错误信息。
 */
function myPromiseAll(promises) {
  return new Promise(function(resolve, reject) {
    if(!Array.isArray(promises)){
      throw new TypeError('arguments must be array');
    }
    var resolveCount = 0;
    var length = promises.length;
    var rejectResult = [];
    for(let i = 0; i< length; i++){
      Promise.resolve(promises[i].then(value => {
        resolveCount++;
        rejectResult[i] = value;
        if(resolveCount === length) {
          return resolve(rejectResult)
        }
      }, error => {
        return reject(error);
      }))
    }
  })
}

/* 概念理解
react不想事件冒泡调用event.stopPropagation是无效的，需要调用event.preventDefault
事件注册：updatDOMProperties--通过lastProps和nextProps判断是否新增、删除事件--新增事件enqueuePutListener(事件存储)--获取dom对象
--listen捕获/冒泡--监听事件（document.addEventListener || document.attachEvent）--dispath分发事件
事件存储：EventPluginHub负责管理react合成事件callback，将callback存在listenerBank中。EventPluginHub的putListener方法是想存储器中
添加一个listener，获取绑定事件的唯一key后，listenerBank[registrationName][key]=listener
事件触发执行：触发注册事件的回调dispathEvent，然后利用捕获-目标-冒泡，中间存在事件委托代理，父组件可以代理子组件方法
合成事件：调用EventPluginHub的extractEvent方法--循环plugins--根据各自的evntType获取不同的事件池--getPooled取出合成事件（事件池为空则创建个新的）
--根据元素nodeid（唯一标识key）和eventType从listenerBank中取回调--返回带有合成事件参数的回调函数


伪类：pseudu-class
比如:hover,:ActiveXObject,:visited,:AnchorLink,:first-child,:focus等
核心是用来选择dom树之外的信息，不能呗普通选择器选择的文档之外的元素，用来添加一些选择器的效果
状态变化时，需要得到一个伪类的效果
伪元素：pseudo-elements
dom树没有定义的虚拟元素
核心在于需要创建不存在文档中的元素
比如：before,:after；表示选择元素内容之前或者之后的内容
伪元素控制的内容和元素时没有差别的，但由于它本身时基于元素的抽象，并不实际存在文档中，所以称为为伪元素
伪类和伪元素的区别：
表示上伪类和伪元素分别用单冒号和双冒号表示
关键在于是否需要添加伪元素才能达到效果，如果是伪元素，否则为伪类
less和sass最主要的区别是less是通过Javascript编译，而sass是通过ruby编译的，如果没有引入前端工程化，
less会消耗客户端性能，sass会消耗服务端性能，但是引入前端工程化的话，gunt，gulp，webpack等，
less和sass在打包阶段都会转化成css，所以不会有区别，只是sass是基于ruby，所以每次npm的时候相对慢一点点

*/ 
