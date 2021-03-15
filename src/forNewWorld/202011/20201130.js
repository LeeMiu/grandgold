
const { resolve, reject } = require("core-js/fn/promise");


 // 创建一个ajax
 var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XHLHTTP');
 xhr.open('index.xml', 'get', true);
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