// leecode72题：两个字符串转换所需的最小操作次数
/**
 * 只能进行插入、替换和删除,且都是一个字符的操作
 * 在对比时分以下两种情况；
 * 1、如果str1[i] = str2[j]；那就方案就是str1[i-1]和str2[j-1]的比较
 * 即dp[i][j] = dp[i - 1][j - 1];
 * 2、如果两个不相等；则取以下三者中的最小变换次数
 * a、替换，直接将str1[i]字符用str2[j]字符替换 dp[i][j] = dp[i-1][j-1] + 1
 * b、添加插入；在str1[i]末尾插入一个str2[j] dp[i][j] = dp[i][j-1] + 1;
 * c、删除str1[i]字符，然后继续比较 dp[i][j] = dp[i - 1][j] + 1
 */

 function exchangeStr(str1, str2) {
     const n = str1.length;
     const m = str2.length;
     let res = new Array(n + 1).fill(0).map(() => new Array(m + 1).fill(0));
     for (let i = 0; i <= n; i++) {
         res[i][0] = i;
     }
     for (let j = 0; j <= m; j++) {
         res[0][j] = j;
     }
     // 分两种情况进行匹配转换
     for (let i = 0; i <= n; i++) {
         for (let j = 0; j <= m; j++) {
             if (str1[i] === str2[j]) {
                 res[i+1][j+1] = res[i][j];
                 continue;
             }
             let insert = res[i+1][j] + 1, del = res[i][j+1] + 1, replace = res[i][j] + 1;
             res[i+1][j+1] = Math.min(Math.min(insert, del), replace);
         }
     }
     return res[n][m];
 }

 /**
  * 
  */