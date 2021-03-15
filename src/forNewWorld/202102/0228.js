/**
 * 1、介绍Set，Map，WeakSet和weakMap的区别
        1)Set
        成员唯一、无序且不重复；(类似于===，但是NaN也是等于自身的，在===中NaN不等于自身)
        [value, value]，键值与键名是一致的（或者说只有键值，没有键名）；
        可以遍历，方法有：add、delete、has、size。
        转化为数组：Array.from(set)或者[...set]
        Set 结构的默认迭代器生成函数是 values() 方法

        2)WeakSet
        成员都是对象；
        成员都是弱引用，可以被垃圾回收机制回收，可以用来保存DOM节点，不容易造成内存泄漏；
        不能遍历，方法有 add、delete、has。

        3)Map
        本质上是键值对的集合，类似集合；
        可以遍历，方法很多，可以跟各种数据格式转换。
        方法有set、get、has、delete、clear
        Map 结构的默认遍历器接口（Symbol.iterator属性），就是entries方法

        4)WeakMap
        只接受对象作为键名（null 除外），不接受其他类型的值作为键名；
        键名是弱引用，键值可以是任意的，键名所指向的对象可以被垃圾回收，此时键名是无效的；
        不能遍历，方法有 get、set、has、delete。
 */

 /**
  * js在类型比较时的隐形运算转换：
  *     
	* == 的过程（优先换成数字、字符串）

	1.首先看==前后有没有NaN，有的话都是返回false。NaN不等于任何值，包括其本身
	2. 布尔值会转成数字类型，true转成1，false转成0
	3. 数字和字符串比较，字符串会转成数字
	4. undefined和null除了和undefined或null相等，和其他相比都是false
	5. 数字或者字符串和对象相比，对象使用ToPrimitive规则转换。
	6. 当两个操作数都是对象时，JavaScript会比较其内部引用，当且仅当他们的引用指向内存中的相同对象（区域）时才相等，即他们在栈内存中的引用地址相同。

	* +的过程（优先换成字符串、数字）

	1. 如果至少有一个操作数是对象，它会被转换成原始值（字符串，数字或布尔）；
	2. 转换之后，如果至少有一个操作数是字符串类型，第二个操作数会被转换成字符串，并且会执行连接。
	3. 在其他的情况下，两个操作数都会转换成数字并执行算数加法运算。

	* -的过程（转换成数字） 这个就很简单了，全部用ToNumber规则转换成数字

  */

  /**
   * display：none和visibility：hidden、opacity: 0区别：
   * 1、visibility具有继承性、给父元素设置，其子元素也会继承该属性，通过visibility：visible可以让子元素显示出来，
   * 但是display：none就都不展示
   * 2、visibility：hidden不影响计数器计数、，display不会计算隐藏元素数量
   * 3、CSS3的transition支持visibility属性，但是并不支持display，由于transition可以延迟执行，
   * 因此可以配合visibility使用纯css实现hover延时显示效果
   * 由于：display：none会脱离文档流，不占据页面空间，不可点击；visibility：hidden只是隐藏了，没有脱离文档流，占据页面内容，不可点击；
   * display：none会引起回流，读屏器不会读取，性能消耗较大，visibility：hidden和opacity: 0会引起重绘，性能消耗较少
   * opacity: 0不会让元素从渲染树中消失，元素继续占据空间，只是内容不可见，可以点击。非继承属性，修改子孙节点属性不能使它显示
   */

   /**
    * setInterval 有两个缺点：使用 setInterval 时，某些间隔会被跳过；可能多个定时器会连续执行；
    * 可以这么理解：每个 setTimeout 产生的任务会直接 push 到任务队列中；而 setInterval 在每次把任务 push 到任务队列前，
    * 都要进行一下判断(看上次的任务是否仍在队列中，如果有则不添加，没有则添加)。
    * 
    * setTimeout模拟setInterval
    */
   let timer = null
  function interval(func, wait){
      let interv = function(){
          func.call(null);
          timer=setTimeout(interv, wait);
      };
      timer= setTimeout(interv, wait);
  };
  // 终止
  if (timer) {
    window.clearSetTimeout(timer);
    timer = null;
  }