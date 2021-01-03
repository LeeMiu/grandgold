/**
 * 隐性的比较转换
 * 1、在js中，null不等于0，更不是0
 * 2、null只等于（==）undefined，剩下他俩和谁都不相等
 * 3、比较大小的关系运算符中，设计上总需要运算元尝试转换为一个number，儿相等运算
 * 符在设计上则不会如此。故在null <= 0 上先将null隐形地进行了Number（null）
 * 所以有以下打印：
 * console.log(null == 0) // false
 * console.log(null <= 0) // true
 * console.log(null < 0) // false
 */

/**
 * 请用算法实现，从给定的无序、不重复的数组data中，取出n个数，
 * 使其相加和为sum。并给出算法的时间/空间复杂度
 */
function getResult(data, n, sum, temp = []) {
    if (temp.length === n) {
        if (temp.reduce((a, b) => a + b) === sum) {
            return temp;
        }
        return false;
    }
    for (let i = 0; i < data.length; i++) {
        // 循环只是为了找第n个相加刚好等于sum的值
        const current = data.shift();
        temp.push(current);
        const res = getResult(data, n, sum, temp);
        if (res) {
            return res;
        }
        temp.pop();
        data.push(current);
    }
} 