/**
 * Promise.all实现原理:
 *  接受一个由promise任务组成的数组
 *  可以同时处理多个promise任务，当所有的任务都执行完成时，Promise.all()返回resolve
 *  但当有一个失败(reject)，则返回失败的信息，即使其他promise执行成功，也会返回失败。
 *  和后台的事务类似,合并多个 Observable 对象 ，等到所有的 Observable 都完成后，才一次性返回值。
 */
function myPromiseAll(promises) {
    return new Promise((resolve, reject) =>{
        if (!Array.isArray(promises)) {
            return reject('args must be an Array');
        }
        let count = 0, len = promises.length;
        const resolveArr = new Array(len);
        for(let i =0; i< len; i++) {
            (function(i) {
                Promise.resolve(promises[i]).then((val) => {
                    count++;
                    resolveArr[i] = val;
                    if (count === len) {
                        return resolve(resolveArr);
                    }
                }, (res) => {
                    return reject(res);
                })
            })(i)
        }
    })
}