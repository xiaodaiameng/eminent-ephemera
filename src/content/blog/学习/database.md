---
title: '数据库'
---


数据库网络相关

1. 数据库里一张表不能同时拥有多个表空间，也无法在使用时切换。

2. 高频访问的索引/表放 SSD提升性能，低频的放机械硬盘，优化存储和性能。

3. 表空间对应的文件系统目录不需要用户有读写权限，通常是数据库服务进程才需要权限，普通用户不需要直接操作这个目录。

4. 可在其他分区创建新的表空间。

   



mysql部分

#### 打包数据命令：（在命令行）

`mysqldump -u root -p --databases dbName >D:\dbname2.sql`

#### 还原数据命令：

`mysql -u root -p < D:\dbname2.sql`

在mysql里：`SOURCE D:/dbname.sql`


#### 一、数据库

```sql
mysql>SHOW databaseS;  
mysql>CREATE DATABASE Library;
mysql>SHOW CREATE DATABASE Library; 
mysql>USE Library;
```



#### 二、表操作

show tables, create table, alter table, drop table, rename table o to n, desc 

```sql
创建表
CREATE TABLE book(
bNo CHAR(10) PRIMARY KEY,
bName VARCHAR(20) NOT NULL DEFAULT 'abc', 
bTime DATETIME,
);
自增必须是数值类型id INT auto_increment PRIMARY KEY
外键：可以不是父表的主键,也可以不是子表的主键,但是必须唯一（起码unique）
创建表时就设置好外键约束：设置外键约束名
CREATE TABLE 子表名(..., bNo INT(10), ...,
CONSTRAINT 约束名 FOREIGN KEY(bNo) referenceS book(bNo));

修改列 ALTER TABLE <table_name> MODIFY COLUMN <column_name> <attributes可以部分修改> AFTER <column_name>;

增加列 ALTER TABLE <table_name> ADD COLUMN <column_name> <attributes> AFTER <column_name>;

增加列的外键约束：
ALTER TABLE son_table ADD CONSTRAINT 约束名 FOREIGN KEY (<column_name01>,<column_name02>) REFERENCES father_table(<column_name01>,<column_name02>);
如果有的表名和mysql关键字重名，要用反引号括起来。

增加列的条件约束：
ALTER TABLE atable ADD CONSTRAINT 约束名 CHECK(gender IN ('男', '女'));也可以直接在创建表时就约束：.. ,CONSTRAINT 约束名 CHECK(.AND.)
ALTER TABLE users ADD CONSTRAINT chk_email CHECK(email LIKE '%@%.%');

删除列:
ALTER TABLE book DROP COLUMN bName;

删除表：先删除相关的其他表的外键约束,
ALTER TABLE 子表名 DROP FOREIGN KEY 约束名;
DROP TABLE table_name;

修改表名：
RENAME TABLE old_name TO new_name;
ALTER TABLE old_name RENAME TO new_name;

查看所有表：
SHOW tableS;
描述表：
DESC table_name;
```



#### 三、表内数据操作

insert into, update set, delete from, select from

```
插入：
INSERT INTO table_name(bNo, bName, bTime) VALUES (1001, '数据库基础', '2025-12-21');

更新:
UPDATE table_name SET bAuthor='李慧' WHERE bTime='2025-12-21';

删除：
DELETE FROM table_name WHERE bName = '海的女儿';
```

#### 表内操作之——查询

##### 聚合函数

COUNT(column)

MAX(column)

MIN(column)

AVG(column)

SUM(column)

##### 标准顺序：

```sql
SELECT ...FROM ...WHERE ...
GROUP BY ...
HAVING ...-- 组级过滤（分组后过滤）
ORDER BY ...(DESC)
LIMIT ...
```



##### 单表、汇总、分组、连接

```sql
SELECT sNo,sName,sSex,sBirth FROM student WHERE mNo='24173';

SELECT * FROM student WHERE sName LIKE '陈__' OR sName LIKE '陈_';

SELECT sNo FROM student WHERE sName NOT LIKE '陈%';

SELECT sNo FROM student WHERE (mNO='24173') AND (sBirth <= '2025/12/17');

SELECT sNo,sName,(YEAR(CURDATE())-YEAR(sBirth)) AS '年龄' FROM student;

SELECT * FROM sc WHERE score BETWEEN 80 AND 85;

SELECT sNo,ROUND(sweight, 1) FROM stuinfo WHERE ssex = '女' AND ROUND(sweight, 1) <= 80;

SELECT AVG(score), MAX(score), MIN(score) FROM sc WHERE sNo = '714';

SELECT MAX(sheight) FROM studetail (AS) T1, stuclass (AS) T2 WHERE T1.sno = T2.sno AND T2.mno = '24173';

SELECT  count(*) FROM  course WHERE cpno IS NOT NULL;

SELECT  sNo,sName,sSex FROM  student WHERE  student.sNo IN(SELECT sNo FROM sc WHERE tcno IN ('2414040107','2414040303'));

```



```sql
SELECT DISTINCT sNo FROM sc WHERE score<60 GROUP BY sNo;
SELECT DISTINCT LEFT(sName, 1) FROM student; 
```

##### distinct 去除重复值。

##### <mark>left(字符串, 取前几个字符) </mark>

