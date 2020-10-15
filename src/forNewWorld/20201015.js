/* 写一个 mySetInterVal(fn, a, b),
每次间隔 a,a+b,a+2b 的时间，
然后写一个 myClear，停止上面的 mySetInterVal */
function mySetInterVal(fn, a, b) {
    this.times = 0;
    this.handle = null;
    this.start = () => {
        this.handle = setTimeout(() =>{
            fn();
            times++;
            this.start();
        }, a + this.times * b);
    };
    return this.start;
}
function myClear() {
    clearTimeout(this.handle);
    this.times = 0;
}
/* 
手写实现add(1)(2)(3)
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
            let val = fn.apply(this, args);
            args = [];
            return val;
        }
    }
    return temp;
}
const add = curry(addArgs);
/*
合并二维有序数组成一维有序数组，归并排序的思路
*/
/*
思路：
 * 双指针 从头到尾比较 两个数组的第一个值，根据值的大小依次插入到新的数组中
 * 空间复杂度：O(m + n)
 * 时间复杂度：O(m + n)
 * @param {Array} arr1
 * @param {Array} arr2
*/
function merge(arr1, arr2) {
    var res = [];
    while(arr1.length && arr2.length) {
        if (arr[0] < arr2[0]) {
            // 利用数组shift函数；删除数组中第一个元素并返回第一个元素
            res.push(arr1.shift());
        } else {
            res.push(arr2.shift());
        }
    }
    // 当其中一个数组已经加完了，另一个数组还有则直接把另一个数组直接接在后面位置
    return res.concat(arr1).concat(arr2);
}
function mergeSortArr(arr) {
    if (!arr.length) {
        return [];
    }
    while(arr.length > 1) {
        // 依次取出数组中前两个数组，然后合并后加入输入的尾部，直至数据总长度为1
        let arr1 = arr.shift(); 
        let arr2 = arr.shift(); 
        let mergeList = merge(arr1, arr2);
        arr.push(mergeList);
    }
    return arr[0];
}

/*多种方法实现斐波那契数列 */
// 粗爆递归型，缺陷容易爆栈，空间时间消耗大
function febonacci(n) {
    if (n === 1 || n === 2) {
        return 1;
    }
    return febonacci(n-1) + febonacci(n -2);
}
function febonacci(n) {
    // 利用数组将已经计算过的数据存起来
    let cache = [0, 1, 1];
    if ([1, 2].includes(n)) {
        return 1;
    }
    if (cache[n]) {
        return cache[n];
    }
    let res = febonacci(n-1) + febonacci(n -2);
    cache[n] = res;
    return res;
}
// for循环相加
function febonacci(n) {
    let prev = 1;
    let cur = 1;
    let res;
    if ([1, 2].includes(n)) {
        return 1;
    }
    for (let i = 3; i <= n; i++) {
        res = prev + cur;
        prev = cur;
        cur = res;
    }
    return res;
}
// ES6 Generator
function febonacci(n) {
    var a = 1, b = 1, num = 0;
    while (num <= n) {
        [a, b] = [b, a + b];
        num++;
    }
    return a;
}
/*
字符串中最长不重复子串长度
 */
function maxChildStr(str) {
    const arr = [...str];
    let res = 1;
    let result = arr.reduce((prev, cur, index, arr) => {
        if (index === 0) {
            return cur;
        } else {
            if (prev.indexOf(cur) < 0) {
                return prev + cur;
            } else if (res < prev.length) {
                res = prev.length;
                return prev.slice(prev.indexOf(cur) + 1, prev.length) + cur;
            } else {
                return prev.slice(prev.indexOf(cur) + 1, prev.length) + cur;
            }
        }
    }, '');
    if (res < result.length) {
        res = result.length;
    }
    return res;
}