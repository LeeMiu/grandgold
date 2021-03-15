/**
 * 异步，非阻塞I/O：
 * 浏览器端，只有一种I/O，即网络请求和返回读取，属于网络I/O；
 * nodejs中，分为文件I/O（如fs模块对文件进行读写）、网络I/O（如http模块发起网络请求）
 * 非阻塞I/O：针对操作系统内核而言，不用等待I/O返回再执行回调，可以进行一些其他事情执行。node知道操作系统是否已经做完I/O方法：
 * 1、轮询检查I/O状态 2、循环遍历文件描述符 3、epoll模式，进入轮循时未完成则cpu休眠，完成后唤醒cpu
 * linux下异步I/O缺陷：1、只有linux下存在，其他操作系统暂没支持 2、无法利用系统缓存
 * nodejs异步I/O是通过线程池来实现的：多线程、其中i/o读取线程完成I/O操作后将发送信号给执行回调的线程进行回调执行。linux下是直接使用
 * 线程池、window下采用IOCP的系统API.
 * nodejs下的异步I/O：由EventLoop、I/O观察者、请求对象，线程池相互配合完成
 * 1、系统在函数调用过程中创建I/O请求对象，并注入回调函数
 * 2、推入线程池，调用返回。QueueUserWorkItem（）将请求对象推进线程池等待执行。这样就满足了js代码和I/O异步执行了
 * 3、回调通知：当I/O完成后（GetPostQueuedCompletionStatus检查池中是否有执行完请求，有则可以执行回调了。将I/O获取的结果存储到相应
 * 的请求对象，把请求对象塞给I/O观察者），通过PostQueuedCompletionStatus向IOCP提交I/O完成状态。
 * 4、I/O观察者的行为就是取出请求对象的存储结果，同时去查对应的回调函数，然后将存储结果作为函数入参执行。
 * 
 */

const { resolve, reject } = require("core-js/fn/promise");

// node回调函数机制：利用发布-订阅模式，模拟实现node中的Event模块
function EventEmitter() {
    this.events = new Map();
}
const wrapCallback = (fn, once = false) => ({callback: fn, once});
EventEmitter.prototype.addListener = function(type, fn, once = false) {
    let handle = this.events.get(type);
    if (!handle) {
        this.events.set(type, wrapCallback(fn, once));
    } else if (handle && typeof handle.callback === 'function') {
        // type对应的回调只有一个
        this.events.set(type, [handle, wrapCallback(fn, once)]);
    } else {
        handle.push(wrapCallback(fn, once));
    }
}

EventEmitter.prototype.removeListener = function(type, fn) {
    let handle = this.events.get(type);
    if (!handle) return;
    if (!Array.isArray(handle)) {
        // 单个回调
        if (handle.callback === fn.callback) this.events.delete(type);
        else return;
    }
    for(let i = 0; i < handle.length; i++) {
        let item = handle[i];
        if (item.callback === fn.callback) {
            handle.splice(i, 1);
            i--;
            if (handle.length === 1) {
                this.events.set(type, handle[0]);
            }
        }
    }
}

EventEmitter.prototype.emit = function(type, ...args) {
    let handle = this.events.get(type);
    if (!handle) return;
    if (!Array.isArray(handle)) {
        // 参数少的情况下用call、多用apply因为call是以多个入参形式，apply是以数组的形式包裹多个入参作为一个入参
        handle.callback.apply(this, args);
    } else {
        handle.map((e) => {
            if (e.once) {
                e.callback.apply(this, args);
                this.events.removeListener(type, e);
            }
            e.callback.apply(this, args);
        })
    }
    return true;
}
EventEmitter.prototype.removeAll = function(type) {
    let handle = this.events.get(type);
    if (!handle) return;
    this.events.delete(type);
}

/**
 * promise解决地狱回调的手段：
 * 1、回调函数延迟绑定
 * 2、返回值穿透
 * 3、错误冒泡
 * 
 */
readFilePromise('1.json').then(data => {
    return readFilePromise('2.json');
}).then(data => {
    return readFilePromise('3.json');
}).then(data => {
    return readFilePromise('4.json');
}).catch(err => {
    //错误冒泡后一站式处理，解决每次任务中判断错误、增加代码混乱度的问题
  // xxx
  
})

