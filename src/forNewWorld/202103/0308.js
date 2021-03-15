/**
 * webpack专栏
 * JS的模块打包工具（module bundler）通过分析模块之间的依赖，将所有模块打包成一份或者多分代码包bundler，供html直接引用
 * webpack提供了打包功能和一套文件处理机制，然后通过各种loader和plugin对代码进行预编译和打包。
 *      Entry： 入口文件，webpack从该文件开始进行分析和编译
 *      Output：出口路径，打包创建bundler的文件路径和文件名
 *      Module：模块，在 Webpack 中任何文件都可以作为一个模块，会根据配置的不同的 Loader 进行加载和打包；
 *      Chunk：代码块，可以根据配置，将所有模块代码合并成一个或多个代码块，以便按需加载，提高性能；
 *      Loader: 模块加载器，进行各种文件类型的加载与转换；
 *      Plugin:拓展插件，可以通过 Webpack 相应的事件钩子，介入到打包过程中的任意环节，从而对代码按需修改；
 * 
 * 工作流程：
 *      1、读取配置文件，按命令初始化配置参数，创建Compiler对象
 *      2、调用插件的apply方法，挂载插件监听，然后从入口文件开始编译
 *      3、按文件类型，调用对应的loader对模块进行编译；并在合适的时机触发对应的事件调用plugin执行，再根据模块依赖查找到所依赖模块，递归执行第三步
 *      4、将编译后的代码包装成一个或一个个chunk代码块，按依赖和配置确定输出内容。此阶段依然可以通过plugin进行文件修改
 *      5、根据Output把文件内容写入到指定的文件夹中，完成整个过程。
 * 
 * Loader：对不同格式文件的转换器，对webpack传入的字符串进行按需修改
 *      一般是将代码进行分析，构建AST，然后遍历进行定向修改，再重新生成新的代码字符串
 *      如Babel-Loader：加载 js、jsx 文件， 将 ES6、 ES7 代码转换成 ES5，抹平兼容性问题
 *          将es6--AST--优化后的AST--转换成es5
 *      常用的Loader：file-loader、babel-loader、style-loader、ts-loader、css-loader、less-loader
 *      通过链式调用，按顺序串起一个个 Loader
 * 
 * Plugin：插件系统是 Webpack 成功的一个关键性因素。在编译的整个生命周期中，Webpack 会触发许多事件钩子，Plugin 可以监听这些事件，
 * 根据需求在相应的时间点对打包内容进行定向的修改
 *      通过事件流机制，让 Plugin 可以插入到整个生产过程中的每个步骤中；
 *      Webpack 事件流编程范式的核心是基础类 Tapable，是一种 观察者模式 的实现事件的订阅与广播：
 *       Compiler 与 Compilation 便是继承于 Tapable，也拥有这样的事件流机制：Compiler 全局唯一，且从启动生存到结束；Compilation 对应每次编译，每轮编译循环均会重新创建
 *      Compiler: 可以简单的理解为 Webpack 实例，它包含了当前 Webpack 中的所有配置信息，
 * 如 options， loaders, plugins 等信息，全局唯一，只在启动时完成初始化创建，随着生命周期逐一传递
 *      Compilation: 可以称为 编译实例。当监听到文件发生改变时，Webpack 会创建一个新的 Compilation 对象，开始一次新的编译。
 * 它包含了当前的输入资源，输出资源，变化的文件等，同时通过它提供的 api，可以监听每次编译过程中触发的事件钩子
 *      常用Plugin：htm-webpack-plugin、ProvidePlugin、optimize-css-assets-webpack-plugin、webpack-bundle-analyzer、CommonsChunkPlugin、UglifyJsPlugin（无用代码删除）
 * 
 * webpack优化：
 *  1、无用代码消除，DCE (dead code elimination)，即 删除不可能执行的代码，可使用UglifyJsPlugin插件
 *  2、摇树优化（Tree-Shaking）：把没有使用到的无用代码摇下来，消除那些被 引用了但未被使用 的模块代码
 *  3、code-spliting：代码分割，进行懒加载或者异步加载。使用 SplitChunksPlugin 进行拆分
 *  4、作用域提升:scope-hoisting将分散的模块划分到同一个作用域中，避免了代码的重复引入
 *  5、监听时忽略node_modules目录；多进程并发；使用上面常用插件优化
 * 
 */
function Foo() {
    this.getName = function () {
        console.log(3);
        return {
            getName: getName //这个就是第六问中涉及的构造函数的返回值问题
        }
    }; //这个就是第六问中涉及到的，JS构造函数公有方法和原型链方法的优先级
    getName = function () {
        console.log(1);
    };
    return this
}
Foo.getName = function () {
    console.log(2);
};
Foo.prototype.getName = function () {
    console.log(6);
};
var getName = function () {
    console.log(4);
};

function getName() {
    console.log(5);
} 
//答案：
Foo.getName(); //2
getName(); //4
console.log(Foo())
Foo().getName(); //1
getName(); //1
new Foo.getName(); //2
new Foo().getName(); //3
//多了一问
new Foo().getName().getName(); //3 1
new new Foo().getName(); //3