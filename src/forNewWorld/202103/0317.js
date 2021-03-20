/**
 * 给定二叉树，判断二叉树是否对称
 * 循环：递归、迭代
 * 需比较：左右子树的根节点是否相等，左右子树是否镜像
 * 边界条件：左右子树都为null，返回true；左右子树有一个null时，返回false
 */
// 递归
function isMonitor(root) {
    if (!root) return true;
    function isEqualTree(left, right) {
        if (!left && !right) return true;
        if (!left || !right) return false;
        return left === right && isEqualTree(left.left, right.right) && isEqualTree(left.right, right.left);
    }
    return isEqualTree(root.left, root.right);
}
// 迭代,通过栈去实现
//首先根的左右子树入栈
// 一次出两个，将左右子树出栈，比较两个数是否互为镜像
//如果左右子树的根节点值相等，则将左子树的 left 、右子树的 right 、左子树的 right 、右子树的 left 依次入栈
// 重复上面操作，继续出栈（一次出栈两个进行比较）
function isMonitor(root) {
    if (!root) return true;
    let stack = [root.left, root.right];
    while(stack.length) {
        let right = stack.pop();
        let left = stack.pop();
        if (left && right) {
            if (left.val !== right.val) return false;
            stack.push(left.left);
            stack.push(right.right);
            stack.push(left.right);
            stack.push(right.left);
        } else if (left || right) {
            return false;
        }
    }
    // 迭代遍历完了还没return就表示没有错误
    return true;
}
/**
 * 为什么函数是一等公民
 * 对于JavaScript来说，函数可以赋值给变量，也可以作为函数参数，也可以处理变量，还可以作为函数返回值，
 * 因此JavaScript中函数是一等公民。而且相比于变量，变量在使用前未声名会报错或undefined
 * 函数声明在使用后面也可以。
 * 
 * async await优缺点：
 *      优点：相对Promise来说，优化处理了then链式调用，使得代码清晰准确
 *      缺点：滥用await会阻塞代码，强行建立依赖关系，导致代码失去并发性。
 * 在 await 内部实现了 generators ，generators 会保留堆栈中东西；await 是异步操作，
 * 遇到await就会立即返回一个pending状态的Promise对象，暂时返回执行代码的控制权，使得函数外的代码得以继续执行
 * 
 * 前端动画得几种实现方式：
 *      1、序列帧：需要结合css animation实现.主要在animation: position 1s steps(28)
 *       @keyframes duration | timing-function | delay | name
        animation: 3s linear 1s slidein;

        @keyframes slidein {
        from { transform: scaleX(0); }
        to   { transform: scaleX(1); }
        }

 * 序列帧在 H5 开发中手机分辨率的不同，可能有轻微抖动现象，可通过将该dom嵌套到SVG 中解决。
 *      2、SVG动画，借助三方网站生成SVG代码后直接使用
 *      3、Lottie，由Airbnd开发的动画框架，各平台都有支持。本质是基于SVG或Canvas，使用js进行开发的动画实现
 *      4、WebGL和Canvas：WebGL（全写Web Graphics Library）是一种3D绘图标准，这种绘图技术标准允许
 * 把JavaScript和OpenGL ES 2.0结合在一起。通过增加OpenGL ES 2.0的一个JavaScript绑定，WebGL可以为
 * HTML5 Canvas提供硬件3D加速渲染，这样Web开发人员就可以借助系统显卡来在浏览器里更流畅地展示3D场景和模型了，
 * 还能创建复杂的导航和数据视觉化。
 *      当需要执行大量绘制任务时，WebGL2D的性能远远超越了Canvas 2D Api，达到了后者的数10倍。
 * 
 * cookie安全性：value值最好使用约定的算法进行加密，不建议使用明文、http-only不能js访问cookie，减少XSS攻击、secure只能在
 * 协议中使用https请求才能携带、samesite同源策略，不允许跨域携带cookie，减少CSRF攻击
 * 
 * 判断页面是否加载完：Load事件触发代表页面已经全部加载完毕，DomContentLoaded事件触发表示html已加载解析。
 */
