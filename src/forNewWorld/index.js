const { isArray, reduce } = require("core-js/fn/array");
const { keyBy } = require("lodash");

function mySetInterFn(fn, a, b) {
    this.nums = 0;
    this.time = null;
    this.start = () => {
        this.time = setTimeout(() => {
            fn();
            nums++;
            this.start();
        }, a + this.nums * b);
        return this.start;
    }
}
function myStopInterFn() {
    clearTimeout(this.time);
    this.nums = 0;
}
// 函数柯里化，实现AddFn(1)(2)(3) = 6, AddFn(1)(2)(3)(4) = 10
function addArgs(...args) {
    return args.reduce((a, b) => a + b);
}
function curryFn(fn) {
    let argList = [];
    function tempFn(...arguments) {
        if (arguments.length){
            argList = [...argList, ...arguments];
            return tempFn;
        } else {
            let val = fn.apply(this, argList);
            argList = [];
            return val;
        }
    }
    // 字符类型
    tempFn.toString = function() {
        return fn.apply(this, args);
    }
    // 数值类型
    tempFn.valueOf = function() {
        return fn.apply(this, args);
    }
    return tempFn;
}
const AddFn = curryFn(addArgs);

// 合并若干有序数组
// 合并两个
function merge(list1, list2) {
    let res = [];
    while(list1.length && list2.length) {
        if (list1[0] > list2[0]) {
            res.push(list1.shift());
        } else {
            res.push(list2.shift());
        }
        return res.concat(list1).concat(list2);
    }
}
function mergeFn(list) {
    let resArr = [];
    if (!list.length) {
        return [];
    }
    while(list.length) {
        let arr1 = list.shift(), arr2 = list.shift();
        let temp = merge(arr1, arr2);
        resArr = [...resArr, ...temp];
    }
    return resArr;
}

// 优化的斐波那契数列,1,1,2,3,5,8
function Febonacci(n) {
    let perv = 1, cur = 1, res;
    if ([1, 2].includes(n)) {
        return 1;
    }
    for (let i = 3; i <= n; i++){
        res = perv + cur;
        perv = cur;
        cur = res;
    }
    return res;
}
// 递归调用
function Febonacci(n) {
    // 存储已经算过的数字
    let cache = [0, 1, 1];
    if ([1, 2].includes(n)) {
        return 1;
    }
    if (cache[n]) {
        return res[n];
    }
    let res = Febonacci(n - 1) + Febonacci(n - 2);
    cache[n] = res;
    return res;
}


// 防抖、节流
//防抖,在事件被触发n秒后再执行回调，如在该时间内再次触发，则重新计时。用于提交按钮防快速点击、
function myDebounce(fn, wait) {
    let time = null;
    return function() {
        const context = this;
        const args = [...arguments];
        clearTimeout(time);
        time = setTimeout(() => {
            fn.apply(context, args);
        }, wait);
    }
}
// 立即执行版本
function debounceNow(fn, wait, immediate) {
    let time = null;
    return function () {
        const context = this;
        const args = [...arguments];
        if (time) clearTimeout(time);
        if (immediate) {
            const now = !time;
            time = setTimeout(() => {
                time = null;
            }, wait);
            if (now) fn.apply(context, args);
        } else {
            time = setTimeout(() => {
                fn.apply(context, args);
            }, wait);
        }
    }
}

// 节流=》规定时间内多次触发只有一次有效；利用定时器，一定时间内如果定时器存在就不执行，直到定时器执行后清空定时器，设置下一次触发
function myThrottle(fn, wait) {
    let time = null;
    return function () {
        const context = this;
        const args = [...arguments];
        if (!time) {
            time = setTimeout(() => {
                time = null;
                fn.apply(context, args);
            }, wait);
        }
    }
}

// lodash中的get方法
function _myGet(obj, key, defaultVal = undefined) {
    // a[3].b -> a.3.b -> [a,3,b]
   // key 中也可能是数组的路径，全部转化成 . 运算符并组成数组
    const paths = key.replace(/\[(\d+)\]/g, '.$1').split('.');
    let res = obj;
    for (const p of paths) {
        res = Object(res)[p];
        if (res === undefined) {
            return defaultVal;
        }
    }
    return res;
}

