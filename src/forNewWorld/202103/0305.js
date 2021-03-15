/**
 * 深拷贝：只考虑普通得object和array两种类型
 */
function cloneDeep(target, map = new WeakMap()) {
    if (typeof target === 'object' && target !== null) {
        let cloneTarget = Array.isArray(target) ? [] : {};
        if (map.get(target)) {
            return target;
        }
        map.set(target, cloneTarget);
        for(let key in target) {
            if (target.hasOwnProperty(key)) {
                cloneTarget[key] = cloneDeep(target[key], map);
            }
        }
        return cloneTarget;
    } else {
        return target;
    }
}

// 日志易面试题：
/**
 * IP中四段要么是数字要么是*，并且*一定要在数字后面，以下是合法输入范例：
*.*.*.*
192.*.*.*
192.168.*.*
192.168.1.*
192.168.1.10
`

/**
 * @param {String} text
 * @return {Boolean}
 */
function checkIfInputValid(text) {
    let arr = text.split('.');
    if (arr.length !== 4) {
        return false;
    }
    let len = arr.length;
    for (let i = 0; i < len ; i++) {
        if (arr[i] === '*'){
            if ((i + 1 < len)  && arr[i+1] !== '*') {
                return false;
            }
        } else {
            if (isNaN(Number(arr[i])) || arr[i] !== Number(arr[i]).toString() || Number(arr[i]) > 255) {
                return false;
            }
        }
    }
    return true;
}
console.assert(checkIfInputValid('1.1.*')===false, "you have only three segment");
console.assert(checkIfInputValid('1.1.*.*')===true, "you're not valid");
console.assert(checkIfInputValid('1.1.1.*')===true, "why are you here?");
console.assert(checkIfInputValid('269.1.1.*')===false, "269 exceed range");
console.assert(checkIfInputValid('192.*.2.1')===false, 'asterisk can\'t occur before number');
console.assert(checkIfInputValid('19a.2.001.1')===false, 'alphabet can\'t occur');
console.assert(checkIfInputValid('19.2.0001.1')===false, 'segment can\'t be 0000');


function checkIfInputValid5(text) {
    const ns = text.split('.');
    if (ns.length !== 4){
        return false;
    } else {
        let metAsterisk = false;
        for (const n of ns){
            if (/^(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])$/.test(n)){
                if (metAsterisk){
                    // 星号在数字前 192.*.2.1
                    return false;
                }
            } else if (n === "*"){
                metAsterisk = true;
                
            } else {
                return false;
            }
        }
        return true;
    }
}
var obj = {
    A: function A(){console.log(this.A);},
    B: () => {console.log(this.B);},
    C: () => {console.log(this.C);},
    D: () => {console.log(this.D);},
    E: "E",
    F: "F",
};
var A = "A", B = "B";
const C = "C", D = "D";
function test() {
    obj.A();
    setTimeout(obj.B);
    Promise.resolve()
        .then(() => {
            obj.C.bind(obj)();
            return Promise.reject();
        })
        .then(obj.D)
        .catch(()=>{
            console.log(obj.E);
        })
        .then(()=>{
            console.log(obj.F);
        })
}

function moveArr (arr) {
    if (!Array.isArray(arr)) {
        throw new TypeError('agrs must be an Array');
    }
    if (!arr.length) return [];
    let arr0 = [], arr1 = [];
    while(arr.length) {
        let cur = arr.shift();
        if (cur === 0) {
            arr0.push(cur);
        } else {
            arr1.push(cur);
        }
    }
    return arr0.concat(arr1);
}
function moveArr (arr) {
    if (!Array.isArray(arr)) {
        throw new TypeError('agrs must be an Array');
    }
    let len = arr.length;
    if (!len) return [];
    let resArr = [];
    for (let i = 0; i < len; i++) {
        if (arr[i] === 0) {
            resArr.unshift(arr[i]);
        } else {
            resArr.push(arr[i]);
        }
    }
    return resArr;
}

