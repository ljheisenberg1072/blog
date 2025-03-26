---
outline: deep
---

> 安装参考[【文档】](https://www.ljheisenberg.cn/linux-server-deployment-from-scratch.html#_4-安装mysql)

MySQL 是一个开源的关系型数据库管理系统（RDBMS），使用结构化查询语言（SQL）进行数据管理。它具有 高性能、可靠性强、易扩展 的特点，被广泛应用于 Web 开发、企业应用和大数据处理。

**MySQL 的核心特点**
- 支持 ACID 事务（Atomicity, Consistency, Isolation, Durability）
- 支持多种存储引擎（如 InnoDB、MyISAM、Memory 等）
- 高可扩展性，支持主从复制、分库分表、集群架构
- 强大的 SQL 查询优化，提供索引、缓存、查询优化器
- 广泛应用，适用于小型站点到大规模分布式应用

## 基础
主键的值不允许修改，也不允许复用(不能使用已经删除的主键值赋给新数据行的主键)。
SQL(Structured Query Language)，标准 SQL 由 ANSI 标准委员会管理，从而称为 ANSI SQL。各个 DBMS 都有自己的实现，如 PL/SQL、Transact-SQL 等。
SQL 语句不区分大小写，但是数据库表名、列名和值是否区分依赖于具体的 DBMS 以及配置。

## 注释
MySQL支持三种注释：
```sql
# 注释
SELECT *FROM mytable; -- 注释
/* 注释1
注释2 */
```

## 创建表
```sql
-- 指定存储引擎和字符集
CREATE TABLE test (   
id INT NOT NULL AUTO_INCREMENT,
name INT NOT NULL,
PRIMARY KEY (`id`)
) ENGINE = InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## 修改表
```sql
-- 添加列
ALTER TABLE test ADD hobby CHAR(20);

-- 修改列和属性
-- ALTER TABLE 表名 CHANGE 原字段名 新字段名 字段类型 约束条件
ALTER TABLE test CHANGE hobby new_hobby CHAR(32) NOT NULL;

-- 删除列
ALTER TABLE test DROP COLUMN new_hobby;

-- 删除表
DROP TABLE test;
```

## 插入
```sql
-- 普通插入
INSERT INTO test(name, age) VALUES('alice', 18);

-- 插入检索出来的数据
INSERT INTO test(name, age) SELECT name, age FROM new_test;

-- 将一个表的内容插入到一个新表
CREATE TABLE new_test AS SELECT * FROM test;
```

## 更新
```sql
UPDATE test set name = 'tom' WHERE id = 1;
```

## 删除
```sql
DELETE FROM test WHERE id = 1;

-- 清空表，删除所有行
TRUNCATE TABLE test;
```

## 查询
```sql
-- DISTINCT，相同的值出现一次，所有列的值都相同才算
SELECT DISTINCT name, age FROM test;

-- LIMIT n → 取前 n 行
-- LIMIT offset, count → 跳过offset行，取count行
SELECT * FROM test LIMIT 5;
SELECT * FROM test LIMIT 0, 5;
SELECT * FROM test LIMIT 2, 3;
```

## 排序
```sql
-- ASC升序（默认），DESC降序
SELECT * FROM test ORDER BY created_at DESC, age ASC;
```

## 过滤
```sql
SELECT * FROM test WHERE name IS NULL;
```

WHERE 子句可用的操作符如下：

| 操作符      | 	说明      |
|:---------|:---------|
| =	       | 等于       |
| <	       | 小于       |
| \>	      | 大于       |
| <> !=	   | 不等于      |
| <= !>	   | 小于等于     |
| \>= !<	  | 大于等于     |
| BETWEEN	 | 在两个值之间   |
| IS NULL	 | 为 NULL 值 |

应该注意到，NULL 与 0、空字符串都不同。

AND 和 OR 用于连接多个过滤条件。优先处理 AND，当一个过滤表达式涉及到多个 AND 和 OR 时，可以使用 () 来决定优先级，使得优先级关系更清晰。

IN 操作符用于匹配一组值，其后也可以接一个 SELECT 子句，从而匹配子查询得到的一组值。

NOT 操作符用于否定一个条件。

## 通配符
通配符也是用在过滤语句中，但它只能用于文本字段。
- % 匹配 >=0 个任意字符；
- _ 匹配 ==1 个任意字符；
- \[ ] 可以匹配集合内的字符，例如 [ab] 将匹配字符 a 或者 b。用脱字符 ^ 可以对其进行否定，也就是不匹配集合内的字符。

使用 Like 来进行通配符匹配。
```sql
-- 不以 A 或 B 开头的任意文本
SELECT * FROM test WHERE name LIKE '[^AB]%';
```

## 计算字段
计算字段通常需要使用 AS 来取别名，否则输出的时候字段名为表达式
```sql
SELECT price * amount AS total_price FROM test;
```
CONCAT() 用于连接两个字段。许多数据库会使用空格把一个值填充为列宽，因此连接的结果会出现一些不必要的空格，使用 TRIM() 可以去除首尾空格。
```sql
SELECT CONCAT(TRIM(name), '(', TRIM(hobby),')') AS concat_col FROM test;
```

## 函数
### 汇总

| 函 数	            | 说 明                 |
|:----------------|:--------------------|
| AVG()	          | 返回某列的平均值            |
| COUNT()	        | 返回某列的行数             |
| MAX()	          | 返回某列的最大值            |
| MIN()	          | 返回某列的最小值            |
| SUM()	          | 返回某列值之和             |

AVG() 会忽略 NULL 行。

使用 DISTINCT 可以让汇总函数值汇总不同的值。
```sql
SELECT AVG(DISTINCT age) AS avg_age FROM test;
```

### 文本处理

| 函数	               | 说明                      |
|:------------------|:------------------------|
| LEFT()	           | 左边的字符                   |
| RIGHT()	          | 右边的字符                   |
| LOWER()	          | 转换为小写字符                 |
| UPPER()	          | 转换为大写字符                 |
| LTRIM()	          | 去除左边的空格                 |
| RTRIM()	          | 除右边的空格                  |
| LENGTH()	         | 长度                      |
| SOUNDEX()	        | 转换为语音值                  |

其中， **SOUNDEX()** 可以将一个字符串转换为描述其语音表示的字母数字模式。如 "apple" 的 SOUNDEX 代码为 "A140"
假设 test 表的数据如下：

| id	    | name      |
|:-------|:----------|
| 1	     | apple     |
| 2	     | aple      |
| 3	     | appel     |
| 4	     | banana    |
| 5	     | apoll     |
```sql
SELECT * FROM test WHERE SOUNDEX(name) = SOUNDEX('apple');
```
可能返回：

| id       | name       | SOUNDEX(name) |
|:---------|:-----------|:--------------|
| 1	       | apple	     | A140          |
| 2	       | aple	      | A140          |
| 3	       | appel	     | A140          |

**解释**：
- "apple", "aple", "appel" 的 SOUNDEX 代码相同，因此匹配。
- "banana" 的 SOUNDEX 代码不同，因此不会匹配。

**适用场景**
- 拼写错误的模糊匹配（如 appel 误拼为 apple）。
- 搜索用户输入的相似单词。

**局限性**
- SOUNDEX() 适用于 英语单词，对中文、日文等语言效果不好。
- 可能会匹配一些 不太相关的单词，导致误匹配。

### 日期和时间处理
- 日期格式: YYYY-MM-DD
- 时间格式: HH:MM:SS

| 函 数	              | 说 明                      |
|:------------------|:-------------------------|
| AddDate()	        | 增加一个日期(天、周等)             |
| AddTime()	        | 增加一个时间(时、分等)             |
| CurDate()	        | 返回当前日期                   |
| CurTime()	        | 返回当前时间                   |
| Date()	           | 返回日期时间的日期部分              |
| DateDiff()	       | 计算两个日期之差                 |
| Date_Add()	       | 高度灵活的日期运算函数              |
| Date_Format()	    | 返回一个格式化的日期或时间串           |
| Day()	            | 返回一个日期的天数部分              |
| DayOfWeek()	      | 对于一个日期，返回对应的星期几          |
| Hour()	           | 返回一个时间的小时部分              |
| Minute()	         | 返回一个时间的分钟部分              |
| Month()	          | 返回一个日期的月份部分              |
| Now()	            | 返回当前日期和时间                |
| Second()	         | 返回一个时间的秒部分               |
| Time()	           | 返回一个日期时间的时间部分            |
| Year()	           | 返回一个日期的年份部分              |

```sql
mysql > SELECT NOW();
mysql > 2025-3-26 10:42:10
```

### 数值处理

| 函数	        | 说明       |
|:-----------|:---------|
| SIN()	     | 正弦       |
| COS()	     | 余弦       |
| TAN()	     | 正切       |
| ABS()	     | 绝对值      |
| SQRT()	    | 平方根      |
| MOD()	     | 余数       |
| EXP()	     | 指数       |
| PI()	      | 圆周率      |
| RAND()	    | 随机数      |

## 分组
### GROUP BY
GROUP BY 用于将查询结果按某个字段分组，通常配合 聚合函数（如 COUNT()、SUM()、AVG()、MAX()、MIN()）使用。

```sql
SELECT user_id, COUNT(*) AS order_count, SUM(amount) AS total_spent
FROM orders
GROUP BY user_id;

-- 自动按照分组字段进行排序，加ORDER BY按照汇总字段来排序
SELECT user_id, COUNT(*) AS order_count, SUM(amount) AS total_spent
FROM orders
GROUP BY user_id
ORDER BY total_spent;
```
按 user_id 进行分组，每个用户返回一个汇总的订单数和总消费金额。

### HAVING
HAVING 用于 过滤 GROUP BY 之后的结果，类似 WHERE，但 WHERE 不能用于聚合函数，而 HAVING 可以。

```sql
SELECT user_id, COUNT(*) AS order_count
FROM orders
GROUP BY user_id
HAVING order_count > 2;
```
仅返回订单数量超过 2 的用户。

区别：
- WHERE 作用于 GROUP BY 之前，过滤 原始数据。
- HAVING 作用于 GROUP BY 之后，过滤 聚合结果。

## 子查询
子查询中只能返回一个字段的数据，可以将子查询的结果作为 WHERE 语句的过滤条件
```sql
SELECT * FROM test WHERE name IN (SELECT name FROM new_test);
```
检索出客户订单数量
```sql
SELECT name, (SELECT COUNT(*) FROM orders WHERE orders.user_id = users.id) AS order_num FROM users ORDER BY name;
```

## 连接查询（JOIN）
在 MySQL 中，JOIN 用于将多个表的数据连接在一起查询。常见的 JOIN 类型如下：

### 1. INNER JOIN（内连接）

内连接是最常见的 JOIN，它只返回 两个表中匹配的记录。
```sql
SELECT users.id, users.name, orders.amount
FROM users
INNER JOIN orders ON users.id = orders.user_id;
```

返回 users 和 orders 中 user_id 相匹配的所有记录。
如果 users 或 orders 中没有匹配项，则该行不会出现在结果中。
自连接可以看成内连接的一种，只是连接的表是自身而已

```sql
-- 子查询版本
SELECT name from employee WHERE department = (
SELECT department FROM emplyoee WHERE name = 'alice';
)

-- 自连接版本
SELECT e1.name FROM employee AS e1 INNER JOIN employee AS e2 ON e1.department = e2.department AND e2.name = 'alice';
```

### 2. LEFT JOIN（左连接）
左连接返回 左表的所有记录，如果右表中没有匹配项，则 NULL 代替。
```sql
SELECT users.id, users.name, orders.amount
FROM users
LEFT JOIN orders ON users.id = orders.user_id;
```
即使 orders 没有匹配的 user_id，用户数据仍会返回，orders.amount 为空（NULL）。

### 3. RIGHT JOIN（右连接）
与 LEFT JOIN 相反，RIGHT JOIN 返回 右表的所有记录，如果左表中没有匹配项，则 NULL 代替。
```sql
SELECT users.id, users.name, orders.amount
FROM users
RIGHT JOIN orders ON users.id = orders.user_id;
```
即使 users 没有匹配的用户，orders 数据仍然会返回。

### 4. FULL JOIN（全连接）
MySQL 不支持 FULL JOIN，但可用 LEFT JOIN + UNION + RIGHT JOIN 替代：
```sql
SELECT users.id, users.name, orders.amount
FROM users
LEFT JOIN orders ON users.id = orders.user_id
UNION
SELECT users.id, users.name, orders.amount
FROM users
RIGHT JOIN orders ON users.id = orders.user_id;
```

### 5. CROSS JOIN（交叉连接）
CROSS JOIN 返回 两个表的笛卡尔积（即所有可能的组合）。
```sql
SELECT users.id, users.name, orders.amount
FROM users
CROSS JOIN orders;
```
如果 users 有 10 条记录，orders 有 5 条记录，结果集将有 10 × 5 = 50 条记录！

## 组合查询
使用 UNION 来组合两个查询，如果第一个查询返回 M 行，第二个查询返回 N 行，那么组合查询的结果一般为 M+N 行。

每个查询必须包含相同的列、表达式和聚集函数。

默认会去除相同行，如果需要保留相同行，使用 UNION ALL。

只能包含一个 ORDER BY 子句，并且必须位于语句的最后
```sql
SELECT name FROM test UNION SELECT name FROM new_test;
```

## 视图
视图是虚拟的表，本身不包含数据，也就不能对其进行索引操作。

对视图的操作和对普通表的操作一样。

视图具有如下好处:
- 简化复杂的 SQL 操作，比如复杂的连接；
- 只使用实际表的一部分数据；
- 通过只给用户访问视图的权限，保证数据的安全性；
- 更改数据格式和表示。
```sql
CREATE VIEW myview AS
SELECT name FROM test WHERE age > 18;
```

## 存储过程
存储过程可以看成是对一系列 SQL 操作的批处理。

使用存储过程的好处:

- 代码封装，保证了一定的安全性；
- 代码复用；
- 由于是预先编译，因此具有很高的性能。

命令行中创建存储过程需要自定义分隔符，因为命令行是以 ; 为结束符，而存储过程中也包含了分号，因此会错误把这部分分号当成是结束符，造成语法错误。

包含 in、out 和 inout 三种参数。

给变量赋值都需要用 select into 语句。

每次只能给一个变量赋值，不支持集合的操作。
```sql
DELIMITER //

CREATE PROCEDURE myprocedure( OUT ret INT )
BEGIN
DECLARE y INT;
SELECT COALESCE(SUM(age), 0) FROM test INTO y;
SELECT y*y INTO ret;
END //

DELIMITER ;

CALL myprocedure(@ret);
SELECT @ret;
```

## 游标
在存储过程中使用游标可以对一个结果集进行移动遍历。

游标主要用于交互式应用，其中用户需要对数据集中的任意行进行浏览和修改。

使用游标的四个步骤:
1. 声明游标，这个过程没有实际检索出数据；
2. 打开游标；
3. 取出数据；
4. 关闭游标；
```sql
DELIMITER //

CREATE PROCEDURE myprocedure(OUT ret INT)
BEGIN
-- 标志变量，表示游标是否到达末尾
DECLARE done BOOLEAN DEFAULT 0;
DECLARE ret VARCHAR(255);
-- 定义游标，遍历 test 表的 name 字段
DECLARE mycursor CURSOR FOR SELECT name FROM test;
-- 当游标读取不到数据（SQLSTATE '02000'，即 "NOT FOUND"）时，设置 done = 1
DECLARE CONTINUE HANDLER FOR SQLSTATE '02000' SET done = 1;

    -- 打开游标
    OPEN mycursor;
    
    REPEAT
        -- 取出当前行的 name 值存入 ret
        FETCH mycursor INTO ret;
        IF NOT done THEN
            -- 输出 ret
            SELECT ret;
        END IF;
    -- 直到 done = 1（游标读取完所有行）
    UNTIL done END REPEAT;
    
    -- 关闭游标
    CLOSE mycursor;
END //

DELIMITER ;
```

## 触发器
触发器会在某个表执行以下语句时而自动执行: DELETE、INSERT、UPDATE。

触发器必须指定在语句执行之前还是之后自动执行，之前执行使用 BEFORE 关键字，之后执行使用 AFTER 关键字。BEFORE 用于数据验证和净化，AFTER 用于审计跟踪，将修改记录到另外一张表中。

INSERT 触发器包含一个名为 NEW 的虚拟表。
```sql
CREATE TABLE new_test (
id INT AUTO_INCREMENT PRIMARY KEY,
inserted_value VARCHAR(255),  
inserted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER mytrigger
AFTER INSERT ON test
FOR EACH ROW
INSERT INTO new_test (inserted_value) VALUES (NEW.name);
```
DELETE 触发器包含一个名为 OLD 的虚拟表，并且是只读的。

UPDATE 触发器包含一个名为 NEW 和一个名为 OLD 的虚拟表，其中 NEW 是可以被修改的，而 OLD 是只读的。

MySQL 不允许在触发器中使用 CALL 语句，也就是不能调用存储过程。

## 事务管理
基本术语:
- 事务(transaction)指一组 SQL 语句；
- 回退(rollback)指撤销指定 SQL 语句的过程；
- 提交(commit)指将未存储的 SQL 语句结果写入数据库表；
- 保留点(savepoint)指事务处理中设置的临时占位符(placeholder)，你可以对它发布回退(与回退整个事务处理不同)。

不能回退 SELECT 语句，回退 SELECT 语句也没意义；也不能回退 CREATE 和 DROP 语句。

MySQL 的事务提交默认是隐式提交，每执行一条语句就把这条语句当成一个事务然后进行提交。当出现 START TRANSACTION 语句时，会关闭隐式提交；当 COMMIT 或 ROLLBACK 语句执行后，事务会自动关闭，重新恢复隐式提交。

通过设置 autocommit 为 0 可以取消自动提交；autocommit 标记是针对每个连接而不是针对服务器的。

如果没有设置保留点，ROLLBACK 会回退到 START TRANSACTION 语句处；如果设置了保留点，并且在 ROLLBACK 中指定该保留点，则会回退到该保留点。
```sql
START TRANSACTION
// ...
SAVEPOINT delete1
// ...
ROLLBACK TO delete1
// ...
COMMIT
```

## 字符集
基本术语:
- 字符集为字母和符号的集合；
- 编码为某个字符集成员的内部表示；
- 校对字符指定如何比较，主要用于排序和分组。

除了给表指定字符集和校对外，也可以给列指定:
```sql
CREATE TABLE test(
name VARCHAR(20)
)ENGINE = InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
可以在排序、分组时指定校对:
```sql
SELECT *FROM test
ORDER BY name COLLATE utf8mb4_unicode_ci;
```

## 权限管理
MySQL 的账户信息保存在 mysql 这个数据库中。
```sql
USE mysql;
SELECT user FROM user;
```

### 创建账户
新创建的账户没有任何权限。
```sql
CREATE USER myuser IDENTIFIED BY 'mypassword';
```

### 修改账户名
```sql
RENAME myuser TO newuser;
```

### 删除账户
```sql
DROP USER myuser;
```

### 查看权限
```sql
SHOW GRANTS FOR myuser;
```

### 授予权限
账户用 username@host 的形式定义，username@% 使用的是默认主机名。
```sql
GRANT SELECT, INSERT ON mydatabase.* TO myuser;
```

### 删除权限
GRANT 和 REVOKE 可在几个层次上控制访问权限:
- 整个服务器，使用 GRANT ALL 和 REVOKE ALL；
- 整个数据库，使用 ON database.*；
- 特定的表，使用 ON database.table；
- 特定的列；
- 特定的存储过程。
```sql
REVOKE SELECT, INSERT ON mydatabase.* FROM myuser;
```

### 更改密码
必须使用 Password() 函数
```sql
SET PASSWROD FOR myuser = Password('new_password');
```