// 扁平化数组
// reduce + 递归
function myFlat(arr, depth = 1) {
    if (depth > 0) {
        return arr.reduce((acc, cur) => {
            if (Array.isArray(cur)) {
                return [...acc, myFlat(cur, depth - 1)];
            }
            return [...acc, cur];
        }, []);
    }
    return arr;
}
// 栈降维到一维数组
function stackFlat(arr) {
    const res = [];
    const stack = [...arr]; // 拷贝数组到栈，防止改变原数据
    while(stack.length !== 0) {
        const val = stack.pop();
        if (Array.isArray(val)) {
            stack.push(...val);
        } else {
            res.unshift(val);
        }
    }
    return res;
}

/**
 * react生命周期shouldComponentUpdate，在组件的render和组件接受到state和props的值更新之前调用，浅比较后决定
 * 是否更新我们的组件。
 * shouldComponentUpdate (nextProps, nextState) {
 *  const { props, state } = this;
 *  return !shallowequal(props, nextProps) && !shallowequal(state, nextState)
 * }
 * 当然react把这一个特性内置在了React.PureComponent类中，类似与React.Component，只是在 shouldComponentUpdate 
 * 已经帮你实现了一个浅的 props/state 比较。
 * 使用PureComponent时需要：
 * <Table
 *     // map 返回一个新的数组实例，所以浅比较将失败
 *     rows={rows.map(//......)}
 *     // 对象的字面量总是与前一个不一样
 *     style={ { color: 'red' } }
 *     // 箭头函数是一个新的未命名的东西在作用域内，所以总会有一个完整的 diffing
 *     onUpdate={() => { //......}}
 * />
 * 在 render 定义之外创建所有对象、数组和函数，并确保它们在调用期间不会变化 
 * 纯组件适用于复杂的表单和表格，但它们通常会减慢按钮或图标等简单元素的速度
 */

 /**
  * 1. Vue 3.0 性能提升主要是通过哪几方面体现的？
1.响应式系统提升
vue2在初始化的时候，对data中的每个属性使用definepropery调用getter和setter使之变为响应式对象。
如果属性值为对象，还会递归调用defineproperty使之变为响应式对象。(defineproperty)

vue3使用proxy对象重写响应式。proxy的性能本来比defineproperty好，proxy可以拦截属性的访问、
赋值、删除等操作，不需要初始化的时候遍历所有属性，另外有多层属性嵌套的话，
只有访问某个属性的时候，才会递归处理下一级的属性。

优势：
可以监听动态新增的属性；
可以监听删除的属性 ；
可以监听数组的索引和 length 属性；
2. 编译优化
优化编译和重写虚拟dom，让首次渲染和更新dom性能有更大的提升 vue2 通过标记静态根节点,优化 diff 算法 
vue3 标记和提升所有静态根节点,diff 的时候只比较动态节点内容

Fragments, 模板里面不用创建唯一根节点,可以直接放同级标签和文本内容

静态提升
patch flag, 跳过静态节点,直接对比动态节点,缓存事件处理函数

3. 源码体积的优化
vue3移除了一些不常用的api，例如：inline-template、filter等 使用tree-shaking

2. Composition Api 与 Vue 2.x使用的Options Api 有什么区别？

Options Api
包含一个描述组件选项（data、methods、props等）的对象 options；

API开发复杂组件，同一个功能逻辑的代码被拆分到不同选项 ；

使用mixin重用公用代码，也有问题：命名冲突，数据来源不清晰；

composition Api
vue3 新增的一组 api，它是基于函数的 api，可以更灵活的组织组件的逻辑。

解决options api在大型项目中，options api不好拆分和重用的问题。

3. Proxy 相对于 Object.defineProperty

有哪些优点？

proxy的性能本来比defineproperty好，proxy可以拦截属性的访问、赋值、删除等操作，
不需要初始化的时候遍历所有属性，另外有多层属性嵌套的话，只有访问某个属性的时候，才会递归处理下一级的属性。

可以* 监听数组变化
可以劫持整个对象
操作时不是对原对象操作,是 new Proxy 返回的一个新对象
可以劫持的操作有 13 种
4. Vue 3.0 在编译方面有哪些优化？

vue.js 3.x中标记和提升所有的静态节点，diff的时候只需要对比动态节点内容；

Fragments（升级vetur插件):
template中不需要唯一根节点，可以直接放文本或者同级标签

静态提升(hoistStatic),当使用 hoistStatic 时,所有静态的节点都被提升到 render 方法之外.
只会在应用启动的时候被创建一次,之后使用只需要应用提取的静态节点，随着每次的渲染被不停的复用。

patch flag, 在动态标签末尾加上相应的标记,只能带 patchFlag 的节点才被认为是动态的元素,
会被追踪属性的修改,能快速的找到动态节点,而不用逐个逐层遍历，提高了虚拟dom diff的性能。

缓存事件处理函数cacheHandler,避免每次触发都要重新生成全新的function去更新之前的函数 
tree shaking 通过摇树优化核心库体积,减少不必要的代码量

5.  Vue.js 3.0 响应式系统的实现原理？

1. reactive
设置对象为响应式对象。接收一个参数，判断这参数是否是对象。不是对象则直接返回这个参数，
不做响应式处理。创建拦截器handerler，设置get/set/deleteproperty。

get
收集依赖（track）；
如果当前 key 的值是对象，则为当前 key 的对
象创建拦截器 handler, 设置 get/set/deleteProperty；
如果当前的 key 的值不是对象，则返回当前 key 的值。

set
设置的新值和老值不相等时，更新为新值，并触发更新（trigger）。

deleteProperty 当前对象有这个 key 的时候，删除这个 key 并触发更新（trigger）。

2. effect
接收一个函数作为参数。作用是：访问响应式对象属性时去收集依赖

3. track
接收两个参数：target 和 key
－如果没有 activeEffect，则说明没有创建 effect 依赖

－如果有 activeEffect，则去判断 WeakMap 集合中是否有 target 属性

－WeakMap 集合中没有 target 属性，则 set(target, (depsMap = new Map()))

－WeakMap 集合中有 target 属性，则判断 target 属性的 map 值的 depsMap 中是否有 key 属性

－depsMap 中没有 key 属性，则 set(key, (dep = new Set())) －depsMap 中有 key 属性，则添加这个 activeEffect

4.trigger
判断 WeakMap 中是否有 target 属性，WeakMap 中有 target 属性，则判断 target 属性的
 map 值中是否有 key 属性，有的话循环触发收集的 effect()。
  */

