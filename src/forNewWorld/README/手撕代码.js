// 手写new
function myNew(fn, ...args) {
    let obj = {};
    obj.prototype = fn.prototype;
    let res = fn.call(obj, ...args);
    return res !== null && ['function', 'object'].includes(typeof res) ? res : obj;
}
// 手写create
function myCreate(obj) {
    if (typeof obj !== 'object' || obj === null) {
        throw new TypeError('error');
    }
    let fn = function() {};
    fn.prototype = obj;
    fn.prototype.constructor = fn;
    return myNew(fn);
}
// 手写bind
function myBind(context, ...args) {
    if (typeof this !== 'function') {
        throw new TypeError('error');
    }
    let self = this;
    let fNop = function() {};
    let fBound = function() {
        return self.apply(this instanceof this ? this : context, args.concat(Array.prototype.slice.call(arguments)));
    }
    // new
    fNop.prototype = self.prototype;
    fBound.prototype = myNew(fNop);
    // 或者create
    fBound.prototype = myCreate(self.prototype);
    return fBound;
}
// 手写call， apply
function myCallApply(context) {
    let context = context || window;
    let fn = Symbol('fn');
    context.fn = this;
    let res;
    // call
    const args = [...arguments].slice(1);
    res = eval('context.fn(...args)');
    // apply
    if (arguments[1]) {
        const args = arguments[1];
        res = eval('context.fn(...args)');
    } else {
        res = eval('context.fn()');
    }

    delete context.fn;
    return res;
}
// 寄生组合式继承（最完美的继承）
function Parent(name) {
    this.name = name;
}
Parent.prototype.getName = function() {
    console.log(this.name);
}
function Child(name, age) {
    Parent.call(this, name);
    this.age = age;
}
Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;
Child.prototype.getAge = function() {
    console.log(this.age);
}
// 柯里化
function myCurry(fn) {
    let args = [];
    function func(...arguments) {
        if (arguments.length) {
            args = [...args, ...arguments];
            return func;
        } else {
            let val = fn.apply(null, args);
            args = [];
            return val;
        }
    }
    func.toString = function() {
        return fn.apply(null, args);
    }
    func.valueOf = function() {
        return fn.apply(null, args);
    }
    return func;
}
function add(...args) {
    return args.reduce((a, b) => a + b);
}
let addAll = myCurry(add);
addAll(1)(2, 3)([4,5,6]);