// 手写Promise，最全面的
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';
function MyPromise (executor) {
    // executor是一个双参函数，参数就是我们的resolve和reject，promise的实现会立即执行executor，并传入两个参数函数
    // executor通常会触发一些异步运算，成功就resolve，出错则reject，executor的返回值也会被忽略
    let self = this;
    self.value = null;
    self.error = null;
    self.status = PENDING;
    self.onFulfilledCbs = [];
    self.onRejectedCbs = [];

    const resolve = function (value) {
        if (self.status !== PENDING) return;
        //Promise A+中规定成功和失败的回调都是微任务，由于浏览器中 JS 触碰不到底层微任务的分配，可以直接拿 setTimeout(属于宏任务的范畴)
        // 来模拟，用 setTimeout将需要执行的任务包裹 ，当然
        setTimeout(() => {
            self.status = FULFILLED;
            self.value = value;
            self.onFulfilledCbs.push((cb) => cb(self.value));
        })
    }

    const reject = function (error) {
        if (self.status !== PENDING) return;
        //Promise A+中规定成功和失败的回调都是微任务，由于浏览器中 JS 触碰不到底层微任务的分配，可以直接拿 setTimeout(属于宏任务的范畴)
        // 来模拟，用 setTimeout将需要执行的任务包裹 ，当然
        setTimeout(() => {
            self.status = REJECTED;
            self.error = error;
            self.onRejectedCbs.push((cb) => cb(self.error));
        })
    }
    const resolvePromise = function (bridgePromise, x, resolve, reject) {
        //如果x是一个promise
        if (x instanceof MyPromise) {
          // 拆解这个 promise ，直到返回值不为 promise 为止
          if (x.status === PENDING) {
            x.then(y => {
              resolvePromise(bridgePromise, y, resolve, reject);
            }, error => {
              reject(error);
            });
          } else {
            x.then(resolve, reject);
          }
        } else {
          // 非 Promise 的话直接 resolve 即可
          resolve(x);
        }
      }
      
    // 捕获构造异常
    try {
        executor(resolve, reject);
    } catch (e) {
        reject(e);
    }
}
MyPromise.prototype.then = function(onFulfilled, onRejected) {
    let self = this;
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    onRejected = typeof onRejected === 'function' ? onRejected : error => {throw error;};
    if (self.status === PENDING) {
        return newPromise = new MyPromise((resolve, reject) => {
            self.onFulfilledCbs.push((val) => {
                try {
                    onFulfilled(val);
                } catch (e) {
                    reject(e);
                }
            })
            self.onRejectedCbs.push((error) => {
                try {
                    onRejected(error);
                } catch (e) {
                    reject(e);
                }
            })
        });
    } else if (self.status === FULFILLED) {
        return bridgePromise = new MyPromise((resolve, reject) => {
            try{
                let x = onFulfilled(self.value);
                self.resolvePromise(bridgePromise, x, resolve, reject)
            } catch (e) {
                reject(e);
            }
        })
    } else {
        return bridgePromise = new MyPromise((resolve, reject) => {
            try{
                let x = onRejected(self.value);
                self.resolvePromise(bridgePromise, x, resolve, reject)
            } catch (e) {
                reject(e);
            }
        })
    }
}

MyPromise.prototype.catch = function(onRejected) {
    return this.then(null, onRejected);
}
// Promise中的resolve、reject、finally、all、race
/**
 * resolve传参为一个 Promise, 则直接返回它。
 * 传参为一个 thenable 对象，返回的 Promise 会跟随这个对象，采用它的最终状态作为自己的状态。
 * 其他情况，直接返回以该值为成功状态的promise对象。
 */
