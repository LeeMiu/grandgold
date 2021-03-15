/**
 * 手写那些常用的js
 */
// 手写new
function myNew(fn, ...args) {
    let obj = {};
    obj.prototype = fn.prototype;
    let res = fn.call(obj, ...args);
    return res !== null && ['function', 'object'].includes(typeof res) ? res : obj;
}
// 手写create
function myCreate(obj) {
    if (obj === null || typeof obj !== 'object'){
        throw new TypeError('Error');
    }
    let f = function() {};
    f.prototype = obj;
    f.prototype.constructor = f;
    
    return myNew(f);
}
// 手写bind
function myBind(context, ...args) {
    if (typeof this !== 'function') {
        throw new TypeError('Error');
    }
    let self = this;
    let fNop = function() {};
    let fBound = function () {
        return self.apply(this instanceof self ? this : context, args.concat(Array.prototype.slice.call(arguments)));
    }
    fNop.prototype = this.prototype;
    fBound.prototype = myNew(fNop);
    return fBound;
}

// 手写call/apply
function myCall(context, ...args) {
    let self = context || window;
    let fn = Symbol('fn');
    self.fn = this;
    let res = self.fn(...args);
    // 如果是apply的话，那就是[...args],
    delete self.fn;
    return res;
}

// 手写用闭包和Proxy属性拦截实现单例模式
function proxy(fn) {
    let instance;
    let handle = {
        constructor(target, agrs) {
             if (!instance) {
                 instance = Reflect.construct(fn, agrs);
             }
             return instance;
        }
    }
    return new Proxy(fn, handle);
}

// 手写寄生组合继承
function Person(name) {
    this.name = name;
}
Person.prototype.sayName = function() {
    console.log(this.name);
}
function Student(name, age) {
    Person.call(this, name);
    this.age = age;
}
Student.prototype = Object.create(Person.prototype);
Student.prototype.constructor = Student;

