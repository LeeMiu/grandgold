/**
 * 概念性复习：
 * chrome浏览器的几个版本：
 * 稳定版stable、测试版beta、开发者版本dev、金丝雀版canary
 * 特点：
 * canary：只限于测试，是chrome的未来版，功能、代码最新的版本；极不稳定；好在谷歌将其设定为可独立安装，
 * 可以与其他版本chrome共存；几乎每天更新，相当于自动更新，添加了谷歌自家服务和商业闭源插件的chromeium。
 * dev：是以chromeium为基础的，适合web开发者测试新功能和页面，确保自己的应用可以与chrome最新的api更改
 * 功能相互兼容，一般每周更新一次。
 * beta：以dev为基础，chrome正式发布前得最后测试版本，十分稳定，测试阶段可能发现待定版本的问题，允许先
 * 解决问题再发版，一般每月更新一次。
 * stable：常规大部分使用者使用的版本，稳定性最高；一般几个月更新一次。
 * 
 * 项目细节优化：（涉及开发过程中、上线后的首屏、运行中）
 * 1、开发中：a、防止变量滥用 b、组件、标签使用唯一的key做键值迭代 c、不在render中处理数据，不然反复触发
 * d、不必要的标签使用Fragment，可以减少内存占用 e、web worker做密集型任务处理
 * 2、首屏优化：a、采用骨架屏，页面内容未加载，先用简单样式图形进行占位，待内容加载完后再替换 b、路由、图片懒加载
 * 路由懒加载（component: (resolve) => require(["../views/index.vue"], resolve),）图片懒加载（vue-lazyload）
 * c、通过CDN方式引入，减少vendor.js体积 d、gzip压缩 e、静态图片通过服务期请求获取
 * 3、运行中：a、数据或文件放node服务端处理，使用stream流方式处理 b、React.Profiler和performance API分析组件渲
 * 染和时耗 c、使用componentDidCatch处理错误边界。
 * 
 * react hooks优点：让react函数组件更加灵活
 * 引入hooks前：
 * react问题：1、组件复用状态逻辑困难 2、复杂组件难以理解，高阶组件、函数组件嵌套过深 3、class组件的this指向 4、难以记忆的生命周期
 * 引入hooks后：
 * 1、useState返回状态值，以及更新该状态值函数 2、useEffect接受包含命令式 3、useContext接受上下文对象并返回当前上下文 
 * 4、useReducer useState的替代方案。接受类型为(state，action) => newState的reducer，并返回与dispatch方法配对的当前状态。
    5、useCallback 返回一个回忆的memoized版本，该版本仅在其中一个输入发生更改时才会更改。纯函数的输入输出确定性
    6、useMemo 纯的一个记忆函数
    7、useRef 返回一个可变的ref对象，其.current属性被初始化为传递的参数，返回的 ref 对象在组件的整个生命周期内保持不变。
    8、useImperativeMethods 自定义使用ref时公开给父组件的实例值
    9、useMutationEffect 更新兄弟组件之前，它在React执行其DOM改变的同一阶段同步触发
    10、useLayoutEffect DOM改变后同步触发。使用它来从DOM读取布局并同步重新渲染
 * 
 */
/**
 * 最全的前端安全
 * 1、XSS：跨站脚本攻击（cross site script）；
 * 常见a、存储型：如论坛发帖，将恶意代码提交到数据库，浏览器在收到恶意代码后会执行代码
 * b、反射型：如网站搜索、跳转；将恶意代码放在url中，浏览器读取url时会执行恶意代码泄露信息 c、dom型：通过修改页面dom节点形成的
 * d、xss payload指完成各种攻击的恶意脚本：cookie劫持。
 * 预防：a、防范cookie劫持可以在set-cookie时植入httpOnly标识；将cookie和客户端ip绑定 b、输入检查，限制不能输入特殊字符 c、
 * 输出检查，在变量输出到html页面时，可以编码或者转义，使用\对特殊字符进行转义。
 * 2、CERF：跨站点请求伪造（cross site request forgery）
 * 即诱导进入第三方网站，在第三方网站中向被攻击网站发送跨站请求，利用被攻击网站以获取的注册凭证，冒充用户进行网站操作
 * 预防：a、同源检测：检测header中的origin Header b、CERF token验证：页面请求携带token，服务器验证token是否一致 c、双重cookies验证
 * 3、sql注入：把SQL命令插入到Web表单递交或输入域名或页面请求的查询字符串，最终达到欺骗数据库服务器执行恶意的SQL命令,从而达到和服务器交互。
 * 预防：a、后台进行输入验证，过滤sql敏感字符 b、使用参数化查询，避免拼接sql
 * 4、中间人攻击：（man-in-the-middle attack，MITM），指攻击者在客户端与服务端中间分别与两端建立联系并交换传输数据，在此期间，中间人
 * 可以窃听、篡改甚至完全控制会话。如用户在一个未加密的wifi下访问网站。常见攻击方式：嗅探、数据包注入、会话劫持、SSL剥离、DNS欺骗、代理服务器
 * 预防：a、使用权威可信的认证证书 b、不要点击不安全链接或邮件 c、不用公网发送敏感信息 d、确保访问的网站是带有SSL的https地址
 * 5、iframe安全：攻击者将目标网站通过iframe嵌套到访问的页面中，并设置透明，诱导用户点击；嵌入的第三方iframe会有不确定性的安全隐患
 * 预防：a、为iframe设置sandbox属性，对iframe行为进行各种限制。 b、服务端设置X-Frame-Options-Header，拒绝页面嵌套，ALLOW-FROM可以
 * 嵌套在指定来源的iframe中；DENY当前页面不能被嵌套在iframe中
 * 
 */

