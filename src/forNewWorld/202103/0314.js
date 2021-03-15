/**
 * 可能造成内存泄漏
 *      1、意外的全局变量：使用严格模式,在 JavaScript 文件头部或者函数的顶部加上 use strict
 *      2、闭包引用：将事件处理函数定义在外部，通过fn = null解除闭包，或者在定义事件处理函数的外部函数中。
 *      3、未清理的dom元素引用：document.removeChild或者手动element.btn = null;
 *      4、被遗忘的定时器或回调：在组件销毁前的生命周期函数中clearTimeout，clearInternal，removeEventListener 移除事件监听
 *      5、绑在 EventBus 的事件没有解绑：this.$EventBus.$off()
 *      6、Echart没有释放chart资源：在销毁组件前this.chart.clear()
 *      7、map、set强引用；可以适当采用WeakMap、WeakSet或者在使用完后置位null；
 * 
 * 浏览器瀑布流waterfall的各个名称点：
 *      Queueing 浏览器将资源放入队列时间
 *      Stalled 因放入队列时间而发生的停滞时间
 *      DNS Lookup DNS解析时间
 *      Initial connection 建立HTTP连接的时间
 *      SSL 浏览器与服务器建立安全性连接的时间
 *      TTFB 等待服务端返回数据的时间
 *      Content Download 浏览器下载资源的时间
 * 
 * 前端路由：
 *      前端路由的出现就是为了解决单页面网站，通过切换浏览器地址路径，来匹配相对应的页面组件。
 *      前端路由 会根据浏览器地址栏 pathname 的变化，去匹配相应的页面组件。然后将其通过创建 DOM 节点的形式，
 * 塞入根节点 <div id="root"></div> 。这就达到了无刷新页面切换的效果，从侧面也能说明正因为无刷新，
 * 所以 React 、 Vue 、 Angular 等现代框架在创建页面组件的时候，每个组件都有自己的 生命周期 。
 *      对应的模式：哈希模式和历史模式
 *          哈希模式：通过监听事件hashchange监听浏览器地址#后面的描点地址。可以监听：如a标签改变地址、浏览器的
 * 前进后退、window.location
 *          历史模式：依赖js原生事件propstate。MDN解释：调用history.pushState()和history.replaceState()不会触发
 * propstate事件，只有在做出浏览器动作时才会触发该事件，如用户点击浏览器的回退按钮（或者调用history.back()或者history.forward()），
 * a 标签的点击事件也是不会被 popstate 监听
 *      解决a标签不被监听：遍历a标签，阻止a标签的默认事件，加上点击事件的回调，在回调中获取a标签的href值，在通过pushState
 * 去改变浏览器的location.pathname属性值，手动执行porpstate事件的回调去匹配对应的路由。
 *      注意：pushState 和 replaceState 都是 HTML5 的新 API，他们的作用很强大，可以做到改变浏览器地址却不刷新页面。
 * 这是实现改变地址栏却不刷新页面的重要方法。
 */
// 千分位数字，是否自动补位。默认否
function thousandNum(num, tail=2, full=false) {
    const reg = /\B(?=(\d{3})+(?!\d))/g;
    if (num !== '' && !isNaN(Number(num))) {
        const val = String(num);
        const suffix = full ? new Array(tail).fill(0).join('') : '';
        if (/\.{1}/g.test(val)) {
            const arr = val.split('.');
            return `${arr[0].replace(reg, ',')}.${`${arr[1]}${suffix}`.substring(0, tail)}`;
        }
        return full ? `${val.replace(reg, ',')}.${suffix}` : val.replace(reg, ',');
    } else {
        throw new TypeError('please format an number');
    }
}