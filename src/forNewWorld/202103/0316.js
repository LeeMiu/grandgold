/**
 * JSX：类型XML的js代码，是一种js的语法拓展。React.createElement语法糖
 * 如const elem = <h1>hello world!</h1>;
 * 如const elem = <h1 id="container" className="home">hello</h1>;
 * 等价于=
 * const elem = React.createElement('h1', {
 *  id:'container',
 *  className: 'home',
 * }, 'hello');
 * render中一般就是我们进行JSX布局和事件绑定
 * React.createElement有三个参数：type（dom类型，如div，h1）、props（dom属性，如id，class）、children（子节点，字符串或者其他dom元素）
 * JSX用一种类似HTML的语法替代了比较繁琐的React.createElement纯JS方法@label/preset-react插件将所有的JSX都改成React.createElement
 * 
 * 前端测试工具做unit/E2E测试：karma、mocha、jasmin、cypres、jest
 * 快照测试：用于html+css生成的ui层的便捷回归测试
 * 
 * for...of循环：具有iterator接口即可使用for...of遍历他的成员，使用范围：数组、Set、Map、字符串、类数组和Generator对象。可中断循环
 * for...in循环：遍历对象自身和继承的可枚举性，不能直接获取属性值，可中断循环。
 * forEach：只能遍历数组，没有返回值。可以通过异常try。。。catch异常中断
 * map：只能遍历数组，不能中断，返回值是修改后的数组。
 * 
 * ==和===区别在于：===是严格等于，需要类型和value，引用地址啥的都完全相等，==会在比较中默认进行类型转换。
 * ==类型转换流程：
 *  1、首先判断两者类型是否相同，如果相等，判断值是否相等.
 *  2、如果类型不同，进行类型转换
 *  3、判断比较的是否是 null 或者是 undefined, 如果是, 返回 true .
 *  4、判断两者类型是否为 string 和 number, 如果是, 将字符串转换成 number
 *  5、判断其中一方是否为 boolean, 如果是, 将 boolean 转为 number 再进行判断
 *  6、判断其中一方是否为 object 且另一方为 string、number 或者 symbol , 如果是, 将 object 转为原始类型再进行判断
 * 
 * 变量提升：在变量声明之前就可以使用，值为undefined
 * 暂时性死区：只要一进入当前作用域，所要使用的变量就已经存在了，但是不可获取，只要等变量被声明哪一行代码出现，才可以
 * 获取和使用该变量。在暂时性死区使用typeod不再是一个完全安全的操作。
 * 
 * prototype和__proto__区别：
 *  prototype是构造函数的属性，__proto__是每个实例都有的属性，可以访问[[prototype]]属性
 *  实例的__proto__和其构造函数的prototype指向的是同一个对象。
 * 
 * 防抖使用场景：resize/scroll 触发统计事件、文本输入的验证（连续输入文字后发送 AJAX 请求进行验证，验证一次就好）
 * 节流使用场景：DOM 元素的拖拽功能实现（mousemove）、射击游戏的 mousedown/keydown 事件（单位时间只能发射一颗子弹）、
 * 计算鼠标移动的距离（mousemove）、Canvas 模拟画板功能（mousemove）、搜索联想（keyup）、
 * 
 * setTimeout是否就是按wait事件后执行：否。因为事件循环，需要等当前代码执行栈执行完才会执行宏任务队列中事件，可能等待时间
 * 比较久，wait是最少等待时间，而非切确时间。默认4ms，老版本默认10ms
 * 
 * promise.resolve:返回一个以给定值解析后的Promise对象
 *  1、如果value是一个thenable对象，返回的promise会跟随该对象，采用它的最终状态
 *  2、如果传入的value本身就是个promise对象，那直接原封不动地返回该promise对象
 *  3、其他情况，直接返回以该值为成功状态的promise对象
 * 
 * Vue异步请求适合再哪个生命周期调用：
 *      官方示例是在mounted，实际上created中也可以
 * 
 * vue组件间通信：
 *      1、父子组件：props/$emit+v-on：props父级向子级传第数据，$emit+v-on子级向父级传递信息
 *      2、EventBus：全局发布订阅，任何层级组件通信，项目大复杂起来，难以管理
 *      3、vuex：全局数据管理库，vuex管理全局的数据流
 *      4、$atter/$listener：vue2.4加入的跨级组件通信
 *      5、provide/inject：祖先组件向其子孙组件注入依赖。
 * 
 * vue响应式系统：
 *  1、任何一个vue component都有一个与之对应的watcher实例
 *  2、vue的data上属性会被添getter和setter属性。
 *  3、当template被编译化后的render被执行时，data会被touch，getter方法被调用，此时vue会去记录此vue
 * component所依赖的所有data。（依赖收集）
 *  4、data被改动时，setter方法被调用，此时vue会通知所有依赖于此的data的组件去调用render函数进行更新。
 * 
 * 当代前端框架的两种方式侦测变化：pull（react、angular），push（vue的依赖收集）；实际vue是（pull（diff）+push（依赖收集））。
 * vue没有shouldcompnentupdate这种生命周期原因：vue有依收集，可以侦测到具体哪个组件变化了，不需要手动控制diff，
 * 引入该生命周期价值有限不高。
 * 
 * rem：本质是等比缩放，一般是基于宽度，假如将屏幕宽度分成100份，每一份为1rem，那1rem的像素就=屏幕宽度像素/100
 * rem布局加载闪烁问题：解决方案，媒体查询设置根元素字体大小。
 * 比rem更好的方案：vw，1vw表示视口宽度的1%，同理1vh视口高度的1%。缺点是兼容性不好。
 * 
 */