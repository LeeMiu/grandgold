/**
 * 俩大主要框架vue和react 的diff算法区别
 *  同：二者都是忽略跨级比较，只做同级比较
 *  异：1、vue对比节点：在节点元素相同，classname不同使认为使不同类型元素，需要删除重建，react认为是同类型节点，
 * 只是修改节点属性
 *      2、对比方式不同。vue采用头尾指针从端到中间的对比方式，react采用从左到右依次对比（lastIndex，
 * 未遍历数据保存到map继续遍历）进行标记然后移动删除方式。lastIndex变量表示当前最后一个可复用节点，对应的oldFiber在上一次更新中所在的位置索引。我们通过这个变量判断节点是否需要移动。
 * 
 *      启发式缓存：如果响应中未显示Expires，Cache-Control：max-age或Cache-Control：s-maxage，并且响应中不包含其他有关缓存的限制，缓存可以使用启发式方法计算新鲜度寿命。
 * 通常会根据响应头中的2个时间字段 Date 减去 Last-Modified 值的 10% 作为缓存时间。
 * DNS解析：
 *  2、本地计算机浏览器DNS缓存
 *  1、本地hosts文件(一般在C:/Windows/System32/divers/etc下)
 *  3、local DNS服务器缓存
 *  4、根DNS服务器，解析到就一步一步在返回到我们的计算机。
 * DNS优化：
 *  1、前端html页面头部写入dns缓存地址
 *  2、httpDNS：大部分dns都是基于udp和DNS服务器交互；HTTPDNS则是利用http协议和DNS服务器交互，绕开运营商的local DNS服务器，
 * 有效防止了域名劫持，提高域名解析效率。
 *       基于BGP（Border Gateway Protrol边界网关协议）：在自治系统之间动态的交换路由信息的路由协议，在端上采用Vip（virtual ip）方式请求数据
 *  chrome同一个域名下同时最多有6个tcp连接（面向连接、可靠的、基于字节流的传输层通信协议）
 * http请求：请求行、请求头、请求体（只有在post方法下存在）
 * 请求行：请求方法 + 请求url + http版本协议：如 GET http://www.baidu.com/ HTTP/1.1
 * http响应：响应行、响应头（头里面的connection 为keep-alive表示建议持久连接）、响应体
 * 响应行：http版本协议 + 状态码 + 状态描述：如 HTTP/1.1 200 OK
 * html解析：
 *      构建dom(解析和标记化(有限自动状态机),建树算法创建对应的dom对象入树)---dom样式计算（格式化：css文本->结构化对象styleSheets；标准化：em->px、red->#ff0000、bold->700;
 * 继承和层叠）---生成布局树（head标签和display：none不会被放入其中）
 * html渲染：
 *      建立图层树（Layer Tree）--（图层的绘制拆分成绘制指令）-“按顺序组合”-生成绘制列表----生成图块并栅格化（合成线程）----显示器显示
 * 
 * 重绘相对于回流：在计算样式后直接跳过生成布局树和建立图层树，直接到生成绘制列表，然后继续分块，位图等最后更新显示。
 * GPU加速：会直接跳过布局和绘制流程，直接进入非主线程处理部分，交给合成线程进行位图处理（这就是GPU擅长的事情）
 * 主要可实现GPU加速的属性：css3中的transform、opacity、filter
 * 开发过程中渲染优化：
 *  1、避免频繁使用内联样式style，可以使用class
 *  2、使用createDocumentFragment进行批量dom操作
 *  3、对于resize、scroll进行防抖节流处理
 *  4、合理使用GPU加速
 * 
 * https：加强版的http，在http和tcp之间建议一个安全套接层（Security Socket Layer;用于对数据加解密）
 * 
 */
// dns缓存地址
<meta http-equiv="x-dns-prefetch-control" content="on" />
<link rel="dns-prefetch" href="http://xxxxxx.com" />

/**
 * 实现图片懒加载
 * 方案1：clientHeight、ScrollTop、offsetTop
 * 方案2：getBoundingClientRect。判断图片是否出现在了当前视口, 即 DOM 元素的 getBoundingClientRect API
 * 方案3：IntersectionObserver，浏览器内置的一个API，实现了监听window的scroll事件、判断是否在视口中以及节流三大功能
 */