MyPromise.resolve = (params) => {
    if (params instanceof MyPromise) return params;
    return new MyPromise((resolve, reject) => {
        if (params && params.then && typeof params.then === 'function') {
            // param 状态变为成功会调用resolve，将新 Promise 的状态变为成功，反之亦然
            params.then(resolve, reject);
        } else {
            resolve(params);
        }
    })
}
//reject传入的参数会作为一个 reason 原封不动地往下传,
MyPromise.reject = (params) => {
    return new MyPromise((resolve, reject) => {
        reject(params);
    })
}
// 调用finally之后都会执行 finally 中传入的函数，并且将值原封不动的往下传
MyPromise.prototype.finally = function(cb) {
    this.then((value) => {
        return MyPromise.resolve(cb().then(() => {
            return value;
        }))
    }, (error) => {
        return MyPromise.resolve(cb().then(() => {
            throw error;
        }))
    })
}
/**
 *  all 方法而言，需要完成下面的核心功能:
 *    传入参数为一个空的可迭代对象，则直接进行resolve。
 *    如果参数中有一个promise失败，那么Promise.all返回的promise对象失败。
 *    在任何情况下，Promise.all 返回的 promise 的完成状态的结果都是一个数组
 */
MyPromise.all = function(promises) {
    return new MyPromise((resolve, reject) => {
        if (!Array.isArray(promises)) {
            throw new TypeError('arguments must be an array');
        }
        let res = [];
        let count = 0;
        let len = promises.length;
        if (len === 0) {
            resolve(res);
            return;
        }
        for (let i = 0; i < len; i++) {
            MyPromise.resolve(promises[i].then((data) => {
                res[i] = data;
                count++;
                if (count === len) resolve(res);
            }).catch((error) => {
                reject(error);
            }))
        }
    })
}
MyPromise.race = function(promises) {
    return new MyPromise((resolve, reject) => {
        let len = promises.length;
        if (len === 0) return;
        for (let i = 0; i < len; i++) {
            MyPromise.resolve(promises[i]).then((data) => {
                resolve(data);
                return;
            }).catch((error) => {
                reject(error);
                return;
            })
        }
    })
}
/**
 * Iterator迭代器：是一种接口、规范。为不同的数据结构提供统一的访问机制，任何数据结构只要部署了Iterator，就可以完成遍历操作。
 * 迭代器通过指针移动，next改变指针指向，每次next会返回一个对象，value和done
 * 可以使得数据结构成员能够按照某种次序排列；也供ES6中for。。。of消费
 */
// 语法：
const obj = {
    [Symbol.iterator]: function () {}
}
let arr = [{num:1},2,3];
let it = arr[Symbol.iterator]();
console.log(it.next()) 	// { value: Object { num: 1 }, done: false }
/**
 * 生成器：Generator，是一个带星号的函数，可以通过yield关键字进行暂停和恢复执行（本省就是个迭代器Iterator）
 */
function* gen2() {
    yield 2;
    yield 3;
}
function* gen1() {
    yield 1;
    yield* gen2();
    yield 4;
}
// 实现1234的打印
// 生成器执行机制：协程，比线程更加轻量级。协程处在线程的环境中，一个线程可以存在多个协程，
// 可以将协程理解为线程中的一个个任务。不像进程和线程，协程并不受操作系统的管理，而是被具体
// 的应用程序代码所控制。因此并没有进程/线程上下文切换的开销，这是高性能的重要原因

/**
 * thunk 函数。它的核心逻辑是接收一定的参数，生产出定制化的函数，然后使用定制化的函数去完成功能。
 */
let isType = (type) => {
    return (obj) => {
        return Object.prototype.toString.call(obj) === `[object ${type}]`;
    }
}

let isString = isType('String');
let isFunction = isType('Function');
//...
isString("123");
isFunction(val => val);

/**
 * async/await利用协程和Promise实现了同步方式编写异步代码的效果，
 * 其中Generator是对协程的一种实现，虽然语法简单，但引擎在背后做了大量的工作，
 * 我们也对这些工作做了一一的拆解。用async/await写出的代码也更加优雅、美观，
 * 相比于之前的Promise不断调用then的方式，语义化更加明显，相比于co + Generator性能更高，
 * 上手成本也更低，不愧是JS异步终极解决方案！
 * 
 * for...of并不像forEach那么简单粗暴的方式去遍历执行，而是采用一种特别的手段——迭代器去遍历。
 */
// 生成器用for 。。。 of遍历
function* fibonacci(){
    let [prev, cur] = [0, 1];
    console.log(cur);
    while(true) {
      [prev, cur] = [cur, prev + cur];
      yield cur;
    }
  }
  
  for(let item of fibonacci()) {
    if(item > 50) break;
    console.log(item);
  }
  

  