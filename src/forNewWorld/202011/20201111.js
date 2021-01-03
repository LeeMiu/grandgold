/**
 * 会话技术cookies和session
 * 会话是指浏览器和服务器之间地请求和响应；还可以将用户的信息以cookies/session的形式存储，方便以后用户访问web资源的时候使用
 * 不能使用httpServletRequest原因：一次会话中，存在多次请求和响应，而浏览器客户端的每一次请求都会产生一个 HttpServletRequest 对象，
 * 它只会保存此次请求的信息，例如放入购物车与购买付款是不同的请求，很显然数据没有得到很好的保存处理
 * 不能使用servletContext原因：ServletContext对象是被整个web应用所共享的，将数据都存到这里，无疑会无法区分具体信息的归属
 * 
 * cookies是服务器暂存在浏览器中的一些信息，当下次访问时，服务器会主动查询这个cookies资料，根据其中的内容提供一些特别的功能
 * 一个服务器最多在客户端浏览器上保存20个cookies；一个浏览器最多保存300个cookies
 * 注意cookies具有不可跨域名性；保存中文时需要使用unicode编码中文字符
 * Cookie cookie = new Cookie("中文xxx",URLEncoder.encode(name,"UTF-8"));
 * setMaxAge：设置cookies有效期，正数n表示n秒之内有效；-1表示临时性、只在本浏览器有效，关闭则失效；cookies默认值就是-1.0表示删除该cookies
 * cookies.setDomain('.baidu.com')表示只要一级域名是baidu.com即可访问
 * cookies的path属性决定允许访问cookies的路径，如果只需要某一个Servlet可以获取到Cookie，其他的资源不能或不需要获取，cookie.setPath("/Servlet); // 该Cookie只能在Servlet1中可以访问到
 * 设置Cookie的secure属性为true，浏览器只会在HTTPS和SSL等安全协议中传输该Cookie
 * 
 * session是记录浏览器状态的机制，保存在服务器中；可以存储对象并解决了很多cookies解决不了的问题
 * 获取session getAttribute，设置 setAttribute，销毁 invalidate
 * 用户第一次访问服务器Servlet，jsp等动态资源就会自动创建Session，Session对象保存在内存里，
 * 这也就为什么可以直接使用request对象获取得到Session对象
 * 防止内存溢出，服务器回把长时间没有活跃的session删除，即过了session超时时间，默认30分钟
 * 三种设置session超时时间的方法:
 * 在tomcat/conf/web.xml文件中设置：<session-timeout>20<session-timeout>
 * 在单个的web.xml文件中设置，对单个web应用有效，如果有冲突，以自己的web应用为准
 * 通过setMaxInactiveInterval()方法设置：httpSession.setMaxInactiveInterval(60);
 * 
 * session的超时时间是不活跃时间，如果超时内活跃了则重新计时，而cookies是按累计时间。
 * 浏览器禁用Cookie后Session的使用：
 * 用户浏览器禁用了Cookie绝大多数手机浏览器都不支持Cookie：java web中的HttpServletResponse类提供了两个URL地址重写的方法
 * encodeURL(String url)
 * encodeRedirectURL(String url)
 * 这两个方法会自动判断该浏览器是否支持Cookie，如果支持Cookie，重写后的URL地址就不会带有jsessionid了
 * 【当然了，即使浏览器支持Cookie，第一次输出URL地址的时候还是会出现jsessionid（因为没有任何Cookie可带）】
 * Session和Cookie的区别
从存储方式上比较
Cookie只能存储字符串，如果要存储非ASCII字符串还要对其编码。
Session可以存储任何类型的数据，可以把Session看成是一个容器
从隐私安全上比较
Cookie存储在浏览器中，对客户端是可见的。信息容易泄露出去。如果使用Cookie，最好将Cookie加密
Session存储在服务器上，对客户端是透明的。不存在敏感信息泄露问题。
从有效期上比较
Cookie保存在硬盘中，只需要设置maxAge属性为比较大的正整数，即使关闭浏览器，Cookie还是存在的
Session的保存在服务器中，设置maxInactiveInterval属性值来确定Session的有效期。并且Session依赖于名为JSESSIONID的Cookie，
该Cookie默认的maxAge属性为-1。如果关闭了浏览器，该Session虽然没有从服务器中消亡，但也就失效了。
从对服务器的负担比较
Session是保存在服务器的，每个用户都会产生一个Session，如果是并发访问的用户非常多，是不能使用Session的，Session会消耗大量的内存。
Cookie是保存在客户端的。不占用服务器的资源。像baidu、Sina这样的大型网站，一般都是使用Cookie来进行会话跟踪。
从浏览器的支持上比较
如果浏览器禁用了Cookie，那么Cookie是无用的了！
如果浏览器禁用了Cookie，Session可以通过URL地址重写来进行会话跟踪。
从跨域名上比较
Cookie可以设置domain属性来实现跨域名
Session只在当前的域名内有效，不可跨域名
 */