// 简易版的get函数
function myGet (obj, keys, defaultValue = undefined) {
    const keyArr = keys.replace(/\[(\d+)\]/g,  ".$1").split('.');
    let res = obj;
    for(let key of keyArr) {
        res = Object(res)[key];
        if (res === undefined) {
            return defaultValue;
        }
    }
    return res;
}

  // 代码实现
function arrayToTree(array) {
    let root = array[0]
    array.shift()
    let tree = {
        id: root.id,
        val: root.val,
        children: array.length > 0 ? toTree(root.id, array) : []
    }
    return tree;
}

function toTree(parenId, array) {
    let children = []
    let len = array.length
    for (let i = 0; i < len; i++) {
        let node = array[i]
        if (node.parentId === parenId) {
            children.push({
                id: node.id,
                val: node.val,
                children: toTree(node.id, array)
            })
        }
    }
    return children
}

console.log(arrayToTree(input))

if (!Array.prototype.reduce) {
    Object.defineProperty(Array.prototype, "reduce", {
      value: function (callback) {
        if (this === null) {
          throw new TypeError(
            "Array.prototype.reduce called on null or undefiend"
          );
        }
        if (typeof callback !== "function") {
          throw new TypeError(callback + "is not a function");
        }
        var o = Object(this);
        var len = o.length >>> 0;
        var k = 0;
        var value;
        if (arguments.length >= 2) {
          value = arguments[1];
        } else {
          while (k < len && !(k in o)) {
            k++;
          }
          if (k >= len) {
            throw new TypeError("Reduce of empty array with no initial value");
          }
          value = o[k++];
        }
        while (k < len) {
          if (k in o) {
            value = callback(value, o[k], k, o);
          }
          k++;
        }
        return value;
      },
    });
  }

  /**
   * 设计模式：
   * 原则:solid-单一职责原则/开放/封闭原则/里氏替换原则/接口隔离原则/依赖倒转原则
   * 1、单例模式：保证一个类仅有一个实例，并提供一个访问它的全局访问点。实现的方法为先判断实例存在与否，
   * 如果存在则直接返回，如果不存在就创建了再返回，这就确保了一个类只有一个实例对象。
   * 使用场景：弹窗；无论点击多少次，弹窗只应该创建一次；
   * 2、策略模式：定义一系列的算法，把他们一个个封装起来，并且使他们可以相互替换。
   * 两部分组成：第一部分是个策略类（可变，封装了策略的具体实现）、第二个部分是环境类（不变）：接受客户的请求，委托给某个策略。
   * 3、代理模式：为一个对象提供一个代用品或占位符，以便控制对它的访问。
   * 常用虚拟代理形式，延迟到需要的时候再去创建
   * 使用场景:代理实现图片懒加载
   * 4、中介者模式：通过一个中介者对象，其他所有的相关对象都通过该中介者对象来通信，而不是相互引用，当其中的一个对象发生改变时，
   * 只需要通知中介者对象即可。通过中介者模式可以解除对象与对象之间的紧耦合关系。
   * 例如购物车需求，存在商品选择表单、颜色选择表单、购买数量表单等等，都会触发change事件，那么可以通过中介者来转发处理这些事件，
   * 实现各个事件间的解耦，仅仅维护中介者对象即可。
   * 5、装饰者模式：在不改变对象自身的基础上，在程序运行期间给对象动态地添加方法。
   * 装饰者模式适用的场景：原有方法维持不变，在原有方法上再挂载其他方法来满足现有需求；函数的解耦，将函数拆分成多个可复用的函数，
   * 再将拆分出来的函数挂载到某个函数上，实现相同的效果但增强了复用性。
   * 6、观察者模式：被观察对象（subject）维护一组观察者（observer），当被观察对象状态改变时，
   * 通过调用观察者的某个方法将这些变化通知到观察者。可以调用的api：subscribe(): 接收一个观察者observer对象，使其订阅自己
   * unsubscribe(): 接收一个观察者observer对象，使其取消订阅自己；fire(): 触发事件，通知到所有观察者
   */
  // 手动实现观察者模式，类似于eventBus
  // 被观察者
