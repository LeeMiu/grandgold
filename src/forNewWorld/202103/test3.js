// 日志易面试专场
function checkOk(str) {
    const arr = str.split('');
    let len = arr.length;
    let stack = [];
    if (!len || len % 2 !== 0) return false;
    for (let i = 0; i < len; i++){
        if (arr[i] === '(') {
            stack.push(arr[i]);
        } else {
            if (stack.length) {
                stack.pop();
            } else {
                return false;
            }
        }
    }
    return stack.length === 0;
}

function checkOk(str) {
    let len = str.length;
    if (!len || len % 2 !== 0) return false;
    let time = 0;
    for(let i = 0; i < len;i++) {
        if (str.charAt(i) === '(') {
            time++;
        } else {
            time--;
        }
        if (time < 0) {
            return false;
        }
    }
    return time === 0;
}
console.log(checkOk('()()(())'));
console.log(checkOk('()()()))))('));
console.log(checkOk(')(()()()))))'));


function Feb(n) {
    if (n === 1) return 1;
    if (n === 2) return 2;
    if (n > 3) {
        return Feb(n -1 )+ Feb(n-2)
    }
}
