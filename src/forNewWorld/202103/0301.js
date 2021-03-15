/**
 * V8垃圾回收为什么要设置上限：
 *  1、js的单线程执行机制：一旦进入垃圾回收、其他的各种运行逻辑需要暂停
 *  2、垃圾回收机制的限制：以 1.5GB 的垃圾回收堆内存为例，V8 做一次小的垃圾回收需要50ms 以上，做一次非增量式的垃圾回收甚至要 1s 以上
 * 因此，V8 做了一个简单粗暴的选择，那就是限制堆内存，也算是一种权衡的手段，因为大部分情况是不会遇到操作几个G内存这样的场景的
 *  新生代、老生代：（新生代存活短，老生代或许会继续更久的存在内存中）64位系统下，新生代内存大小为32MB，老生代内存大小为1.4GB。
 * 新生代采用Scavenge垃圾回收算法，在算法实现时主要采用Cheney算法。
 * Cheney算法将内存一分为二，叫做semispace，一块处于使用状态，一块处于闲置状态。
 *      新生代from、to两个部分载scavenge算法中对调，完成资源的整合，解决内存碎片
 * 新生代晋升到老生代：1、经历过一次以上scavenge算法调度更替 2、to的内存使用率超过25%以上
 * 老生代垃圾回收:
 *  1、标记清除，先遍历将活动的对象加上标记，然后对于代码中使用的变量以及强引用（如map，考虑到垃圾回收，采用weakMap）的变量取消标记，
 * 随后清除就是清除不带标记的变量进行空间回收。最后进行Mark-Compact是标记整理的意思，是在Mark-Sweep的基础上演变而来的。
 * Mark-Compact在标记完存活对象以后，会将活着的对象向内存空间的一端移动，移动完成后，直接清理掉边界外的所有内存。
 *  2、增量标记，将大工作量的任务标记分成很多小的部分完成，每做完一个小部分标记，就将主线程让给js执行，完成后再做下一个小部分标记。
 * 循环至标记阶段完成才进入内存整理上面来。
 * 在nodejs中我们可以通过：process.memoryUsage()查看内存分配（单位比特）
 *    rss（resident set size）：所有内存占用，包括指令区和堆栈
 *    heapTotal：V8引擎可以分配的最大堆内存，包含下面的 heapUsed
 *    heapUsed：V8引擎已经分配使用的堆内存
 *    external：V8管理C++对象绑定到JavaScript对象上的内存
 * 
 * V8执行一段js代码：AST--字节码--机器码--执行
 * 1、通过词法分析（将js代码分解成一个个token）、语法分析（按照一定的语法规则将token数据转化成树状结构）生成AST（抽象语法树）；然后生成执行
 * 上下文。
 * 2、有了AST后通过V8的解释器Ignition生成字节码（比机器码轻量的多）。生成字节码的原因在于可以分割代码成字节码，然后解释器可以逐行执行字节码，减轻内存压力。
 * 3、字节码解释执行。对于反复出现的代码，V8将其记作热点代码（HotSpot），将这代码通过编译器（TruboFan）编译成机器码保存下来，下次遇见直接执行即可。
 * 
 * Node EventLoop循环机制：
 * 1、三大关键阶段：a、执行定时器回调阶段timer（setTimeout、setInterval）b、轮循阶段poll（异步操作完成后通过data、connect事件使得事件循环到poll阶段）
 * c、check阶段，直接执行setImmdiate回调
 * nodejs和浏览器关于事件循环主要区别：
 *  浏览器中的微任务是在每个对应的宏任务中执行的；nodejs中的微任务是在不同的阶段执行的。
 * process.nextTick独立于EventLoop的任务队列，优先级高于微任务队列
 */
 /**
  * 高阶组件:HOC
  * 不是组件,是增强函数,输入一个组件,返回一个增强组件
  * 主要作用是代码复用,操作状态和参数;
  * 主要有:
  *     属性代理:如默认参数,提取状态,包裹组件,
  *     反向继承,渲染劫持(给loading状态判断条件显示专门的loading界面)
  *     性能监控:在constructor中设置开始时间,在componentDidMount中设置结束时间,进行渲染时间计算监控
  * 
  * 注意事项:
  * 1,纯函数:避免侵入修改元组件
  * 2,避免用法污染:理想状态下,应该透传原组件的无关参数和事件,尽量保持用法不变
  * 3,命名空间:应该符合规范,方便调试和查找问题如withAuthButton,用with命名表示增强点
  * 4,引用传递:传递原组件的refs使用,采用React.forwardRef
  * 
  * 
  * Redux:全局的数据管理中心,通过dispath保证着数据的健壮性,可追溯,预测性.
  * 核心理念:单一数据源;状态只读,纯函数
  *     store:全局store单例,每个redux应用下只有一个store,具有方法:getState(获取state),dispath(触发action,更新state)
  * subscribe(订阅数据变更,注册监听器)
  *     action:行为载体,用于映射相应的reducer,可以成为数据载体,是store的唯一的数据源,行为名称.
  *     reducer:描述如何修改数据的纯函数,是修改行为的实质
  * 
  * 默认情况下需要返回原数据state,避免数据被清空;设置初始值,便于应用初始化和数据稳定
  * connect: 一个高阶组件，可以方便在 React 组件中使用 Redux；
        将store通过mapStateToProps进行筛选后使用props注入组件
        根据mapDispatchToProps创建方法，当组件调用时使用dispatch触发对应的action

  * 
  * 上面有提到模块化，个人觉得如果更广义的来讲，模块化和组件化并不在一个维度上，
  * 模块化往往是代码的设计和项目结构的设计；但很多时候在狭义的场景中，比如一个
  * 很通用的功能，也完全能够将其组件化或模块化，这两者此时十分相似，
  * 最大的区别就是组件必定是模块化的，并且往往需要实例化，也应当赋有生命周期，
  * 而模块化往往是直接引用。
  * 组件化:只要有ui层的展示,就必定有可以组件化的地方:组件就是将一段ui样式和其对应得功能作为独立得整体去看待,
  * 这个整体无论放到哪里去使用,都具有一样得功能和样式,从而实现复用.
  * MVVM框架,定义了view和Model之前的双向绑定,一方对应的变化,另一方也要随之变化.其最大的问题是:
  * 1,短时间的频繁操作会引起大量的更新
  * 2,不支持多次绑定
  * 
  * 函数组件和类组件:
  *   函数组件的写法要比类组件简洁，
  *   类组件比函数组件功能更加强大。类组件可以维护自身的状态变量，即组件的state，类组件还有不同的生命周期方法，
  * 可以让开发者能够在组件的不同阶段（挂载、更新、卸载），对组件做更多的控制。
  * 无状态组件和有状态组件:
  *   无状态组件(Stateless Component )和有状态组件(Stateful Component)，划分依据是根据组件内部是否维护state。
  * 展示型组件和容器型组件:
  *   展示型组件不关心组件使用的数据是如何获取的，以及组件数据应该如何修改，它只需要知道有了这些数据后，组件UI是什么样子的即可。
  * 外部组件通过props传递给展示型组件所需的数据和修改这些数据的回调函数，展示型组件只是它们的使用者。优先考虑使用函数组件实现展示型组件.
  *   容器型组件需要知道如何获取子组件所需数据，以及这些数据的处理逻辑，并把数据和逻辑通过props提供给子组件使用。
  * 容器型组件一般是有状态组件，因为它们需要管理页面所需数据
  *   
  */