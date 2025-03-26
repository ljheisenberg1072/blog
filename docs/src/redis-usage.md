---
outline: deep
---

> 安装参考[【文档】](https://www.ljheisenberg.cn/linux-server-deployment-from-scratch.html#_5-安装redis)

Redis 是一个开源的、基于内存的数据结构存储系统，它可以用作数据库、缓存、消息代理等。Redis 支持丰富的数据结构，如字符串、哈希、列表、集合、有序集合等，且操作速度非常快，因此被广泛应用于高性能、高并发的应用场景。

## Redis的使用场景

Redis 由于其高性能和灵活的功能，广泛应用于各种场景，包括：

**缓存**：Redis 是最常见的缓存系统，它能够将数据存储在内存中，提高系统访问速度。

**会话管理**：很多网站使用 Redis 来存储用户的会话数据，以便快速获取用户信息。

**消息队列**：Redis 的列表和发布/订阅功能使它成为一个高效的消息队列系统。

**计数器**：使用 Redis 的字符串类型和原子操作，可以方便地实现高效的计数器。

**排行榜**：通过 Redis 的有序集合，可以轻松实现实时排行榜等功能。

**实时数据分析**：Redis 提供的 HyperLogLog 和位图等功能，可以用于进行实时的数据统计和分析。

**分布式锁**：Redis 可用作分布式锁的实现，通过 SETNX 和 EXPIRE 等命令来实现高效的分布式锁机制。

## 1. Key（键操作）
| 命令                    | 	作用                    |
|:----------------------|:-----------------------|
| DEL key	              | 删除 key                 |
| DUMP key	             | 序列化 key                |
| EXISTS key	           | 检查 key 是否存在            |
| EXPIRE key seconds	   | 设置 key 过期时间            |
| TTL key	              | 查询 key 剩余过期时间          |
| PERSIST key	          | 移除 key 的过期时间           |
| TYPE key	             | 查看 key 类型              |
| RENAME key newkey	    | 重命名 key                |
| RENAMENX key newkey	  | 如果newkey不存在，重命名key     |

示例：
```bash
SET mykey "hello"
EXISTS mykey    # 1
DEL mykey
EXISTS mykey    # 0
```

## 2. String（字符串）

### 使用场景
- **缓存数据**：常用于缓存数据库查询结果、网页内容、API 调用结果等。
- **计数器**：常用于实现计数器、限制访问频率、请求计数等。可以利用 Redis 提供的原子自增（INCR）功能。
- **令牌生成**：生成唯一标识符，如用于生成会话 ID、令牌等。
- **存储简单值**：如存储用户的基本信息（用户 ID、用户名等）。

### 优点
- 直接支持大部分常见的数值操作（如自增、自减、取值等），并且具有较好的性能。
- 内存消耗低，效率高。

| 命令	                            | 作用                     |
|:-------------------------------|:-----------------------|
| SET key value	                 | 设置字符串值                 |
| GET key	                       | 获取字符串值                 |
| SETEX key seconds value	       | 设置带有过期时间的值             |
| MSET key1 value1 key2 value2	  | 批量设置                   |
| MGET key1 key2	                | 批量获取                   |
| INCR key	                      | 自增 1                   |
| DECR key	                      | 自减 1                   |
| INCRBY key num	                | 按 num 增加               |
| DECRBY key num	                | 按 num 减少               |
| APPEND key value	              | 追加字符串                  |
| GETSET key value	              | 先获取旧值，再设置新值            |

示例：
```bash
SET count 10
INCR count    # 11
INCRBY count 5  # 16
APPEND message " world"
GET message    # "hello world"
```

## 3. Hash（哈希）

### 使用场景
- **存储对象数据**：适合存储结构化的数据，例如用户信息、商品属性等。可以将对象的每个字段作为哈希的不同字段，减少内存消耗。
- **用户会话管理**：在 Web 应用中，可以将用户的会话信息存储在哈希表中。

### 优点
- 在内存中高效地存储字段和值的映射。
- 支持快速获取和修改单个字段，不需要获取整个对象。
- 可以减少存储空间，相比于使用多个 SET 命令，哈希结构更加节省内存。

| 命令	                                    | 作用                        |
|:---------------------------------------|:--------------------------|
| HSET key field value	                  | 设置哈希字段                    |
| HGET key field	                        | 获取哈希字段值                   |
| HDEL key field	                        | 删除哈希字段                    |
| HEXISTS key field	                     | 检查字段是否存在                  |
| HGETALL key	                           | 获取所有字段和值                  |
| HINCRBY key field num	                 | 使字段值增加 num                |
| HMSET key field1 value1 field2 value2	 | 批量设置                      |
| HMGET key field1 field2	               | 批量获取                      |
| HKEYS key	                             | 获取哈希表所有字段                 |
| HVALS key	                             | 获取哈希表所有值                  |

示例：
```bash
HSET user:1001 name "Alice"
HSET user:1001 age 25
HGET user:1001 name    # "Alice"
HINCRBY user:1001 age 5  # 30
HGETALL user:1001
```

## 4. List（列表）

### 使用场景
- **消息队列**：利用 Redis 的列表结构可以构建高效的消息队列。LPUSH 和 RPOP 操作可以实现队列的入队和出队。
- **任务调度**：将任务放入列表，在后端工作线程按顺序处理任务。
- **最近访问的日志/历史记录**：可以用于保存用户的浏览历史、操作日志等，结合 LTRIM 操作来维护固定长度的队列。

### 优点
- 可以实现 FIFO（先进先出）队列，适合用于消息队列、任务队列等场景。
- 支持高效的尾部插入和头部删除。

| 命令	                               | 作用                           |
|:----------------------------------|:-----------------------------|
| LPUSH key value	                  | 向列表左侧添加元素                    |
| RPUSH key value	                  | 向列表右侧添加元素                    |
| LPOP key	                         | 从列表左侧移除并返回元素                 |
| RPOP key	                         | 从列表右侧移除并返回元素                 |
| LLEN key	                         | 获取列表长度                       |
| LRANGE key start stop	            | 获取列表指定区间的元素                  |
| LREM key count value	             | 从列表中删除指定数量的元素                |
| LSET key index value	             | 设置指定位置的元素                    |
| LINDEX key index	                 | 获取指定位置的元素                    |
| RPOPLPUSH source destination	     | 从源列表移除并推送到目标列表               |

示例：
```bash
LPUSH queue "task1"
LPUSH queue "task2"
RPUSH queue "task3"
LRANGE queue 0 -1  # ["task2", "task1", "task3"]
LPOP queue  # "task2"
```

## 5. Set（集合，无序）

### 使用场景
- **去重操作**：用于去除重复元素，例如用户点赞、访问记录等。
- **推荐系统**：利用集合可以构建基于兴趣的推荐系统，基于用户的兴趣集合与其他用户进行对比。
- **实时分析**：如统计在线用户、活动用户等。

### 优点
- 集合中的元素是唯一的，自动去重。
- 支持高效的集合操作，如并集、交集、差集等。

| 命令	                              | 作用                               |
|:---------------------------------|:---------------------------------|
| SADD key value	                  | 向集合中添加元素                         |
| SREM key value	                  | 从集合中移除元素                         |
| SMEMBERS key	                    | 获取集合中的所有成员                       |
| SISMEMBER key value	             | 判断元素是否在集合中                       |
| SCARD key	                       | 获取集合的成员数                         |
| SINTER key1 key2	                | 获取两个集合的交集                        |
| SUNION key1 key2	                | 获取两个集合的并集                        |
| SDIFF key1 key2	                 | 获取两个集合的差集                        |
| SMOVE source destination member	 | 从一个集合移动成员到另一个集合                  |
| SPOP key	                        | 随机移除并返回集合中的一个元素                  |
| SRANDMEMBER key	                 | 随机返回集合中的一个元素（不移除）                |

示例：
```bash
SADD users "Alice" "Bob"
SISMEMBER users "Alice"  # 1
SCARD users  # 2
```

## 6. ZSet（有序集合/Sorted Set）

### 使用场景
- **排行榜**：有序集合是实现实时排行榜、分数排名等的理想数据结构。通过分数排序，可以非常方便地管理和显示排行榜数据。
- **延时队列**：通过设置时间戳作为分数，可以实现延时队列功能，按时间顺序处理任务。
- **带权重的推荐系统**：通过分数来表示权重，结合有序集合来实现基于权重的推荐系统。

### 优点
- 支持元素的排序，并且可以通过分数来精确控制排序顺序。
- 支持高效的范围查询，可以获取特定范围内的元素。

| 命令	                                    | 作用                             |
|:---------------------------------------|:-------------------------------|
| ZADD key score member	                 | 向有序集合中添加成员                     |
| ZREM key member	                       | 从有序集合中移除成员                     |
| ZINCRBY key increment member	          | 增加有序集合中成员的分数                   |
| ZRANGE key start stop [WITHSCORES]	    | 获取有序集合指定区间内的成员                 |
| ZREVRANGE key start stop [WITHSCORES]	 | 获取有序集合指定区间内的成员（倒序）             |
| ZCARD key	                             | 获取有序集合成员数量                     |
| ZCOUNT key min max	                    | 获取有序集合中指定分数范围的成员数量             |
| ZLEXCOUNT key min max	                 | 获取有序集合中指定字典序范围的成员数量            |
| ZRANK key member	                      | 获取有序集合中成员的排名                   |
| ZREVRANK key member	                   | 获取有序集合中成员的倒序排名                 |

示例：
```bash
ZADD leaderboard 100 "Alice"
ZADD leaderboard 200 "Bob"
ZRANK leaderboard "Alice"  # 1
ZRANGE leaderboard 0 -1 WITHSCORES
```

## 7. 位图（Bitmap）

### 使用场景
- **统计用户行为**：如记录用户的每日活跃状态，可以使用位图来表示每个用户是否活跃，节省内存。
- **布隆过滤器**：用于实现高效的集合判断，判断某个元素是否在一个大集合中。
- **实现某些计数操作**：如统计特定用户的活跃天数。

### 优点
- 位图占用的内存非常小，可以高效地表示布尔值数据。
- 可以进行位运算，如与、或、非等，操作简单且高效。

| 命令	                                                                                     | 作用                                             |
|:----------------------------------------------------------------------------------------|:-----------------------------------------------|
| SETBIT key offset value	                                                                | 设置位图中的某个位置的位值                                  |
| GETBIT key offset	                                                                      | 获取位图中某个位置的位值                                   |
| BITCOUNT key [start end]	                                                               | 计算位图中被设置为 1 的位数                                |
| BITOP operation destkey key [key ...]	                                                  | 执行位图的位级操作（如与、或、异或等）。可以对多个位图进行操作并将结果存储在目标键中     |
| BITFIELD key [GET type offset] [SET type offset value] [INCRBY type offset increment]	  | 对位图执行更复杂的操作，支持获取、设置、增量操作等                      |
| BITPOS key bit [start] [end]	                                                           | 查找位图中某个值（0 或 1）第一次出现的位置。可以指定起始和结束范围            |

示例：
```bash
SETBIT mybitmap 7 1
GETBIT mybitmap 7
BITCOUNT mybitmap
```

## 8. 事务（Transactions）
| 命令	                                    | 作用                           |
|:---------------------------------------|:-----------------------------|
| ZADD key score member	                 | 向有序集合中添加成员                   |
| ZREM key member	                       | 从有序集合中移除成员                   |
| ZINCRBY key increment member	          | 增加有序集合中成员的分数                 |
| ZRANGE key start stop [WITHSCORES]	    | 获取有序集合指定区间内的成员               |
| ZREVRANGE key start stop [WITHSCORES]	 | 获取有序集合指定区间内的成员（倒序）           |
| ZCARD key	                             | 获取有序集合成员数量                   |
| ZCOUNT key min max	                    | 获取有序集合中指定分数范围的成员数量           |
| ZLEXCOUNT key min max	                 | 获取有序集合中指定字典序范围的成员数量          |
| ZRANK key member	                      | 获取有序集合中成员的排名                 |
| ZREVRANK key member	                   | 获取有序集合中成员的倒序排名               |

示例：
```bash
MULTI
SET user:1:name "Alice"
SET user:1:age 25
EXEC
```

## 9. 发布/订阅（Pub/Sub）
| 命令	                              | 作用                          |
|:---------------------------------|:----------------------------|
| PUBLISH channel message	         | 发布消息                        |
| SUBSCRIBE channel	               | 订阅频道                        |
| UNSUBSCRIBE channel	             | 取消订阅                        |
| PSUBSCRIBE pattern	              | 订阅匹配模式的频道                   |
| PUNSUBSCRIBE pattern	            | 取消订阅匹配模式的频道                 |

示例：
```bash
# 终端1：
SUBSCRIBE news

# 终端2：
PUBLISH news "Breaking News!"
```

## 10. 持久化
| 命令	                             | 作用                        |
|:--------------------------------|:--------------------------|
| SAVE	                           | 立即保存数据到磁盘（阻塞）             |
| BGSAVE	                         | 后台异步保存数据                  |
| LASTSAVE	                       | 获取最近一次保存时间                |
| SHUTDOWN	                       | 关闭Redis服务器                |
| BGREWRITEAOF	                   | 后台重写AOF文件                 |
| SYNC	                           | 同步AOF文件到磁盘                |
| FLUSHDB	                        | 清空当前数据库                   |
| FLUSHALL	                       | 清空所有数据库                   |

## 11. 脚本（Lua）
| 命令	                              | 作用                         |
|:---------------------------------|:---------------------------|
| EVAL script numkeys key [arg]	   | 执行 Lua 脚本                  |
| EVALSHA sha1 numkeys key [arg]	  | 执行已缓存的 Lua                 |

示例：
```bash
EVAL "return redis.call('SET', KEYS[1], ARGV[1])" 1 mykey "value"
```

## 12. HyperLogLog（基数估算）

### 使用场景
- **基数统计**：用于统计唯一元素的数量，如独立访问者、独立IP等。相比传统的数据结构，HyperLogLog 占用的内存非常小。
- **实时统计**：如统计网页的独立访问者数，而不需要存储所有用户的标识信息。

### 优点
- 内存消耗非常低，适合进行基数估算。
- 适合用来处理大规模的数据去重操作。

| 命令	                             | 作用                       |
|:--------------------------------|:-------------------------|
| PFADD key value	                | 添加元素到 HyperLogLog        |
| PFCOUNT key	                    | 获取 HyperLogLog 的基数估算     |
| PFMERGE destkey key1 key2	      | 合并多个 HyperLogLog         |

示例：
```bash
PFADD visits "user1" "user2" "user3"
PFCOUNT visits  3
```

## 13. GEO（地理位置）
| 命令	                                            | 作用                            |
|:-----------------------------------------------|:------------------------------|
| GEOADD key longitude latitude member	          | 添加地理位置数据                      |
| GEODIST key member1 member2	                   | 计算两点间的距离                      |
| GEORADIUS key longitude latitude radius unit	  | 查询指定半径内的地理位置                  |
| GEOHASH key member	                            | 获取地理位置的哈希值                    |

示例：
```bash
GEOADD cities 116.40 39.90 "Beijing"
GEODIST cities "Beijing" "Shanghai" km
```

## 14. 流（Stream）

### 使用场景
- **事件驱动架构**：用于处理和存储实时事件数据流，如日志系统、消息传递系统。
- **实时数据处理**：用于处理大量的实时数据流，类似于日志队列的功能。
  
### 优点
- 流提供了顺序的、持久的、可扩展的事件存储方式。
- 支持消费者组，适合多消费者模式。

| 命令	                                                                           | 作用                                                                      |
|:------------------------------------------------------------------------------|:------------------------------------------------------------------------|
| XADD key [ID] field1 value1 [field2 value2 ...]	                              | 向流中添加一条新消息。如果指定了 ID，则使用该 ID 作为消息的唯一标识符，否则 Redis 会自动生成 ID                |
| XREAD [BLOCK milliseconds] [COUNT count] STREAMS key [key ...] ID [ID ...]	   | 读取流中的消息。可以指定一个或多个流，按时间顺序读取新消息                                           |
| XREADGROUP GROUP groupname consumer STREAMS key [key ...] ID [ID ...]	        | 消费者组从流中读取消息。消费者组使得多个消费者可以共享处理流中的消息，每个消息只会被一个消费者处理                       |
| XACK key group ID [ID ...]	                                                   | 确认已处理的消息。只有在消费者组中读取并处理过的消息，才能使用该命令标记为已处理                                |
| XDEL key ID [ID ...]	                                                         | 删除指定的消息 ID。如果流中有过期消息或不需要的消息，可以使用该命令删除                                   |
| XTRIM key MAXLEN ~count	                                                      | 修剪流，保留最新的 count 条消息。如果流的长度超出指定的最大值，超出部分的消息将被删除。可以用于实现有限长度的日志队列          |
| XPENDING key group [start end count] [consumer]	                              | 查询消费者组中待处理的消息。可以查看尚未确认的消息、它们的 ID 和被哪些消费者处理                              |
| XINFO STREAM key	                                                             | 获取流的元数据，包括流的长度、最后一条消息的 ID、消息数等信息                                        |