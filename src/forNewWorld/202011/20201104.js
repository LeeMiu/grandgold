/**
 * vue3带来的变化
 * vue3使用了typescript进行大规模的重构，带来了composition API RFC，可以让像react hook一样写vue
 * 新特性：setup、ref、reactive、isRef、toRefs、computed、watch、LifeCycle Hooks（新的生命周期）、Template refs、
 * globalProperties、Suspense
 * 与vue2的对比：
 * 1、vue2对ts的支持不友好，所有属性都放this对象上了、难以倒推组件的数据类型
 * 2、大量api挂载在vue对象原型上，难以实现TreeShaking
 * 3、架构层面对跨平台dom渲染开发支持不友好
 * vue3的优点：
 * 1、composition API
 * 2、更方便支持ts
 * 3、Template支持多个根标签
 * 4、对虚拟dom进行了重写、对模板编译进行了优化
 * 
 * 1、setup函数，统一代替了beforeCreate和created钩子，data、methods、watch等全部都用对应的api写到setup中
 * setup(props, context) {
    context.attrs
    context.slots
    context.parent
    context.root
    context.emit
    context.refs

    return {

    }
  }
  props: 用来接收 props 数据
  context 用来定义上下文, 上下文对象中包含了一些有用的属性，这些属性在 vue 2.x 中需要通过 this 才能访问到, 在 setup() 函数中无法访问到 this，是个 undefined
  返回值: return {}, 返回响应式数据, 模版中需要使用的函数
* 2、reactive函数，接受一个普通对象，返回一个响应式数据对象
  用reactive创建出来后，在setup中return出去，然后直接在template中调用即可

  3、ref函数，根据给定的值创建一个响应式的数据对象，该对象只包含一个value属性、只在setup中访问ref函数需要加.value
  const num = ref<number>(10)
  setup() {
    const num = ref<number>(10);
    console.log(num.value);
    const obj = reactive({
      t: 100,
      num,
    })
    console.log(obj.num)
  }
  通过reactive来获取ref的值时，不需要.value属性
  4、isRef用于判断某个值是否是ref创建出来的对象
  5、toRefs将reactive创建出来的响应式对象转换为普通对象，但是该对象的每个属性节点都是ref类型的响应式数据
  6、computed，创造计算属性，返回一个ref对象，可以传对象或方法，对象中包含set和get函数
  const age = ref<number>(18)
  const computedObj = computed({
    get: () => age.value +1,
    set: val => age.value + val
  })
  const computedFunc = computed(() => age.value + 1)
  7、watch，侦听数据源，默认是懒执行、在侦听数据源变化时才执行回调。
  可以同时监听多个值：watch(
    [()=> state.age, ()=> state.name],
    ([newName, newAge], [oldName, oldAge]) => {
      console.log()
    }
  )
  可用stop停止侦听。在执行stop后，原来侦听的数据源变化时不会再触发watch
  8、LifeCycle Hooks：可按需导入到组件中，只能在setup中使用，可在setup外定义
  import { defineComponent, onBeforeMount, onBeforeUnmount, onBeforeUpdate,
    onErrorCaptured, onMounted, onUnmounted, onUpdated } from 'vue';
  export default defineComponent({
  setup(props, context) {
    onBeforeMount(()=> {
      console.log('beformounted!')
    })
    onMounted(() => {
      console.log('mounted!')
    })
    return {}
  }
});

9、Template refs，获取真实dom元素，可在setup中申明一个ref并返回
<template>
  <!--第一步：还是跟往常一样，在 html 中写入 ref 的名称-->
  <div class="mine" ref="elmRefs">
    <span>1111</span>
  </div>
</template>

<script lang="ts">
import { set } from 'lodash';
import { defineComponent, onMounted, ref } from 'vue';
export default defineComponent({
  setup(props, context) {
    // 获取真实dom
    const elmRefs = ref<null | HTMLElement>(null);
    onMounted (() => {
      console.log(elmRefs.value); // 得到一个 RefImpl 的对象, 通过 .value 访问到数据
    })

    return {
      elmRefs
    }
  }
});
</script>

10、全局配置
const app = Vue.createApp({})

app.config.globalProperties.$http = 'xxxxxxxxs'

可以在组件用通过 getCurrentInstance() 来获取全局 globalProperties 中配置的信息,
getCurrentInstance 方法获取当前组件的实例，然后通过 ctx 属性获得当前上下文，
这样我们就能在 setup 中使用 router 和 vuex, 通过这个属性我们就可以操作变量、全局属性、组件属性等等
setup( ) {
  const { ctx } = getCurrentInstance();
  ctx.$http
}

11、suspense组件：
新增了 React.lazy 类似功能的 defineAsyncComponent 函数，处理动态引入（的组件）。defineAsyncComponent
可以接受返回承诺的工厂函数。当您从服务器检索到组件定义时，应该调用 Promise 的解析回调。
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() =>
  import('./components/AsyncComponent.vue')
)

app.component('async-component', AsyncComp);

您还可以调用 reject(reason)来指示负载已经失败
<template>
  <Suspense>
    <template #default>
      <my-component />
    </template>
    <template #fallback>
      Loading ...
    </template>
  </Suspense>
</template>

<script lang='ts'>
 import { defineComponent, defineAsyncComponent } from "vue";
 const MyComponent = defineAsyncComponent(() => import('./Component')); // 动态引入

export default defineComponent({
   components: {
     MyComponent
   },
   setup() {
     return {}
   }
})
</script>
 */