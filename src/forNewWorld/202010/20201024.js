const { preventExtensions } = require("core-js/fn/object");
const { resolve, reject } = require("core-js/fn/promise");

/**
 * 递归优化之尾递归,函数中所有递归形式的调用都出现在函数的末尾
 * 迭代在很多时候可以取代递归
 * 斐波那契数列尾递归优化
 */
function Fibonacci (n, step, acc) {
    // n需要计算的项数，step加数，acc累加器
    if (n < 1) {
        throw new error('必须是正数项');
    }
    if (n < 3) {
        return acc;
    } else {
        return Fibonacci(n-1, acc, acc + step);
    }
}


/**
 * 事件循环机制
 * 
 * 
 */

 /**
  * 手动是实现instanceOf
  * 1、先获取当前类的原型，当前实例对象的原型链
  * 2、循环查找机制：a、当前实例对象原型链的原型链proto = proto.__proto__ b、如果当前
  * 实例原型链lian__proto__上找当当前类的原型prototype，返回true c、一致循环找下去，直到null还没有返回false
  *
  */
function myInstanceOf (obj, fn) {
    let classFn = fn.prototype;
    let proto = obj.__proto__;
    while (true) {
        if(proto === null) {
            return false;
        }
        if (proto === classFn) {
            return true;
        }
        proto = proto.__proto__;
    }
}

/**
 * 手动实现object.create
 */

 Object.create() = function create(prototype) {
     // 排除传入对象为null和非object情况
     if (prototype === null || typeof prototype !== 'object') {
         throw new TypeError('object prototype must be an object!');
     }
     //让空对象的__proto__指向传进来的对象prototype
     function Temp() {};
     Temp.prototype = prototype;
     // 手动实现new
     return myNew(Temp);

 }

 function myNew (fn, ...args) {
     // 创建一个fn的实例对象
     let obj = {};
     obj.__proto__ = fn.prototype;

     let res = fn.call(obj, ...args);
     return res !== null && ['object', 'function'].includes(typeof res) ? res : obj;
 }


 /**
  * 数组扁平化flat方法：for循环、数组reduce方法
  */

  function ForFlat(arr) {
      const that = this;
      let newArr = [];
      function cycleArr (list) {
        for (let i = 0; i < list.length; i++) {
            let item = list[i];
            if (Array.isArray(item)) {
                cycleArr(item);
                continue;
            } else {
                newArr.push(item);
            }
        }
      }
      cycleArr(arr);
      return newArr;
  }

  function ReduceFlat (arr) {
    return arr.reduce((a, b) => {
        return a.concat(Array.isArray(b) ? ReduceFlat(b) : b);
    }, []);
  }

/**
 * 基于Generator实现async/await
 * 将Generator中的内容基于Iterator迭代器一步一步执行
 */
function asyncFunc (generator) {
    if (typeof generator !== 'function') {
        throw new TypeError('params must be a Generator function')
    }
    const iterator = generator(); // 接下来要执行next
    // data为第一次执行后的返回结果，用于第二次传参后执行
    const next = (data) => {
        // 第二次执行，接受第一次执行的结果data
        let { value, done } = iterator.next(data);
        if (done) return;
        value.then((res) => {
            next(res);
        });
    }
    next();
}

asyncFunc(function* (){
    let data = yield readFile('a.js');
    data = yield readFile(data + 'b.js');
    return data;
})

function readFile(file) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(file);
        }, 0);
    })
}

/**
 * 基于promise封装ajax
 * 返回promise实例
 * 创建XMLHttpRequest对象
 * 调用open方法；打开url，建立连接后send一些信息
 * 监听ajax状态信息：如果readyState === 4标识已经完成（status === 200即resolve状态；status === 404即reject）
 * readyState ！==4，把请求主体的信息基于send发给服务器
 */

 function promiseAjax (url, method) {
     return new Promise((resolve, reject) => {
         const xhr = new XMLHttpRequest();
         xhr.open(url, method, true);
         xhr.send(null);
         xhr.onreadystatechange = function () {
             if (xhr.readyState === 4) {
                 if (xhr.status === 200) {
                     resolve(xhr.response);
                 } else if (xhr.status === 404) {
                     reject(new Error('404'));
                 }
             } else {
                 reject('请求错误')
             }
         }
     })
 }


 /**
  * reduce((prev, cur, curIndex, arr) => {}, initValue)
  * // prev初始值或计算后的返回值，cur当前元素，curIndex标识当前元素的索引，arr当前操作数组
  */
 Array.prototype.myReduce = function (fn, initValue) {
    const that = this; // this其实表示当前数组arr.reduce中的arr
    const length = that.length;
    let prev = initValue;
    for(let i = 0; i < length; i++){
        if (typeof prev === 'undefined') {
            prev = fn(that[i], that[i + 1], i + 1, that);
            ++i;
        } else {
            prev = fn(prev, that[i], i, that);
        }
    }
    return prev;
 }

 /**
  * 寄生组合式继承：通过接用构造函数来继承属性；通过原型链继承方法
  * 只调用一次父类构造函数，效率更高，避免了在子类.prototype上创建不必要，多余的属性，于此同时，原型链还能保持不变
  */

  function Parent (name) {
      this.name = name;
      this.colors = ['red', 'yellow', 'blue'];
  }
  Parent.prototype.getName = function () {
    return this.name;
  }
function Child(name, age) {
    Parent.call(this, name); // 调用父类构造函数，将父类构造函数的this指向子类的实例
    this.age = age;
}
// 寄生组合式继承
Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;

Child.prototype.getAge = function () {
    return this.age;
}
//此后Child继承有Parent的方法和属性还有自己特有的方法属性
let boy = new Child('Lee', 18);
boy.getName(); // 'Lee'


/**
 * 手动实现object.freeze
 * 冻结一个对象，不让再添加/删除属性，也布恩那个修改对象已有属性的可枚举性，可配置，可写性，
 * 也不能改属性值和它的原型属性，最后返回和传入对象相同的对象
 */

 function myFreeze (obj) {
     if (obj instanceof Object) {
         Object.seal(obj); // 封闭对象
         for (let key in obj) {
             if (obj.hasOwnProperty(key)) {
                 Object.defineProperty(obj, key, {
                     writable: false,
                 })
                 myFreeze(obj[key]);
             }
         }
     }
 }