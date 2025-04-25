---
outline: deep
---

## 简单 Node.js 微服务示例结构

- 用户服务（user-service）
- 商品服务（product-service）
- API 网关（api-gateway）
- 使用 REST API 通信
- 使用 JWT 做简单认证
- 使用 Redis 做用户缓存
- 使用 RabbitMQ 做消息队列

## 项目结构
```pgsql
microservices-example/
│
├── api-gateway/
│   └── index.js
│
├── user-service/
│   └── index.js
│
├── product-service/
│   └── index.js
│
└── shared/
    ├── utils/jwt.js
    └── utils/redis.js
```

## 各服务说明

### `api-gateway/index.js`

```js
const express = require('express');
const axios = require('axios');
const { verifyToken } = require('../shared/utils/jwt');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 认证中间件
app.use((req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Missing token' });

    try {
        req.user = verifyToken(token);
        next();
    } catch (e) {
        res.status(401).json({ message: 'Invalid token' });
    }
});

// 代理用户服务
app.get('/users/:id', async (req, res) => {
    const result = await axios.get(`http://localhost:3001/users/${req.params.id}`);
    res.json(result.data);
});

// 代理商品服务
app.get('/products/:id', async (req, res) => {
    const result = await axios.get(`http://localhost:3002/products/${req.params.id}`);
    res.json(result.data);
});

app.post('/product', async (req, res) => {
    const result = await axios.post(`http://localhost:3002/product`, req.body, {
        headers: { 'Content-Type': 'application/json'}
    });
    res.json(result.data);
});

app.listen(3000, () => console.log('API Gateway on port 3000'));
```

### `user-service/index.js`

```js
const express = require('express');
const redis = require('../shared/utils/redis');
const { signToken } = require('../shared/utils/jwt');
const app = express();
app.use(express.json());

app.post('/login', (req, res) => {
    const { username } = req.body;
    const token = signToken({ username });
    res.json({ token });
});

app.get('/users/:id', async (req, res) => {
    const userId = req.params.id;
    const cacheKey = `user:${userId}`;

    const cached = await redis.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    const user = { id: userId, username: 'Richard' };
    await redis.set(cacheKey, JSON.stringify(user), { EX: 3600 });

    res.json(user);
});

app.listen(3001, () => console.log('User Service on port 3001'));
```

### `product-service/index.js`

```js
const express = require('express');
const redis = require('../shared/utils/redis');
const amqp = require('amqplib');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/products/:id', async (req, res) => {
    const productId = req.params.id;
    const cacheKey = `product:${productId}`;

    const cached = await redis.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    const product = { id: productId, name: 'MacBook Pro', price: 6300 };
    await redis.set(cacheKey, JSON.stringify(product), { EX: 3600 });

    res.json(product);
});

// 发布新产品消息到 RabbitMQ
app.post('/product', async (req, res) => {
    const { id, name, price } = req.body;

    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();

        const queue = 'productQueue';
        const msg = JSON.stringify({ id, name, price });

        await channel.assertQueue(queue, { durable: false });
        await channel.sendToQueue(queue, Buffer.from(msg));

        console.log(" [x] Sent %s", msg);

        await channel.consume(queue, (msg) => {
            console.log("Received message in product-service: ", msg.content.toString());
        }, { noAck: true });

        res.status(201).json({ message: 'Product created and message sent' });
    } catch (error) {
        console.error('RabbitMQ error:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

app.listen(3002, () => console.log('Product Service on port 3002'));
```

### `shared/utils/jwt.js`

```js
const jwt = require('jsonwebtoken');
const secret = 'microservice-secret';

function signToken(payload) {
    return jwt.sign(payload, secret, { expiresIn: '1h' });
}

function verifyToken(token) {
    return jwt.verify(token, secret);
}

module.exports = { signToken, verifyToken };
```

### `shared/utils/redis.js`

```js
const redis = require('redis');
const client = redis.createClient();

client.on('error', (err) => console.error('Redis error:', err));
client.connect();

module.exports = client;
```

## 启动命令（在各文件夹中）

```bash
# 在 shared/ 中
npm install jsonwebtoken redis

# 在 api-gateway/ 中
npm install express axios
# 启动
node index.js

# 在 user-service/ 中
npm install express
# 启动
node index.js

# 在 product-service/ 中
npm install express amqpli
# 启动
node index.js
```

## 测试流程

### 登录获取 Token：

```bash
POST http://localhost:3001/login
Body: { "username": "richard" }
```

### 用 Token 访问 API Gateway：

```bash
GET http://localhost:3000/users/123
Authorization: Bearer <your-token>
```