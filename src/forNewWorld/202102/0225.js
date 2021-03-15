/**
 * css-盒模型：dom所采用的布局模型，可以通过box-size进行设置；
 * w3c标准盒模型：content-box；
 * ie标准盒模型：border-box；
 * BFC：Block Formatting Context：块级格式化上下文；使BFC内部和外部的元素相互隔离
 * ie下为Layout，通过zoom：1触发
 * 触发：根元素、position：absolute/fixed、display：inline-block/table、float元素、overflow ！== visible
 * 规则：相邻的两个box垂直排列，且margin会重叠、BFC区域不与float元素重叠
 * 计算高度时，浮动子元素也参与计算、文字层不会被浮动层覆盖，环绕于四周
 * 叠层上下文：
 * 优先级：border/background < 负的z-index < block盒子 < float浮动盒子
 * < inline/inline-block水平盒子(行内元素) < z-index:auto/0 < 正的z-index（值越大层级越高）
 * 选择器优先级：！important > 行内样式style > #id > class > tag > * > 继承 > 默认
 * 清除浮动影响，防止父级高度塌陷：增加为元素清除浮动：&:after {clear: both} ；创建父级BFC、父级设置高度
 * 
 * 执行上下文（EC）中的变量对象，可抽象为一种数据作用域，存储着该执行上下文的所有变量和函数声明（不包括函数表达式）
 * [[scope]]属性: 指向父级变量对象和作用域链，也就是包含了父级的[[scope]]和AO
 * 
 * script的引入：
 * 1、html中静态引入：<script src="xx.js"></script>
 * 2、js动态插入：var demo = document.ceateElement("script");demo.src = 'xxx.js';
 * 3、script defer: 延迟加载，元素解析完成后执行,多个设置了 defer 属性的脚本按规范来说最后是顺序执行的，但是在一些浏览器中可能不是这样
 * 4、script async：异步加载，执行时可能会阻塞元素渲染。个 async 属性的脚本的执行顺序是不可预测的
 */

 /**
  * 手动是实现instanceOf
  * 1、先获取当前类的原型，当前实例对象的原型链
  * 2、循环查找机制：a、当前实例对象原型链的原型链proto = proto.__proto__ b、如果当前
  * 实例原型链__proto__上找当当前类的原型prototype，返回true c、一致循环找下去，直到null还没有返回false
  *
  */
 function myInstanceOf (obj, fn) {
    let fn_proto = fn.prototype, proto = obj.__proto__;
    while(true) {
        if (proto === null || fn_proto === undefined) {
            return false;
        }
        if (proto === fn_proto) {
            return true;
        }
        proto = proto.__proto__;
    }
}

/**
 * js的几种模块规范
 * 1、commonjs方案：通过require引入，modulues.export定义模块的输出接口。
 * 是服务器端的解决方案，以同步的方式来引入,因为在服务端文件都存储在本地磁盘，读取非常快，采用同步是没有问题的。
 * 2、AMD方案：采用异步加载的方式加载模块，模块加载不影响后面语句的执行，所有
 * 依赖该模块的语句都在一个回调函数里，require.js实现了AMD规范
 * 3、CMD方案：和AMD一样解决了异步模块加载的问题。sea.js实现了CMD规范；与AMD不同在于
 * 模块定义时对依赖的处理以及依赖模块的执行时机的不同。
 * 4、ES6的import、export的导入导出模块。
 * 以上规范的区别：
 * 1、commonjs模块输出的是值得拷贝，es6输出得是值的引用。一旦引入模块内部的变化就影响不到这个值，
 * 而es6是import一个只读引用，到脚本真正执行时，才会去模块中去值。
 * 2、commonj是运行时加载、es6是编译时输出接口。
 * AMD和CMD规范区别：
 * 1、模块定义时对依赖的处理不同。AMD推崇依赖前置，在定义模块时就要声明其依赖模块，CMD推崇
 * 就近依赖，只有在用到某个依赖时才会去require
 * 2、依赖模块的执行时机不同。都是异步加载，但是AMD在依赖加载完成后就直接执行依赖，且执行顺序和
 * 我们书写的顺序不一定一致。CMD在依赖加载后并不执行，等到所有依赖都加载好了后，进入回调函数逻辑
 * 遇到require才执行对应的模块，这样执行顺序和我们书写的一致。
 * 
 * requirejs核心原理是通过动态创建script脚本来异步引入模块，然后对每个脚本的load事件进行监听。所有都加载完了再调用回调函数。
 * 
 * 事件循环：先执行微任务，再执行一个宏任务。主进程来回在该两个任务队列来回切换：
 * 微任务：一般由promise、ajax、object.observe
 * 宏任务：setTimeout、script、I/O、UI rendering
 * 
 * Node下的Event Loop的6个阶段：
 * timer阶段：执行到期的setTimeout/setInterval队列回调
 * I/O阶段：执行上轮循环残留的callback
 * idle，prepare：idle准备
 * poll：等待回调（执行回调；执行定时器（如有到期的setTimeout/setInterval，则返回timer阶段；如有setImmediate，前往check阶段））
 * check：执行setImmediate
 * close callbacks：执行关闭所有回调
 *  */
