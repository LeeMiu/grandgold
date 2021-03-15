/**
 * scss:sass css
 * 1、变量：以$开头。注意同一变量明，中划线和下划线是一样的。后定义的变量会被忽略，但是赋值会被执行
 * $border-color: red; // 申明变量，全局变量
 * $border_color: blue; // border_color会被忽略，但是赋值会被执行,导致border-color变成blue
 * .container{
 *      $border-width: 1px; // 内部变量
 * }
 * 2、嵌套：
 * 嵌套选择器：原来平铺横项排列的选择器，按照树形结构嵌套。
 * 嵌套属性
 * li {
    border:1px solid #aaa {
        left:0;
        right:0;
    }
    == border:1px solid #aaa;
    border-left:0;
    border-right:0;
   }
 * 3、导入：@import App.scss，防止导入的样式覆盖原来文件中的同名样式，需要在导入文件中加!default
 *      嵌套导入时会将原文件中样式全部加载嵌套的父级下
 * 4、注释：双斜杠的//注释不会被保留到编译后的生成的css文件中，/*注释这样的会
 * 5、混合器：混合器中可以写一切css
 *      提取重复代码复用、可以作为函数传递参数（参数可设置默认值）
 *      使用时需要加@include 混合器函数
 * 6、继承：被继承的需要加%，继承的需要加@extend
 * 7、提供了标准的算数运算符：+、-、*、/、%
 * //SCSS
    width: 600px / 960px * 100%;
    // 编译后css
    width: 62.5%;
 */
// 居中布局
/**
 * 父级：#parent{
 *  display: table-cell;
 *  text-align: center; // 水平
 *  vertical-align: middle; // 垂直
 * }
 * 子级: #child{
 *  display: inline/inline-block;
 * }
 * 父级：#parent{
    * position: relative; // 相对定位
 * }
 * 子级: #child{
 *  position: absolute; // 绝对定位，4个方向设为0，margin设置为auto
 * left:0;
 * right: 0;
 * top: 0;
 * bottom: 0;
 * margin: auto;
 * }
 * 
 * 父级：#parent{
 *  display: flex;// flex布局
 *  display: -webkit-flex; // 防止浏览器不兼容safari
 * }
 * 子级: #child{
 *  margin: auto;
 * }
 * 
 * 父级：#parent{
    * position: relative; // 相对定位
 * }
 * 子级: #child{
 *  height: 50px; width: 50px;
 *  position: absolute; // 绝对定位，margin左上或右下一般宽高+左上或右下50%
 *  left:50%;
 *  top: 50%;
 *  已知宽高下，
 *  margin: -25px 0 0 -25px;
 *  未知宽高下，
 *  transform: translate(-50%, -50%);
 *  -webkit-transform: translate(-50%, -50%);
 * }
 * 
 * 父级：#parent{
 *  display: flex;// flex布局
 *  display: -webkit-flex; // 防止浏览器不兼容safari
 *  justify-content: center; // 水平
 *  align-items: center; // 垂直
 * }
 * 子级: #child{
 *  不许要
 * }
 */
// 水平居中
// text-align: center; // 行内元素
// margin: 0 auto; // 块级元素
// absolute + transform;
// flex + justify-content: center;

// 垂直居中
// line-hight: height;
// absolute + transform;
// flex + align-items: center;
// table-cell + display: inline

// 水平垂直：
// absolute + transform;
// display: flex + justify-content: center; + align-items: center; // 父级控制子级居中
// 样式选择器优先级
// ！imortant》》内联样式style》》#id》》calss》》tag》》*》》继承》》默认
/**
 * 叠层等级：（在同一层叠上下文种，层叠等级才有意义）
 * background/border 》》 z-index为负数》》块级元素block》》浮动元素float》》行内元素inline》》z-index：0/auto》》z-index为正数
 */
// js读写样式方法：
// 1、dom节点对象的style对象
var elm = document.getElementsById('test');
elm.style.color = 'red';
// 2、通过element对象的方法getAttribute、setAttribute，removeAttribute
elm.setAttribute('style', 'color: red; height: 30px;');
// 3、通过CSSStyleDeclaration对象的cssText属性和setProperty()、removeProperty等方法
elm.style.cssText = 'color: red; height: 30px;';
elm.style.removeProperty('color');
elm.style.setProperty('color', 'red', 'important');
// 4、利用document.styleSheets属性
document.styleSheets[0].insertRule('#test:hover{color: white;}',0);
document.styleSheets[0].deleteRule(0); //删除样式表中的第一条规则
document.styleSheets[0].cssRules[1].selectorText; //返回选择器字符串
document.styleSheets[0].cssRules[1].cssText; //返回规则字符串，含选择器
//5、用window对象的getComputedStyle方法，第一个参数是Element对象，第二个参数可以是null、空字符串、伪元素字符串，该方法返回一个只读的表示计算样式的CSSStyleDeclaration对象
var color = window.getComputedStyle(elm, ':before').color;
// 6、直接添加样式表
var style1 = document.createElement('style');
 style1.innerHTML = 'body{color:red}#top:hover{background-color: red;color: white;}';
 document.head.appendChild(style1);
