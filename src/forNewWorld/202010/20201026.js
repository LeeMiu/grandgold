/**
 * 概念性咬文嚼字
 * f.prototype 是使用使用 new 创建的 f 实例的原型. 而 Object.getPrototypeOf 是 f 函数的原型.
 */
function f() {}
const a = f.prototype,b = Object.getPrototypeOf(f);
console.log(a === b) // false

// 要想相等
a === Object.getPrototypeOf(new f());
b === Function.prototype;


/**
 * 下面代码中 a 在什么情况下会打印 1
 var a = ?;
if(a == 1 && a== 2 && a== 3){
 	console.log(1);
}
 */
// 由于==有隐形转换，重写toString方法
var a = {
    i: 1,
    toString: function () {
      return a.i++;
    }
  }
  if(a == 1 && a == 2 && a == 3) {
    console.log('1');
  }
// 或者用symbol

var a = {[Symbol.toPrimitive]: ((i) => () => ++i) (0)};
if (a == 1 && a == 2 && a == 3) {
  console.log('1');
}


/**
 * 父组件和子组件传值：
 * 1、父组件@func="myFunc";子组件中通过this.$emit('func')
 * // Parent.vue
<Child @mounted="doSomething"/>
    
// Child.vue
mounted() {
  this.$emit("mounted");
}
2、父组件在引用子组件时通过@hook:func
//  Parent.vue
<Child @hook:mounted="doSomething" ></Child>

doSomething() {
   console.log('父组件监听到 mounted 钩子函数 ...');
},
    
//  Child.vue
mounted(){
   console.log('子组件触发 mounted 钩子函数 ...');
},  
以上的输出顺序为：
// 子组件触发****
// 父组件监听到*****
当然 @hook 方法不仅仅是可以监听 mounted，其它的生命周期事件，例如：created，updated 等都可以监听。
 */