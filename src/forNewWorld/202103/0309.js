/**
 * EventLoop 事件循环
 *  有浏览器的EventLoop和node的EventLoop
 *  浏览器的EventLoop把事件放入队列中：主要有宏任务队列和微任务队列，通过任务队列的机制来进行协调的。
 * 宏任务（macrotask，也叫tasks）：setTimeout、setInterval、requestAnimationFrame (浏览器独有)、I/O、UI rendering (浏览器独有)
 * 微任务（microtask，也叫jobs）：Promise、Object.observe、MutationObserver
 * 任务执行流程：（注意队列是先进先出的）
 * 先执行宏任务，再执行本轮所有微任务；再执行宏任务....宏任务微任务交替循环执行。
 * 每个任务都有一个任务源(task source)，源自同一个任务源的 task 必须放到同一个任务队列，从不同源来的则被添加到不同队列。
 * 执行宏任务的过程中产生了新的宏任务就放在宏任务队列中，产生了新的微任务就放在微任务的任务队列中。
 * 宏任务是一个一个执行的；执行完一个宏任务，会执行本轮产生的所有微任务。
 * Promise中的异步体现在then和catch中，所以写在Promise中的代码是被当做同步任务立即执行的。而在async/await中，
 * 在出现await出现之前，其中的代码也是立即执行的。那么出现了await时候，await是一个让出线程的标志。await后面的表达式会先执行一遍，
 * 将await后面的代码加入到microtask中，然后就会跳出整个async函数来执行后面的代码。原因由于因为async await 本身就是promise+generator的语法糖。所以await后面的代码是microtask。
 * 浏览器为了使js和dom能有序的进行，再进行一个宏任务执行结束后，在下一个宏任务执行开始前会对页面进行重新渲染
 *  
 *  Node也有宏任务、微任务之分；但是宏任务会有多个阶段性，
 *  timers（setTimeout、setInterval回调）-----poll(i/o操作)------check(setImmediate回调)--timer。。。。循环过程
 *  微任务：promise；process.nextTick独立于EventLoop的任务队列，优先级高于微任务队列
 *  在每个阶段切换时会查看微任务队列中是否有微任务，有就执行微任务
 */
// 函数arguments本身不能调用数组方法，但是有下标、callee、length属性，被称为类数组
// 常见的类数组还有：使用getElementById等获取的html集合、以及querySelector获取的节点列表

const { resolve } = require("core-js/fn/promise");

// arguments转成数组的方法
Array.prototype.slice.call(arguments); // Array.prototype.slice.call()
[...arguments]; // 展开元素符
Array.from(arguments);
Array.prototype.concat.apply([], arguments); // apply方法会把第二个参数展开
//递归深拷贝
function deepClone(target, map = new WeakMap()){
    if (typeof target === 'object' && target !== null) {
        const that = this;
        const clone = Array.isArray(target) ? [] : {};
        if (map.has(target)) {
            return target;
        }
        if(target instanceof Function) {
            clone = (...arguments) => target.apply(that, arguments);
        } else if (target instanceof Date) {
            clone = new Date(target);
        } else if (target instanceof RegExp) {
            clone = new RegExp(target.source, target.flags);
        }
        map.set(target, clone);
        for(let key in target) {
            if (target.hasOwnProperty(key)) {
                clone[key] = deepClone(target[key], map);
            }
        }
        return clone;
    } else {
        return target;
    }
}
// 非递归深拷贝
function deepClone(target) {
    const list = []; // 存储已拷贝数据数组
    let root = {};
    // 建栈
    const stack = [{parent: root, key: 'cloneTarget', data: target}];
    while(stack.length) {
        const node = stack.pop();
        const {parent, key, data} = node;
        let res = parent;
        if (typeof key !== undefined) {
            res = parent[key] = {};
        }
        if (list.find(e => e.source === data)) {
            parent[key] = data;
            break;
        } else {
            list.push({source: data});
        }
        for (let k in data) {
            if (data.hasOwnProperty(k)) {
                if (typeof data[k] !== 'object') {
                    res[k] = data[k];
                } else {
                    // 压入栈
                    stack.push({parent: res, key: k, data: data[k]})
                }
            }
        }
    }
    return root['cloneTarget'];
}

// promise封装ajax实现
function myAjax(url, method) {
    let promise = new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        xhr.onreadystatechange = function() {
            if (this.readyState !== 4) return;
            if (this.status === 200) {
                resolve(this.response);
            } else {
                reject(this.statusText);
            }
        };
        xhr.onerror = function() {
            reject(this.statusText);
        }
        xhr.responseType = 'json';
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.send(null);
    });
    return promise;
}