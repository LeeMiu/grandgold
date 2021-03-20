/**
 * Vue的主要考点
 * nextTick：下次dom更新循环结束之后执行延迟回调，可用于获取更新后的dom状态
 * 关键点在于对于微任务和宏任务的理解：microtasks、macrotasks
 * 默认nextTick是microtasks，在v-on中会使用macrotasks
 * 宏任务实现的顺序：setImmediate--MessageChannel--setTimeout
 * 
 * vue生命周期:
 * init:（var vm = new Vue()表示开始创建一个Vue实例对象）
 * 1、initLifecycle/Event：往vm上挂载各种属性，初始化事件系统
 * 2、beforeCreated：实例被创建之初，组件的属性生效之前-------钩子
 * 3、initInjection/initState：初始化注入和data的响应性
 * 4、created：创建完成钩子，此时data属性已经绑定，但还未生成真实的dom，$el还不可用（即没有el）------钩子
 * 5、元素挂载：$el存在则继续向下编译，没有则停止直到vue实例调用了vm.$mount()才继续编译
 * 6、是否有template：.vue后缀的文件vue-loader会将template编译成render function,没有template则将外部HTML作为模板编译
 * 综合排名优先级：render函数选项 > template选项 > outer HTML.
 * 7、beforeMount：模板编译/挂载之前钩子,相关的render函数首次被调用，此时还是通过{{text}}进行占位------钩子
 * 8、执行render function，生成真正的dom、并替换原来vitrual dom到dom tree中
 * 8、mounted：el被新创建的vm.$el替换，组件已经挂载钩子-----钩子
 * beforeUpdate：data数据发生变化，需要重新渲染组件，更新前的钩子-----钩子
 * updated：执行diff算法，对比改变触发ui更新----钩子
 * 1、其中flushScheduleQueue：中的watcher.before触发beforeUpdate钩子，watcher.run执行watcher中的notify，通知所有依赖更新ui
 * actived/deactived：不销毁，keep-alive专属，缓存组件的激活和失活
 * destroy：
 *  1、beforeDestory：销毁开始，此时实例仍然完全可用。----钩子
 *  2、销毁自身且递归销毁子组件以及事件监听：
 *      remove：删除节点、watcher.teardown：清空依赖、vm.$off：解绑监听
 *  3、destoryed：销毁完成钩子-----钩子
 */

new Vue({})

// 初始化Vue实例
function _init() {
	 // 挂载属性
    initLifeCycle(vm) 
    // 初始化事件系统，钩子函数等
    initEvent(vm) 
    // 编译slot、vnode
    initRender(vm) 
    // 触发钩子
    callHook(vm, 'beforeCreate')
    // 添加inject功能
    initInjection(vm)
    // 完成数据响应性 props/data/watch/computed/methods
    initState(vm)
    // 添加 provide 功能
    initProvide(vm)
    // 触发钩子
    callHook(vm, 'created')
		
	 // 挂载节点
    if (vm.$options.el) {
        vm.$mount(vm.$options.el)
    }
}

// 挂载节点实现
function mountComponent(vm) {
	 // 获取 render function
    if (!this.options.render) {
        // template to render
        // Vue.compile = compileToFunctions
        let { render } = compileToFunctions() 
        this.options.render = render
    }
    // 触发钩子
    callHook('beforeMount')
    // 初始化观察者
    // render 渲染 vdom， 
    vdom = vm.render()
    // update: 根据 diff 出的 patchs 挂载成真实的 dom 
    vm._update(vdom)
    // 触发钩子  
    callHook(vm, 'mounted')
}

// 更新节点实现
funtion queueWatcher(watcher) {
	nextTick(flushScheduleQueue)
}

// 清空队列
function flushScheduleQueue() {
     // 遍历队列中所有修改
     for() {
	    // beforeUpdate
        watcher.before()
         
        // 依赖局部更新节点
        watcher.update() 
        callHook('updated')
     }
}

// 销毁实例实现
Vue.prototype.$destory = function() {
	 // 触发钩子
    callHook(vm, 'beforeDestory')
    // 自身及子节点
    remove() 
    // 删除依赖
    watcher.teardown() 
    // 删除监听
    vm.$off() 
    // 触发钩子
    callHook(vm, 'destoryed')
}