substring(字符串, 起始位置1, 长度)



##### GROUP BY

```sql
SELECT sName, subject, SUM(score) FROM sc GROUP BY sName, subject;
SELECT sName, GROUP_CONCAT(subject), SUM(score) FROM sc GROUP BY sName;
```

错误：`SELECT sName, subject, SUM(score) FROM sc GROUP BY sName;`
使用 GROUP BY 时,SELECT 中的每个非聚合列都必须出现在 GROUP BY 子句中。



##### DESC

```sql
SELECT  sSex,COUNT(*) FROM  student GROUP BY ssex ORDER BY COUNT(*) DESC;
```

DESC Descending 降序,从低到高
ASC Ascending,升序,从高到低,默认值



##### COUNT

```sql
SELECT COUNT(cpNo) FROM course;
```

cpNo 通常表示先修课程编号prerequisite course number

COUNT(*)：数行数,包括 NULL 行
COUNT(列名)：数该列非 NULL 值的数量



```sql
SELECT courseNo, COUNT(*),AVG(score) FROM sc WHERE sNo LIKE '24173%' GROUP BY courseNo HAVING COUNT(*)>10;
```

24173班超过10人选了这门课程的课程编号、课程人数、课程平均分。



##### LIMIT

```sql
...ORDER BY score DESC LIMIT 0,3;不能有括号
```

LIMIT 0,3 表示从第0条开始取前3条,等价于 LIMIT 3



##### JOIN

```sql
SELECT student.sname FROM

student JOIN sc ON student.sno = sc.sno 

GROUP BY student.sno

HAVING AVG(sc.score) > 80 AND COUNT(*) >= 2;

等价写法：
SELECT student.sname FROM student 

WHERE student.sno IN
(	SELECT sc.sno FROM sc 
 	GROUP BY sc.sno 
 	HAVING AVG(score) > 80 AND COUNT(*) >= 2
);
```



##### 等价写法、WHERE EXISTS ... 、WHERE column IN ...

```sql
SELECT (student.)sname FROM student INNER JOIN sc ON student.sno = sc.sno;
等价写法：
SELECT sname FROM student T1, sc T2 WHERE T1.sno = T2.sno;（老式写法）
SELECT sname FROM student NATURAL JOIN sc;

exist写法！！
SELECT sname FROM student WHERE EXISTS (SELECT * FROM sc WHERE sc.sno = student.sno);
in写法：
SELECT sname FROM student WHERE sno IN (SELECT sno FROM sc);
```



```sql
SELECT sNo,sName,sSex,mName FROM student s LEFT JOIN Major m ON s.mNo = m.mNo;
```



##### 多JOIN

```sql
SELECT DISTINCT s.sNo, sName, mName FROM
student s 
INNER JOIN major m ON s.mNo = m.mNo 
INNER JOIN sc ON s.sNo = sc.sNo
WHERE score < 60;
```



##### 带where条件的多表连接

```sql
SELECT  sc1.sNo, sc1.score, sc2.score FROM

sc1
JOIN sc2 ON sc1.sNo = sc2.sNo
WHERE  sc1.tcno='2411010101'
AND  sc2.tcno='2411010202'
AND sc1.score > sc2.score;
```



#### 布尔表达式

```sql
SELECT...FROM student LEFT JOIN sc ON student.sno = sc.sno ORDER BY sc.tcno IS NULL DESC;
```

order by 一个布尔表达式,DESC 可以用于此处使降序：使表达式为1的数据在前,使表达式为0的数据在后。

#### 多层排序：

```sql
SELECT ...FROM student LEFT JOIN sc ON student.sno = sc.sno ORDER BY sc.tcno IS NULL DESC, student.sno, sc.score DESC;
```

第一排序为选课信息：没选课在前,选课在后,第二排序为学号,同一学号的,按各科成绩降序排序。



#### any的意思：低满足

```sql
WHERE sc.score > ANY (子查询)
等价于
WHERE sc.score > (SELECT MIN(score) FROM ...)
```



#### 其他长句：

```sql
SELECT s.sNo,s.sName FROM student s
WHERE sNo IN (SELECT sc.sNo FROM sc join tc on sc.tcno=tc.tcno 
                  					 join course on tc.cno=course.cno
    		  WHERE c.cname  IN('计算机网络','金融学')
GROUP BY sNo HAVING COUNT(DISTINCT c.cname) = 2);


SELECT s.sname,s.snative,d.dname FROM student s JOIN dept d ON s.dno = d.dno
WHERE EXISTS (
  SELECT * FROM student s2 JOIN dept d2 ON s2.dno = d2.dno
  WHERE d2.dname = '计算机系' AND s2.snative = s.snative)
AND d.dname != '计算机系';

SELECT sname,sweight-avgweight FROM student s JOIN stuinfo sf1 ON s.sno=sf1.sno
JOIN (SELECT mno,avg(sweight) FROM student s2 JOIN stuinfo sf2 on s2.sno=sf2.sno GROUP BY mno)
ON s.mno= v1.mno;

```

```sql
SELECT...FROM...WHERE EXISTS (SELECT...FROM...WHERE...)
				AND EXISTS (SELECT * FROM  sc WHERE NOT EXISTS...AND...);
```