const { resolve, reject } = require("core-js/fn/promise");

 /**
  * Koa2和Express区别：
  * express：一个基于node.js平台极简，灵活的web应用开发框架，主要基于connect中间件，自身也
  * 封装了路由、视图处理等。
  * koa2相对更为年轻，是原班人马基于es的新特性重新开发的框架，主要基于co中间件，基于es6 generator特性
  * 异步流程控制，解决了低于回调和麻烦的错误处理。使用async await实现异步流控制。框架不包含任何中间件
  * 需要结合第三方中间件处理。
  * 区别：
  * 1、express自身集成了路由试图等。koa2不具备任何中间件，需要配合路由、试图等中间件开发
  * 2、异步流程处理：express采用的是callback回调来处理异步，koa2采用async await以同步的形式处理异步。语义上更强
  * 3、错误处理：express采用callback捕获异常，无法捕获深层次的异常；koa2使用try catch，可以更好的捕获异常
  * 4、中间件模型：express基于connect，线性模型；koa2中间件采用洋葱模型，所有请求在中间件是会执行两次，可以方便
  * 处理一些后置逻辑
  * 5、express只有Request和Response两个对象，koa2增加了一个context请求上下文对象（在koa1中为中间件的this，在koa2为中
  * 间件的第一个参数）；同时context上挂载了request和response两个对象
  * 
  */

  /**
   * 跨域
   * 同源策略：协议+域名+端口都相同表示同源，策略限制内容有：cookies、localStorage、indeedDB等存储性内容；DOM节点、Ajax请求发送
   * 允许跨域加载资源的标签：<img src='xxx'/>、<link href='xxx' />、<script sre='xxx' />
   * JSONP：利用 <script> 标签没有跨域限制的漏洞，网页可以得到从其他来源动态产生的 JSON 数据。JSONP请求一定需要对方的服务器做支持才可以。
   * JSONP和AJAX相同，都是客户端向服务器端发送请求，从服务器端获取数据的方式。但AJAX属于同源策略，JSONP属于非同源策略（跨域请求）。
   * JSONP优点是简单兼容性好，可用于解决主流浏览器的跨域数据访问的问题。缺点是仅支持get方法具有局限性,不安全可能会遭受XSS攻击。
   * corss: 需要浏览器和后端同时支持。IE 8 和 9 需要通过 XDomainRequest 来实现。
   * 浏览器会自动进行 CORS 通信，实现 CORS 通信的关键是后端。只要后端实现了 CORS，就实现了跨域。
   * 服务端设置 Access-Control-Allow-Origin 就可以开启 CORS。 该属性表示哪些域名可以访问资源，如果设置通配符则表示所有网站都可以访问资源。
   * 虽然设置 CORS 和前端没什么关系，但是通过这种方式解决跨域问题的话，会在发送请求时出现两种情况，分别为简单请求和复杂请求。
   * 简单请求：使用下列方之一：get、post、head且content-type的值仅限于下列之一：text/plain、multipart/form-data、application/x-www-form-urlencoded
   * 复杂请求：不符合简单请求的请求，在请求前会增加一次options预请求，依次来知道服务器是否支持跨域
   */
//   手撕封装JSONP
function myJsonp ({url, params, cb}) {
   return new Promise((resolve, reject) => {
      let script = document.createElement('script');
      window[cb] = function (data) {
         resolve(data);
         document.body.removeChild(script);
      }
      let params = { ...params, cb }, arrs = [];
      for (let key in params) {
         arrs.push(`${key}=${params[key]}`);
      }
      script.src = `${url}?${arrs.join('&')}`;
      document.body.appendChild(script);
   })
}

// jQuery的JSONP形式
$.ajax({
   url:"http://crossdomain.com/jsonServerResponse",
   dataType:"jsonp",
   type:"get",//可以省略
   jsonpCallback:"show",//->自定义传递给服务器的函数名，而不是使用jQuery自动生成的，可省略
   jsonp:"callback",//->把传递函数名的那个形参callback，可省略
   success:function (data){
   console.log(data);}
});
   