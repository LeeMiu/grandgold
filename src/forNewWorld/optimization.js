// 项目细节优化：（涉及开发过程中、上线后的首屏、运行中）
//  * 1、开发中：a、防止变量滥用 b、组件、标签使用唯一的key做键值迭代 c、不在render中处理数据，不然反复触发
//  * d、不必要的标签使用Fragment，可以减少内存占用 e、web worker做密集型任务处理 f,优化webpack打包机制 g,图片转base64
//  * 2、首屏优化：a、采用骨架屏，页面内容未加载，先用简单样式图形进行占位，待内容加载完后再替换 b、路由、图片懒加载
//  * 路由懒加载（component: (resolve) => require(["../views/index.vue"], resolve),）图片懒加载（vue-lazyload）
//  * c、通过CDN分发，减少vendor.js体积 d、gzip压缩 e、静态图片通过服务期请求获取 f,利用好async,defer属性使js脚本延迟执行,
// 不阻塞页面渲染 g,引入http2.0,传输性能的提升 h,利用http压缩
//  * 3、运行中：a、数据或文件放node服务端处理，使用stream流方式处理 b、React.Profiler和performance API分析组件渲
//  * 染和时耗 c、使用componentDidCatch处理错误边界。d,配置nginx优化
//  * 
//  * react优化性能手段：
//  *  1、纯组件（PureComponent）：浅比较，相同则不会重新渲染
//  *  2、React.memo组件记忆：记忆上一次props的执行输出并提升性能
//  *  3、shouldComponentUpdate：自定义精准渲染控制。如表格非展示数据不予重新渲染
//  *  4、懒加载组件（Suspense + lazy）：主包体积变小，消耗的网络传输时间更少
//  *  5、对于有公共父级的组件，使用React.Fragment避免额外标记
//  *  6、减少内敛函数使用，而是在render外面创建一个函数，绑定到对应组件的事件上
//  *  7、避免使用react建议移除的生命周期
//  *  8、避免使用内联样式。使用内联样式时浏览器需要花费更多时间来处理脚本和渲染，因为它必须映射传递给实际 CSS 属性的所有样式规则
//  *  9、优化react中条件渲染render中少用if  else  可以使用  this.state.flag && <ComponentA />
//  *  10、为组件创建错误边界：getDerivedStateFromError和componentDidCatch
//  *  11、使用CDN：不同域名提升并发能力；文件可以被缓存利用减少网络请求；高容量基础设施
//  *  12、使用HTML5+CSS3动画代替js动画：解析css代价更加便宜（声明性的，可并行，可以推迟样式属性计算）；
//  * 加载js库需要更多网络宽带和请求；破损的css规则对页面损坏影响小，有js报错页面大概率奔溃空白
//  *  13、启用gzip压缩，减少网络宽带，减少了网页需要传输到客户端的数据量
//  *  14、web worker处理cpu密集任务：Worker 线程在后台运行，可以在不中断主线程的情况下执行多个脚本和 JavaScript 任务
//  * 和js线程在隔离环境中执行、但可以使用进程间线程通信与js主线程交互，主线程可以专心处理dom渲染
//  *  15、服务的渲染SSR（Server site Rendering）：遂于SEO和首屏加载很有利
//  * 
//  * 
//  * 开发过程中渲染优化：
//  *  1、避免频繁使用内联样式style，可以使用class
//  *  2、使用createDocumentFragment进行批量dom操作
//  *  3、对于resize、scroll进行防抖节流处理
//  *  4、合理使用GPU加速度
//  * 
//  * 首屏渲染优化
    // 保证应用的可用性,增加错误边界.
    // 方式及分包策略,资源的减少是最有效的加快首屏打开的方式
//  优化用户感知:
 
//  利用一些动画 过渡效果，能有效减少用户对卡顿的感知；
//  尽可能利用 骨架屏(Placeholder) / Loading 等减少用户对白屏的感知；
//  动画帧数尽量保证在 30帧 以上，低帧数、卡顿的动画宁愿不要；
//  js 执行时间避免超过 100ms，超过的话就需要做:
//     寻找可 缓存 的点；
//     任务的 分割异步 或 web worker 执行；