function Subject() {
    this.observers = [];
  }
  
  Subject.prototype = {
    // 订阅
    subscribe: function (observer) {
      this.observers.push(observer);
    },
    // 取消订阅
    unsubscribe: function (observerToRemove) {
      this.observers = this.observers.filter(observer => {
        return observer !== observerToRemove;
      })
    },
    // 事件触发
    fire: function () {
      this.observers.forEach(observer => {
        observer.call();
      });
    }
  }
//   测试用例
const subject = new Subject();

function observer1() {
  console.log('Observer 1 Firing!');
}


function observer2() {
  console.log('Observer 2 Firing!');
}

subject.subscribe(observer1);
subject.subscribe(observer2);
subject.fire();

//输出：
// Observer 1 Firing! 
// Observer 2 Firing!

  //装饰者模式
  Function.prototype.before = function(beforefn) {
    var self = this;    //保存原函数引用
    return function(){  //返回包含了原函数和新函数的 '代理函数'
        beforefn.apply(this, arguments);    //执行新函数，修正this
        return self.apply(this,arguments);  //执行原函数
    }
}
Function.prototype.after = function(afterfn) {
    var self = this;
    return function(){
        var ret = self.apply(this,arguments);
        afterfn.apply(this, arguments);
        return ret;
    }
}
var func = function() {
    console.log('2');
}
//func1和func3为挂载函数
var func1 = function() {
    console.log('1');
}
var func3 = function() {
    console.log('3');
}
func = func.before(func1).after(func3);
func();
// console.log 1 2 3

/**
 * 数组、链表、指针、集合的区别
 * 数组：线性数据结构，连续内存空间，存储相同的数据类型，支持随机访问，插入，删除需要On的时间复杂度；
 * 适合做底层数据结构
 * 链表：链式数据结构，非连续内存，内存可拓展，存储相同数据类型，插入删除高效，直接改变next即可，查询
 * 需要依赖算法查询；通常会通过链表创建红黑树，平衡树、基数树等
 * 指针：相当于一个变量，存放其他变量在内存中的地址
 * 集合：典型如set、map、list等，特点是内存空间不连续，可扩容；数据类型未声明时为Object
 * 
 */