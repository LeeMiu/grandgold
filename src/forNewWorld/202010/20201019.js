/**
 * chromeV8引擎核心机制流程；四大模块
 * 1、Parser：语法分析器，将JavaScript源码转换为抽象语法树（Abstract Syntax Tree）AST。
 * 2、Ignition：解释器，将AST转换为字节码（ByteCode），解释执行Bytecode，同时收集TurboFan优化编译
 * 所需的信息；字节码、寄存器、栈、堆。分为基于栈和基于寄存器的解释器：基于栈用来保存函数参数、中间运算结果、变量等
 * 基于寄存器的支持底层计算机指令操作。基于堆栈的虚拟机在处理函数调用、解决递归问题和切换上下文时简单明了。
 * 而现在的 V8 虚拟机则采用了基于寄存器的设计，它将一些中间数据保存到寄存器中，速度上快。
 * 3、TurboFan：编译器，将ByteCode转换为优化的汇编代码，上一层的Ignition已经准备了优化信息。
 * 4、Orinoco：垃圾回收机制，基于世代假说：a、大部分对象在内存中存活时间很短；b、不死的对象，会活的更久
 * 新生代采用scavenge算法回收（from和to空间），老生代采用mark-sweep（标记清除）和mark-compact（标记整理）相结合策略。
 * 新生代会晋升到老生代，老生代会移到新生代，角色反转。
 * 
 */

 /**
  * 手写发布订阅
  * @Description:  eventBus的emit事件必须声明在types，避免遍历时eventType为undefined
 * @Params: types
 * @Return: 初始事件
  */
 class EventListener {
    constructor() {
        this.events = {};
    }
    
    on(event, callback) {
        const cbs = this.events[event] || [];
        cbs.push(callback);
        this.events[event] = cbs;
        return this;
    }

    off(event, callback) {
        const cbs = this.events[event];
        this.events[event] = cbs && cbs.filter((fn) => fn != callback);
        return this;
    }

    removeAll(event) {
        const cbs = this.events[event];
        this.events[event] = [];
        return this;
    }

    emit(...args) {
        const event = args[0];
        const params = [].slice.call(args, 1);
        const cbs = this.events[event];
        cbs.forEach((fn) => fn.apply(this, params));
        return this;
    }

    once(event, callback) {
        const wrapFn = (...args) => {
            callback.apply(this, args);
            this.off(event, wrapFn);
        };
        this.on(event, wrapFn);
        return this;
    }
 }

/**
 * 手写观察者模式
 * 观察者需放置到被观察者中，被观察者的状态变化需要通知观察者，内部式基于发布订阅模式，收集观察者，状态变化后告诉观察者
 */
class subject {
    // 被观察者
    constructor(name) {
        this.name = name;
        this.state = '开心的';
        this.observers = []; // 收集观察者
    }

    linkObservers (man) {
        this.observers.push(man);
    }

    setState (newState) {
        this.state = newState;
        this.observers.forEach((e) => e.update(this));
    }
}

class observer {
    // 观察者
    constructor(name) {
        this.name = name;
    }
    update(subject){
        console.log(`当前${this.name}被通知了，${subject.name}的状态是${subject.state}`);
    }
}

// 实例测试
let student = new subject('学生A');
let parent = new observer('父母');
let teacher = new observer('老师');

student.linkObservers(parent);
student.linkObservers(teacher);
student.setState('被欺负了！');



/**
 * 数组转换为树或森林
 * 根据parentId建立父子关系
 */
function arrayToTree (array) {
    const roots = array.filter((e) => e.parentId == null);
    for (let i  = 0; i < roots.length; i++) {
        const root = roots[i];
        array.splice(array.findIndex((e) => e.id === root.id), 1);
        let Tree = {
            id: root.id,
            val: root.val,
            children: toTree(root.id, array),
        }
        res[i] = Tree;
    }
    function toTree(id, arr) {
        let child = [];
        let len = arr.length;
        for(let i = 0; i < len; i++) {
            let node = arr[i];
            if (node.parentId === id) {
                child.push({
                    id: node.id,
                    val: node.val,
                    children: toTree(node.id, array),
                })
            }
        }
        return child;
    }
    return res;
}


/**
 * 使用ES6的proxy实现数组负索引
 * 立即调用的函数表达式（IIFE） 有一个 自己独立的 作用域，如果函数名称与内部变量名称冲突，
 * 就会永远执行函数本身；所以上面的结果输出是函数本身；
 */
"use strict";
let arr=[1,2,4,6,8,10];
function changeArrFn(arr) {
    let proxy = new Proxy(arr, {
        set(){},
        get(arr, index) {
            if (index >= 0) {
                return arr[index];
            } else {
                return arr[arr.length + index];
            }
        },
    });
    return proxy;
}
let newArr = changeArrFn(arr);
console.log(newArr[-2])



