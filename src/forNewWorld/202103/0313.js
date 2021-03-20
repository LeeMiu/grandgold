/**
 * Vue的性能优化
 * 背景：Vue 框架通过数据双向绑定和虚拟 DOM 技术，帮我们处理了前端开发中最脏最累的 DOM 操作部分， 
 * 我们不再需要去考虑如何操作 DOM 以及如何最高效地操作 DOM；但 Vue 项目中仍然存在项目首屏优化、Webpack 编译配置优化等问题
 * 
 * Vue代码层面：
 *  1、v-if 适用于在运行时很少改变条件，不需要频繁切换条件的场景；v-show 则适用于需要非常频繁切换条件的场景
 *  2、watch和computed：需要进行数值计算，并且依赖于其它数据时，应该使用 computed，因为可以利用 computed 的缓存特性，避免每次获取值时，都要重新计算
 * 需要在数据变化时执行异步或开销较大的操作时，应该使用 watch，使用 watch 选项允许我们执行异步操作 ( 访问一个 API )，限制我们执行该操作的频率，并在我们得到最终结果前，设置中间状态。
 *  3、v-for 遍历必须为 item 添加 key。为了较快地定位到 diff；v-for 遍历避免同时使用 v-if；v-for 比 v-if 优先级高， 哪怕我们只渲染出一小部分用户的元素，
 * 也得在每次重渲染的时候遍历整个列表，不论活跃用户是否发生了变化。这将会影响速度，必要下可以替换成computed先过滤if条件数据
 * 为什么v-for的优先级更高v-if：
 *  因为在compiler编译模板器中，源码是先判断处理v-for，return genFor(el, state);然后再判断处理v-if，return genIf(el, state)
 * 所以同时使用时，依旧是先遍历的整个list，
 * render函数执行以后会生成vnode，就是虚拟dom。每当数据发生变化时，会触发watcher执行update方法，
 * 就会重新执行render方法生成新的vnode，所以就需要重新遍历一遍数据
 *  推荐
 *         <ul>
            <li
                v-for="user in activeUsers"
                :key="user.id">
                {{ user.name }}
            </li>
            </ul>
            computed: {
            activeUsers: function () {
                return this.users.filter(function (user) {
            return user.isActive
                })
            }
            }
 *  
 * 4、beforeDestroy时需要手动清除我们一开始设置的事件侦听removeEventListener、以及定时器
 * 5、图片懒加载v-lazy，
 * 自定义懒加载配置
 *  Vue.use(VueLazyload, {
        preLoad: 1.3,
        error: 'dist/error.png',
        loading: 'dist/loading.gif',
        attempt: 1
        })
 * 
 * 6、路由懒加载，提升首屏加载速度，但是其他页面第一次点击进去还是会速度比一次性加载完慢一点
 * 7、长列表优化，vue-virtual-scroll-list 和 vue-virtual-scroller 来优化这种无限列表的场景的。
 * 8、服务端渲染 SSR or 预渲染。回顾下：SSR优点：a、利于SEO搜索引擎爬虫优化 b、首屏加载更快 缺点：a、服务器负载压力增大 b、开发限制，只支持 beforCreate 和 created 两个钩子函数
 * 
 * webpack优化：
 *  1、imag-webpack-loader图片压缩优化
 *  2、babel-plugin-transform-runtime 插件就是用来实现这个作用的，将相关辅助函数进行替换成导入语句，从而减小 babel 编译出来的代码的文件大小。
 *  3、分离 JavaScript 和模板文件，你可以使用 vue-template-loader，它也可以在构建过程中把模板文件转换成为 JavaScript 渲染函数
 *  4、提取多个Chunk 中的公共部分的插件 CommonsChunkPlugin
 *  5、webpack-bundle-analyzer构建结果输出分析，再webpack.prod.conf.js下面
 *  if (config.build.bundleAnalyzerReport) {
        var BundleAnalyzerPlugin =   require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
        webpackConfig.plugins.push(new BundleAnalyzerPlugin());
        }
 * 
 * 其他：
 *  1、开启gzip压缩。支持率高，gzip 压缩效率非常高，通常可以达到 70% 的压缩率
 *  2、使用CDN内容分发网络。通过不同的域名来加载文件，从而使下载文件的并发连接数大大增加，且CDN 具有更好的可用性，更低的网络延迟和丢包率 。
 *  3、使用 Chrome Performance 查找性能瓶颈。erformance 面板可以录制一段时间内的 js 执行细节及时间
 *  4、使用浏览器缓存
 */