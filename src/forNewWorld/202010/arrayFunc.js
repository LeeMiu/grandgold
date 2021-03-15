/**
 * 手撕数组array的那些函数（注意一些异常处理）
 * map（fn， this）：回调函数fn、回调函数的this
 * reduce：初始值不传处理、回调函数的参数，返回值如何让处理
 */
Array.prototype.map = function(fn, thisArg) {
    if (this === null || this === undefined) {
        throw new TypeError("can not read property 'map' of null or undefined");
    }
    if (Object.prototype.toString.call(fn) !== "[object function]") {
        throw new TypeError(fn + 'is not a function')
    }
    // 先转为对象
    let obj = Object(this);
    let context = thisArg;
    let len = obj.length >>> 0; //无符号右移 0 位，但实际上是把前面的空位用0填充，这里的作用是保证len为数字且为整数。
    let arr = new Array(len);
    for(let k = 0; k < len; k++) {
        if (k in obj) {
            let mapVal = fn.call(context, obj[k], k, obj);
            arr[k] = mapVal;
        }
    }
    return arr;
}

Array.prototype.reduce = function (fn, initVal) {
    if (this === null || this === undefined) {
        throw new TypeError("can not read property 'reduce' of null or undefined");
    }
    if (Object.prototype.toString.call(fn) !== "[object function]") {
        throw new TypeError(fn + 'is not a function')
    }
    // 先转为对象
    let obj = Object(this);
    let len = obj.length >>> 0;
    let acc = initVal;
    let k = 0;
    if (acc === undefined) {
        for (; k < len; k++) {
            if (k in obj) {
                acc = obj[k];
                k++;
                break;
            } 
        }
    }
    if (k === len && acc === undefined) {
        throw new TypeError('Each element of the array is empty');
    }
    for(; k < len; k++) {
        if (k in obj) {
            acc = fn.call(undefined, acc, obj[k], k, obj)
        }
    }
    return acc;
}

Array.prototype.push = function(...items) {
    let obj = Object(this);
    let len = this.length >>> 0;
    let argLen = items.length >>> 0;
    if (len + argLen > 2 ** 53 - 1) {
        throw new TypeError('the number of array is over the max size');
    }
    for (let index = 0; index < argLen; index++) {
        obj[len + index] = items[index];
    }
    obj.length = len + argLen;
    return obj;
}
Array.prototype.pop = function() {
    let obj = Object(this);
    let len = this.length >>> 0;
    if (len === 0) {
        obj.length = 0;
        return undefined;
    }
    len--;
    let value = obj[len];
    delete obj[len];
    obj.length = len;
    return value;
}