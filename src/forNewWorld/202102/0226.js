/**
 * 钩子hook
 * useXXX在组件初始化阶段工作（mount） 
 *  1、获取当前hook节点，并添加到hook链表中
 *  2、初始化hook状态，读取初始XXX的值
 *  3、创建一个新的链表作为更新队列，用来存放更新操作函数setXXX
 *  4、创建一个dispatch方式（如 useState 返回的数组的第二个参数：setXxx()），并将此更新操作添加到
 * 更新队列中，还会将该更新和当前正在渲染的fiber绑定起来
 *  5、返回当前XXX和更新setXXX的方法
 *  fiber： requestIdleCallback形参是个函数，该函数中有两个重要的方法：timeRemaining表示当前帧中是否还有空闲时间
 * 另一个是didTimeOut，表示是否超时这个通常结合 requestIdleCallback 的第二个参数使用，
 * 例如：requestIdleCallback(run, { timeout: 2000 })，则表示 2 秒会超时
 * 原生提供的 requestIdleCallback 方法的 timeRemaining() 最大返回是 50ms，也就是 20fps，
 * 达不到页面流畅度的要求，并且该 API 兼容性也比较差。React 团队没有直接使用原生的 requestIdleCallback，而是自己 polyfill 了一个。
 * polyfill是一段代码(或者插件),提供了那些开发者们希望浏览器原生提供支持的功能.
 * 二叉树遍历：DFS深度遍历，BFS广度遍历
 */
// 先序遍历:根左右
let res = [];
function dfsfront(tree) {
    if (tree) {
        res.push(tree.value);
        dfsfront(tree.left);
        dfsfront(tree.right);
    }
}
// 非递归
function dfsfront(tree) {
    let res = [], stack = [];
    stock.push(tree);
    while(stock.length) {
        let node = stack.pop(); // 栈的最后一个，栈支持先进后出
        res.push(node.value);
        if (node.right) stack.push(node.right); // 先入栈右子树
        if (node.left) stack.push(node.left); // 后入栈左子树
    }
    return res;
}
// 中序遍历：左根右
let res = [];
function dfsmid(tree) {
    if (tree) {
        dfsmid(tree.left);
        res.push(tree.value);
        dfsmid(tree.right);
    }
}
// 非递归
function dfsmid(tree) {
    let res = [], stack = [];
    let node = tree;
    while(stack.length || node) {
        while (node) {
            stack.push(node);
            node = node.left;
        }
        if (stack.length) {
            node = stack.pop();
            res.push(node.value);
            node = node.right;
        }
    }
    return res;
}
// 后序遍历：左右根
let res = [];
function dfsafter(tree) {
    if (tree) {
        dfsafter(tree.left);
        dfsafter(tree.right);
        res.push(tree.value);
    }
}
function dfsafter (tree) {
    let res = [], stack = [];
    let node = tree, lastVisit = tree;
    while(stack.length || node) {
        while(node) {
            stack.push(node);
            node = node.left;
        }
        node = stack[stack.length - 1];
        if (!node.right || node.right === lastVisit) {
            res.push(node.value);
            stack.pop();
            lastVisit = node;
            node = null;
        } else {
            node = node.right;
        }
    }
    return res;
}
// 广度优先遍历BFS
function bfs(tree) {
    let res = [];
    let stack = [tree];
    let count = 0;
    const fn = function (){
        let node = stack[count];
        if (node) {
            res.push(node.value);
            if (node.right) stack.push(node.right);
            if (node.left) stack.push(node.left);
            count++;
            fn()
        }
    };
    fn();
    return res;
}
function bfs(tree) {
    let res = [], queue = [];
    queue.push(tree);
    while(queue.length) {
        node = queue.shift(); // 队列，先进先出
        res.push(node.value);
        if (node.left) queue.push(node.left);
        if (node.right) queue.push(node.right);
    }
    return res;
}

