const { reject } = require('core-js/fn/promise');
/**
 * webpack打包优化
 * 1）优化webpack构建速度：
 * 1、使用高版本的webpack（webpack4）
 * 2、多线程/多实例构建：thread-loader
 * 3、缩小打包作用域：exclude/include、modules、extensions，no parse等
 * 4、充分利用缓存提升二次构建速度：如果一起使用thread-loader和cache-loader
 * 按顺序cache、thread、heavy配置
 * 5、DLL Plugin进行分包使用 DllReferencePlugin(索引链接) 对 manifest.json 引用
 * 
 * webpack4优化的原因：
 * 1、使用的V8引擎，用for代替了forEach、Map和Set代替了Object，includes代替了indexOf
 * 2、默认使用更快的md4 hash算法
 * 3、webpack AST可以直接从loader传递给AST，减少解析时间。
 * 4、采用了字符串代替正则表达式
 * 
 * noparse： 不解析某个库内部的依赖关系，如noParse: /jquery/
 * ignorePlugin：忽略依赖库内部引用的某些内容，如new Webpack.IgnorPlugin（/./loacl/, /moment/）
 * dillPlugin： 不会多次打包，会将依赖不变的库先打包，优化打包时间
 * thread-loader：多线程打包，将loader放置在一个worker池中运行，每个loader有限制600ms的node.js进程
 * use:[
 *  'thread-loader',
 *   // 高开销loader，如babel-loader
 * ]
 * 多线程压缩：terser-webpack-plugin，配置minimizer：[new TerserPlugin(parallel: true)],
 * 
 * 
 * 优化webpack打包后体积：
 * 1、压缩代码：多进程压缩；通过 mini-css-extract-plugin 提取 Chunk 中的 CSS 代码到单独文件，
 * 通过optimize-css-assets-webpack-plugin插件 开启 cssnano 压缩 CSS；terser-webpack-plugin 开启 parallel 参数
 * 2、提取公共资源：使用 html-webpack-externals-plugin，将基础包通过 CDN 引入，不打入 bundle 中；
 * 使用SplitChunksPlugin进行公共资源分离；
 * 3、tree shaking：标记没有引用国得模块，在资源压缩时在最终的bundle总去掉；禁用babel-loader模块依赖解析；
 * 使用purify或uncss去除无用的css代码
 * 4、scope hoisting：由于存在大量闭包，代码运行创建的作用域变多，内存开销大。SH将变量按引用顺序管理好，适当会重命名
 * 可能名称冲突的变量
 * 5、图片压缩：基于node库的imagemin；配置image-webpack-loader
 * 
 * speed-measure-webpack-plugin：SMP。可以分析webpack打包过程中loader和plugin时耗，有助于定位问题
 */

/**
 * node中间层作用：
 * 1、代理：解决请求跨域问题，利用代理转发请求至多个服务器
 * 2、缓存：用户的动作触发的数据更新，node中间层可以处理部分缓存需求
 * 3、限流：作为客户端和服务端中间层，可以针对接口或路由做响应的限流
 * 4、日志：相比服务端，node中间层的日志记录能更方便快捷地定位问题
 * 5、监控：监控高并发请求处理
 * 6、鉴权：node有一个中间层去鉴权，一种单一职责的实现
 * 7、服务端渲染：node中间层的解决方案更灵活，如SSR、模板直出、利用js库做预渲染等
 * 
 * node转发api时：
 * 1、可以处理后端数据为对恰前端更友好的格式
 * 2、可以解决跨域问题，跨域是浏览器的同源策略导致的
 * 3、多个请求可以在node中间合并，减少前端对于后端的请求：
 * a、使用express中间件multifetch将请求批量合并
 * b、使用expres + http+middleware实现接口代理转发
 * 
 * ***高能预警：手撕nodejs代理服务器，实现请求合并转发
 * 思路：
 * 1、搭建http服务，node http模块的createServer方法
 * 2、请求报文，包括请求行，请求头，请求体
 * 3、将报文发送到目标服务器，http模块的request方法
 */
//搭建http服务器
const http = require('http');
const { resolve } = require('path');
const server = http.createServer();
server.on('request', (req, res) => {
    var { connection, host, ...originHeaders } = req.headers;
    var options = {
        method: req.method,
        hostname: 'www.baidu.com',
        port: '80',
        path: req.url,
        headers: { originHeaders },
    }
    // 使用promise接受客户端发送数据
    var pData = new Promise((resolve, reject) => {
        // req的data事件和end事件接受客户端发送的数据
        // 并用buffer.concat处理一下
        let postbody = [];
    
        req.on('data', chunk => {
            postbody.push(chunk);
        })
        req.on('end', () =>{
            // 合并请求
            let bodyBuffer = Buffer.concat(postbody);
            resolve(bodyBuffer);
        })
    });
    // 数据转发，接受服务器返回数据并转发给客户端
    pData.then((bodyBuffer) => {
        let resposeResult = [];
        var request = http.request(options, (response) => {
            response.on('data', chunk => {
                resposeResult.push(chunk);
            })
            response.on('end', () =>{
                // 合并响应
                let resBodyBuffer = Buffer.concat(resposeResult);
                res.end(resBodyBuffer);
            })
        })
        // 使用request的write方法传递请求体
        request.write(bodyBuffer);
        request.end();
    })
})
server.listen(3000, () => {
    console.log('server is running!');
})