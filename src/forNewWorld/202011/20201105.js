/**
 * 关于浏览器的那些：
 * 1、浏览器缓存：强缓存（expire、cache-control），协商缓存（last-modified），缓存位置
 * expire过期时间，过期了就向服务器发请求，缺点就是浏览器时间和服务器时间可能会不一致，可能就不准确
 * cache-control采用过期时长，max-age可以表示该时间内是有效的，单位是秒。其他关键属性：public：客户端和代理服务器都可以缓存；
 * private：浏览器能缓存，中间的代理服务器不可以缓存；no-cache：跳过当前强缓存、发送http请求，直接进入协商缓存；s-maxage：针对
 * 代理服务器的缓存时间
 * 协商缓存分为Last-Modified和ETag
 * Last-Modified最后修改时间，服务器在响应头中加上这个字段；浏览器再次请求时会携带is-Modified-Since字段，然后服务器对比时间，
 * 需要更新则返回200和新的资源；不需要更新则返回304
 * ETag是服务器根据文件内容，给文件生产得唯一标识，只要有改动，ETag的值就会改变，服务器通过响应头把该值给浏览器。浏览器再次请求时将ETag的值
 * 作为If-None-Match字段内容放请求头中，服务器收到后对比。
 * 二者比较：
 * 1、Etag在精准度上更优，Etag根据文件内容定标识，能精准感知资源变化，而Last-Modified是秒级的，一秒内改变了多次时并没有体现；而且要是编辑了资源，但文件
 * 内容没变，其实可以直接用缓存的。
 * 2、性能上Last-Modified更优，因为其记录的时一个时间点，而ETag需要根据文件内容生成哈希值。
 * 两种方式都支持的话优先考虑ETag
 * 缓存位置有：service worker cache、memory cache、disk cache、push cache
 * 从cookies和localStorage、sessionStorage的区别
 * 1、容量：cookies容量4k左右，后两者在5M
 * 2、localStorage等只存在客户端，默认不参与与服务端的通信，cookies参与与服务端通信，存在性能问题和安全问题
 * 3、localStorage等有接口封装，通过setItem、getItem等方法操作方便。
 * localStorage其实存储的都是字符串，如果是存储对象需要调用JSON的stringify方法，并且用JSON.parse来解析成对象。
 * sessionStorage和localStorage有一个本质的区别，那就是前者只是会话级别的存储，并不是持久化存储。
 * 会话结束，也就是页面关闭，这部分sessionStorage就不复存在了。
 * 
 * 从输入url到页面呈现：
 * 网络篇：构建请求---查询强缓存---DNS解析（浏览器有DNS数据缓存处理）---建立TCP连接（chrome下同一域名最多6个TCP连接）---发送http请求---服务端响应返回数据资源
 * 在响应完成后判断tcp连接是否断开通过connection字段：keep-alive表示持久连接
 * 
 * 浏览器解析算法篇：
 * 1、构建dom树。将请求响应的text/html字节流转换为dom，一个以document为根节点的多叉树。然后解析算法，通过词法分析、语法分析：标记生成器将标记信息发给建树器创建
 * 对应得dom对象，然后将dom对象加入dom树种，将对应标记压入存放开放（标签得闭合标签符）元素的栈中。其中html5有着强大的容错策略。容错：使用</br>会转换为<br>,表格离散，
 * 表单元素嵌套会直接忽略里面的form
 * 2、样式计算：格式化样式表（渲染引擎将css转换成结构化对象styleSheets）---标准化样式属性---计算每个节点具体样式（继承和层叠）。样式计算完后所有的样式会被挂载window.getComputedStyle上
 * js可以通过此函数获取计算后的样式。
 * 3、生成布局树：通过浏览器的布局系统确定元素的位置。a、便利生成的dom树节点，并把它们添加到布局树中 b、计算布局树中节点的坐标位置
 * 该布局树中只包含可见函数，对于head标签、display：none的元素，不会放入其中。
 * 
 * 渲染引擎篇：
 * 1、建立图层树：对于又层叠上下文的时候，需要进行分层。分层分为显示合成和隐式合成
 * 显式合成：
 * 一、 拥有层叠上下文的节点。
层叠上下文也基本上是有一些特定的CSS属性创建的，一般有以下情况:

HTML根元素本身就具有层叠上下文。
普通元素设置position不为static并且设置了z-index属性，会产生层叠上下文。
元素的 opacity 值不是 1
元素的 transform 值不是 none
元素的 filter 值不是 none
元素的 isolation 值是isolate
will-change指定的属性值为上面任意一个。(will-change的作用后面会详细介绍)

二、需要剪裁的地方。
比如一个div，你只给他设置 100 * 100 像素的大小，而你在里面放了非常多的文字，那么超出的文字部分就需要被剪裁。
当然如果出现了滚动条，那么滚动条会被单独提升为一个图层。
隐式合成：层叠等级低的节点被提升为单独的图层之后，那么所有层叠等级比它高的节点都会成为一个单独的图层，风险点大。

对于图层在repaint时只需repaint本身，不影响其他层级。
2、生成绘制列表
3、生成图块和生成位图。主要有一个合成线程，按绘制列表进行绘制。chrome底层首屏优化是一个首次合成图块时只采用一个低分辨率的图片，正常
绘制完毕后再替换。渲染进程中专门维护了一个栅格化线程池，专门负责把图块转换为位图数据。
4、格栅化完成后，合成线程生成一个绘制指令发给浏览器进程的viz组件，然后将绘制了页面内容的内存发给显卡显示.

* 渲染可以分为：
解析html建立dom树
解析css构建style规则
结合dom和style规则合成render树
生成布局树（layout和reflow）回流也叫重排
绘制paint树，绘制页面像素信息（repaint）
将分层的图块信息发给GPU显示
影响布局的需要reflow，从《html》开始递归往下，依次计算节点的尺寸和位置
改变某个元素的颜色信息等会触发重绘repaint
注意：
display：none的界面不会被加入render tree、而visibility：hidden会，所以设置display：none用于显示与否更优
display：none会触发reflow，而visibility：hidden会触发repaint
有些情况下，修改元素的样式，浏览器不是立刻reflow或repaint，而是会积攒一批修改动作，异步refloe或增量异步reflow
但在有些情况下，如resize窗口，改变页面默认字体等，浏览器会立马reflow
* 如果dom结构发生变化，重新渲染dom树，然后将主线程之外的任务全走一遍，开销大
重绘不需要重新布局，没有影响几何属性，在计算样式后直接生成绘制列表。
所以重绘不一定回流，但是回流一定发生了重绘。

利用css3的transform、opacity、filter这些属性可以实现合成，达到GPU加速
在合成的情况下，会直接跳过布局和绘制的流程，
 */