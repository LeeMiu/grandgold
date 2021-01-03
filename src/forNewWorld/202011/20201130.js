/**
 * css基础回顾
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
 * 4、table下可以对td/th使用align：center，valign：middle
 * 5、display：table-cell
 */

const { resolve, reject } = require("core-js/fn/promise");


 // 创建一个ajax
 var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XHLHTTP');
 xhr.open('get', 'index.xml', true);
 xhr.send(null);
 xhr.onreadystatechange = () => {
     if (xhr.readyState === 4 && xhr.statux === 200 || xhr.status === 304) {
         console.log(xhr.responseXML);
     }
 }

 // Promise封装实现
 getAjax = (url) => {
     let promise = new Promise((resolve, reject) => {
         let xhr = new XMLHttpRequest();
         xhr.open('GET', url, true);
         xhr.onreadystatechange = () => {
             if (this.readyState !== 4) return;
             if (this.status === 200) {
                 resolve(this.response);
             } else {
                 reject(new Error(this.statusText));
             }
         };
         xhr.onerror = () => {
            reject(new Error(this.statusText));
         }
         xhr.responseType = 'json';
         xhr.setRequestHeader('Accept', 'application/json');
         xhr.send(null);
     });
     return promise;
 }