/**
 * vue数据劫持响应  ******
 * 数据响应由两部分构成:观察者watcher和依赖收集器Dep，核心为defineProperty方法，该方法可以重写属性的get和set方法，从而完成监听数据的改变
 * 观察者观察props和state：对这俩者中的每个属性创建独立的监听器watcher
 * 使用defineProperty重写每个属性的get/set（defineReactive）；从而get收集依赖、set派发更新
 * get: 收集依赖
    Dep.depend()
        watcher.addDep()
 * set: 派发更新
    Dep.notify()
    watcher.update()
    queenWatcher()
    nextTick
    flushScheduleQueue
    watcher.run()
    updateComponent()
 */
function defineReactive(obj, key, val) {
    const dep = new Dep();
    // 给当前属性的值添加监听
    let chlidOb = observe(val);
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get: () => {
        // 如果Dep类存在target属性，将其添加到dep实例的subs数组中
        // target指向一个Watcher实例，每个Watcher都是一个订阅者
        // Watcher实例在实例化过程中，会读取data中的某个属性，从而触发当前get方法
        if (Dep.target) {
          dep.depend();
        }
        return val;
      },
      set: newVal => {
        if (val === newVal) return;
        val = newVal;
        // 对新值进行监听
        chlidOb = observe(newVal);
        // 通知所有订阅者，数值被改变了
        dep.notify();
      },
    });
  }

 /**
  * virtual dom原理：
  * （diff算法的优化在于同层比较）：将真实的dom以js对象的形成抽出来模拟树形结构。
  * 得益于js优点，运行效率高，可跨平台，可以优化频繁修改为一次真实dom操作。
  * 优点是其抽象能力和常驻内存的特性，让框架能更容易实现更强大的 diff 算法，
  * 缺点是增加了框架复杂度，也占用了更多的内存。
  * 当数据发生改变时，set方法会让调用Dep.notify通知所有订阅者Watcher，
  * 订阅者就会调用patch给真实的DOM打补丁，更新相应的视图。
  * patch函数判断oldVnode和newVnode可比性：值得比较则patchVnode，不值得则直接替换
  */ 
 function sameVnode (a, b) {
        return (
            a.key === b.key &&  // key值
            a.tag === b.tag &&  // 标签名
            a.isComment === b.isComment &&  // 是否为注释节点
            // 是否都定义了data，data包含一些具体信息，例如onclick , style
            isDef(a.data) === isDef(b.data) &&  
            sameInputType(a, b) // 当标签是<input>的时候，type必须相同
        )
        }
/*
  * proxy相比于defineProperty优势：数组，对象变化也可以监听到，不需要深度遍历监听；proxy由多达13种拦截方法
  * proxy如何代理多层对象：判断当前Reflect.get的返回值是否为object，是则再通过reactive方法进行代理
  * 防止proxy监听数组可能触发多次get/set：判断key是否为当前被代理对象target自身属性，或旧值和新值是否想等，满足以上其中之一才有可能触发
  * Proxy 区别于 Object.definedProperty。

Object.defineProperty 只能监听到属性的读写，而 Proxy 除读写外还可以监听属性的删除，方法的调用等。

通常情况下我们想要监视数组的变化，基本要依靠重写数组方法的方式实现，这也是 Vue 的实现方式，而 Proxy 可以直接监视数组的变化。
 */
new Proxy(target, {
    get(target, property) {
    },
    set(target, property) {
    },
    deleteProperty(target, property) {
    }
})
const list = [1, 2, 3];
const listproxy = new Proxy(list, {
    set(target, property, value) {
        target[property] = value;
        return true; // 标识设置成功
    }
});

list.push(4);
// Proxy 是以非入侵的方式监管了对象的读写，而 defineProperty 需要按特定的方式定义对象的属性。
/**
   * vue-router：
   * 模式分为：history、hash
   * 在hash模式下，所有的页面跳转都是客户端进行操作，因此对于页面拦截更加灵活；
   * 但每次url的改变不属于一次http请求，所以不利于SEO优化。
   * 在history模式下，借助history.pushState实现页面的无刷新跳转；这种方式URL的改变属于http请求，
   * 因此会重新请求服务器，这也使得我们必须在服务端配置好地址，否则服务端会返回404，为确保不出问题，
   * 最好在项目中配置404页面
   * 路由跳转可用：this.$router.push()，<router-link to=""></router-link>，
   * 路由守卫：<router-view></router-view>
   *
 */

 /**
  * Reflect：ES5新增的纯静态对象，只能通过静态方法的方式调用；提供了一套统一操作Object的API
  * 如判断对象是否存在属性 if(key in obj)或者优雅的Reflect.has(obj, key),删除也可以Reflect.deldeteProperty(obj, key);
  * 获取所有属性Object.keys(obj),也可以Reflect.ownKeys(obj);
  */