// 基础排序算法：插冒归基稳定，快选堆希不稳定
// 冒泡：
function bubleSort (arr) {
    var len = arr.length;
    for (let i = 0; i < len -1; i++) {
        for (let j = 0; j < len - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j+1], arr[j]];
            }
        }
    }
    return arr;
}
// 选择排序
function selectSort(arr) {
    let len = arr.length;
    for (let i = 0; i < len - 1; i++) {
        for(let j = i; j < len; j++) {
            if (arr[j] < arr[i]) {
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
        }
    } 
    return arr;
}
// 插入排序
function insertSort(arr) {
    for (let i = 1; i < arr.length; i ++) {
        for (let j = i; j > 0; j--) {
            if (arr[j] < arr[j - 1]) {
                [arr[j - 1], arr[j]] = [arr[j], arr[j-1]];
            }
        }
    }
    return arr;
}
// 快排
function quickSort(arr) {
    if (arr.length <= 1) return arr;
    var left = [], right = [], current = arr.splice(0,1);
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] > current) {
            right.push(arr[i]);
        } else {
            left.push(arr[i]);
        }
    }
    return quickSort(left).concat(current, quickSort(right));
}
// 快排优化：小于10个数时采用插入排序，大于1000采用三向切分取哨兵、否则取中间数字为哨兵；还可以通过聚集相等元素

/**
 * vue和react比较
 * 1、监听数据变化实现原理不同
 *      vue通过defineProperty修改属性的getter/setter，进行数据变化劫持，然后发布给订阅者进行更新
 *      react默认通过比较引用的方式进行，建议使用（PureComponent/shouldComponentUpdate）
 *      vue使用的是可变数据，而react更强调数据的不可变。vue所以更加简单，react在构建大型应用上鲁棒性更强
 * 2、数据流不同
 *      vue1.0：parent<--props-->child<--v-model-->Dom
 *      vue2.x: parent--props-->child<--v-model-->Dom
 *      react：parent--props-->child--state-->Dom
 * 可见vue2.x把父子间的双向props变成单向的了，但是可以通过语法糖$emit+v-on实现子组件向父组件传第数据。
 * react从诞生之初就提倡单向数据流，称之为onChange/setState（）模式
 * 分别通过vuex、redux进行单向数据流的集中状态管理
 * 3、组合不同功能的方式不同
 *      vue采用mixins、react通过HOC高阶组件
 *      起初react也是采用mixins，由于react组件是个纯粹的函数；后面认为这种方式对组件侵入太强会导致很多问题。
 * 高阶组件本质是个高阶函数，对于react来说相对简单。然而vue组件时一个被包装的函数，vue将我们代码定义组件传入
 * 的对象和函数编译过。如果采用那被包装的组件就无法正常工作了。
 * 4、组件通信的区别
 *      vue中：父组件通过props向子组件传递数据，子组件通过事件（$emit）向父组件发消息数据；在vue2.2.0中新增了
 * provide/inject可跨越多个层级实现父组件向子组件数据注入；
 *      react中：父组件通过props向子组件传递数据，通过 context 进行跨层级的通信，这其实和 provide/inject 起到的作用差不多
 * 子组件通过使用回调向父组件传递数据。这可能时二者最大的区别。
 * 5、模板渲染方式不同
 * 
 *      vue是通过一种拓展的HTML语法进行渲染，采用template格式：通过指令来实现，如v-if的条件语句。如import组件后还需要再components中声明才能使用。
 *      react通过JSX渲染模板，采用render渲染：通过原生js实现模板中的常见语法。
 * 6、vuex和redux的区别（store注入和使用方式区别）
 *      vuex中：$store被注入到组件实例中，通过dispatch和commit进行提交更新，通过mapState和this.$store读取数据。组件中可以
 * dispatch actions，也可以commit update进行更新数据
 *      redux中：每个组件需要用connect把需要的props和dispatch连接起来。只能通过dispatch进行更新数据。
 *      主要是react使用的是不可变数据，每次更新都要用新的state替换旧的；vuex数据是可变的，直接修改更新。redux在检测数据变化时
 * 通过diff比较差异；vuex和vue一样，通过getter/setter来进行比较
 *  
 * 
 * 
 * 生命周期：
 * 挂载：
 *  constructor：组件构造函数，如果显示定义了该构造函数，需要在构造函数第一行执行super(props)，否则无法在构造函数中拿到this对象
 * 此阶段会：初始化state对象；给自定义方法绑定this
 * 采用getDerivedStateFromProps（nextProps， prevState）代替componentWillReceiveProps（nextProps）的原因：
 *  componentWillReceiveProps判断前后两个props是否相同然后再可能取更新，这样一来会破坏state的单一数据源，导致组件状态变得不可预测，
 * 另一方面会增加组件重绘次数。getDerivedStateFromProps使得组件更新逻辑更加清晰，并且禁止访问this.props，强制开发者去比较nextProps和
 * prevProps中的值，确保就是根据当前props来更新组件，而不是去做一些使状态不可预测的事情。
 * componentDidMount：组件装载完，可以获取dom进行操作，如服务器请求，订阅等，如设置订阅或者定时器、侦听等，需要在componentWillUnMount中取消这些
 * 采用getSnapshotBeforeUpdate(prevProps, prevState)代替componentWillUpdate(prevProps, prevState)原因：
 *  在react开启异步渲染模式后，render阶段读取的dom元素状态不总是和commit时相同，这就导致在componentDidUpdate 中使用 componentWillUpdate 
 * 中读取到的 DOM 元素状态是不安全的，因为这时的值很有可能已经失效了。getSnapshotBeforeUpdate 会在最终的 render 之前被调用，也就是说在
 *  getSnapshotBeforeUpdate 中读取到的 DOM 元素状态是可以保证与 componentDidUpdate 中一致的。该组件需要和componentDidUpdate一起使用
 */

 function qick(arr) {
     if(Array.isArray(arr)) {
         if (arr.length < 1) return arr;
         let cur = arr[0];
         let right = [], left = [];
         let len = arr.length;
         for (let i = 0; i< len ;i++) {
             if (arr[i] > cur) {
                right.push(arr[i]);
             }
             if (arr[i] < cur) {
                 left.push(arr[i])
             }
         }
         return qick(left).concat(cur, qick(right));
     }
     return [];
 }