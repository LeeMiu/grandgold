/**
 * GET和POST的区别：
 * 1、缓存角度，get请求会被浏览器主动缓存下来，留下历史记录，post不会
 * 2、编码角度，get只接受ASCII字符，只能进行url编码，post没有限制
 * 3、参数角度，get参数会体现在url中，post放在请求体中
 * 4、幂等性，get是幂等的，post不是（幂等性是指执行相同的操作，结果也是相同的）
 * 5、tcp角度，get请求会把请求报文一次性发送出去，post请求会分两次（火狐浏览器除外），首先发送header部分，响应100后继续发送body部分
 * 
 * uri：统一资源标识符Uniform Resource Identifier，区分互联网上不同的资源
 * 区别于url（网址）：uri包括了url和urn两个部分，由于url过于普及，一般我们默认将uri视为url
 * URI:构成（scheme://user:passwd@ host:port path ?query #fragment）
 * scheme 表示协议名，比如http, https, file等等。后面必须和://连在一起。
    user:passwd@ 表示登录主机时的用户信息，不过很不安全，不推荐使用，也不常用。
    host:port表示主机名和端口。
    path表示请求路径，标记资源所在位置。
    query表示查询参数，为key=val这种形式，多个键值对之间用&隔开。
    fragment表示 URI 所定位的资源内的一个锚点，浏览器可以根据这个锚点跳转到对应的位置
    注意：http 和 https 的默认端口分别为80、443
 * 
 * URI编码：只能使用ASCII码，URI 引入了编码机制，将所有非 ASCII 码字符和界定符转为十六进制字节值，然后在前面加个%，如中文或者特殊字符会转义成%（16进制数）
 * 状态码:
 * 1XX（协议处理的中间态，还需要后续操作）如101标识http升级为websock变更、
 * 2XX（成功状态）200成功且响应体中放有数据、204成功但是响应头后面没有body数据、206成功部分数据返回（使用场景：http分块下载和断点续传）、
 * 3XX（重定向，资源位置发生变动，如301永久重定向、302临时重定向，304命中协商缓存）、
 * 4XX（请求报文有误，如常见的400请求出错、403服务器禁止访问、404资源未找到、405请求方法暂不支持、408服务器等待时间太久）、
 * 5XX（服务器发送错误，如500服务器出错，503服务器繁忙，暂时无法响应服务）、
 * 
 * http特点和缺点：
 * 1、灵活可扩展：语义上自由，只规定了基本格式，其他部分没有严格控制；传输形式的多样性，传输文本、图片、视频等
 * 2、可靠传输：基于TCP/IP协议，是个面向对象，可靠数据传输
 * 3、请求-应答 4、无状态：有好有坏，好在每次请求都是独立的，不需要保存过多的信息。在长连接中，需要保存数据防止重复数据传输，这时候就成了缺点了
 * 缺点：
 * 1、明文传输：协议报文中使用的是文本形式、便于开发调试，但是也会被攻击者攻击如wifi陷阱
 * 2、队头阻塞：开启长连接时，共用一个http请求，当前面的请求耗时过长时其他请求就是阻塞状态了。
 * 
 * Transfer-Encoding: chunked：表示分块传输数据，设置这个字段后会自动产生两个效果:Content-Length 字段会被忽略、基于长连接持续推送动态内容
 * 响应体结构：
 * chunk长度(16进制的数)
 * 第一个chunk的内容
 * chunk长度(16进制的数)
 * 第二个chunk的内容
 * 。。。。。
 * 0
 * 关键字段Content-Type: multipart/byteranges;boundary=00000010101，它代表了信息量是这样的:请求一定是多段数据请求，响应体中的分隔符是 00000010101
 * 
 * 关于作用域也有两个属性: Domain和path, 给 Cookie 绑定了域名和路径，在发送请求之前，发现域名或者路径和这两个属性不匹配，
 * 那么就不会带上 Cookie。值得注意的是，对于路径来说，/表示域名下的任意路径都允许使用 Cookie。
 * http代理：中间层角色
 * 功能：
 * 1、负载均衡:这个代理服务器可以拿到这个请求之后，可以通过特定的算法分发给不同的源服务器，让各台源服务器的负载尽量平均。包括随机算法、轮询、一致性hash、LRU(最近最少使用)等等
 * 2、保障安全:利用心跳机制监控后台的服务器，一旦发现故障机就将其踢出集群。并且对于上下行的数据进行过滤，对非法 IP 限流
 * 3、缓存代理（cache-control：public表示允许中间代理进行缓存）
 * via为代理服务器留痕记录字段，Via中代理的顺序即为在 HTTP 传输中报文传达的顺序
 * 客户端 -> 代理1 -> 代理2 -> 源服务器
 * 服务器收到：Via: proxy_server1, proxy_server2
 * 客户端收到：Via: proxy_server2, proxy_server1
 * 
 * X-Forwarded-For：为谁转发，请求方的ip，在代理中每次代理后就是代理机走出来的ip
 * 会产生一个问题：意味着代理必须解析 HTTP 请求头，然后修改，比直接转发数据性能下降；在 HTTPS 通信加密的过程中，原始报文是不允许修改的。
 * 解决方法：代理协议 PROXY + TCP4/TCP6 + 请求方地址 + 接收方地址 + 请求端口 + 接收端口
 * 如PROXY TCP4 0.0.0.1 0.0.0.2 1111 2222
 * 代理缓存：
 * proxy-revalidate：must-revalidate的意思是客户端缓存过期就去源服务器获取，而proxy-revalidate则表示代理服务器的缓存过期后到源服务器获取。
 * s-maxage s是share的意思，限定了缓存在代理服务器中可以存放多久，和限制客户端缓存时间的max-age并不冲突。
 * 
 * 利用Unix Domain Socket套接字，配合事件驱动的高性能网络并发库libevent完成进程的 IPC（网络进程通信）过程
 * 解决跨域：
 * 1、CORS：w3c的一个标准，全称是跨域资源共享。需要浏览器和服务器共同支持
 *  a、响应中Access-Control-Allow-Origin字段和请求中Origin字段不不包含在范围，就会拦截。
 *  b、Access-Control-Allow-Credentials。这个字段是一个布尔值，表示是否允许发送 Cookie，对于跨域请求，浏览器对这个字段默认值设为 false，
 *  而如果需要拿到浏览器的 Cookie，需要添加这个响应头并设为true, 并且在前端也需要设置withCredentials属性:let xhr = new XMLHttpRequest();xhr.withCredentials = true;
 *  c、Access-Control-Expose-Headers：这个字段是给 XMLHttpRequest 对象赋能
 *  d、Access-Control-Max-Age: 预检请求的有效期，在此期间，不用发出另外一条预检请求。
 * 2、JSONP：CORS相比，JSONP 最大的优势在于兼容性好，IE 低版本可以用，但是只能请求方式单一get，不安全，容易造成xss攻击
 *  通过创建script标签src为请求地址来模拟内部同源下发送get请求实现跨域数据响应
 * 3、nginx：高性能反向代理服务器
 * 4、postMessage()实现不同源的两个页面间的通信：postMessage()能在两个页面间通信，利用iframe
 * 5、通过window.name 实现跨域：name在不同页面加载后仍旧存在，配合iframe
 * 6、通过路径的hash来实现页面间的跨域（通信）
 * 7、通过window.domian
 * 8、通过websocket 与服务器通信
 * 
 * 
 */
