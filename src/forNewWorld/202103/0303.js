/**
 * 史上最全的数组扁平化。即[1, [2, [3, [4, 5]]], 6];// -> [1, 2, 3, 4, 5, 6]
 */
let ary = [1, [2, [3, [4, 5]]], 6];
// 1、ES6的flat方法直接扁平化
ary = ary.flat(Infinity); // flat函数参数为解析的层数，默认为1，即先去最里面数组层，Infinity标识最大自然数，可以直接扁平化到只有一层
// 2、replace + split
const str = JSON.stringify(ary);
ary = str.replace(/(\[|\])/g, '').split(','); // 如需要保持类型一致，将数组元素类型转为number
ary = ary.map(e => Number(e));
// 3、replace + JSON.parse
const str = JSON.stringify(ary);
str = str.replace(/(\[|\])/g, '');
ary = JSON.parse(`[${str}]`);
// 4、普通递归
let res = [];
let fn = function(ary) {
    for (let i = 0; i < ary.length; i++) {
        if (Array.isArray(ary[i])) {
            fn(ary[i]);
        } else {
            res.push(ary[i]);
        }
    }
}
// 5、reduce + 递归
function myFlat(ary) {
    return ary.reduce((prev, cur) => {
        return prev.concat(Array.isArray(cur) ? myFlat(cur) : cur);
    }, [])
}
// 6、扩展运算符
while(ary.some(e => Array.isArray(e))) {
    ary = [].concat(...ary)
}
// 手撕bind
function myBind(context, ...args) {
    if (typeof this !== 'function') {
        throw new TypeError('can not read property bind of undefined');
    }
    const self = this;
    var fNop = function() {};
    var fBound = function() {
        self.apply(this instanceof self ? this : context, args.concat(Array.prototype.slice.call(arguments)));
    }
    fNop.prototype = this.prototype;
    fBound.prototype = new fNop();
    return fBound;
}
// 手撕call/apply
function myCallApply(context, ...args) {
    const self = context || this;
    let fn = Symbol('fn');
    self.fn = this;

    let res = eval('context.fn(...args)');
    delete self.fn;
    return res;
}