/**
 * 关于css常用的那些样式
 * 1、一行超出显示省略号
 * overflow： hidden;
 * text-overflow: ellipsis;
 * white-space: nowrap;
 * 2、多行文本超出显示省略号
 * display: -webkit=box;
 * -webkit-box-orient: vertical;
 * -webkit-line-clamp: 3;
 * overflow: hidden;
 * 3、ios手机滑动条不流畅
 * overflow: auto;
 * -webkit-overflow-scrolling: touch;
 * 4、画出一个三角形
 * div-sanjiao {
 *  width: 0;
 *  height: 0;
 *  border: 5px solid #transparent;
 *  border-top-color: red;
 * }
 * 5、添加contenteditable： true可以让html变成可编辑状态
 * 6,BEM（Block-块 Element-元素 Modifier-修饰符）规则
 * __：双下划线用来连接块和块的子元素
 * -：仅作为连字符使用，连接块或元素或修饰符的多个单词
 * --:双中划线用来连接块或元素的状态（也可使用‘_’单下划线表示）
 */
/**
 * 三栏布局（已知左右宽度）
 * 1、float实现：优点在于兼容性好，缺点是脱离文档流，dom节点顺序错误
 * 主要是float：left，float：right。剩余则是中间位置的
 * 2、flex实现：优点是遵守文档流，容易排查问题；缺点是兼容性差
 * 父级display： flex；子集中间项：flex：1；
 * 3、absolute实现：优点：快快捷；缺点：脱离文档流
 * position: absolute;left：0；position：absolute； right：0；
 * 4、table实现：优点兼容性好，快捷；缺点：单元格限制，当某个单元格调整时，其他单元格也会调整
 * 父级display：table；子级：display：table-cell
 * 5、grid实现：优点将网格布局标准化，复杂问题简单化；缺点：兼容性差
 * 父级display：grid；grid-template-columns：300px auto 300px；grid-template-rows：100px
 * （未知左右宽度）：以上flex和table可用，其他不可用
 * 居中布局：
 * 1、margin：auto；
 * 2、text-align：center；
 * 3、line-height：父级容器高度。只适用一行文字情况。
 * 4、table下可以对td/th使用align：center，vertial-align：middle
 * 5、display：table-cell
 */
// 千分位化数字
function thouthands(num, tail = 2) {
    const reg = /\B(?=(\d{3})+(?!\d))/g;
    const val = String(num);
    const suffix = new Array(tail).fill('0').join('');
    if (Number(val) == val) {
        if ((/\.{1}/g.test(val))) {
            const arr = val.split('.');
            return `${arr[0].replace(reg, ',')}.${`${arr[1]}${suffix}`.substring(0, tail)}`;
        }
        return `${val.replace(reg, ',')}.${suffix}`;
    } else {
        throw new TypeError('your data is not an number');
    }
}

/**
 * Session:一种记录浏览器状态的机制,保存再服务器,
 * 用户第一次访问服务器Servlet，jsp等动态资源就会自动创建Session，Session对象保存在内存里
 * 如果访问HTML,Image等静态资源Session不会被创建
 * Session生成后，只要用户继续访问，服务器就会更新Session的最后访问时间，无论是否对Session进行读写，服务器都会认为Session活跃了一次。
 * Session的超时时间默认是30分钟，修改超时时间:
 * 1,tomcat/conf/web.xml修改,所有的web应用都有效<session-timeout>20<session-timeout>
 * 2,通过setMaxInactiveInterval()方法设置;httpSession.setMaxInactiveInterval(60);
 * 在过期时间上与cookies的区别:
 * session有访问就重新及时,大于过期时间就失效,cookies是累积时间及时,不管是否有访问.
 * 
 * 服务器是如何实现一个session为一个用户浏览器服务的？换个说法：为什么服务器能够为不同的用户浏览器提供不同session？
 * HTTP协议是无状态的，Session不能依据HTTP连接来判断是否为同一个用户。于是乎：服务器向用户浏览器发送了一个名为JESSIONID的Cookie，
 * 它的值是Session的id值。其实Session依据Cookie来识别是否是同一个用户。
 * 
 * 禁用cookie后的session使用:
 * java web提供url地址重写
 * httpServletResponse类提供了两个url地址重写
 * encodeURL(String url);
 * encodeRedirectURL(String url);
 * encodeURL()不会对本身属性url的特殊字符进行编码，例如“冒号、正斜杠、问号、井号”；而encodeURLComponent()则会对它发现的任何非标准字符进行编码。
 * encodeURIComponent编码范围更广，适合给参数编码，encodeURI适合给URL本身（locaion.origin）编码
 * */