// 先给图片一个占位资源
<img src="default.jpg" data-src="http://www.baidu.com/target.jpg" />
// 监听scroll事件判断图片是否到达视口
let img = document.getElementsByTagName("img");
let num = img.length, count = 0;
lazyLoad();
window.addEventListener('scroll', _.throttle(lazyLoad, 200)); // 对scroll进行节流，避免高频触发
function lazyLoad() {
    let viewHeight = document.documentElement.clientHeight;
    let scrollTop = document.documentElement.scrollTop || document.body.scrollTop; // 滚动条卷去的高度
    for (let i = count; i < num; i++) {
        // 元素已出现在视口中
        if (img[i].offsetHeight < scrollTop + viewHeight) {
            if (img[i].getAttribute('src') !== 'default.jpg') continue;
            img[i].src = img[i].getAttribute('data-src');
            count++;
        }
    }    
}

// 采用getBoundingClientRect时将上面lazyLoad函数改一下
if (img[i].getBoundingClientRect().top < document.documentElement.clientHeight){};
// IntersectionObserver
let img = document.getElementsByTagName('img');

const observer = new IntersectionObserver(changes => {
    // changes是被观察元素的集合
    for(let i = 0; i < changes.length; i++) {
        let change = changes[i];
        // 判断是否在视口中
        if (change.isIntersecting) {
            const imgElemnt = change.target;
            imgElemnt.src = imgElemnt.getAttribute('data-src');
            observer.unobserve(imgElemnt);
        }
    }
})
Array.from(img).forEach((e) => observer.observe(e)); // 监听懒加载图片

/**
 * 原生js灵魂之问
 *  基本类型：object引用类型包括：Object、Array、RegExp、Date、Math、Function
 * js中数字是采用IEEE754的双精度标准进行储存，数字无论是定点数还是浮点数，都是以二进制的形式储存
 * 创建BigInt：1、数字末尾追加n。如：8124812649126471612321n  2、BigInt构造函数BigInt(812649614612421921632);
 * BigInt注意点：1、不支持一元+运算，如+10n会抛出异常，更改+的行为也会破坏asm.js代码 2、不允许bigInt和number进行混合操作
 * 如10 + 10n会报错typeError 3、不能将BigInt传递给Web api和内置的 JS 函数，这些函数需要Number 类型 4、在转化为Boolean类型时
 * 只要不是0n，其他都是true 5、BigInt可以正常地进行位运算
 * Object.is在严格等于的基础上修复了一些特殊情况下的失误，具体来说就是+0和-0，NaN和NaN
 * Object.is(-0, +0) // false;
 * Object.is(NaN, NaN) // true;
 * 对象转原始类型数据逻辑：Symbol.toPrimitive（）---valueOf（）---toString（）---报错
 * 如： 如何让if(a == 1 && a == 2)条件成立？
 */
var a = {
    value: 0,
    valueOf: function() {
        this.value++;
        return this.value;
    }
}
// 通过重写valueOf函数,在进行==判断时，会隐形调用valueOf
console.log(a == 1 && a == 2);//true

for(var i = 1; i <= 5; i ++){
    setTimeout(function timer(){
      console.log(i)
    }, 0)
  }
// setTimeout为宏任务，由于JS中单线程eventLoop机制，
// 在主线程同步任务执行完后才去执行宏任务，因此循环结束后setTimeout中的回调才依次执行，但输出i的时候当前作用域没有，往上一级再找，发现了i,此时循环已经结束，i变成了6。
/**
 * 解决·方法：1、立即执行函数表达式 2、给定时器传入第三个参数，作为打印函数的第一个函数入参 3、使用es6中的let，让作用域变为块级作用域，用let后作用域链不复存在。代码的作用域以块级为单位
 * 
 */
for(var i = 1;i <= 5;i++){
    (function(j){
      setTimeout(function timer(){
        console.log(j)
      }, 0)
    })(i)
  }
  for(var i = 1; i <= 5; i ++){
      setTimeout(function timer(j){
        console.log(j)
      }, 0, i)
    }

  for(let i = 1; i <= 5; i++){
    setTimeout(function timer(){
      console.log(i)
    },0)
  }

//   检测对象中是否有某个属性：关键字in、Object.hasOwnProperty
// Object.setPrototypeOf(subClass, superClass)，这是用来干啥的呢？
// 答案是用来继承父类的静态方法。这也是原来的继承方式疏忽掉的地方。继承最大的问题在于全盘接受。
// 如class车子都有drive，addoil，但是新能源车也是车，但是不需要加油：从车子那继承过来就会把加油addoil也继承过来了
// 属性从0开始排，依次为0，1，2...和length属性，我们称之为类数组
// 类数组转化为数组
Array.prototype.slice.call(arguments);
Array.from(arguments);
[...arguments]
Array.prototype.concat.apply([], arguments);
// for循环