Student.prototype.sayAge = function() {
    console.log(this.age);
}
/* 
手写实现add(1)(2)(3), 柯里化函数
*/
function addArgs(...args) {
    return args.reduce((a, b) => a + b);
}
function curry(fn) {
    let args = [];
    function temp(...arguments){
        if (arguments.length) {
            args = [...args, ...arguments];
            return temp;
        } else {
            let val = fn.apply(null, args);
            args = [];
            return val;
        }
    }
    // 字符类型
    temp.toString = function() {
        return fn.apply(null, args);
    }
    // 数值类型
    temp.valueOf = function() {
        return fn.apply(null, args);
    }
    return temp;
}
const add = curry(addArgs);
// 手写map
Array.prototype.map = function(fn, thisArg) { // 特别注意这个thisArg参数，用作执行回调时的this，否则undefined会被用作回调函数的this值
    if(this === null || this === undefined) {
        throw new TypeError('Can not read map of null or undefined');
    }
    if (typeof fn !== 'function') {
        throw new TypeError(fn + ' must be a function');
    }
    const obj = Object(this);
    let len = obj.length >>> 0;
    let res = [];
    for (let k = 0 ; k < len; k++) {
        if(k in obj) {
            res[k] = fn.call(thisArg, obj[k], k, obj);
        }
    }
    return res;
}
//手写reduce
Array.prototype.reduce = function(fn, initValue) { 
    if(this === null || this === undefined) {
        throw new TypeError('Can not read map of null or undefined');
    }
    if (typeof fn !== 'function') {
        throw new TypeError(fn + ' must be a function');
    }
    const obj = Object(this);
    let len = obj.length >>> 0;
    let k = 0, acc = initValue;
    if (acc === undefined) {
        for(; k < len; k++) {
            if (k in obj) {
                acc = obj[k];
                k++;
                break;
            }
        }
    }
    if (k === len && acc === undefined) {
        throw new TypeError('Each element of Array is empty');
    }
    for(; k < len; k++) {
        if (k in obj) {
            acc = fn.call(undefined, acc, obj[k], k, obj);
        }
    }
    return acc;
}
// 手写splice
Array.prototype.splice = function(dindex, count, ...addItems) {
    let array = Object(this);
    let len = array.length;
    let deleteArr = new Array(count);
    let addLen = addItems && addItems.length || 0;
    // 判断 sealed 对象和 frozen 对象, 即 密封对象 和 冻结对象
    if (Object.isSealed(array) && count !== addLen) {
        throw new TypeError('the object is a sealed object!')
    } else if(Object.isFrozen(array) && (count > 0 || addLen > 0)) {
        throw new TypeError('the object is a frozen object!')
    }
    // 拷贝删除的数据
    for (let i = 0; i < count; i++) {
        const index = dindex + i;
        if (index in array) {
            deleteArr[i] = array[index];
        }
    }
    // 处理负索引,边接处理
    if(dindex < 0) {
        dindex = dindex + len > 0 ? dindex + len : 0;
    }
    if (dindex > len) {
        dindex = len;
    }
    if (count > len - dindex) {
        count = len - dindex;
    }
    // 移动删除后面的数据
    if (count !== addLen) {
        for (let i = len - 1; i >= dindex + count; i--) {
            array[addLen + i - count] = array[i];
        }
    }
    // 把插入的数据插入
    for (let i = 0; i < addLen; i++) {
        array[dindex + i + 1] = addItems[i];
    }
    // 修改array的length
    array.length = len - count + addLen;
    return deleteArr;
}
// 手写深拷贝
function myCloneDeep(target, map = new WeakMap()) {
    if (typeof target !== 'object' || target === null) {
      return target;
    }
    const that = this;
    let res;
    res = Array.isArray(target) ? [] : {};
    if (map.get(target)) {
      return target;
    }
    if (target instanceof Function) {
      res = (...arguements) => target.apply(that, arguements);
    } else if (target instanceof Date) {
      res = new Date(target);
    } else if (target instanceof RegExp) {
      res = new RegExp(target.source, target.flags);
    }
    map.set(target, res);
    for (const key in target) {
      if (target.hasOwnProperty(key)) { // 不拷贝原型上的属性，太浪费内存
        res[key] = that.myCloneDeep(target[key], map);
      }
    }
    return res;
  }

  // 手写一个const实现：
  mayConst = (variable, value) => { // variable变量名、value变量值
    // Object.defineProperty()有三个参数，第一个是要挂在哪个对象下面，第二个是属性名或变量名，第三个是一个对象，里面是配置权限
    Object.defineProperty(window, variable, {
      get() { return value; },
      set(newVal) {
        // newVal表示新的赋值
        if (newVal !== value) { // 发现被修改了则报错提醒
          console.error(`${variable} is already assignmented.`);
          return false;
        }
        return value;
      },
      configurable: false, // 表示能否通过delete删除属性从而重新定义属性，能否修改属性的特性，或者能否把属性修改为数据属性.默认值为true
      enumerable: false, // 表示能否通过for-in循环返回属性。默认值为true
    });
  }
  
 // 防抖函数：将高频操作优化只在最后一次执行，场景：用户输入
 function myDebounce(fn, wait, immediate) {
    let time = null;
    return function () {
        let context = this;
        let args = [...arguments];
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
        let context = this, args = [...arguments];
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

//   手写封装JSONP
function myJsonp ({url, params, cb}) {
    return new Promise((resolve, reject) => {
       let script = document.createElement('script');
       window[cb] = function (data) {
          resolve(data);
          document.body.removeChild(script);
       }
       let params = { ...params, cb }, arrs = [];
       for (let key in params) {
          arrs.push(`${key}=${params[key]}`);
       }
       script.src = `${url}?${arrs.join('&')}`;
       document.body.appendChild(script);
    })
 }
 /*
 手写实现lodash的_.get 
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