// setState实际发生了什么：
/**
 * 1、react为要更新的新节点当创建一个updateQueue更新队列
 * 2、然后触发reconciliation过程，使用react Fiber调度算法，开始生成fiber树；最大优势在于异步可中断
 * 3、react scheduler根据优先级先执行优先级高的节点，具体是执行dowork方式
 * 4、dowork方法中：执行updateQueue获取新节点，然后对比新旧节点，为老节点打上更新、替换，插入，移动等标签
 * 5、当前节点完成后，执行performUnitOfWork获取新的节点重复以上过程；
 * 6、所有节点完成后，触发commitRoot进入commit更新阶段
 * 7、commit：react根据前面的各个节点的标签，一次性更新整个dom元素
 * 
 * 虚拟dom的优缺点：
 *  优点：
 *      1、为函数式的 UI 编程方式打开了大门
 *      2、在不需要手动优化的情况下，依然可以保证性能下线
 *      3、无需手动操作dom
 *      4、具有跨平台优势，可以渲染到 DOM 以外的 backend，比如 ReactNative
  * 优点是其抽象能力和常驻内存的特性，让框架能更容易实现更强大的 diff 算法，
  * 缺点是增加了框架复杂度，也占用了更多的内存。
 *  缺点：
 *      无法进行极致优化
 * innerHTML:  render html string O(template size) + 重新创建所有 DOM 元素 O(DOM size)
 * Virtual DOM: render Virtual DOM + diff O(template size) + 必要的 DOM 更新 O(DOM change)
 * 可以看到：Virtual DOM render + diff 显然比渲染 html 字符串要慢，但是！它依然是纯 js 层面的计算，比起后面的 DOM 操作来说，依然便宜了太多。
 * Virtual DOM：它保证了 1）不管你的数据变化多少，每次重绘的性能都可以接受；2) 你依然可以用类似 innerHTML 的思路去写你的应用。
 * MVVM（Angular，Vue）的变化是数据层面的，react的检查是dom结构层面的
 *  MVVM渲染列表时，由于每一行都有自己的数据作用域scope、通常每一行有一个对应的ViewModel实例，或者一个轻量一些的利用原型继承的
 * scope对象，创建ViewModel/scope实例比Virtual Dom代价要高很多，所以MVVM列表渲染的初始化几乎一定比react要慢。
 *  Angular 和 Vue 都提供了列表重绘的优化机制，也就是 “提示” 框架如何有效地复用实例和 DOM 元素。Angular 和 Vue 用了 track by $index 
 * portals： 使组件可以脱离父组件层架挂载在dom树的任何位置；但是组件事件通过冒泡机制依旧可以传给父组件
 * react优化性能手段：
 *  1、纯组件（PureComponent）：浅比较，相同则不会重新渲染
 *  2、React.memo组件记忆：记忆上一次props的执行输出并提升性能
 *  3、shouldComponentUpdate：自定义精准渲染控制。如表格非展示数据不予重新渲染
 *  4、懒加载组件（Suspense + lazy）：主包体积变小，消耗的网络传输时间更少
 *  5、对于有公共父级的组件，使用React.Fragment避免额外标记
 *  6、减少内敛函数使用，而是在render外面创建一个函数，绑定到对应组件的事件上
 *  7、避免使用react建议移除的生命周期
 *  8、避免使用内联样式。使用内联样式时浏览器需要花费更多时间来处理脚本和渲染，因为它必须映射传递给实际 CSS 属性的所有样式规则
 *  9、优化react中条件渲染render中少用if  else  可以使用  this.state.flag && <ComponentA />
 *  10、为组件创建错误边界：getDerivedStateFromError和componentDidCatch
 *  11、使用CDN：不同域名提升并发能力；文件可以被缓存利用减少网络请求；高容量基础设施
 *  12、使用HTML5+CSS3动画代替js动画：解析css代价更加便宜（声明性的，可并行，可以推迟样式属性计算）；
 * 加载js库需要更多网络宽带和请求；破损的css规则对页面损坏影响小，有js报错页面大概率奔溃空白
 *  13、启用gzip压缩，减少网络宽带，减少了网页需要传输到客户端的数据量
 *  14、web worker处理cpu密集任务：Worker 线程在后台运行，可以在不中断主线程的情况下执行多个脚本和 JavaScript 任务
 * 和js线程在隔离环境中执行、但可以使用进程间线程通信与js主线程交互，主线程可以专心处理dom渲染
 *  15、服务的渲染SSR（Server site Rendering）：遂于SEO和首屏加载很有利
 * 
 * 
 * React 会检测 element.$$typeof，如果元素丢失或者无效，会拒绝处理该元素。
 * 特意用 Symbol.for() 的好处是 Symbols 通用于 iframes 和 workers 等环境中。
 * 因此无论在多奇怪的条件下，这方案也不会影响到应用不同部分传递可信的元素。
 * 浏览器不支持Symbol就会设置$$type: 0xeac7（长得像react的数字）
 * 判断Function函数组件还是Class类组件： 看原型链上有没有React.Component
 */

componentDidCatch(error, info) {
    console.log("Component Did Catch Error");
}
// static 函数用于指定回退机制，并从收到的错误中获取组件的新状态
static getDerivedStateFromError(error) {
    console.log("Get Derived State From Error");
    return {
        hasErrors: true
    }
}

