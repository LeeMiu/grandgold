/**
 * 常规编程：
 * 模拟大数相乘：如1865459497823*6349526719336
 * 实现思路：模拟人工手算，一位一位相乘，从最低位开始，用数组存储每一位的数
 */
function bigNumMultiply(num1, num2) {
    num1 = num1.toString();
    num2 = num2.toString();
    let res = new Array(num1.length + num2.length).fill(0);
    // 定义一个全部为0，总位数为二者长度和的数组
    for (let i = num1.length - 1; i >= 0; i--) {
        for (let j = num2.length - 1; j >= 0; j--) {
            let temp = num1[i] * num2[j];
            let sum = res[i + j + 1] + temp;
            res[i + j + 1] = sum % 10;
            res[i + j] += (sum / 10) | 0; // 与零非为取整可以用parseInt,Math.floor进行向下取整
        }
    }
    while(res[0] === 0) {
        res.shift(); // 去除首部为0的部分
    }

    return res.join(''); // 直接合并数组为字符串
}

/**
 * svg和canvas的比较
 * Canvas是使用JavaScript程序绘图(动态生成)，SVG是使用XML文档描述来绘图。
 * SVG更适合用来做动态交互，而且SVG绘图很容易编辑，只需要增加或移除相应的元素就可以了。
 * SVG是基于矢量的，所有它能够很好的处理图形大小的改变。Canvas是基于位图的图像，
 * 它不能够改变大小，只能缩放显示；所以说Canvas更适合用来实现类似于Flash能做的事情(当然现在Canvas与Flash相比还有一些不够完善的地方)
 * svg是个静态图片展示、高保真文档和打印的应用场景，功能比较完善
 * canvas功能更原始，适合像素处理、动态渲染和大数据量绘制
 * Canvas依赖分辨率不支持事件处理器弱的文本渲染能力能够以.png或.jpg格式保存结果图像最适合图像密集型的游戏，其中的许多对象会被频繁重绘
 * SVG不依赖分辨率支持事件处理器最适合带有大型渲染区域的应用程序（比如谷歌地图）复杂度高会减慢渲染速度（任何过度使用DOM的应用都不快）不适合游戏应用
 */

 /**
  * h5移动端页面1px边框问题解决：
  * 1、伪类+transform：原理是把原先元素的border去掉，然后利用：before或者：after重做border，用将transform的scale缩小一半，原先的元素相对定位，
  * 新做的border绝对定位
  * 2、rem + viewport：在运行时拿到设备的devicePixelRatio，动态改变viewport的initial-scale为1/devicePixelRatio,保证1px的宽度就是真这物理上1px像素
  */

  /**
   * 鸡蛋测楼层掉落问题
   *k个鸡蛋，n层楼，f楼及以下楼层掉鸡蛋不碎，最快的方法找的这个f楼
   */
  function eggsDrop (k = 1, n = 1) {
      //需要从0个鸡蛋或者0层楼开始算起，所以申请了K+1行N+1列的二维数组空间
    let arr = new Array();
    for (let i = 0; i <= k; i ++){
        arr[i] = new Array();
        for (let j = 0; j <= n; j++) {
            arr[i][j] = 0;
        }
    }
    for (let i = 1; i <= k; i ++){
        arr[k][1] = 1;//如果只有一层楼，那么无论多少个鸡蛋都只需要扔一次鸡蛋
    }
    for (let i = 1; i <= n; i ++){
        arr[1][i] = i;//如果只有一个鸡蛋，那么有多少层楼就需要扔多少次鸡蛋
    }
    for (let i = 2; i <= k; i++) {//从两个鸡蛋两层楼的情况开始算起
        for (let j = 2; j <= n; j++) {
            let temp = Number.MAX_SAFE_INTEGER; // js最大安全整数
            for (let m = 1; m <= j; m++) {
                temp = Math.min(temp, Math.max(arr[i-1][m-1], arr[i][j-m]) + 1)
            }
            arr[i][j] = temp;//记录最小的扔鸡蛋次数到record[i][j]中
        }
    }
    return arr[k][n];//最后返回record[K][N]就是我们要找的扔鸡蛋次数了
  }
  // 换种方式；知道k个鸡蛋，最多m次尝试摔碎鸡蛋的次数，可以得到的测算楼层的高度n
  /**
   * 分治法的思路来看，在某一层X摔下去，如果碎了，那么只剩下M-1次次数和K-1个鸡蛋，而用这剩下的M-1
   * 次数和K-1个鸡蛋，必定可以测算得到X-1层的F的具体值。如果没碎，那么还剩下M-1次次数和K个鸡蛋，
   * 而用这M-1次次数和K个鸡蛋，必定可以测算得到N-X的楼层的F的具体值。
   */
  function eggDrop (k = 1, n = 1) {
    let arr = new Array();
      for (let i = k; i >= 1; i--) {
          // 0个鸡蛋或0次尝试机会都是只能测试0层楼的，1次机会、1个鸡蛋，一定能测出的最高高度是1，
        arr[0][i] = 0;
        arr[1][i] = 1;
      }
      let testTimes = 2;
      arr[testTimes] = new Array(k + 1);
      for (; arr[testTimes][k] < n;) {
        for(let i = k; i >= 0; i--) {//从vector的后面开始更新，这样不影响其他位置的vector元素的更新
            if ([1, 0].includes(i)) {
                arr[testTimes][i] = i
            }
            arr[testTimes][i] = arr[testTimes - 1][i] + arr[testTimes - 1][i - 1] + 1;
        }
        testTimes++;
        arr[testTimes] = new Array(k + 1);
      }
      return testTimes - 1;//返回需要的尝试次数
  }
