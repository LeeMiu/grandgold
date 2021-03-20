/**
 * 前端如何进行SEO优化（SEO Search Engine Optimization搜索引擎优化）
 *      1、合理的title、description、keywords：搜索对该三项的权重逐个减小。
 *      2、语义化的html代码，符合w3c规范，语义化代码让所有引擎更容易理解网络
 *      3、重要的html代码放到上面。因为爬虫抓取html顺序是从上到下的
 *      4、少用iframe：搜索引擎不会抓取iframe中的内容，当然重要内容不能用js输出，同理不抓取
 *      5、非装饰性图片需要加上alt
 * 
 * 前后端分离的项目如何SEO
 *      1、使用prerender，预渲染
 *      2、nginx判断当前页面用户的user-agent是否是爬虫，是网络爬虫则用nginx反向代理到我们前端项目页面，
 * 增加扒页面的接受延迟，保证异步渲染的接口数据返回，最后得到页面的数据，返还给访问的爬虫即可。
 * 
 * 如何优雅的一次性插入1000个div
 *      使用Fragment：
 *      var fragment = document.createDocumentFragment();
 *      for (let i = 0; i < 1000; i++) {
 *          var elem = document.createElement('div');
 *          elem.innerHTML = i + 1;
 *          fragement.appendChild(elem);
 *      }
 * 优雅的向1000个div中插入一个平级div：
 *      先display：none，然后再插入，再display: block;每个div需要带上唯一标识key
 * 
 * 很多数量20万个小球，在浏览器用js存储他们的信息：大小，颜色，位置等
 *      1、用ArrayBuffer实现极致存储
 *      2、哈夫曼编码+字典查询树优化索引
 *      3、用bit-map实现大数据筛选
 *      4、用hash索引实现简单快捷检索
 *      5、用indexedDB实现动态存储扩充浏览器虚拟容量
 * 
 * 如何使上面的20万个小球在浏览器以直线流畅运动起来
 *      1、GPU加速：css3中的transform、opacity、filter
 *      2、使用assembly辅助计算，然后再浏览器控制动画帧频率
 *      3、利用web worker实现js多线程，分块处理小球运动
 *      4、用单链表树和协程机制，实现动态任务分割和任务暂停，采用Fiber原理处理小球
 *    备注：生成器执行机制：协程，比线程更加轻量级。协程处在线程的环境中，一个线程可以存在多个协程，
 *          可以将协程理解为线程中的一个个任务。不像进程和线程，协程并不受操作系统的管理，而是被具体
 *          的应用程序代码所控制。因此并没有进程/线程上下文切换的开销，这是高性能的重要原因
 *           async/await利用协程和Promise实现了同步方式编写异步代码的效果
 * 
 * a.b.c.d和a['b']['c']['d']，哪个性能更高
 *       涉及ast抽象语法树、编译原理、v8内核对原生js实现问题。部分实验证明前一种更好性能。
 * 
 * MVVM：moddel-view-ViewModel
 *      Model：对应数据层的域模型，它主要做域模型的同步。通过 Ajax/fetch 等 API 完成客户端和服务端业务 Model 的同步。
 *      View：视图层，整个 View 是一个动态模板。除了定义结构、布局外，它展示的是 ViewModel 层的数据和状态。
 * View 层不负责处理状态，View 层做的是 数据绑定的声明、 指令的声明、 事件绑定的声明。
 *      ViewModel：把 View 需要的层数据暴露，并对 View 层的 数据绑定声明、 指令声明、 事件绑定声明 负责，
 * 也就是处理 View 层的具体业务逻辑。ViewModel 底层会做好绑定属性的监听。
 * MVVM优缺点：
 *      优点：a、分离试图和模型，降低代码耦合，提高试图或者逻辑的重用性 b、提高可测试性，ViewModel的存在可以帮助
 * 开发者更好德编写测试代码 c、自动更新dom，由于实现了双向绑定
 *      缺点：a、bug很难被调试，可能使view层面的、也可能是model层面的。由于使用了双向绑定，使得一个位置bug被快速传第
 *到其他位置。 b、大模块的model不释放内存造成了资源的长期占用 c、对于大型图形应用程序，视图状态多，viewmodel的构建和
 维护成本都比较高
 */