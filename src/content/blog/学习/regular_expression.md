---
title: '几乎没有的匹配'
pubDate: 2026-01-26
updated: 2026-01-26

---



1. ```
   ^   匹配字符串开始
   $   匹配字符串结束
   .   匹配任意字符（除换行）
   \d  匹配数字
   
   
   在各语言的写法：
   JavaScript
   const regex = /^\d{3}-\d{4}$/;
   
   Python
   pattern = r'^\d{3}-\d{4}$'
   re.match(pattern, "123-4567")
   
   Java
   Pattern pattern = Pattern.compile("^\\d{3}-\\d{4}$");
   ```



2. 匹配邮箱：

   ```regex
   ^  [a-zA-Z0-9._%+-]+  @[a-zA-Z0-9-]+  \.  [a-zA-Z]{2,}  (?:  \.  [a-zA-Z]{2,}  )?  $
   
   {2,}    至少2个字符
   (?: ) 是一个整体符号，意思是 “非捕获分组”
   ?表示可选，(?:abc)?  表示整个分组是可选的
   ^[a-zA-Z0-9._%+-]+@m\.gduf\.edu\.cn$	匹配@m.gduf.edu.cn
   ```



3. ```regex
   <a  \s+  .*?  href="  (  [^"]+  )  "  .*?  >  (  [^<]+  )  </a>
   ```

​	由 <a 开头，

​	\s+ 表示有一个或多个空白符，

​	`.*?`非贪婪匹配除了换行符之外的任意字符，直到接下去的文本被匹配到。

​	捕获组被加括号。\[^"]+ 匹配除了 “ 之外的任意字符一次或多次。

```javascript
const regex = /(\d{4})-(\d{2})-(\d{2})/;
const match = "今天是2025-12-29。".match(regex);

console.log(match[0]); // "2025-12-29"
console.log(match[1]); // "2025"
console.log(match[2]); // "12"
console.log(match[3]); // "29"
```
