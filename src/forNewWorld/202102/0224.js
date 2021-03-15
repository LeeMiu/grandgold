/**
 * 合成事件和原生事件的区别
 * react事件绑定的一般都是合成事件：
 * React合成事件机制: React并不是将click事件直接绑定在dom上面,而是采用事件冒泡的形式冒泡到document上面,
 * 然后React将事件封装给正式的函数处理运行。
 * 为了避免dom事件滥用，同时屏蔽底层不同浏览器见的事件系统差异，采用了中间层SyntheticEvent（负责所有事件合成）
 *  1、当用于为onClick添加函数时，并没有将click绑定到dom上
 *  2、而是在document处监听所有支持的事件，当事件冒泡到document时，react将内容封装交给中间层处理
 *  3、然后事件触发时中间层使用统一的分发函数dispatchEvent将指定函数执行
 */
// react事件绑定
<div className="demo" onClick={this.click()}></div>
// 普通事件绑定
<div className="demo" onclick={this.click()} />
// 原生事件比合成事件快，原因就在于合成事件需要冒泡后再分发执行
// 阻止原生事件的冒泡后,会阻止合成事件的监听器执行
/**
 * 
 * React核心流程可以分为:
 *  1,reconciliation:调度算法,也可称render
 *      更新state和props
 *      调用生命周期钩子
 *      生成Virtual dom(Fiber Tree)
 *      通过diff算法进行新旧dom比较
 *      确定是否需要更新
 *  2,commit:进行dom节点的更新
 *  fiber是为了解决同步阻塞而采取的任务分割,将分割后的小任务单元分散到浏览器的空闲期间去排队执行:
 * 
 * Fiber会将任务分割后分散执行，低优先级的的任务交给requestIdleCallback处理，
 * 这是个浏览器提供的事件循环空闲期的回调函数，需要 pollyfill，而且拥有 deadline 参数，限制执行事件，以继续切分任务
 * 高优先级的任务交给requestAnimationFrame处理(由html5提供，专门用于请求动画api)；使用setInterval实现动画容易掉帧
 * 优先级策略: 文本框输入 > 本次调度结束需完成的任务 > 动画过渡 > 交互反馈 > 数据更新 > 不会显示但以防将来会显示的任务
 * requestAnimationFrame最大的优势是由系统来决定回调函数的执行时机，
 * 当页面处于未激活的状态下，该页面的屏幕绘制任务也会被系统暂停，因此跟着系统步伐走的rAF也会停止渲染，当页面被激活时，动画就从上次停留的地方继续执行，有效节省了CPU开销。
 * requestAnimationFrame的步伐跟着系统的刷新步伐走，它能保证回调函数在屏幕每一次的刷新间隔中只被执行一次，这样就不会引起丢帧。
 * 
 */