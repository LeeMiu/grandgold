2021-03-09平安寿险一面：
0、自我介绍+随机项目介绍
1、菜单权限控制：vue，react分别可以用有哪些方法？接口查询控制、动态加载路由、错误边界、重定向
2、React钩子：useState、useEffect、useRef；useRef和createRef区别，useEffect中第二个参数含义，不传，传空和传具体值有什么区别
useEffect接受包含命令式 .useEffect(callback, [source]),如果没有传入[source]参数时,默认每次render时会优先调用上次保存的回调中返回的函数
执行 useEffect 时，将 useEffect Hook 添加到 Hook 链表中，判断依赖： 
假如没有传入依赖（useEffect 没有传入第二个参数），那么直接给这个 effect 打上 “需要执行” 的 tag（HookHasEffect）；
假如有传入依赖 deps 并且当前依赖和上次渲染时的依赖对比有发生改变，那么就给这个 effect 打上 “需要执行” 的 tag（HookHasEffect）；
假如有传入依赖 deps，但是依赖没有发生改变，则 不会 给这个 effect “需要执行” 的 tag；
假如有传入依赖 deps，但是传入的是一个空数组 []，那么也 不会 给这个 effect “需要执行” 的 tag；
渲染组件的 UI；
假如有清除函数（effect 中的 return 内容），则执行上一次渲染的清除函数；如果依赖是 []，则先不用执行清除函数，而是等到组件销毁时才执行；
判断本次 effect 是否有“需要执行” 的 tag（HookHasEffect），如果有，就执行本次 effect；如果没有，就直接跳过，不执行 本次 effect；
useRef和createRef：
createRef 并没有 Hooks 的效果，其值会随着 FunctionComponent 重复执行而不断被初始化；
Hooks 的独特之处，虽然用在普通函数中，但在 React 引擎中会得到超出普通函数的表现，比如初始化仅执行一次，或者引用不变。
为什么 createRef 可以在 ClassComponent 正常运行呢？这是因为 ClassComponent 分离了生命周期，使例如 componentDidMount 等初始化时机仅执行一次。
useRef中的current
useRef是一个方法，且useRef返回一个可变的ref对象。current属性保存着一个可变值“盒子”，initialValue被赋值给其返回值的.current对象
附录：
  1、一般来说，在函数退出后变量就会”消失”，而 state 中的变量会被 React 保留，所以定义的函数会被清除
  2、React hook更新 state 变量总是替换它而不是合并它。跟class不一样
  3、useEffect只有一个参数的时候=componentDidMount+componentDidUpdate
  4、useEffect它已经保存在函数作用域中。Hook 使用了 JavaScript 的闭包机制
  5、return一个函数，运行就会清理，因为 useEffect 默认就会处理。它会在调用一个新的 effect 之前对前一个 effect 进行清理
  6、不能将hook放置在条件判断中，没有满足的条件会导致判断条件后的链表指针在next移动时的不准确。
3、虚拟dom为什么快，是否有缺点；真实dom转成虚拟dom
react虚拟dom结构：通过createElement函数创建
const vNode = {
   key:xxx,
   type:'div',
   ref:xxx
   prop:{
    className:xxx,
    onClick:()=>{}
    children:[
      {type:p,....},
      {type:span,...}
    ]
   }
  }
vue虚拟dom结构：通过h函数h('div',{ class:'red', on:{ click:()=>{} }},[h('p',{},'span'),h('p',{},'span')])
const vNode = {
      tag:'div',
      data:{
      class:'red',
      on:{
       click(){}
      }
     },
      children:[
      {tag:p,....},
      {tag:span,...}
      ]
  }
4、简单说一下react diff算法
5、长列表优化：可视区域展示，怎么确定可视区域，怎么加载？用到哪些方法？
虚拟渲染：列表局部渲染。比较知名的一些第三方库有vue-virtual-scroller、react-tiny-virtual-list、react-virtualized；它们都可以利用局部加载解决列表过长的问题。vue-virtual-scroller、react-tiny-virtual-list一类的方案只支持虚拟列表，而react-virtualized这种大而全的库则是支持表格、集合、列表等多种情况下的局部加载方案。
可以使用react-virtualized优化： 详情https://juejin.cn/post/6844903603094683656#heading-4
react-virtualized将我们的滚动场景区分为了viewport内的局部滚动, 和基于viewport的滚动, 前者相当于在页面中开辟了一个独立的滚动区域，
属于内部滚动, 这跟和iscroll的滚动很类似, 而后者则把滚动作为了window滚动的一部分(对于移动端而言，这种更为常见). 基于此计算出当前所需要显示的组件。
虚拟列表：可视区域、滑动窗口、滑动块、滚动条、虚拟数据列表、懒加载、临界点判断等。   详情：https://juejin.cn/post/6844904008667103240
6、XSS攻击及预防
7、react Hook可以模拟哪些生命周期，不能模拟哪些
可以模拟constructor、componentDidMount、shouldComponentUpdate、componentDidUpdate、componentWillUnmount
其他的就不可模拟了
