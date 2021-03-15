const { last } = require("lodash");

/**
 * 算法求解：两数之和，三数之和、n数之和
 * 1、2数之和为一个数字：
 *      取其中一个数，看是否存在另一个为x-nums[i],存在则返回对应值和下标
 * 2、3数之和为一个数字
 *      遍历数组，取一个数字arr[i]作为第一个数，然后就是在i+1~arr.length - 1里面找和为x-arr[i]
 *      针对重复的三元组：先找后针对三元组去重，或者先排序，在取得过程中去重，
 *      排序后更操作防止重复数据、可以用双指针进行，先取定一个数，指针移动求和判断和x大小，大于x则后指针前移，
 *      小于x则前指针后移，当前后指针相遇后第一轮循环结束
 */
function getNumsFromArr (arr, x) {
    let map = new Map();
    let res = [], indexRes = [];
    for (let i = 0; i < arr.length; i++) {
        let first = arr[i];
        let second = x - arr[i];
        if (map.has(second)) {
            res.push([first, second]);
            indexRes.push([i, map.get(second)]);
        } else {
            map.set(arr[i], i);
        }
    }
    map.clear();
    return {
        value: res,
        index: indexRes
    };
}
function get3NumsFromArr (arr, x) {
    if(!arr || arr.length < 3) return [];
    let res = [], indexRes=[], second, third;
    arr.reduce((a, b) => a - b);
    for (let i = 0; i < arr.length - 1; i++){
        if (arr[i] > x) break;
        if (arr[i] === arr[i - 1]) continue;
        second = i + 1;
        third = arr.length - 1;
        while (second < third) {
            // second < third表示指针还没相遇
            const sum = arr[i] + arr[second] + arr[third];
            if (sum > x) {
                third--;
            } else if (sum < x) {
                second++;
            } else {
                res.push(arr[i],  arr[second], arr[third]);
                indexRes.push(i, second, third);
                // 同理针对second和third也要进行重复判断
                while (second < third && arr[second] === arr[second - 1]) second++;
                while (second < third && arr[third] === arr[third - 1]) third--;
                // 经历一次常规的取舍后，对应的指针都要移动
                second++;
                third--;
            }
        }
    }
    return {
        value: res,
        index: indexRes
    }
}