// nginx代理
server {
    listen  80;
    server_name  client.com;
    location /api {
      proxy_pass server.com;
    }
  }
  /**
   * HTTPS：HTTP+SSL/TLS
   * SSL/TLS：安全套接层（Secure Sockets Layer）/传输层安全，Transport Layer Security）TLS是标准化的SSL，即TLS1.0 = SSL3.1
   * TLS握手:（即建立连接的过程中通过证书、对称加密和非对称加密保证双方身份安全）
   * 加密套件列表：如TLS_ECDHE_WITH_AES_128_GCM_SHA256：意思是TLS握手过程中，使用ECDHE算法生成pre_random(这个数后面会介绍)，128位的AES算法进行对称加密，
   * 在对称加密的过程中使用主流的GCM分组模式，因为对称加密中很重要的一个问题就是如何分组。最后一个是哈希摘要算法，采用SHA256算法。
   */

/**
 * React Native优缺点：
 * 优点：1、调试方便，ipa安装好后不需要频繁编译，只需reload或者保存代码时自动编译的hotReload
 * 2、css-layout布局
 * 3、跨平台：只需写一套代码就可以在不同手机操作系统下运行，界面上只需要做一些平台区分即可。
 * 4、热更新，不需要app商店审核、不需要频繁升级
 * 5、有facebook的支持
 * 缺点：1、毕竟是脚本语言，开发体验一般、
 * 2、相关文档粗略，文档细节描述不到位，导致开发上总踩坑
 * 3、俩个平台还未完全统一，部分控件不同平台表现差异很大
 * 4、每次升级RN版本，需要修改的代码比较多
 * 5、对应控件库不完善，控件的相关功能缺失
 */
  