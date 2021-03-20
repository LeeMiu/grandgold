/**
 * service worker：本质是web应用程序和浏览器之间的代理服务器，也可以在网络可用时作为浏览器和网络间的代理。
 * 类似于web worker，有独立的运行环境，独立的空间内存。可以创建有效的离线体验，拦截网络请求并基于网络是否可用
 * 以及更新的资源是否驻留在服务器上来采取的适当的动作。他们还允许访问推送通知和后台同步API。
 * 
 */

// index.js
if(navigator.serviceWorker) {
    navigator.serviceWorker.register('sw.js').then((registeration) => {
        console.log('sw注册成功');
    }).catch((error) => {
        console.log('sw注册失败');
    });
}
// sw.js
// 监听install事件，回调中缓存所需文件
self.addEventListener('install', (e) =>{
    e.waitUntil(caches.open('my-cache').then((cache) => {
        return cache.addAll(['/index.html', './index.js']);
    }));
});
// 拦截所有请求事件
// 如果缓存中有那就直接用缓存，没有则去请求数据
self.addEventListener('fetch', (e) => {
    e.respondWith(caches.match(e.request).then((response) => {
        if (response) {
            return response;
        }
        console.log(`fetch source ${response}`);
    }))
})
/**
 * 图片优化:
 *  1、用CDN加载图片，可以计算出适配屏幕的宽度，然后请求相应裁剪好的图片
 *  2、小图使用base64格式："A-Z、a-z、0-9、+、/" 64个可打印字符
 *  3、多个图标文件整合成一张（雪碧图）
 *  4、选择正确的图片格式:能显示WebP格式的浏览器使用WebP格式，它有着更好的图像数据压缩算法，可以带来更小的图片体积，拥有
 * 肉眼识别无差异的图像质量；小图使用PNG，或者SVG替代；照片使用JPEG格式
 */
/**
 * 渲染卡顿是指：
 *      大部分设备的刷新频率是60hz（60次/秒），浏览器的对每一帧画面的渲染工作要在16ms内完成，超出这个时间就会出现所谓卡顿
 * 三种常见渲染流程：
 *      1、js/css>计算样式>布局>绘制>渲染层合并图层
 *      2、js/css>计算样式>绘制>渲染层合并图层
 *      3、js/css>计算样式>渲染层合并图层
 * 优化渲染性能：
 *      1、js执行效率：a：js动画避免使用setTimeout、setInterval（无法保证回调函数的执行时间，可能导致丢帧）
 * ，尽量使用requestAnimation（紧跟着系统的刷新步伐，可以保证回调在每帧动画开始的时候执行）b：使用web worker处理耗时长的js代码。
 * js执行会阻塞浏览器渲染工作。c：批量更新dom，把dom元素更新划分为多个小任务，每个任务都放到requestAnimationFrame 中回调执行
 * d:使用插件分析js性能：chrome DevTols的TimeLine中的js profile来分析
 *      2、降低样式计算的范围和复杂度：a:降低样式选择器的复杂度，保持class简短，web components框架 b：减少需要执行样式计算的元素个数
 *      3、避免大规模，复杂的布局：a：避免使用dom元素几何属性修改（如，width/height/left/top）b:使用flexbox替换老的浮动布局，flexbox的
 * 布局耗时比老的浮动布局要少很多。c：强制浏览器在执行js脚本前先执行布局过程。先读后写，先读取样式属性，后再修改
 *      4、简化绘制，减少绘制区域：a：合理使用GPU加速属性（transform， opacity），只绘制变动区域不影响其他元素
 *      5、对滚动、调节窗口大小resize事件进行防抖节流
 * 
 * 
 */