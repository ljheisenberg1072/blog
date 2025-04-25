---
outline: deep
---

## 1. Node.js 基础

### Node.js 是什么？它的特点是什么？

Node.js 是一个 基于 V8 引擎的 JavaScript 运行时，采用 事件驱动 和 非阻塞 I/O，适用于高并发应用，如 API、实时通信、微服务 等。

**特点**：

- 单线程，事件驱动（基于 libuv）
- 异步非阻塞 I/O（适用于高并发）
- V8 引擎（执行速度快）
- 内置模块（如 fs、http、crypto）

### Node.js 与 JavaScript 在浏览器端的区别？

| 对比项	                | Node.js	                         | 浏览器端 JavaScript               |
|:--------------------|:---------------------------------|:------------------------------|
| 运行环境	               | 服务器端	                            | 浏览器                           |
| 全局对象	               | global、process	                  | window、document               |
| 模块系统	               | CommonJS（require）或 ES Modules	   | ES Modules（import/export）     |
| API	                | fs、http、os	                      | DOM、fetch、localStorage        |
| 事件循环	               | Libuv 事件循环	                      | 浏览器事件循环                       |
| 安全性	                | 无沙盒，完全访问系统资源	                    | 受浏览器沙盒保护                      |
| 使用场景	               | 服务器端、CLI、物联网	                    | 前端开发、Web UI                   |

### Node.js 如何处理高并发？

Node.js 使用 **事件循环（Event Loop）+ 非阻塞 I/O** 来处理高并发：

```js
const http = require('http');

const server = http.createServer((req, res) => {
setTimeout(() => {
res.end('Hello, World!');
}, 1000); // 模拟异步操作
});

server.listen(3000, () => {
console.log('Server running on port 3000');
});
```
- 采用 **单线程 + 事件循环**，让 I/O 操作（如数据库、网络请求）异步执行，不阻塞主线程。

**为什么 Node.js 适用于高并发？**
- **单线程** 避免了线程同步问题
- **事件驱动** 让 I/O 任务不会阻塞
- **异步非阻塞 I/O** 允许处理大量并发请求

### 什么是单线程？Node.js 为什么是单线程？

**单线程（Single Thread）** 指的是在同一时间内，**程序只能执行一个任务**，而不是并行执行多个任务。

在单线程模型中：

- 代码按照**顺序执行**，一个任务完成后才会执行下一个任务。
- 如果当前任务耗时过长（如 I/O 操作、数据库查询），后续任务需要等待，可能导致程序**阻塞（Blocking）**。

`Node.js` 之所以采用单线程，主要是为了避免多线程编程的复杂性，提高性能，并利用事件驱动和异步 I/O 实现高并发。

#### 1. JavaScript 语言特性

Node.js 的核心运行环境是基于 JavaScript，而 JavaScript 早期主要运行在浏览器中，它本身就是单线程的（避免多个线程同时操作 DOM，导致数据竞争和复杂的同步问题）。

#### 2. 事件驱动和非阻塞 I/O

Node.js 采用 事件驱动（Event-Driven） 和 非阻塞 I/O（Non-Blocking I/O） 机制，通过 事件循环（Event Loop） 来管理任务，而不是使用多线程。

#### 3. 避免多线程编程的复杂性

- 多线程编程涉及：
- 线程同步（避免数据竞争）
- 死锁（多个线程互相等待资源）
- 上下文切换的开销（线程调度）

#### 4. 适用于高并发场景

由于 Node.js 采用 异步非阻塞 I/O，即使是单线程，它依然可以处理大量并发请求，适用于：

- Web 服务器（如 Express/Koa）
- API 网关
- 微服务架构
- WebSocket（如聊天应用）

### Node.js 的模块系统有哪些？区别是什么？（CommonJS vs ESM）

Node.js 主要支持 **两种模块系统**：

- **CommonJS（CJS）** —— 传统的 Node.js 模块系统，使用 require() 和 module.exports。
- **ES Modules（ESM）** —— ECMAScript 标准化的模块系统，使用 import 和 export，Node.js 在 v12 及以上支持。

此外，Node.js 还有：

- **内置模块**（如 fs、http、path）
- **第三方模块**（如 express，通过 npm 安装）
- **本地模块**（用户自己编写的模块）

#### 1. CommonJS（CJS）

CommonJS 是 Node.js 默认的模块系统，基于同步加载 (require())，适用于服务器端。

#### 2. ES Modules（ESM）

ES Modules 是 ECMAScript 官方标准，使用 import/export 进行模块化，适用于浏览器和 Node.js。

#### 3. CommonJS vs ESM 对比

| 对比项	           | CommonJS (CJS)	              | ES Modules (ESM)         |
|:---------------|:-----------------------------|:-------------------------|
| 导入语法	          | const mod = require('mod')	  | import mod from 'mod'    
| 导出语法	          | module.exports = {...}	      | export / export default  
| 加载方式	          | 同步加载	                        | 异步加载                     |
| 执行时机	          | 运行时解析	                       | 编译时解析                    |
| Tree Shaking	  | ❌ 不支持                        | 	✅ 支持                    |
| 适用环境	          | Node.js 服务器端                 | 	浏览器 & 现代 Node.js        |
| 支持顶层 await     | 	❌ 不支持                       | 	✅ 支持                    |
| 是否默认支持	        | ✅ 默认支持	                      | ❌ 需要手动配置                 |
| 是否可在 if 内使用    | 	✅ require() 可放在 if 语句中      | 	❌ import 不能放在 if 里      |

#### 4. Node.js 中如何使用 ESM

Node.js 默认使用 CommonJS，要使用 ES Modules，需要：

- 使用 .mjs 扩展名
- 或者在 package.json 中添加 "type": "module"

**如何在 ESM 中使用 CommonJS？**

可以使用 import() 进行动态导入：

```js
const math = await import('./math.cjs');
console.log(math.add(2, 3));
```

**如何在 CommonJS 中使用 ESM？**

CommonJS 不能直接 require() ESM，但可以使用 import()：

```js
(async () => {
    const { add } = await import('./math.mjs');
    console.log(add(2, 3));
})();
```

#### 5. 何时使用 CommonJS，何时使用 ESM？

✅ 使用 CommonJS（CJS）：

- 旧的 Node.js 项目（兼容性好）
- 依赖大量 CommonJS 库（如 express、lodash）
- 需要 require() 进行动态导入

✅ 使用 ES Modules（ESM）：

- 现代前端项目（React、Vue、Svelte）
- 现代 Node.js 项目（适用于 Tree Shaking 和顶层 await）
- 需要跨平台（浏览器 & Node.js）兼容

### 如何创建一个简单的 HTTP 服务器？

```js
const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello, World!\n');
});

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});
```

**代码解析**

1. **引入 `http` 模块**：const http = require('http');
2. **创建服务器**：http.createServer((req, res) => {...})
   - `req`：请求对象（包含 URL、方法、头部等）
   - `res`：响应对象（用于返回数据）
3. **设置 HTTP 响应头**：res.writeHead(200, { 'Content-Type': 'text/plain' });
4. **发送响应数据**：res.end('Hello, World!\n');
5. **监听端口**：server.listen(3000, () => {...});


### Node.js 适合用于 CPU 密集型任务吗？如何优化？

不适合直接用于 CPU 密集型任务，但可以通过优化策略使其在 CPU 密集型任务中表现更好。

#### 1. 为什么 Node.js 不适合 CPU 密集型任务？

Node.js 是单线程的，基于 Event Loop 和 非阻塞 I/O 进行任务调度：

- 适合 I/O 密集型任务（如 Web 服务器、数据库操作）。
- 不擅长 CPU 密集型任务（如图像处理、加密、数据分析），因为单线程会阻塞主线程，导致请求无法及时响应。

#### 2. 如何优化 CPU 密集型任务？

##### 方案 1：使用 worker_threads 开启多线程

`worker_threads` 模块允许 Node.js 运行多个线程，并充分利用多核 CPU。

示例：使用 `worker_threads` 处理 CPU 任务

```js
const { Worker, isMainThread, parentPort } = require('worker_threads');

if (isMainThread) {
    const http = require('http');

    const server = http.createServer((req, res) => {
        if (req.url === '/compute') {
            const worker = new Worker(__filename);
            worker.on('message', result => {
                res.end(`Sum: ${result}`);
            });
            worker.postMessage('start');
        } else {
            res.end('Hello, World!');
        }
    });

    server.listen(3000, () => console.log('Server running at http://localhost:3000/'));
} else {
    // Worker 线程执行的任务
    parentPort.on('message', () => {
        let sum = 0;
        for (let i = 0; i < 1e9; i++) {
            sum += i;
        }
        parentPort.postMessage(sum);
    });
}

```

**优势**：

- 主线程不会被阻塞，服务器仍能处理其他请求。
- 充分利用 CPU 多核性能，并行计算加速任务。

##### 方案 2：使用 child_process 进行多进程计算

`child_process` 创建子进程，适用于计算密集型任务。

示例：使用 `child_process.fork()`

```js
const { fork } = require('child_process');
const http = require('http');

const server = http.createServer((req, res) => {
    if (req.url === '/compute') {
        const computeProcess = fork('./compute.js');
        computeProcess.send('start');
        computeProcess.on('message', result => {
            res.end(`Sum: ${result}`);
        });
    } else {
        res.end('Hello, World!');
    }
});

server.listen(3000, () => console.log('Server running at http://localhost:3000/'));

```

子进程文件 `compute.js`：

```js
process.on('message', () => {
    let sum = 0;
    for (let i = 0; i < 1e9; i++) {
        sum += i;
    }
    process.send(sum);
});
```

**优势**：

- 子进程独立运行，不会阻塞主线程。
- 可以创建多个子进程，提高并发能力。

##### 方案 3：使用 Cluster 进行负载均衡

`cluster` 模块可以在多个 CPU 核心上运行多个 Node.js 进程，提高并发处理能力。

示例：使用 `cluster` 进行负载均衡

```js
const cluster = require('cluster');
const http = require('http');
const os = require('os');

if (cluster.isMaster) {
    const numCPUs = os.cpus().length;
    console.log(`Master process is running, forking ${numCPUs} workers...`);

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker) => {
        console.log(`Worker ${worker.process.pid} died`);
        cluster.fork(); // 重新启动 worker
    });
} else {
    http.createServer((req, res) => {
        let sum = 0;
        for (let i = 0; i < 1e9; i++) {
            sum += i;
        }
        res.end(`Worker ${process.pid}: Sum: ${sum}`);
    }).listen(3000, () => console.log(`Worker ${process.pid} started`));
}
```

**优势**：

- 充分利用多核 CPU，每个核心运行一个独立的 Node.js 进程。
- 进程崩溃时自动重启，提高稳定性。

##### 方案 4：使用 WebAssembly (WASM)

如果 CPU 密集型任务计算逻辑复杂，可以使用 WebAssembly（WASM）来提高性能：

- 计算任务用 C/C++/Rust 编写，然后编译为 WASM。
- Node.js 调用 WebAssembly 进行计算，提高执行效率。

```js
const fs = require('fs');
const wasmBuffer = fs.readFileSync('./compute.wasm');

WebAssembly.instantiate(wasmBuffer).then(wasmModule => {
    const compute = wasmModule.instance.exports.compute;
    console.log(compute(1000000000)); // 调用 WebAssembly 计算
});
```

**优势**：

- WebAssembly 运行速度接近 C/C++，比 JavaScript 快很多。
- 适合计算密集型任务，如 加密、图像处理、AI 计算。

##### 最佳实践

- **短时间 CPU 计算** 👉 worker_threads
- **长时间计算任务** 👉 child_process
- **Web 服务器高并发处理** 👉 cluster
- **极致性能优化** 👉 WebAssembly

## 2. 事件循环（Event Loop）

### Node.js 的事件循环是什么？事件循环的 6 个阶段是什么？

Node.js 是单线程的，它通过事件驱动的方式处理异步操作。

事件循环（Event Loop）是Node.js 处理异步任务的核心机制，它决定了何时执行异步代码。

事件循环的核心作用：

- 让 **非阻塞 I/O**（如文件读写、网络请求）能够并行执行。
- 通过**任务队列**（Queue）调度异步任务。
- 使 **Promise**、`setTimeout()`、`process.nextTick()` 等异步操作按照特定顺序执行。

- **Timers（定时器阶段）** → 执行 setTimeout() 和 setInterval() 回调
- **I/O callbacks（I/O 回调阶段）** → 处理上一轮事件循环延迟的 I/O 任务
- **Idle, prepare（空闲阶段）** → 内部使用
- **Poll（轮询阶段） → 核心阶段**，处理大部分 I/O 任务
- **Check（检查阶段）** → 执行 setImmediate()
- **Close callbacks（关闭回调阶段）** → 执行 close 事件回调

### process.nextTick() 和 setImmediate() 有什么区别？

```js
setImmediate(() => console.log('setImmediate'));
process.nextTick(() => console.log('nextTick'));
console.log('sync code');
```
执行顺序：
```bash
sync code
nextTick
setImmediate
```
**解析**：

- process.nextTick() 在当前循环的 微任务队列 中执行，优先于 setImmediate()。

### setTimeout()、setImmediate()、Promise.then() 的执行顺序？

| 调用位置	                        | 执行顺序                                                                          |
|:-----------------------------|:------------------------------------------------------------------------------|
| 全局（无 I/O）	                   | process.nextTick() → Promise.then() → setTimeout(0) / setImmediate()（不确定）     |
| I/O 任务回调中	                   | I/O 回调 → process.nextTick() → Promise.then() → setImmediate() → setTimeout(0) |

**微任务（Microtask）始终优先执行**，然后才是 setImmediate() 和 setTimeout(0)，其顺序取决于事件循环的具体阶段

### 如何在 Node.js 中避免阻塞主线程？

#### 1. 使用异步 I/O 操作

Node.js 是**事件驱动、非阻塞 I/O**的，尽量使用**异步 API**（fs.readFile()、http.request() 等）而不是同步 API（fs.readFileSync()）。

🚫 阻塞的例子（同步 I/O，影响性能）
```js
const fs = require('fs');

// 读取文件时阻塞整个线程
const data = fs.readFileSync('large-file.txt', 'utf8');
console.log(data);
```

✅ 改进（异步 I/O，避免阻塞）
```js
fs.readFile('large-file.txt', 'utf8', (err, data) => {
   if (err) throw err;
   console.log(data);
});
console.log("不会被阻塞，继续执行其他任务");
```

#### 2. 使用 Worker Threads 处理 CPU 密集型任务

Node.js 适合 I/O 密集型任务，但处理 CPU 密集型任务时（如大数据计算、加密、图像处理）会阻塞主线程。可以使用 worker_threads 模块将任务移到子线程。

🚫 阻塞的例子（计算密集型任务阻塞主线程）
```js
function fibonacci(n) {
   if (n <= 1) return n;
   return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(40)); // 计算 Fibonacci(40)，会阻塞主线程
console.log("这行代码要等很久才执行");
```

✅ 改进（使用 Worker Threads 处理 CPU 密集型任务）
```js
const { Worker } = require('worker_threads');

function runWorker(workerData) {
   return new Promise((resolve, reject) => {
      const worker = new Worker('./worker.js', { workerData });
      worker.on('message', resolve);
      worker.on('error', reject);
      worker.on('exit', code => {
         if (code !== 0) reject(new Error(`Worker exited with code ${code}`));
      });
   });
}

// worker.js（单独的线程处理 Fibonacci）
const { parentPort, workerData } = require('worker_threads');
function fibonacci(n) {
   if (n <= 1) return n;
   return fibonacci(n - 1) + fibonacci(n - 2);
}
parentPort.postMessage(fibonacci(workerData));

// 主线程调用
runWorker(40).then(console.log);
console.log("不会被阻塞，主线程继续执行");
```
🔹 适用场景：数据压缩、加密、复杂计算、图像处理。

#### 3. 使用 setImmediate() 或 process.nextTick() 让出主线程

如果有长时间运行的任务，可以使用 setImmediate() 或 process.nextTick() 让出主线程，让事件循环处理其他任务。

🚫 阻塞的例子（长时间循环）
```js
console.log("Start");
for (let i = 0; i < 1e9; i++) {} // 阻塞主线程
console.log("End");
```

✅ 改进（分段执行，避免阻塞）
```js
console.log("Start");
let i = 0;
function heavyTask() {
   while (i < 1e9) {
      i++;
      if (i % 1e7 === 0) {
         setImmediate(heavyTask); // 让出主线程
         break;
      }
   }
}
heavyTask();
console.log("不会被完全阻塞");
```
🔹 适用场景：长时间循环、数据处理任务。

#### 4. 使用 Stream 处理大文件

当处理**大文件（如日志、视频）时，不要一次性读取整个文件，而是使用流（Stream）**逐块读取。

🚫 阻塞的例子（一次性读取大文件，占用大量内存）
```js
const fs = require('fs');
const data = fs.readFileSync('large-file.txt', 'utf8'); // 可能导致内存溢出
console.log(data);
```

✅ 改进（使用 Stream 逐步处理）
```js
const fs = require('fs');
const readStream = fs.createReadStream('large-file.txt', { encoding: 'utf8' });

readStream.on('data', chunk => console.log(chunk)); // 逐步读取文件，不占用大量内存
readStream.on('end', () => console.log('读取完成'));
```
🔹 适用场景：日志文件、视频流、音频处理。


#### 5. 使用 cluster 模块实现多进程

worker_threads 适合CPU 密集型任务，而 cluster 适合负载均衡，可以充分利用多核 CPU。

✅ cluster 实现多进程
```js
const cluster = require('cluster');
const http = require('http');
const os = require('os');

if (cluster.isMaster) {
    const numCPUs = os.cpus().length; // 获取 CPU 核心数
    console.log(`主进程 ${process.pid} 正在运行`);

    // Fork workers
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker) => {
        console.log(`Worker ${worker.process.pid} 已退出`);
    });
} else {
    http.createServer((req, res) => {
       res.writeHead(200);
       res.end("Hello, World!");
    }).listen(8000);

    console.log(`Worker ${process.pid} 启动`);
}
```
🔹 适用场景：Web 服务器、API 网关、大量并发请求。

#### 6. 避免 sync 方法

Node.js 的 fs, crypto, zlib 等模块都提供了 同步（xxxSync()）和 异步 方法，避免使用同步方法：

- 🚫 fs.readFileSync()
- 🚫 crypto.pbkdf2Sync()
- 🚫 zlib.gzipSync()

✅ 使用异步方法
```js
fs.readFile('file.txt', (err, data) => {
   if (err) throw err;
   console.log(data);
});
```

#### 7. 避免 JSON 大对象解析阻塞

解析大 JSON 时，JSON.parse() 可能会阻塞主线程：

```js
const jsonData = require('./large.json'); // 🚫 可能会阻塞
const data = JSON.parse(jsonData);
```

✅ 改进：使用 stream-json
```js
const { parser } = require('stream-json');
const fs = require('fs');

fs.createReadStream('large.json')
.pipe(parser())
.on('data', chunk => console.log(chunk));
```

| 方法	                                    | 适用场景                    |
|:---------------------------------------|:------------------------|
| 使用异步 I/O	                              | 读取文件、数据库、网络请求           |
| Worker Threads	                        | CPU 密集任务，如计算、压缩、加密      |
| setImmediate() / process.nextTick()	   | 长时间运行的任务拆分              |
| 使用 Stream	                             | 处理大文件、日志、视频流            |
| cluster	                               | 多核 CPU 负载均衡，适用于 Web 服务器 |
| 避免 sync 方法	                            | fs, crypto, zlib 等      |
| JSON 解析优化	                             | 解析大 JSON 文件             |

### 为什么 Node.js 适用于 I/O 密集型任务？

Node.js **天生适合 I/O 密集型任务**，原因主要包括**事件驱动**、**非阻塞 I/O** 和**异步编程模型**。这些特点使得 Node.js **能够高效处理大量并发请求**，避免因 I/O 操作（如数据库查询、文件读取、网络请求）而导致线程阻塞。

#### 1. 事件驱动 & 非阻塞 I/O

Node.js 基于 事件驱动和异步 I/O，依赖 libuv 库管理事件循环。当遇到 I/O 操作（如数据库查询、文件读取、网络请求），Node.js 不会等待 I/O 任务完成，而是继续执行其他任务，当 I/O 完成后，会触发回调函数执行。

#### 2. 单线程事件循环

Node.js 采用 单线程 + 事件循环 处理多个 I/O 请求，而不是像传统服务器（如 Apache）那样，为每个请求创建一个新线程。这使得 Node.js 不会因线程切换和资源竞争而消耗额外开销，更适合高并发 I/O 任务。

🌍 传统多线程服务器（如 Apache）
- 每个请求创建一个线程，每个线程占用 CPU、内存 资源。
- 如果有 10,000 个请求，就需要 10,000 个线程，导致线程切换和资源消耗过大。

🚀 Node.js 单线程事件循环
- 所有 I/O 操作都是异步的，不会阻塞主线程。
- 通过 事件循环 处理 成千上万个请求，并在 I/O 操作完成后执行回调。
- 轻量级，避免线程开销，适合高并发 I/O 任务。

#### 3. 适用于 I/O 密集型 vs. CPU 密集型

🔹 **I/O 密集型任务（Node.js 的强项）**

I/O 密集型任务指的是涉及大量网络、文件系统、数据库操作的任务，例如：

- Web 服务器：处理 HTTP 请求、API 调用。
- 数据库操作：查询 MySQL、MongoDB、Redis 等。
- 文件系统操作：读取、写入大文件。
- 网络请求：调用外部 API，下载文件。

🔸 **CPU 密集型任务（Node.js 的弱点）**

CPU 密集型任务指的是需要大量计算的任务，如：

- 图像处理：压缩、解码。
- 大规模数据计算：机器学习、加密、哈希计算。
- 复杂算法：排序、大量数学运算。

🚫 Node.js 单线程无法有效利用多核 CPU，CPU 密集型任务会阻塞主线程，导致所有请求变慢。

✅ 解决方案
- 使用 Worker Threads（子线程）
- 使用 Cluster（多进程）

## 3. 异步编程

### 什么是回调地狱？如何解决？

回调地狱（Callback Hell），又称 “回调嵌套地狱”，是指在 Node.js 异步编程 中，回调函数层层嵌套，导致代码难以阅读、维护和调试。它通常发生在多个异步操作依赖执行顺序时，比如：

- 读取文件 → 解析数据 → 处理数据 → 写入数据库 → 响应客户端
- 依赖多个 API 请求的结果

#### 1. 使用 Promise

Promise 允许异步代码以链式（.then()）方式执行，使代码更清晰可读。

#### 2. 使用 async/await

async/await 是基于 Promise 的语法糖，使代码更接近同步风格，可读性更强。

#### 3. 使用 util.promisify()

对于 不支持 Promise 的 回调风格 API（如 fs.readFile()），可以使用 util.promisify() 将其转换为 Promise 版本。

#### 4. 使用 Promise.all() 并行执行

有些异步操作彼此不依赖，可以并行执行，减少总执行时间。

- 🚫 顺序执行（慢） ，每个 await 都要等前一个完成，总时间是 t1 + t2 + t3。
- ✅ 并行执行（更快），减少等待时间，同时执行多个异步任务

#### 5. 使用 async.queue() 控制任务并发

如果有大量任务（如爬虫、批量 API 请求），可以使用 async.queue() 控制并发数量。

### Promise、async/await 和回调的区别？

#### 1. 回调（Callback）

**特点**：

- 通过 **回调函数** 处理异步操作的结果。
- 容易产生 **回调地狱**（嵌套过深，代码难以维护）。
- 传统的异步处理方式，例如 setTimeout、fs.readFile。

```js
function fetchData(callback) {
    setTimeout(() => {
        callback(null, "数据加载成功");
    }, 1000);
}

fetchData((err, data) => {
    if (err) {
        console.error("发生错误", err);
    } else {
        console.log(data);
    }
});
```

#### 2. Promise

**特点**：

- Promise 解决了回调地狱问题，支持 **链式调用**（.then()）。
- 状态不可变（pending → fulfilled / rejected）。
- 可以 **并行** 执行多个异步任务（Promise.all()）。

```js
function fetchData() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("数据加载成功");
        }, 1000);
    });
}

fetchData()
    .then(data => console.log(data))
    .catch(err => console.error("发生错误", err));
```

#### 3. async/await

**特点**：

- async/await 是 Promise 的 语法糖，让异步代码看起来像同步代码。
- await 让 JavaScript 等待 Promise 处理完成，避免 .then() 链式调用。

```js
function fetchData() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("数据加载成功");
        }, 1000);
    });
}

async function getData() {
    try {
        let data = await fetchData();
        console.log(data);
    } catch (err) {
        console.error("发生错误", err);
    }
}

getData();
```

| 特性	   | 回调 (Callback)	 | Promise	       | async/await   |
|:------|:---------------|:---------------|:--------------|
| 可读性	  | 差（嵌套地狱）	       | 好（链式调用）	       | 最优（同步风格）      |
| 错误处理	 | 繁琐（回调内处理）	     | .catch()	      | try...catch   |
| 并发处理	 | 复杂	            | Promise.all()	 | Promise.all() |
| 代码结构	 | 复杂	            | 清晰	最清晰         |
| 适用场景	 | 早期异步方式	        | 现代异步编程	        | 现代异步编程        |

**建议**：

- 如果是简单的异步操作，**直接用** `Promise`。
- 如果有多个顺序执行的异步操作，**推荐** `async/await`，可读性更强。
- **避免使用回调**，除非是兼容老代码或处理 **事件监听** 这种场景。

### async/await 如何处理错误？

| 错误处理方式	                                                                           | 适用场景                      |
|:----------------------------------------------------------------------------------|:--------------------------|
| try...catch	                                                                      | 适用于 async/await 代码块，清晰易读  |
| .catch() 链式调用	                                                                    | 适用于单个 await 任务，防止全局异常     |
| process.on("unhandledRejection") / window.addEventListener("unhandledrejection")	 | 适用于全局 Promise 错误捕获，防止崩溃   |
| Promise.all() + try...catch	                                                      | 适用于多个并发任务，但任何一个失败都会影响整体   |
| Promise.allSettled()	                                                             | 适用于多个并发任务，即使某个失败，仍返回所有结果  |

### 如何并行执行多个异步操作？（Promise.all vs Promise.allSettled）

当 Promise.all() 处理多个异步任务时，**任何一个任务失败，整个 Promise.all() 都会被 reject**：

即使 Promise.all() 整体返回了 reject，但 fetch1 和 fetch3 仍然会继续运行，只是它们的结果不会被 Promise.all() 处理。

```js
async function fetch1() {
    return "数据1";
}
async function fetch2() {
    throw new Error("数据2 失败");
}
async function fetch3() {
    return "数据3";
}

async function getData() {
    try {
        let results = await Promise.all([fetch1(), fetch2(), fetch3()]);
        console.log(results);
    } catch (err) {
        console.error("Promise.all 发生错误:", err.message);
    }
}

getData();
```

**优化方案**：使用 Promise.allSettled()，它不会因为某个任务失败就终止，而是返回所有任务的结果：

```js
async function getData() {
    let results = await Promise.allSettled([fetch1(), fetch2(), fetch3()]);
    console.log(results);
}

getData();
```
输出：
```bash
[
    { status: 'fulfilled', value: '数据1' },
    { status: 'rejected', reason: Error: '数据2 失败' },
    { status: 'fulfilled', value: '数据3' }
]
```
**适用场景**：希望多个异步任务并行执行，但即使其中一个失败，也不影响其他任务的执行。

### 如何控制异步任务的并发数量？

| 方法	                           | 适用场景	       | 优势	      | 缺点        |
|:------------------------------|:------------|:---------|:----------|
| Promise.all() + 分批	           | 固定任务量，简单场景	 | 易实现	     | 可能会导致资源空闲 |
| async/await + Promise.race()	 | 需要动态分配任务	   | 灵活	      | 代码稍复杂     |
| Promise.race()	               | 任务完成时间不均衡	  | 先完成的先处理	 | 任务顺序不确定   |
| p-limit	                      | 需要优雅的并发控制	  | 最简单，库封装	 | 需额外安装依赖   |

### 如何优雅地终止异步任务？

#### 1. 终止 fetch 请求（AbortController）

fetch 不提供 cancel() 方法，但可以使用 AbortController 发送取消信号：

```js
const controller = new AbortController();
const signal = controller.signal;
// 2 秒后终止请求
setTimeout(() => controller.abort(), 2000);
```

**适用场景**：
- API 请求超时
- 用户取消操作（比如搜索框输入变化，取消上一次请求）

#### 2. 终止 setTimeout / setInterval

setTimeout 和 setInterval 可以使用 clearTimeout() 和 clearInterval() 终止：

如果是可重复执行的任务，clearInterval() 也能终止：
```js
const interval = setInterval(() => {
    console.log("每秒执行一次");
}, 1000);

setTimeout(() => {
    clearInterval(interval);
    console.log("已停止循环");
}, 5000);
```

**适用场景**：

- 轮询任务、心跳检测
- 限制定时器运行时长

#### 3. 终止 Promise（可控标记）

Promise 本身不能被中断，但可以用可控标记让任务自行退出：

```js
let isCancelled = false;

function asyncTask() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (isCancelled) {
                reject(new Error("任务被取消"));
            } else {
                resolve("任务完成");
            }
        }, 3000);
    });
}

asyncTask()
    .then(console.log)
    .catch(console.error);

// 1 秒后取消任务
setTimeout(() => {
    isCancelled = true;
}, 1000);
```

**适用场景**：Promise 任务不能中断时，主动检查取消标记

#### 4. 终止 async/await（控制变量）

如果 async 任务正在运行，可以用一个外部变量控制：

```js
let isRunning = true;

async function fetchData() {
    for (let i = 0; i < 5; i++) {
        if (!isRunning) {
            console.log("任务已取消");
            return;
        }

        console.log(`执行任务 ${i + 1}`);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 模拟异步操作
    }

    console.log("任务完成");
}

fetchData();

// 3 秒后终止
setTimeout(() => {
    isRunning = false;
}, 3000);
```

适用场景：

- 循环任务（比如数据轮询）
- 批量任务执行

#### 5. 终止 Promise.allSettled()

当使用 Promise.all() 处理多个异步任务时，如果其中一个失败，整个 Promise.all() 仍会执行所有任务。

但 Promise.allSettled() 允许你检查所有任务状态，从而决定是否继续：

```js
const tasks = [
    new Promise((resolve) => setTimeout(() => resolve("任务1完成"), 1000)),
    new Promise((_, reject) => setTimeout(() => reject("任务2失败"), 2000)),
    new Promise((resolve) => setTimeout(() => resolve("任务3完成"), 3000))
];

Promise.allSettled(tasks).then((results) => {
    const hasError = results.some((r) => r.status === "rejected");

    if (hasError) {
        console.log("有任务失败，中止执行:", results);
    } else {
        console.log("所有任务成功:", results);
    }
});
```

**适用场景**：
- 批量 API 请求
- 任务失败时终止后续操作

#### 6. 终止 Worker 线程

如果任务在 Web Worker 线程中运行，可以使用 terminate() 方法强制终止：

```js
const worker = new Worker("worker.js");

worker.postMessage("开始任务");

// 5 秒后终止
setTimeout(() => {
    worker.terminate();
    console.log("Worker 线程已终止");
}, 5000);
```

**适用场景**：
- 计算密集型任务
- 后端数据处理

| 方式	                               | 适用场景	        | 终止方式               |
|:----------------------------------|:-------------|:-------------------|
| AbortController	                  | fetch 请求	    | controller.abort() |
| clearTimeout() / clearInterval()	 | 定时器任务	       | clearTimeout(id)   |
| 取消标记 + Promise	                   | Promise 任务	  | isCancelled = true |
| isRunning 变量	                     | async/await	 | 在循环内 return 退出     |
| Promise.allSettled()	             | 并发任务	        | 检查状态决定是否继续         |
| worker.terminate()	               | Web Worker	  | worker.terminate() |

## 4. Express 框架

### Express 是什么？它的主要特点是什么？

### Express 中间件（Middleware）的执行顺序？

### 如何在 Express 中处理错误？

### 如何编写一个 Express 路由？

### 如何在 Express 中实现 JWT 认证？

### 如何在 Express 中处理跨域请求（CORS）？

### 如何在 Express 中优化 API 响应速度？

### 如何实现 API 限流（Rate Limiting）？

## 5. 数据库

### Node.js 常用的数据库有哪些？

#### 1. SQL 数据库（关系型数据库）

适用于 数据结构固定、事务一致性要求高 的应用，例如电商系统、银行系统等。

| 数据库	                  | 介绍	                                   | 适用场景	                            | Node.js 客户端                        |
|:----------------------|:--------------------------------------|:---------------------------------|:-----------------------------------|
| MySQL	                | 最流行的关系型数据库，轻量、高性能	                    | Web 应用、CMS、博客、电商	                | mysql2、sequelize                   |
| PostgreSQL	           | 支持 ACID 事务、JSON 数据类型，功能更强	            | 金融系统、大数据处理	                      | pg、knex、sequelize                  |
| SQLite	               | 轻量级、嵌入式数据库，无需服务器	                     | 移动应用、本地存储	                       | sqlite3、better-sqlite3             |
| MariaDB	              | MySQL 的分支，支持 MySQL 语法，性能优化	           | MySQL 兼容场景	                      | mariadb                            |
| Microsoft SQL Server	 | 微软的 SQL 服务器，适合 Windows 企业应用	          | 大型企业系统	                          | mssql                              |

示例（Node.js 连接 MySQL）：
```js
const mysql = require('mysql2/promise');

async function connect() {
    const connection = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'test' });
    const [rows] = await connection.execute('SELECT * FROM users');
    console.log(rows);
    await connection.end();
}

connect();
```

#### 2. NoSQL 数据库（非关系型数据库）

适用于 数据结构不固定、需要高扩展性、大并发、高可用 的场景，例如社交平台、实时应用等。

| 数据库	                | 介绍	                           | 适用场景	               | Node.js 客户端      |
|:--------------------|:------------------------------|:--------------------|:-----------------|
| MongoDB	            | 基于文档的 NoSQL 数据库，使用 JSON 存储数据	 | 社交网络、实时分析	          | mongoose、mongodb |
| Redis	              | 基于内存的键值存储，支持缓存和消息队列	          | 缓存、Session 管理、分布式锁	 | ioredis、redis    |
| Cassandra	          | 高可用、去中心化的分布式数据库	              | 物联网、大规模数据存储	        | cassandra-driver |
| CouchDB	            | 类似 MongoDB，支持 HTTP API 访问	    | 分布式 Web 应用	         | nano             |
| Firebase Firestore	 | 谷歌的云数据库，适用于前端、移动端	            | 实时聊天、移动应用	          | firebase-admin   |

示例（Node.js 连接 MongoDB）：
```js
const { MongoClient } = require('mongodb');

async function connect() {
    const client = new MongoClient('mongodb://localhost:27017');
    await client.connect();
    const db = client.db('test');
    const users = await db.collection('users').find().toArray();
    console.log(users);
    await client.close();
}

connect();
```

#### 3. NewSQL 数据库（兼具 SQL 和 NoSQL 的特性）

NewSQL 数据库既支持 SQL 语法，又具备 NoSQL 的高扩展性，适用于 高并发、大规模数据 场景。

| 数据库	         | 介绍	               | 适用场景	        | Node.js 客户端        |
|:-------------|:------------------|:-------------|:-------------------|
| TiDB	        | MySQL 兼容，支持分布式事务	 | 高并发 OLTP 系统	 | mysql2             |
| CockroachDB	 | 强一致性、分布式 SQL 数据库	 | 高可用系统	       | pg                 |
| VoltDB	      | 低延迟、内存计算数据库	      | 实时分析	        | voltdb-node-client |

#### 4. Graph 数据库（图数据库）

适用于 社交关系、推荐系统、知识图谱 等应用。

| 数据库	      | 介绍	                      | 适用场景	      | Node.js 客户端  |
|:----------|:-------------------------|:-----------|:-------------|
| Neo4j	    | 最流行的图数据库，使用 Cypher 查询语言	 | 社交网络、知识图谱	 | neo4j-driver |
| ArangoDB	 | 既支持文档、SQL，也支持图数据库	       | 复杂数据分析	    | arangojs     |

示例（Node.js 连接 Neo4j）：
```js
const neo4j = require('neo4j-driver');

const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', 'password'));
const session = driver.session();

async function query() {
    const result = await session.run('MATCH (n) RETURN n LIMIT 5');
    console.log(result.records);
    await session.close();
    await driver.close();
}

query();
```

#### 如何选择合适的数据库？

| 需求	                    | 适合的数据库                    |
|:-----------------------|:--------------------------|
| 传统 Web 应用（电商、CMS、ERP）	 | MySQL、PostgreSQL          |
| 高并发、分布式系统	             | TiDB、Cassandra            |
| 实时数据分析	                | Redis、VoltDB              |
| 社交网络、推荐系统	             | Neo4j、ArangoDB            |
| 移动端 / 小型项目	            | Firebase Firestore、SQLite |
| 缓存、Session 存储	         | Redis                     |
| 大规模 JSON 文档存储	         | MongoDB、CouchDB           |

### 如何使用 Sequelize 连接 MySQL？

#### 1. 安装 Sequelize 和 MySQL2

Sequelize 需要 mysql2 作为 MySQL 驱动程序

```bash
npm install sequelize mysql2
```

#### 2. 连接 MySQL

创建`database.js`进行数据库连接：

```js
const { Sequelize } = require('sequelize');

// 创建 Sequelize 实例
const sequelize = new Sequelize('database_name', 'username', 'password', {
    host: 'localhost',  // 数据库地址
    dialect: 'mysql',   // 使用 MySQL
    logging: console.log, // 是否打印 SQL 语句，关闭设置为 false
});

// 测试连接
async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('✅ MySQL 连接成功！');
    } catch (error) {
        console.error('❌ MySQL 连接失败:', error);
    }
}

testConnection();

module.exports = sequelize;
```

#### 3. 定义模型

在 `models/User.js` 中定义 `User` 模型：

```js
const { DataTypes } = require('sequelize');
const sequelize = require('../database'); // 引入数据库实例

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'users',  // 指定数据库表名
    timestamps: true     // 自动创建 createdAt 和 updatedAt
});

module.exports = User;
```

#### 4. 同步数据库

在 `sync.js` 中同步模型到 MySQL：

```js
const sequelize = require('./database');
const User = require('./models/User');

async function syncDatabase() {
    try {
        //  等价于 await sequelize.sync();
        await sequelize.sync({ force: false }); // `force: true` 会删除表再重建
        console.log('✅ 数据库同步成功');
    } catch (error) {
        console.error('❌ 数据库同步失败:', error);
    } finally {
        await sequelize.close();
    }
}

syncDatabase();
```

#### 5. 增删改查（CRUD）

在 `index.js` 测试 CRUD 操作：

```js
const User = require('./models/User');

// 创建用户
async function createUser() {
    const user = await User.create({
        username: 'Richard',
        email: 'richard@example.com',
        age: 30
    });
    console.log('✅ 用户创建成功:', user.toJSON());
}

// 查询用户
async function findUser() {
    const user = await User.findOne({ where: { username: 'Richard' } });
    console.log('🔍 查询用户:', user ? user.toJSON() : '未找到');
}

// 更新用户
async function updateUser() {
    const [updated] = await User.update({ age: 31 }, { where: { username: 'Richard' } });
    console.log(updated ? '✅ 用户更新成功' : '❌ 更新失败');
}

// 删除用户
async function deleteUser() {
    const deleted = await User.destroy({ where: { username: 'Richard' } });
    console.log(deleted ? '✅ 用户删除成功' : '❌ 删除失败');
}

async function main() {
    await createUser();
    await findUser();
    await updateUser();
    await deleteUser();
}

main();
```

#### 6. 处理数据库事务

Sequelize 支持 **事务（Transaction）**，适用于需要 **保证数据一致性** 的操作：

```js
const sequelize = require('./database');
const User = require('./models/User');

async function transactionExample() {
    const t = await sequelize.transaction(); // 开启事务
    try {
        const user = await User.create({
            username: 'Alice',
            email: 'alice@example.com',
            age: 25
        }, { transaction: t });

        console.log('✅ 用户创建成功:', user.toJSON());

        // 手动提交事务
        await t.commit();
    } catch (error) {
        console.error('❌ 事务失败:', error);
        await t.rollback(); // 回滚事务
    }
}

transactionExample();
```

#### 7. 关联关系（外键）

Sequelize 支持 **一对多、一对一、多对多** 关系：

```js
const User = require('./models/User');
const Post = require('./models/Post'); // 假设有 Post 模型

// 一对多（User 有多个 Post）
User.hasMany(Post, { foreignKey: 'userId' });
Post.belongsTo(User, { foreignKey: 'userId' });

await sequelize.sync({ alter: true }); // 同步数据库
```

**注意**：正式环境不建议使用`sequelize.sync({force/alter: true})`，会直接删除表或自动调整表结构，导致数据丢失，正式环境应该使用数据库迁移

#### 使用 Sequelize Migrations
- 创建迁移文件
```bash
npx sequelize-cli migration:generate --name add_age_column_to_users
```

- 修改迁移文件
```js
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Users', 'age', {
            type: Sequelize.INTEGER,
            allowNull: true,
        });
    },
   down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('Users', 'age');
   }
}
```

- 运行迁移
```bash
npx sequelize-cli db:migrate
```

- 回滚迁移
```bash
npx sequelize-cli db:migrate:undo
```

### 如何使用 Mongoose 连接 MongoDB？

#### 1. 安装 Mongoose

```bash
npm install mongoose
yarn add mongoose
```

#### 2. 连接 MongoDB

创建一个 `db.js` 文件

```js
const mongoose = require('mongoose');

const DB_URI = 'mongodb://127.0.0.1:27017/mydatabase'; // 替换为你的 MongoDB 地址

// 连接 MongoDB
mongoose.connect(DB_URI, {
  useNewUrlParser: true, 
  useUnifiedTopology: true
});

// 获取数据库连接对象
const db = mongoose.connection;

// 监听连接事件
db.on('connected', () => {
  console.log('✅ MongoDB 连接成功');
});

db.on('error', (err) => {
  console.error('❌ MongoDB 连接失败:', err);
});

db.on('disconnected', () => {
  console.log('⚠️ MongoDB 连接断开');
});

// 导出 mongoose 供其他文件使用
module.exports = mongoose;
```

#### 3. 创建 Mongoose 模型

在 `models/User.js` 中定义一个 User 模型：
```js
const mongoose = require('../db'); // 引入数据库连接

// 定义 Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  age: { type: Number, default: 18 },
  createdAt: { type: Date, default: Date.now }
});

// 创建模型
const User = mongoose.model('User', userSchema);

module.exports = User;
```

#### 4. 使用模型操作数据库

在 `index.js` 文件中编写 `CRUD` 操作：
```js
const User = require('./models/User');

// 插入数据
async function createUser() {
  try {
    const newUser = new User({
      username: 'richard',
      email: 'richard@example.com',
      age: 30
    });
    await newUser.save();
    console.log('✅ 用户创建成功:', newUser);
  } catch (error) {
    console.error('❌ 创建用户失败:', error);
  }
}

// 查询用户
async function findUser() {
  const user = await User.findOne({ username: 'richard' });
  console.log('🔍 查询到的用户:', user);
}

// 更新用户
async function updateUser() {
  const updatedUser = await User.findOneAndUpdate(
    { username: 'richard' },
    { age: 31 },
    { new: true } // 返回更新后的文档
  );
  console.log('🔄 用户更新成功:', updatedUser);
}

// 删除用户
async function deleteUser() {
  await User.deleteOne({ username: 'richard' });
  console.log('🗑️ 用户删除成功');
}

// 运行测试
(async () => {
  await createUser();
  await findUser();
  await updateUser();
  await deleteUser();
})();
```

#### 5. 连接远程 MongoDB

如果你使用 MongoDB Atlas，你需要 在 MongoDB Atlas 后台获取连接 URL，通常是这样的：
```js
const DB_URI = 'mongodb+srv://username:password@cluster0.mongodb.net/mydatabase?retryWrites=true&w=majority';
```
然后在 `mongoose.connect()` 里替换掉本地 `mongodb://127.0.0.1:27017/mydatabase`。

### MySQL 和 MongoDB 的区别？

MySQL 和 MongoDB 是两种常见的数据库管理系统（DBMS），但它们的 数据结构、存储方式、查询方式 等有很大不同。以下是它们的核心区别：

#### 1. 数据模型

| 对比项	  | MySQL（关系型数据库）	                         | MongoDB（NoSQL 文档数据库）            |
|:------|:---------------------------------------|:--------------------------------|
| 数据存储	 | 表（Tables），数据以 行（Rows） 和 列（Columns） 组织	 | JSON/BSON 文档（Documents），类似 嵌套对象 |
| 数据结构	 | 固定模式（Schema），表结构必须定义，字段类型固定	           | 灵活模式（Schema-less），每个文档的字段可以不同   |
| 数据关系	 | 外键（Foreign Key） 进行关联	                  | 嵌套文档（Embedded Documents） 代替关系   |

示例：存储 用户数据

**MySQL（表结构）**：

```sql
CREATE TABLE users (
   id INT PRIMARY KEY AUTO_INCREMENT,
   name VARCHAR(255),
   email VARCHAR(255) UNIQUE,
   age INT
);
```

**MongoDB（JSON 文档）**：

```bash
{
   "_id": ObjectId("624bcf1f..."),
   "name": "Richard",
   "email": "richard@example.com",
   "age": 30
}
```
**结论**：
- **MySQL** 适用于 **结构化数据**，每个表的字段必须固定。
- **MongoDB** 适用于 **半结构化或非结构化数据**，每条数据可以有不同的字段。

#### 2. 查询方式

| 对比项	   | MySQL	                               | MongoDB                             |
|:-------|:-------------------------------------|:------------------------------------|
| 查询语言	  | SQL（Structured Query Language）	      | MongoDB Query Language（MQL）         |
| 基本查询	  | SELECT * FROM users WHERE age > 25;	 | db.users.find({ age: { $gt: 25 } }) |
| 多表关联	  | JOIN 查询	                             | $lookup（类似 JOIN），推荐使用 嵌套文档          |
| 事务支持	  | ✅ 支持事务（InnoDB 引擎）	                   | ✅ 4.0+ 开始支持多文档事务，但开销较大              |

示例：查询所有年龄大于 25 的用户

**MySQL**：

```sql
SELECT * FROM users WHERE age > 25;
```

**MongoDB**：

```js
db.users.find({ age: { $gt: 25 } });
```

**结论**：
- **MySQL 的 SQL 语法强大**，支持复杂查询、事务处理。
- **MongoDB 的查询语言灵活**，更适合 JSON 数据结构。

#### 3. 事务（Transactions）

| 对比项	  | MySQL	                  | MongoDB                     |
|:------|:------------------------|:----------------------------|
| 事务支持	 | ✅ 强支持（ACID 事务，适合金融、银行）	 | ⚠️ 4.0+ 开始支持事务，但比 MySQL 成本高 |
| 适用场景	 | 银行、财务、订单管理	             | 实时日志、社交应用、NoSQL 场景          |

**示例：MySQL 事务**

```sql
START TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
```

**示例：MongoDB 事务**

```js
const session = db.startSession();
session.startTransaction();
try {
   db.accounts.updateOne({ id: 1 }, { $inc: { balance: -100 } }, { session });
   db.accounts.updateOne({ id: 2 }, { $inc: { balance: 100 } }, { session });
   session.commitTransaction();
} catch (error) {
   session.abortTransaction();
}
```

**结论**：
- **MySQL 的事务更成熟**，适用于银行、财务、订单系统等场景。
- **MongoDB 事务适用于文档存储**，但复杂事务比 MySQL 成本高。

#### 4. 读写性能

| 对比项	   | MySQL	                   | MongoDB                    |
|:-------|:-------------------------|:---------------------------|
| 读写性能	  | 读写速度较快，但复杂 JOIN 查询会降低性能	 | 写入速度更快，读取性能优秀（No JOIN）     |
| 索引	    | B-Tree 索引，支持复合索引、全文索引	   | B-Tree 索引，支持 全文索引、地理索引     |
| 扩展性	   | 垂直扩展（增加 CPU/RAM）	        | 水平扩展（Sharding 分片），更适合大规模数据 |

**结论**：
- **MySQL 适合高并发小规模查询**，但 JOIN 可能降低性能。
- **MongoDB 适合高写入、实时应用（日志、社交、物联网）**，分片扩展更灵活。

#### 5. 适用场景

| 场景	          | MySQL（SQL 关系型数据库）	 | MongoDB（NoSQL 文档数据库） |
|:-------------|:-------------------|:---------------------|
| 银行、财务、订单系统	  | ✅ 强事务支持，适合	        | ❌ 事务成本高，不适合          |
| 社交网络、用户数据	   | ❌ JOIN 影响性能	       | ✅ JSON 文档存储，适合嵌套数据   |
| 实时日志、物联网	    | ❌ 插入性能较慢	          | ✅ 高写入速度，支持水平扩展       |
| 内容管理系统（CMS）	 | ✅ 适用于结构化内容	        | ✅ 更适合存储动态内容          |
| 搜索引擎	        | ❌ 复杂查询慢	           | ✅ 支持全文索引，搜索性能好       |

**结论**：
- MySQL 适合高事务、高一致性需求的业务（银行、订单系统）。
- MongoDB 适合高并发、实时数据、非结构化存储（社交、日志、物联网）。

#### 6. 选择建议

✅ **如果你的数据是**：
- 高度结构化（固定字段、强约束） → MySQL
- 非结构化（字段动态变化、JSON 友好） → MongoDB

✅ **如果你需要**：
- 强事务、一致性（银行、订单系统） → MySQL
- 高并发、大数据量（日志、物联网） → MongoDB

✅ **如果你追求扩展性**：
- 数据量不大，单机数据库 → MySQL
- 数据量巨大，需要分片扩展 → MongoDB

### 如何优化数据库查询？

优化数据库查询的方法主要从 **索引、查询优化、缓存、分片、数据库架构** 等多个方面入手

#### 1. 使用索引（Index）

**适用数据库**： MySQL、PostgreSQL、MongoDB 等

✅ **优化方式**：

- 给 `WHERE、ORDER BY、GROUP BY` 相关的字段添加 合适的索引。
- 使用 `覆盖索引`（索引包含查询字段，无需回表）。
- 避免 `低选择性索引`（如性别字段，只有 Male/Female 只有两个值）。
- `前缀索引`（如 VARCHAR(255)，可以创建 VARCHAR(10) 的索引）。

```sql
-- 为 email 字段添加索引
CREATE INDEX idx_user_email ON users(email);
-- 优化前，无索引，扫描全表
SELECT * FROM users WHERE email = 'xxx@xxx.com';
-- 优化后，只查索引字段（覆盖索引）
SELECT id, name FROM users WHERE email = 'xxx@xxx.com';
```

#### 2. 避免 SELECT （只查询需要的字段）

**适用数据库**： MySQL、PostgreSQL、MongoDB

✅ 优化方式：

- 只查询需要的字段，减少 I/O 和内存占用。

```sql
-- ✅ 只查询需要的字段
SELECT id, name FROM users WHERE id = 1;
-- ❌ 查询所有字段，增加开销
SELECT * FROM users WHERE id = 1;
```

#### 3. 使用 LIMIT 分批查询

**适用数据库**： MySQL、PostgreSQL

✅ 优化方式：

- 避免一次性查询大量数据，改为 分页 处理。

```sql
-- 取第 101 - 110 条数据
SELECT * FROM users ORDER BY id LIMIT 10 OFFSET 100;
-- 使用索引优化分页，避免 OFFSET 过大时性能下降
SELECT * FROM users WHERE id > 1000 LIMIT 10;
```

#### 4. 使用缓存（Redis/Memcached）

**适用数据库**： MySQL、MongoDB、PostgreSQL

✅ 优化方式：

- 频繁查询的数据 存 Redis，避免每次都查数据库。
- 短时间不变的数据（如热门排行榜、用户信息等）可以缓存。

```php
//  先查缓存
$user = Cache::get('user:1001');

if ($user) {
    //  缓存不存在，查询数据库
    $user = DB::table('users')->where('id', 1001)->first();
    //  写入缓存，缓存 10 分钟
    Cache::put('user:1001', $user, 600);
}

//  get + put 等价于 remember
//  这样可以自动读取缓存，如果缓存不存在，就查询数据库并存入缓存，代码更简洁。
$user = Cache::remember('user:1001', 60 * 10, function () {
    return DB::table('users')->where('id', 1001)->first();
});
```

#### 5. 避免 N+1 查询问题

**适用数据库**： MySQL、PostgreSQL（ORM 框架：Sequelize、Eloquent、TypeORM）

✅ 优化方式：

- Eager Loading（预加载）
- JOIN 查询 替代多次查询

```php
//  错误示例（N+1）查询
$users = User::all();
foreach ($users as $user) {
    echo $user->profile->age;
}
//  优化后（预加载），只查询 1 次
$users = User::with('profile')->get();
```
```sql
-- 使用 JOIN 代替
SELECT users.*, profiles.age FROM users JOIN profiles ON users.id = profiles.user_id;
```

#### 6. 适当使用数据库分片 & 读写分离

**适用数据库**： MySQL、PostgreSQL、MongoDB

✅ 优化方式：

- 读写分离：主库处理写操作，从库处理读操作。
- 分库分表：大表拆成多个小表，提高查询性能。

```php
// 读操作（从库）
DB::connection('slave')->select("SELECT * FROM users WHERE id = 1");

// 写操作（主库）
DB::connection('master')->insert("INSERT INTO users(name) VALUES('Richard')");
```

#### 7. 避免不必要的 ORDER BY

**适用数据库**： MySQL、PostgreSQL

✅ 优化方式：

- ORDER BY 会导致全表扫描，尽量配合索引使用。
- 排序字段要有索引，避免临时表排序。

```sql
-- 没有索引，全表扫描
SELECT * FROM users ORDER BY created_at;
-- 创建索引
CREATE INDEX idx_users_created_at ON users(created_at);
```

#### 8. 事务优化

**适用数据库**： MySQL、PostgreSQL

✅ 优化方式：

- 减少事务的时间（事务内 SQL 语句越少越好）。
- 避免长时间锁表（适用于高并发环境）。

```php
DB::beginTransaction();
try {
    DB::table('users')->update(['balance' => 500]);
    DB::table('orders')->insert(['user_id' => 1, 'amount' => 500]);
    DB::commit();   //  事务提交成功
} catch (\Exception $e) {
    DB::rollBack(); //  事务出错回滚
}
```

### Redis 在 Node.js 中的应用场景？

在 Node.js 中，Redis 主要用于`缓存、队列、会话存储`等场景，提升应用性能和响应速度。以下是几个常见应用场景：

#### 1. 数据缓存（减少数据库查询，提高响应速度）

在 高并发场景 下，如果每次请求都查询数据库，性能会下降。可以用 `Redis 缓存` 查询结果，减少数据库压力。

查询用户数据，缓存 10 分钟
```js
//  引入 Redis 库
const redis = require('redis');
//  创建 Redis 连接客户端，无密码默认配置可留空
//  const client = redis.createClient({
//     host: '127.0.0.1',
//     port: 6379,
//     password: 'your-redis-password',
//  });
const client = redis.createClient();
//  Node.js 原生的 redis 库使用**回调函数（callback）**来处理异步操作，例如：
//  client.get('key', (err, value) => {
//     if (err) {
//         console.error(err);
//     } else {
//         console.log(value);
//     }
// });
//  但 回调函数写法不够直观，不利于 async/await 形式的异步编程，所以使用 promisify() 来转换回调为 Promise。
const { promisify } = require('util');
//  client.get() 原本是 回调函数风格，用 promisify() 转换为 Promise 风格
//  bind(client) 确保 this 仍然指向 client，避免 this 绑定错误的问题
const getAsync = promisify(client.get).bind(client);
//  client.setex() 是 Redis 命令 SETEX key seconds value，用于设置一个带过期时间的 key。
//  由于 setex() 也是回调风格，promisify() 让它变成 Promise，可用 await 方式调用。
const setAsync = promisify(client.setex).bind(client);

async function getUser(userId) {
    const cacheKey = `user:${userId}`;
    //  先查询 Redis 缓存
    let user = await getAsync(cacheKey);
    if (user) {
        return JSON.parse(user);
    }
    //  如果缓存未命中，查询数据库
    user = await db.getUser(userId);
    //  存入 Redis 缓存，设置 10 分钟过期时间
    await setAsync(cacheKey, 600, JSON.stringify(user));
    
    return user;
}
```
**效果**：

- 第一次查询数据库，后续请求直接从 Redis 读取缓存，提高查询效率。
- 减少数据库压力，提高系统吞吐量。

#### 2. 分布式 Session（用户登录状态管理）

Node.js 无状态，如果使用多台服务器部署，Session 不能只存 内存，需要一个 共享存储，Redis 就是很好的选择。

使用 express-session + Redis 存储 Session

```js
// 引入 express 框架的会话 session 管理中间件 express-session
const session = require('express-session');
// 引入 connect-redis，并连接到 express-session
const RedisStore = require('connect-redis')(session);
// 引入 Redis 客户端
const redis = require('redis');
// 创建 Redis 连接
const client = redis.createClient();

app.use(session({
   store: new RedisStore({ client }),   // 配置 session 存入 Redis
   secret: 'your-secret-key',   // 加密 session ID 的密钥
   resave: false,               // 如果 session 没变化，则不重新保存
   saveUninitialized: true,     // 是否保存未初始化的 session（建议 false）
   cookie: { secure: false, maxAge: 60000 } // cookie 配置：不使用 HTTPS，1 分钟过期
}))
```

**效果**：

- Session 共享，多台服务器可以访问同一个 Redis，用户不用频繁登录。
- 高性能，比数据库存储 Session 快很多。

#### 3. 任务队列（分布式消息队列）

当任务执行时间较长（如 邮件发送、图片处理），可以用 Redis 消息队列，让任务异步处理，防止主线程阻塞。

使用 bull 处理任务队列
```js
const Queue = require('bull');
//  创建队列
const emailQueue = new Queue('email', { redis: { host: '127.0.0.1', port: 6379 } });
//  生产者：添加任务
emailQueue.add({ email: 'user@example.com', content: 'hello' });
//  消费者：处理任务
emailQueue.process(async (job) => {
    console.log(`Sending email to ${job.data.email}`);
    //  模拟邮件发送
    await sendEmail(job.data.email, job.data.content);
});
```
**效果*：

- 任务异步执行，不阻塞主线程。
- 可扩展：多个消费者（Worker）并行处理任务。

#### 4. 计数器（限流、防刷）

Redis 的 INCR 和 EXPIRE 指令可以快速实现限流，防止用户短时间内频繁操作（如登录尝试、API 限流）。

限制每个 IP 10 秒内最多访问 5 次
```js
const rateLimit = async (ip) => {
    const key = `rate:${ip}`;
    const current = await getAsync(key);
    if (current && current >= 5) {
        return false;
    }
    await setAsync(key, current ? current + 1 : 1, 'EX', 10);
    return true;
};
app.use(async (req, res, next) => {
    const ip = req.ip;
    if (! await rateLimit(ip)) {
        return res.status(429).send("Too Many Requests");
    }
    next();
});
```
**效果**：

- 防止恶意请求，限制用户短时间内访问 API 过多次。
- 提高安全性，可用于 登录防爆破（多次失败后限制 IP）。

#### 5. 实时排行榜（点赞、计分系统）

Redis ZSET（有序集合）适用于 排行榜，可快速存储、查询用户排名。

存储和查询用户得分
```js
const redis = require('redis');
const client = redis.createClient();
//  添加用户得分， 用户 1001 增加 10 分
client.zincrby('leaderboard', 10, 'user:1001');
//  查询前 5 名用户
client.zrevrange('leaderboard', 0, 4, 'WITHSCORES', (err, result) => {
    console.log(result);
});
```
**效果**：

- 高效计算排行榜，比 SQL 快很多。
- 适用于游戏排名、文章点赞、视频热度排行。

#### 6. Pub/Sub（实时消息推送）

Redis 发布/订阅（Pub/Sub）可用于 实时通知、WebSocket 消息推送。

聊天室（订阅 & 发布消息）
```js
const pub = redis.createClient();
const sub = redis.createClient();

//  订阅频道
sub.subscribe('chat');
//  监听新消息
sub.on('message', (channel, message) => {
    console.log(`New message on ${channel}:${message}`);
});
//  发布消息
pub.public('chat', 'Hello, world!');
```
**效果**：

- 适用于 WebSocket、实时消息推送（如聊天室）。
- 多个服务之间传递数据（分布式消息通知）。

### 如何使用 Redis 实现分布式锁？

在分布式系统中，多台服务可能同时修改共享资源。为了避免“并发写”问题，需要一个“只有一个人能拿到的锁”。

使用 Redis 的 SET key value NX PX ttl 原子操作（NX：仅当 key 不存在时设置，PX：设置过期时间）。谁先成功执行 SET，谁就拿到了锁。

最简单的分布式锁代码（使用 Node.js + Redis v4）
```js
const redis = require('redis');
const { v4: uuidv4 } = require('uuid');

const client = redis.createClient();
await client.connect();

const LOCK_KEY = 'lock:my-resource';
const LOCK_EXPIRE = 5000;   //  毫秒
const LOCK_ID = uuidv4();   //  唯一表示本次加锁

const acquired = await client.set(LOCK_KEY, LOCK_ID, {
    NX: true,
    PX: LOCK_EXPIRE
});

if (acquired) {
    console.log('成功获得锁');
    try {
        //  业务代码
    } finally {
       //   释放之前必须验证是自己的锁
       const script = `
          if redis.call("get", KEYS[1]) == ARGV[1] then
              return redis.call("del", KEYS[1])
          else
              return 0;
          end
       `;
       const result = await client.eval(script, {
           keys: [LOCK_KEY],
           arguments: [LOCK_ID]
       });
       console.log(result ? '锁已释放' : '锁已被其他客户端修改');
    }
} else {
    console.log('获取锁失败');
}
```
为什么用 uuid？ 用作锁的“唯一标识”，防止出现：

- A 拿到了锁
- A 执行时间过长，锁过期
- B 拿到了锁
- A 结束执行，误删了 B 的锁

使用 Lua 脚本释放锁的好处？
- 确保 "检查锁值" 和 "删除锁" 是原子操作，防止在多线程/多进程下竞态删除。

可以使用`Redlock`来实现
```js
const { createClient } = require('redis');
const { default: Redlock } = require('redlock');

const client = createClient();
await client.connect();

const redlock = new Redlock([client]);

try {
    const lock = await redlock.acquire(['lock:my-resource'], 5000);

    console.log('已获得 Redlock 锁');

    await lock.release();
    console.log('Redlock 锁已释放');
} catch (err) {
    console.log('加锁失败：', err);
}
```

### 如何在 Node.js 中实现缓存？

#### 1. 内存缓存 (Memory Cache)

最简单的方式是直接将数据存储在应用的内存中。这适用于小型应用或开发环境。可以使用如 node-cache 或直接使用 JavaScript 的对象来存储缓存。

```js
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 100, checkperiod: 120 });  // 设置缓存存活时间

// 设置缓存
cache.set('user:1001', { name: 'Richard', age: 30 });

// 获取缓存
const user = cache.get('user:1001');
console.log(user);  // { name: 'Richard', age: 30 }

// 如果缓存不存在
const missingUser = cache.get('user:2001');
console.log(missingUser);  // undefined
```

**特点**：
- 缓存存储在内存中，速度非常快。
- 适用于小型应用、开发阶段或者一些轻量级的缓存需求。
- 如果服务器重启，缓存会丢失。

#### 2. 文件系统缓存 (File System Cache)

可以使用文件系统存储缓存，通常适用于不适合放在内存中的大数据，但需要缓存的场景。

```js
const fs = require('fs');
const path = require('path');

// 缓存存储位置
const cacheFilePath = path.join(__dirname, 'cache.json');

// 读取缓存文件
function readCache() {
  if (fs.existsSync(cacheFilePath)) {
    const data = fs.readFileSync(cacheFilePath);
    return JSON.parse(data);
  }
  return null;
}

// 写入缓存文件
function writeCache(data) {
  fs.writeFileSync(cacheFilePath, JSON.stringify(data));
}

// 使用缓存
let cache = readCache();
if (!cache) {
  console.log('Cache miss!');
  // 假设查询数据库的操作
  cache = { user: { name: 'Richard', age: 30 } };
  writeCache(cache);
} else {
  console.log('Cache hit!');
}

console.log(cache);
```
**特点**：
- 缓存数据存储在磁盘上，不容易丢失。
- 相较内存缓存，性能较差，但适用于持久化存储大数据。
- 适用于长期缓存、图片、日志等文件。

#### 3. Redis 缓存 (Distributed Cache)

对于分布式环境，或者需要在多个 Node.js 实例间共享缓存时，使用 Redis 是最常见的选择。Redis 是一个基于内存的键值存储，可以实现高效的缓存操作，且可以持久化数据。

```js
const Redis = require('ioredis');
const redis = new Redis();  // 默认连接到 localhost:6379

// 设置缓存
redis.set('user:1001', JSON.stringify({ name: 'Richard', age: 30 }), 'EX', 600);  // 设置过期时间 600秒

// 获取缓存
redis.get('user:1001').then((result) => {
  if (result) {
    console.log('Cache hit:', JSON.parse(result));
  } else {
    console.log('Cache miss');
    // 假设查询数据库操作
    const user = { name: 'Richard', age: 30 };
    redis.set('user:1001', JSON.stringify(user), 'EX', 600);  // 设置缓存
  }
});
```
**特点**：
- 可以存储大量数据，且支持多种数据结构（字符串、列表、集合、哈希等）。
- 支持过期时间，自动清除过期数据。
- 可用于分布式系统，多个实例之间共享缓存。

#### 4. 使用 Cache-Control 头部缓存 HTTP 响应

在 Node.js 中构建 Web 应用时，可以通过设置 HTTP 响应头来实现缓存控制。最常见的就是使用 Cache-Control 头来告诉浏览器或其他代理缓存某些资源。

在 Express 中使用 Cache-Control 头

```js
const express = require('express');
const app = express();

app.get('/data', (req, res) => {
  // 设置缓存头，告诉浏览器缓存响应 1小时
  res.set('Cache-Control', 'public, max-age=3600');
  res.json({ message: 'This is cached data' });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```
**特点**：
- 用于控制 HTTP 响应的缓存策略。
- 适用于静态资源、API 响应等。

#### 5. 缓存库与框架：

lru-cache：实现 Least Recently Used 缓存

lru-cache 是一个实现 LRU（最近最少使用）缓存的库。当缓存达到最大限制时，会自动删除最少使用的项。

```js
const LRU = require('lru-cache');
const options = { max: 500 };  // 设置最大缓存数
const cache = new LRU(options);

// 设置缓存
cache.set('user:1001', { name: 'Richard', age: 30 });

// 获取缓存
const user = cache.get('user:1001');
console.log(user);  // { name: 'Richard', age: 30 }
```

#### 总结：

- **内存缓存**：使用简单，速度快，适用于小型数据。
- **文件缓存**：适用于不适合放在内存中的大数据。
- **Redis缓存**：适用于分布式环境，可以存储大量数据，支持数据过期，适合高并发场景。
- **HTTP缓存**：通过 HTTP 头 Cache-Control 控制缓存，适用于 API 和静态资源。
- **LRU缓存**：通过 lru-cache 等库实现最近最少使用缓存，避免缓存占用过多内存。

## 6. 性能优化

### Node.js 如何提高性能？

#### 1. 使用异步编程模型

**避免同步操作**：

同步操作会阻塞事件循环，影响性能。尽量避免在 Node.js 中使用同步的 I/O 操作，如 fs.readFileSync()、fs.writeFileSync() 等。

#### 2. 使用负载均衡（Load Balancing）

对于高并发应用，使用多核 CPU 进行负载均衡非常重要。Node.js 本身是单线程的，但可以通过集群模式来利用多核 CPU，分摊负载。

- 使用 cluster 模块
```js
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('Hello, Node.js!');
  }).listen(8000);
}
```

#### 3. 优化数据库查询

数据库查询往往是性能瓶颈，尤其是在高并发应用中。优化数据库查询可以显著提升应用性能。

✅ 减少不必要的查询：
- 只查询你需要的字段，避免使用 SELECT *。
- 使用索引优化查询，避免全表扫描。

✅ 使用缓存：
- 使用 Redis 等缓存机制存储热点数据，减少数据库查询。

#### 4. 压缩响应数据

对于 Web 应用，响应数据的压缩可以减少网络传输的负担，提高加载速度，改善用户体验。

✅ 使用 GZIP 或 Brotli 压缩响应：
- 可以使用 compression 中间件对 HTTP 响应进行压缩。
```js
const express = require('express');
const compression = require('compression');
const app = express();

app.use(compression());  // 开启 GZIP 压缩

app.get('/', (req, res) => {
  res.send('Hello, compressed world!');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

#### 5. 使用更高效的 HTTP 请求处理

Node.js 的 http 模块支持流式传输，可以避免加载整个文件到内存中，适用于大文件传输。

✅ 使用流（Streams）处理大文件：
```js
const fs = require('fs');
const http = require('http');

http.createServer((req, res) => {
  const readStream = fs.createReadStream('/path/to/large/file');
  readStream.pipe(res);  // 将文件流直接写入响应
}).listen(8000);
```

#### 6. 异步化 I/O 操作

Node.js 是为了异步和非阻塞 I/O 设计的，因此在需要频繁进行文件、网络、数据库操作时，要充分利用异步 I/O。

✅ 使用 async/await 或回调处理异步操作：

✅ 使用事件驱动模型：利用事件驱动和回调函数，确保事件循环不会被阻塞。

#### 7. 代码优化

- 减少不必要的循环：避免在循环中做复杂的操作，尽量减少计算量。
- 避免内存泄漏：及时清除不再使用的对象，避免内存占用过高。
- 使用高效的数据结构：如 Set 和 Map 替代传统的数组，尤其在查找和去重时，能够提高性能。

#### 8. 优化 Node.js 进程和线程管理

✅ 使用 `--max-old-space-size` 调整内存限制：
- Node.js 默认的内存限制大约为 1.5GB，处理大数据时可能会导致内存溢出。可以使用 --max-old-space-size 来增加内存限制：

✅ 使用 pm2 管理 Node.js 应用：
- pm2 是一个常用的进程管理工具，支持进程监控、负载均衡和自动重启。

#### 9. 性能监控与调优工具

✅ 使用 clinic.js 或 node --inspect 工具进行性能分析：
clinic.js：帮助你分析 Node.js 应用的性能瓶颈。

node --inspect：用于查看应用的 CPU 和内存使用情况。
```bash
npm install -g clinic
clinic doctor -- node app.js  # 分析性能问题
```

#### 10. 升级 Node.js 版本

新的 Node.js 版本通常会有性能改进和 bug 修复，因此保持 Node.js 版本的更新非常重要。

✅ 使用 nvm 管理 Node.js 版本：
```bash
nvm install node  # 安装最新版本的 Node.js
```

### 如何在 Node.js 中使用 Worker Threads？

#### 1. 安装 Node.js 版本要求

Worker Threads 模块是从 Node.js 10.5.0 版本开始引入的，因此需要确保 Node.js 版本至少为 10.5.0。

你可以通过以下命令检查 Node.js 版本：
```bash
node -v
```

#### 2. 创建 Worker 线程

使用 worker_threads 模块，你可以创建一个工作线程，工作线程可以通过 postMessage 和主线程进行通信。每个线程都运行在独立的 V8 实例中，具有自己的事件循环。

主线程与 Worker 线程通信(main.js)
```js
const { Worker, isMainThread, parentPort } = require('worker_threads');

if (isMainThread) {
  // 主线程代码
  const worker = new Worker(__filename);  // 启动当前文件作为 worker
  
  worker.on('message', (result) => {
    console.log('从 Worker 线程收到的消息:', result);
  });

  worker.on('error', (error) => {
    console.error('Worker 线程出错:', error);
  });

  worker.on('exit', (exitCode) => {
    console.log(`Worker 线程退出，退出码: ${exitCode}`);
  });

  // 传递消息给 Worker 线程
  worker.postMessage('Hello from main thread');
} else {
  // Worker 线程代码
  parentPort.on('message', (message) => {
    console.log('从主线程收到的消息:', message);
    parentPort.postMessage('Hello from worker thread');
  });
}
```

#### 3. 传递数据给 Worker 线程

你可以通过 postMessage 向 Worker 线程传递数据，Worker 线程也可以通过 parentPort.postMessage 向主线程发送数据。

```js
// 在主线程中
worker.postMessage({ type: 'start', payload: [1, 2, 3] });

// 在 Worker 线程中
parentPort.on('message', (message) => {
  if (message.type === 'start') {
    const result = message.payload.map(x => x * 2);
    parentPort.postMessage(result);
  }
});
```

#### 4. 在 Worker 中执行 CPU 密集型任务

使用 Worker Threads 非常适合 CPU 密集型任务。比如如果你需要执行大量的计算任务，可以将这些任务分配给多个 Worker 线程，避免主线程被阻塞。

分配计算任务到 Worker 线程
```js
const { Worker, isMainThread, parentPort } = require('worker_threads');

function performHeavyComputation(data) {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./worker.js');  // worker.js 存放 Worker 线程代码
    
    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (exitCode) => {
      if (exitCode !== 0) {
        reject(new Error(`Worker stopped with exit code ${exitCode}`));
      }
    });

    worker.postMessage(data);
  });
}

// 主线程调用计算任务
performHeavyComputation([1, 2, 3, 4, 5]).then((result) => {
  console.log('计算结果:', result);
}).catch((err) => {
  console.error('计算失败:', err);
});
```

`worker.js` 文件内容（Worker 线程代码）：
```js
const { parentPort } = require('worker_threads');

parentPort.on('message', (data) => {
  // 模拟一个密集计算
  const result = data.map(x => x * 2);
  parentPort.postMessage(result);
});
```

#### 5. 共享内存（SharedArrayBuffer）

如果需要多个线程共享数据，可以使用 SharedArrayBuffer 和 Atomics 来实现共享内存。这对于需要共享大量数据的场景（如大规模并行计算）非常有用。

```js
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

if (isMainThread) {
  const sharedBuffer = new SharedArrayBuffer(4);
  const sharedArray = new Int32Array(sharedBuffer);

  const worker = new Worker(__filename, { workerData: sharedBuffer });

  worker.on('message', () => {
    console.log('Shared data after worker update:', sharedArray[0]);
  });

  worker.on('exit', () => {
    console.log('Worker done');
  });
} else {
  const sharedArray = new Int32Array(workerData);
  Atomics.add(sharedArray, 0, 10);  // 对共享数据进行操作
  parentPort.postMessage('Worker done');
}
```

#### 6. 处理错误

Worker 线程会独立于主线程运行，因此错误不会直接传递给主线程。你需要通过事件监听处理错误。

```js
const worker = new Worker(__filename);

worker.on('error', (error) => {
  console.error('Worker encountered an error:', error);
});

worker.on('exit', (code) => {
  if (code !== 0) {
    console.error(`Worker stopped with exit code ${code}`);
  }
});
```

### Node.js 如何处理大文件上传？

在 Node.js 中处理大文件上传通常会面临几个挑战，例如：内存限制、网络带宽、并发处理等。为了高效地处理大文件上传，我们通常会使用一些流式传输技术（如：stream），并采用第三方库来简化开发过程。

#### 1. 使用 express 和 multer 处理大文件上传

multer 是一个流行的中间件，用于处理 multipart/form-data 类型的表单数据，尤其是文件上传。它会处理文件流并将其存储到硬盘或内存中。

```js
const express = require('express');
const multer = require('multer');
const path = require('path');

// 配置文件存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // 设置上传的文件保存路径
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // 给文件命名
  }
});

// 创建上传中间件，限制文件大小为 100MB
const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 },  // 设置文件大小限制为100MB
}).single('file');  // 上传单个文件，字段名为 'file'

// 创建 express 应用
const app = express();

// 文件上传路由
app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).send('文件大小超过限制');
      }
      return res.status(500).send('上传失败');
    }
    res.status(200).send('文件上传成功');
  });
});

// 启动服务器
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
```
**解释**：
- 使用 multer.diskStorage 来定义文件保存路径和文件命名规则。
- limits: { fileSize: 100 * 1024 * 1024 } 用来限制文件上传的大小（例如，100MB）。
- upload.single('file') 处理单个文件上传，file 是上传文件的字段名。
- upload(req, res, callback) 负责实际的文件上传操作。

#### 2. 流式上传大文件

对于更大的文件或希望避免将整个文件加载到内存中的情况，可以使用 流式传输 来逐块上传文件，而不是一次性读取整个文件。Node.js 中的流（stream）可以帮助我们高效地处理大文件上传。

```js
const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

// 配置文件存储（不使用内存存储）
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // 上传的文件保存路径
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // 文件命名
  }
});

// 创建上传中间件
const upload = multer({ storage: storage }).single('file');

const app = express();

// 上传文件时处理流
app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).send('上传失败');
    }

    // 文件上传完成，处理文件流
    const filePath = path.join(__dirname, 'uploads', req.file.filename);
    const writeStream = fs.createWriteStream(filePath);
    req.pipe(writeStream);

    req.on('end', () => {
      res.status(200).send('文件上传成功');
    });

    req.on('error', (err) => {
      console.error('上传过程出错:', err);
      res.status(500).send('上传失败');
    });
  });
});

// 启动服务器
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```
**解释**：
- req.pipe(writeStream) 会将上传的文件流直接写入硬盘，避免将文件加载到内存中，从而节省内存。
- writeStream 用于将文件数据流写入磁盘。
- req.on('end') 监听上传完成的事件。
- req.on('error') 监听上传过程中的错误。

#### 3. 分片上传（Chunked Upload）

如果文件非常大，你可能需要采用 分片上传 的方式。分片上传是将大文件分成多个小块，逐个块上传到服务器，然后服务器将它们重新合并。通常分片上传会涉及以下步骤：

- 客户端将文件分成多个块（通常在前端使用 JavaScript）。
- 每个块都被上传到服务器，并且可以在服务器端处理。
- 服务器将这些块合并成最终的文件。

客户端代码（如使用 FormData 进行分片上传）：
```js
const file = document.querySelector('#fileInput').files[0];
const chunkSize = 1024 * 1024; // 每个块的大小（1MB）
let offset = 0;

function uploadChunk() {
  const chunk = file.slice(offset, offset + chunkSize);
  const formData = new FormData();
  formData.append('file', chunk);

  fetch('/upload-chunk', {
    method: 'POST',
    body: formData
  }).then(response => response.json()).then(data => {
    if (data.success) {
      offset += chunkSize;
      if (offset < file.size) {
        uploadChunk();  // 继续上传下一个块
      } else {
        console.log('文件上传完成');
      }
    }
  }).catch(err => console.error('上传失败', err));
}

uploadChunk();
```
服务器端接收分片上传：
```js
app.post('/upload-chunk', (req, res) => {
  const chunk = req.file;  // 获取文件块
  const filePath = path.join(__dirname, 'uploads', 'uploaded_file');

  // 将文件块写入磁盘
  fs.appendFileSync(filePath, chunk.buffer);

  res.json({ success: true });
});
```

#### 4. 其他优化方法

- **压缩文件**： 上传前先压缩文件，可以减少上传的文件大小，减轻带宽负担。
- **并发上传**： 可以在客户端将大文件拆分成多个块并并行上传，这样可以加速上传过程。
- **进度监控**： 使用 progress 库或前端 XMLHttpRequest 事件，监控上传进度，给用户反馈。
- **CDN**： 对于大型文件，可以考虑通过 CDN 进行文件上传，减少服务器负担。

### Node.js 如何进行负载均衡？

#### 1. 反向代理负载均衡（使用 Nginx 或 HAProxy）

使用 Nginx 实现负载均衡

假设你有多个 Node.js 实例（例如，运行在不同的端口），Nginx 作为反向代理来实现负载均衡。

配置 nginx.conf 文件：
```nginx
http {
    upstream node_backend {
        # 定义后端 Node.js 服务器列表
        server 127.0.0.1:3000;
        server 127.0.0.1:3001;
        server 127.0.0.1:3002;
    }

    server {
        listen 80;
        server_name yourdomain.com;

        location / {
            proxy_pass http://node_backend;  # 将请求转发到上面定义的 upstream（Node.js 后端）
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
}
```
启动 `Nginx`：
```bash
sudo service nginx start
```
启动多个 `Node.js` 实例：
```bash
node app.js 3000
node app.js 3001
node app.js 3002
```
通过这种方式，Nginx 会将 HTTP 请求均匀地分发到不同的 Node.js 实例，实现负载均衡。

**Nginx 支持的负载均衡策略**：
- 轮询（Round Robin）： 默认方式，按顺序将请求分配给各个服务器。
- 最少连接（Least Connections）： 将请求转发到当前连接数最少的服务器。
- IP 哈希（IP Hash）： 根据客户端的 IP 地址将请求始终转发给同一台服务器。

#### 2. 使用 Node.js 内建的 Cluster 模块

Node.js 的 cluster 模块允许你创建多个工作进程（worker），每个进程可以监听同一个端口，从而实现负载均衡。cluster 模块在单个 Node.js 实例中使用多个 CPU 核心，提高了处理能力。

```js
const cluster = require('cluster');
const http = require('http');
const os = require('os');

if (cluster.isMaster) {
    // 主进程负责创建工作进程（worker）
    const numCPUs = os.cpus().length;  // 获取 CPU 核心数

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();  // 每个 CPU 核心创建一个 worker
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`工作进程 ${worker.process.pid} 已退出`);
    });
} else {
    // 工作进程负责处理 HTTP 请求
    http.createServer((req, res) => {
        res.writeHead(200);
        res.end('Hello, Node.js Cluster!');
    }).listen(8000, () => {
        console.log(`工作进程 ${process.pid} 启动，监听 8000 端口`);
    });
}
```
**解释**：
- cluster.isMaster 检查当前进程是否是主进程，如果是主进程，它会创建多个工作进程。
- cluster.fork() 创建一个工作进程，每个工作进程会处理请求。
- 每个工作进程都会监听 8000 端口，因此 Node.js 会将请求均匀地分发到不同的进程上，实现负载均衡。

#### 3. 使用 PM2 集群模式

PM2 是 Node.js 的进程管理工具，支持集群模式，可以很方便地进行负载均衡。PM2 会根据 CPU 核心数自动创建多个进程来处理请求。

```bash
npm install pm2 -g
pm2 start app.js -i max # "max" 表示创建与 CPU 核心数相同的进程数
```
**优点**：
- PM2 会自动处理进程管理和负载均衡。
- PM2 提供了更多的功能，如监控、日志管理、自动重启等。

### 如何使用 PM2 进行进程管理？

```bash
# 安装pm2
npm install pm2 -g 

# 启动单个应用
pm2 start app.js

# 启动并指定名称
pm2 start app.js --name myapp

# 启动多个实例（集群模式）
pm2 start app.js -i max # 根据 CPU 核心数启动多个进程
# 指定要启动的进程数量
pm2 start app.js -i 4 # 启动 4 个进程

# 查看所有进程状态
pm2 list

# 查看所有进程日志
pm2 logs
# 查看特定应用的日志
pm2 logs myapp

# 停止名为 myapp 的应用
pm2 stop myapp
# 停止进程 ID 为 0 的应用
pm2 stop 0

# 重启进程
pm2 restart myapp
pm2 restart 0

# 删除进程
pm2 delete myapp
pm2 delete 0

# 查看进程详情
pm2 show myapp
pm2 show 0

# 文件改变时自动重启
pm2 start app.js --watch
# 如果应用重启次数超过 10 次，则停止重启
pm2 start app.js --max-restarts 10

# 为进程指定环境变量
pm2 start app.js --env production

# 持久化进程
pm2 startup # 设置 PM2 在系统重启后自动启动
pm2 save # 保存当前的进程列表

# 监控和统计
pm2 monit # 进入 PM2 监控页面，实时查看进程的 CPU 和内存使用情况

# 恢复上次保存的进程列表
pm2 resurrect
```

### 如何优化 Node.js 的内存使用？

#### 1. 使用正确的数据结构

选择合适的数据结构可以大大降低内存占用。对于大数据量的操作，尽量使用高效的数据结构（如哈希表、链表等），而不是简单的数组和对象。例如，使用 Map 和 Set 替代对象（{}）和数组（[]），因为它们提供了更高效的查找和插入。

#### 2. 使用流（Streams）处理大文件

在处理大文件或大量数据时，尽量使用流来处理数据，而不是一次性加载到内存中。Node.js 中的流（stream）可以帮助你逐块读取和处理数据，避免占用大量内存。
```js
const fs = require('fs');
const readline = require('readline');

const stream = fs.createReadStream('large-file.txt');
const rl = readline.createInterface({
  input: stream,
  crlfDelay: Infinity,
});

rl.on('line', (line) => {
  console.log(line);
});
```

#### 3. 定期进行垃圾回收

虽然 V8 引擎会自动进行垃圾回收，但在某些情况下，手动触发垃圾回收可能有助于优化内存使用。可以使用 global.gc() 来强制进行垃圾回收，但是需要在启动 Node.js 时启用 --expose-gc 标志。
```bash
node --expose-gc app.js
```
然后在代码中可以使用 global.gc() 强制触发垃圾回收：
```js
global.gc();
```
注意：过于频繁地触发垃圾回收可能会影响性能，通常只有在处理大数据量时才需要这样做。

#### 4. 避免内存泄漏

内存泄漏是指程序中未释放的内存，这会导致应用随着时间的推移占用越来越多的内存。可以采取以下措施来避免内存泄漏：

避免未解除的事件监听器： 确保在事件处理程序不再需要时，及时移除它们。
```js
const emitter = new EventEmitter();
emitter.on('data', handleData);

// 当事件监听器不再需要时
emitter.removeListener('data', handleData);
```

清理定时器（setTimeout 和 setInterval）： 如果某些定时器不再需要，确保它们被清理。
```js
const timer = setInterval(() => { console.log('hello'); }, 1000);

// 清理定时器
clearInterval(timer);
```
使用 `WeakMap` 或 `WeakSet` 来存储对象的引用，它们不会阻止垃圾回收。

#### 5. 限制内存的最大使用

Node.js 允许你限制进程的最大内存使用，默认情况下是 1.5GB。通过设置 --max-old-space-size，你可以控制 Node.js 的内存限制。

例如，限制最大内存为 2GB：
```bash
node --max-old-space-size=2048 app.js
```

#### 6. 内存分析和调试

利用工具进行内存分析，帮助你识别内存泄漏和内存占用异常。Node.js 提供了几种工具来进行内存分析：

- Heap snapshot：可以使用 Chrome DevTools 进行内存快照分析。
- heapdump：使用 heapdump 模块生成堆快照，帮助分析内存使用情况。

#### 7. 优化外部依赖

检查并优化应用中使用的外部依赖。一些外部库可能会导致内存占用过多或者内存泄漏，定期更新库版本，并避免引入不必要的模块。

#### 8. 使用缓存减少重复计算

如果你的应用在多个请求中处理相同的数据，考虑使用内存缓存（如 Redis、Memory-cache 等）来避免重复计算，从而节省内存。

#### 9. 分布式缓存和数据库

在需要处理大量数据时，尽量避免将所有数据都存储在内存中，而是使用外部缓存系统（如 Redis）和数据库进行分布式存储。

#### 10. 监控和自动化

通过监控工具（如 PM2、New Relic、Datadog 等）实时监控 Node.js 应用的内存使用情况。如果内存使用异常，及时采取措施（如重启进程或优化代码）。

#### 11. 避免大型 JSON 解析

如果你在处理非常大的 JSON 数据时，不要直接将其全部加载到内存中，可以考虑流式解析 JSON 数据。使用 JSONStream 进行大 JSON 文件的流式解析：

### 如何调试 Node.js 内存泄漏？

#### 1. 使用 --inspect 和 Chrome DevTools

Node.js 提供了 --inspect 选项，可以启用 V8 的调试协议，允许使用 Chrome DevTools 调试 Node.js 应用。你可以使用 Chrome DevTools 来进行内存快照分析，从而查找内存泄漏的原因。

**启动 Node.js 调试**

使用 --inspect 启动你的应用：
```bash
node --inspect app.js
```
此命令会在默认端口 9229 上启动调试，打开 Chrome 浏览器并访问 `chrome://inspect` 页面，点击 "Configure" 按钮，确认调试端口。

在 Chrome DevTools 中分析内存
- 进入 chrome://inspect 页面。
- 点击你的 Node.js 进程连接（通常显示为 "Remote Targets"）。
- 点击 "inspect" 按钮打开 DevTools。
- 在 DevTools 中，切换到 "Memory" 面板。
- 点击 "Heap snapshot" 按钮生成堆快照。

你可以在 "Memory" 面板中执行以下操作：
- Heap Snapshot：查看堆内存快照，分析对象的内存占用。
- Allocation Timeline：实时监控内存分配，查看内存使用的变化趋势。
- Allocation Profiling：跟踪对象分配的栈跟踪，帮助定位内存泄漏。

#### 2. 使用 heapdump 生成堆快照

heapdump 是一个用于生成 V8 堆快照的 Node.js 模块。你可以在运行中的应用中生成堆快照并分析内存泄漏。

安装 heapdump
```bash
npm install heapdump
```
生成堆快照，在你的应用中引入 heapdump，并在需要的地方触发堆快照生成。
```js
const heapdump = require('heapdump');

heapdump.writeSnapshot('/path/to/snapshot.heapsnapshot');
```

你可以在代码中的不同位置（例如在请求处理或特定操作后）生成堆快照。生成的 .heapsnapshot 文件可以通过 Chrome DevTools 进行分析。
```bash
google-chrome /path/to/snapshot.heapsnapshot
```

#### 3. 使用 memwatch-next 检测内存泄漏

memwatch-next 是一个检测 Node.js 内存泄漏的工具。它可以监控内存的增长，并在内存泄漏发生时发出警告。

安装 memwatch-next
```bash
npm install memwatch-next
```

使用 memwatch-next 监控内存
```js
const memwatch = require('memwatch-next');

// 监控内存使用情况
memwatch.on('leak', (info) => {
console.log('Memory Leak Detected:', info);
});

setInterval(() => {
// 模拟应用逻辑
}, 1000);
```
memwatch-next 会在检测到内存泄漏时输出详细信息，包括泄漏的内存大小和栈跟踪。

#### 4. 使用 clinic.js 分析内存

clinic.js 是一个非常强大的 Node.js 性能分析工具，它可以帮助你查找内存泄漏、CPU 使用等性能问题。clinic 包含多个子工具，其中 clinic doctor 是最常用的用于分析内存和性能问题。

安装 clinic
```bash
npm install -g clinic
```
使用 clinic 进行性能分析

启动应用并使用 clinic doctor 分析：
```bash
clinic doctor -- node app.js
```
按照提示进行操作，完成后查看报告。

报告中将详细显示内存使用情况，并帮助你定位潜在的内存泄漏问题。

#### 5. 手动检查内存泄漏

手动检查代码是找出内存泄漏的另一个方法。常见的内存泄漏原因包括：

- 未清理的事件监听器：忘记移除不再需要的事件监听器会导致对象持续引用。
- 未清理的定时器：定时器未清除会导致其回调仍然保持对某些对象的引用。
- 闭包中的引用：在闭包中保持对外部对象的引用，导致对象无法被垃圾回收。

你可以检查应用中使用的对象，尤其是在事件处理和定时器回调中，确保在不再需要时清除不必要的引用。

#### 6. 使用 v8-profiler-next 进行分析

v8-profiler-next 是一个用于创建 V8 性能分析文件的 Node.js 模块。你可以通过它生成一个 CPU 性能分析文件，帮助你了解内存的使用和分配情况。

安装 v8-profiler-next
```bash
npm install v8-profiler-next
```

使用 v8-profiler-next 生成分析文件
```js
const profiler = require('v8-profiler-next');
const fs = require('fs');

profiler.startProfiling('memory-profile');
setTimeout(() => {
const profile = profiler.stopProfiling('memory-profile');
profile.export()
.pipe(fs.createWriteStream('profile.cpuprofile'))
.on('finish', () => {
profile.delete();
});
}, 10000);
```
然后，你可以使用 Chrome DevTools 来分析生成的 profile.cpuprofile 文件。

#### 7. 使用 Node.js 内置的 process.memoryUsage

Node.js 提供了 process.memoryUsage() 方法，可以帮助你监控应用的内存使用情况。它返回一个对象，其中包含了内存的各种指标。

```js
const memoryUsage = process.memoryUsage();
console.log(memoryUsage);
```
返回的对象包含以下字段：
- rss：常驻集大小（Resident Set Size），即应用的总内存使用量。
- heapTotal：V8 堆内存的总大小。
- heapUsed：V8 堆内存的已用大小。
- external：由 C++ 对象占用的内存（例如，Node.js 中的 Buffer 对象）。

**总结**

调试内存泄漏是一个循序渐进的过程。常见的步骤包括：

- 使用 `Chrome DevTools` 的堆快照功能进行内存分析。
- 使用 `heapdump` 或 `clinic.js` 生成堆快照并分析。
- 利用 `memwatch-next` 监控内存泄漏。
- 手动排查代码中可能导致内存泄漏的地方，如事件监听器和定时器。

### 如何使用 cluster 模块提高性能？

Node.js 的 cluster 模块允许你利用多核处理器的优势，通过创建多个工作进程（workers）来提升应用的性能，特别是在高并发的场景中。每个工作进程都可以共享服务器端口，从而提高系统的处理能力。使用 cluster 模块能够提高应用的吞吐量和响应速度，减少单个进程的负载压力。

使用 cluster 模块

**步骤 1**：在主进程中启动多个工作进程

首先，你需要使用 cluster.fork() 来启动多个工作进程，每个工作进程都会有独立的事件循环和内存空间。

**步骤 2**：监听请求和分配给工作进程

主进程通常会监听来自客户端的请求，然后将这些请求分发给不同的工作进程。

**步骤 3**：处理工作进程崩溃

如果某个工作进程崩溃了，主进程可以重新启动一个新的工作进程来代替它。

```js
const http = require('http');
const cluster = require('cluster');
const os = require('os');

// 获取 CPU 核心数量
const numCPUs = os.cpus().length;

// 如果当前进程是主进程
if (cluster.isMaster) {
    // 为每个 CPU 启动一个工作进程
    console.log(`Master process is running on pid ${process.pid}`);
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();  // 启动一个工作进程
    }

    // 监听工作进程退出
    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
    });
} else {
    // 工作进程
    http.createServer((req, res) => {
        res.writeHead(200);
        res.end('Hello, world!');
    }).listen(8000);

    console.log(`Worker ${process.pid} started`);
}
```
- cluster.isMaster: 判断当前进程是否为主进程。如果是主进程，使用 cluster.fork() 创建多个工作进程。
- cluster.fork(): 用于启动一个新的工作进程。
- cluster.on('exit'): 监听工作进程退出事件，如果某个工作进程崩溃，主进程可以启动一个新的工作进程来替代它。
- http.createServer(): 每个工作进程都会启动一个 HTTP 服务器，监听同一个端口（8000）。

## 7. 安全性

### 如何防止 SQL 注入？

#### 1. 使用预处理语句（Prepared Statements）

最有效的防止 SQL 注入的方式是使用预处理语句或参数化查询。预处理语句会将 SQL 语句的结构与用户输入的值分开，确保用户输入的内容不会直接拼接到 SQL 语句中，从而防止 SQL 注入。

#### 2. 使用 ORM（对象关系映射）工具

现代开发框架大多提供了 ORM 工具，它们通常会自动防止 SQL 注入，因为 ORM 在构造 SQL 查询时会使用参数化查询。

使用 Sequelize（Node.js 的 ORM）：
```js
const { User } = require('./models');

// 使用 ORM 自动防止 SQL 注入
User.findOne({
    where: {
        id: 5
    }
}).then(user => {
    console.log(user);
});
```

#### 3. 对用户输入进行数据验证和过滤

除了使用预处理语句外，还可以通过验证用户输入来限制输入的格式和内容。这样可以有效减少恶意输入的可能性。

常见的输入验证措施：
- 检查输入的类型：确保用户输入的值符合预期的类型（如整数、字符串、日期等）。
- 限制输入的长度：防止用户输入过长的内容。
- 过滤非法字符：对特殊字符进行过滤（如 ;、'、"、-- 等）。

#### 4. 避免直接拼接 SQL 查询

不要将用户输入直接拼接到 SQL 查询语句中，这样容易导致 SQL 注入漏洞。

#### 5. 最小化数据库权限

尽量限制数据库用户的权限，仅授予其执行必要操作的权限。比如，如果应用只需要读取数据，就不要给予删除数据的权限。这样即使攻击者成功注入恶意 SQL，损害也会被限制在最低范围。

- 不要使用 root 用户连接数据库：在开发和生产环境中，使用具有最小权限的数据库用户。
- 最小化表权限：确保数据库用户仅能访问应用需要的表。

#### 6. 定期审计和更新代码

定期审查和更新应用程序代码，修复潜在的 SQL 注入漏洞。如果你依赖于第三方库或框架，确保它们保持最新，并且没有已知的漏洞。

#### 7. 使用 Web 应用防火墙（WAF）

Web 应用防火墙可以帮助检测和拦截常见的 SQL 注入攻击。WAF 可以拦截恶意的 SQL 请求并发出警报，防止攻击者利用注入漏洞进行攻击。

#### 8. 启用数据库日志记录和监控

启用数据库的查询日志，并定期检查这些日志。这可以帮助你发现异常的数据库操作，比如异常的查询模式或未知的 SQL 查询。

#### 9. SQL 注入漏洞示例

攻击示例： 如果没有防止 SQL 注入的机制，攻击者可能会向登录表单输入以下内容：

- username=' OR '1'='1
- password=' OR '1'='1

这种输入会导致查询变成：
```sql
SELECT * FROM users WHERE username = '' OR '1'='1' AND password = '' OR '1'='1';
```
由于 '1' = '1' 总是为真，查询会返回所有用户数据，从而绕过身份验证。

### 如何防止 XSS（跨站脚本攻击）？

#### 1. 对用户输入进行过滤和转义

对所有用户输入进行严格的验证和转义，确保其中不包含恶意脚本。常见的 XSS 攻击往往通过插入 HTML、JavaScript 等标签来注入恶意代码。因此，在将用户输入呈现到页面上时，需要对特殊字符进行转义。

##### 1.1 过滤 HTML 标签

一个常见的做法是移除或转义用户输入中的 HTML 标签，例如 `<script>`、`<img>` 等标签。

HTML 标签过滤：去除或替换不允许的 HTML 标签。

##### 1.2 转义用户输入

使用转义的方式处理用户输入，确保用户输入中的特殊字符被安全地显示出来。比如，< 转义为 &lt;，> 转义为 &gt;，& 转义为 &amp; 等。

例如，在后端输出 HTML 内容时可以使用一些库来进行转义。Node.js 中常用的库有 he、escape-html。
```js
const escapeHtml = require('escape-html');

const safeString = escapeHtml('<script>alert("XSS")</script>');
console.log(safeString); // 输出: &lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;
```

##### 1.3 例子：对用户输入进行转义

```html
<div>
  <p>用户输入：</p>
  <p id="user-input">&lt;script&gt;alert('XSS')&lt;/script&gt;</p>
</div>
```
这个 HTML 输出中，`<script>` 被转义为 &lt;script&gt;，这将防止浏览器执行恶意的脚本。

#### 2. 使用内容安全策略（CSP）

内容安全策略（CSP）是一种用于防止 XSS 攻击的安全机制。CSP 通过限制浏览器加载哪些资源来减少恶意脚本的执行。

CSP 允许你控制哪些源的脚本可以在页面中执行。如果你为站点配置了 CSP，浏览器会严格按照 CSP 的规则来加载资源，拦截所有不符合规则的资源（例如，外部的、未经授权的脚本）。

##### 2.1 配置 CSP 头

通过设置 HTTP 响应头来启用 CSP，通常你可以在服务器端配置 CSP 头。例如，在 Node.js 中使用 Express 可以这样做：
```js
const express = require('express');
const app = express();

// 设置 CSP 头
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; object-src 'none';");
  next();
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000);
```
- default-src 'self' 表示只允许从当前域名加载资源。
- script-src 'self' 表示只允许加载当前域的脚本。
- object-src 'none' 表示不允许加载 Flash 等插件。

#### 3. 避免动态插入 HTML（如 innerHTML）

避免使用 innerHTML、document.write() 或类似的动态 HTML 插入方法，因为它们会将用户输入解析为 HTML，并可能导致脚本执行。

##### 3.1 替代方案：使用 textContent 或 createTextNode()

如果你需要将用户输入显示在网页上，可以使用 textContent 或 createTextNode()，这些方法会自动将用户输入处理为文本，而不是 HTML 元素。
```js
const userInput = '<script>alert("XSS")</script>';
const div = document.createElement('div');

// 使用 textContent 安全地插入文本
div.textContent = userInput;
document.body.appendChild(div);
```

##### 3.2 避免使用 innerHTML:

```js
// 不安全的做法
div.innerHTML = '<div>' + userInput + '</div>'; // 可能导致 XSS 攻击

// 安全的做法
div.textContent = userInput; // 安全地插入文本，不会解析 HTML
```

#### 4. 使用框架的模板引擎

现代的 Web 开发框架通常使用模板引擎（如 React、Vue、Angular）来渲染 HTML，这些模板引擎会自动对输出进行转义。使用模板引擎时，确保你正确地使用它们的功能，这样可以避免直接将用户输入插入到页面中。

```jsx
const userInput = '<script>alert("XSS")</script>';
const element = <div>{userInput}</div>;
// React 会自动对 userInput 进行转义，避免 XSS 攻击
```

#### 5. 验证和限制用户输入

对用户输入进行严格的验证和限制，防止恶意输入。比如，你可以对输入内容进行白名单检查，限制输入的字符类型和长度。对于需要的用户输入（如文本框、评论等），可以限制只允许特定字符的输入。

- 文本输入：只允许字母、数字和常规符号。
- 评论系统：可以限制用户评论的 HTML 标签，或者完全禁止 HTML 标签。

#### 6. HttpOnly 和 Secure Cookie 标志

设置 HttpOnly 和 Secure 标志的 Cookie 可以防止通过 JavaScript 访问到这些 Cookie。这有助于防止攻击者通过 XSS 攻击盗取会话 Cookie。

- HttpOnly: 阻止 JavaScript 访问 Cookie。
- Secure: 只有通过 HTTPS 连接时，才会发送 Cookie。

#### 7. 避免使用 URL 参数执行动态脚本

避免通过 URL 参数动态执行脚本。恶意用户可以通过构造恶意的 URL 参数来尝试注入 XSS 攻击代码。

#### 8. 使用 HTTPOnly 和 SameSite Cookie

启用 HTTPOnly 和 SameSite 属性的 Cookie 可以增强会话的安全性，减少 XSS 攻击中 Cookie 被窃取的风险。
```js
res.cookie('session', sessionId, {
  httpOnly: true,
  secure: true,      // 在 HTTPS 下才会发送
  sameSite: 'Strict' // 防止跨站请求伪造攻击 (CSRF)
});
```

防止 XSS 攻击的关键是：

- 对所有用户输入进行验证和转义。
- 使用安全的 API，如 textContent，避免动态插入 HTML。
- 配置内容安全策略（CSP）。
- 使用框架时，依赖框架的安全机制（如 React 和 Vue 会自动转义数据）。
- 限制和验证用户输入，避免恶意脚本的注入。

### 如何防止 CSRF（跨站请求伪造）？

#### 1. 使用 CSRF Token（防御首选 ✅）

在表单或 AJAX 请求中嵌入一个服务器生成的、不可预测的 token，服务端验证该 token 是否匹配。

**工作原理**：
- 服务端生成一个随机 token，存入用户的 session 或 cookie。
- 在 HTML 表单中或 AJAX 请求中，把 token 一并提交。
- 后端验证提交的 token 与 session 中的一致，否则拒绝请求。

```js
const express = require('express');
const session = require('express-session');
const csrf = require('csurf');

const app = express();
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
app.use(csrf());

app.get('/form', (req, res) => {
  res.send(`
    <form method="POST" action="/process">
      <input type="hidden" name="_csrf" value="${req.csrfToken()}">
      <button type="submit">提交</button>
    </form>
  `);
});

app.post('/process', (req, res) => {
  res.send('表单提交成功');
});
```

#### 2. SameSite Cookie 属性

通过设置 Cookie 的 SameSite 属性，限制 Cookie 在跨站请求中携带。

- Strict: 完全禁止第三方请求携带 Cookie；
- Lax: 允许 GET 请求（如链接跳转）携带；
- None: 允许所有跨站请求（但必须搭配 Secure）。

```js
res.cookie('session_id', sessionId, {
  httpOnly: true,
  secure: true,
  sameSite: 'Strict' // 或 Lax，视情况而定
});
```

#### 3. 验证 Referer 或 Origin 头

在服务端校验请求头的来源是否是合法的本站。

```js
app.post('/process', (req, res) => {
  const referer = req.get('Referer') || '';
  if (!referer.startsWith('https://yourdomain.com')) {
    return res.status(403).send('非法请求');
  }
  // 合法处理请求
});
```
缺点：Referer 有可能被代理清除或伪造。

#### 4. 使用双重 Cookie 验证

一种轻量的 CSRF 防御方案：
- 服务端生成随机 token，设置到 Cookie 中；
- 客户端 JS 从 Cookie 中读取该 token，附加到请求头（或请求体）；
- 服务端验证请求中的 token 是否和 Cookie 中一致。

攻击者无法从 Cookie 中读出 token，因此伪造失败。

#### 5. 限制敏感操作使用 GET 请求

确保敏感操作（如删除、修改）使用 `POST/PUT/DELETE` 请求，避免攻击者通过 `<img src="">`、`<a href="">` 等 GET 请求伪造操作。

| 防御方式	              | 推荐程度    | 	说明                      |
|:-------------------|:--------|:-------------------------|
| CSRF Token	        | ⭐⭐⭐⭐⭐	  | 最常用、最安全的方式               |
| SameSite Cookie	   | ⭐⭐⭐⭐	   | 浏览器层面的强保护，推荐开启           |
| Referer/Origin 校验	 | ⭐⭐	     | 可作为辅助手段                  |
| 双重 Cookie 验证	      | ⭐⭐⭐	    | 比 CSRF Token 简单，但需要配合 JS |
| 禁用跨域请求	            | ⭐	      | 过于激进，可能影响正常功能            |

如果你使用的是现代前端框架（如 React/Vue）+ 后端框架（Express/Koa 等），建议开启 CSRF token 和 SameSite cookie 一起用，能覆盖绝大多数场景。

### 如何防止 DOS 攻击？

防止 DoS（Denial of Service，拒绝服务）攻击的核心目标是保护系统不被过量请求拖垮，保障正常用户访问。下面我们从 应用层、服务器层、网络层 三个维度讲解，并附带一些具体方法与 Node.js 示例。

DoS 攻击通过大量请求或恶意数据，占用资源（CPU、内存、带宽、连接数等），导致服务器无法正常服务。
如果攻击来自多个源头，即称为 DDoS（分布式拒绝服务攻击）。

#### 1. 限制请求频率（Rate Limiting）【首选！】

防止单个 IP 在短时间内发出过多请求。
```js
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1分钟
  max: 100,            // 每个IP最多100个请求
  message: '请求过于频繁，请稍后再试。',
});

app.use(limiter);
```

#### 2. 使用 CDN 和 WAF

- CDN（如 Cloudflare、阿里云 CDN）：可抵挡海量恶意请求，减少源站压力；
- WAF（Web Application Firewall）：检测恶意请求、爬虫、攻击行为（如 SQL 注入、XSS）；

#### 3. Nginx/Apache 层限流

利用反向代理（如 Nginx）提前拦截异常请求。
```nginx
# 含义：每个 IP 每秒最多 10 个请求，突发最多 20 个。

limit_req_zone $binary_remote_addr zone=mylimit:10m rate=10r/s;

server {
    location / {
        limit_req zone=mylimit burst=20 nodelay;
        proxy_pass http://localhost:3000;
    }
}
```

#### 4. 使用 Redis 等缓存防御高频接口

如登录、短信验证码类接口，应加入缓存判断：
```js
// 记录手机号发送验证码次数
const key = `sms:limit:${phone}`;
const count = await redis.incr(key);
if (count > 5) return res.status(429).send('请求过于频繁');
await redis.expire(key, 60); // 设置 1 分钟过期
```

#### 5. 验证码（图形/滑动）

限制机器人或自动脚本请求，特别适用于注册、登录等接口。

#### 6. 异步/限流处理耗时任务

- 大型任务（如文件解析、视频转码）可通过队列排队处理；
- 使用 bull、kue 等库或消息队列系统（如 RabbitMQ、Kafka）；

#### 7. 进程或线程隔离

- Node.js 单线程，推荐使用 Cluster 或 Worker Threads 模块拆分工作；
- 或使用 PM2 开启多进程，提升抗压能力：
- 
```bash
pm2 start app.js -i max  # 根据 CPU 核心数启动多个进程
```

#### 8. 内存保护 & GC监控

设置合理的内存限制避免攻击者拖垮服务：
```bash
node --max-old-space-size=512 app.js  # 限制最大内存 512MB
```

#### 🚫 防御误区

| 错误做法	          | 说明              |
|:---------------|:----------------|
| 只靠前端限制请求频率	    | 攻击者可绕过前端，直接请求接口 |
| 依赖日志审查后处理	     | 响应太慢，已经造成影响     |
| 忽视爬虫和 IP 切换行为	 | 攻击者可能频繁更换 IP    |

#### 🔐 总结防御策略（建议组合使用）：

| 层级	    | 技术方案                         |
|:-------|:-----------------------------|
| 网络层	   | CDN、防火墙、防DDoS服务              |
| 服务器层	  | Nginx 限流、负载均衡、WAF            |
| 应用层	   | express-rate-limit、验证码、缓存限流  |
| 架构层	   | 队列异步处理、Cluster多进程            |

### 如何防止目录遍历攻击？

目录遍历攻击（Directory Traversal）是一种试图访问服务器上不允许访问的文件或目录的攻击手段。攻击者通常会构造路径，比如 ../../etc/passwd，来越权访问敏感文件。

目录遍历攻击利用“路径跳转”漏洞访问到服务器的上层目录，常见形式如下：
```bash
http://example.com/read?file=../../../../../etc/passwd
```
如果服务器没有正确限制，这可能会返回敏感系统文件！

#### 1. 永远不要直接拼接用户输入为路径

**危险写法**：不推荐
```js
const filePath = './uploads/' + req.query.file;
fs.readFile(filePath, (err, data) => {});
```
如果 req.query.file = ../../etc/passwd，就完了……

#### 2. 使用 path.join() + path.normalize()

- path.normalize()：规范化路径
- path.join()：安全拼接路径

```js
const path = require('path');
const fs = require('fs');

const safeBaseDir = path.resolve(__dirname, 'uploads');
const requestedFile = req.query.file;

const targetPath = path.resolve(safeBaseDir, requestedFile);

// 确保请求路径不跳出 uploads 目录
if (!targetPath.startsWith(safeBaseDir)) {
  return res.status(403).send('禁止访问');
}

fs.readFile(targetPath, (err, data) => {
  if (err) return res.status(404).send('文件不存在');
  res.send(data);
});
```

#### 3. 白名单机制

只允许访问指定文件或文件类型，例如：
```js
const allowedFiles = ['report.pdf', 'manual.txt'];
if (!allowedFiles.includes(req.query.file)) {
  return res.status(403).send('非法访问');
}
```

#### 4. 限制文件后缀（防止读取源代码）

```js
if (!/^[a-zA-Z0-9_\-]+\.(txt|jpg|png)$/.test(req.query.file)) {
  return res.status(400).send('文件名不合法');
}
```

#### 5. 使用专门中间件限制静态目录访问

比如 Express 的 express.static 本身就带有防御能力：
```js
app.use('/public', express.static(path.join(__dirname, 'public')));
```
这只允许访问 public 目录下的文件，目录遍历会被阻止。

#### 6. 服务器端设置权限

在操作系统层：
- 限制 Node.js 进程访问权限
- 设置上传/读取目录的用户权限最小化（如 chroot、Docker 沙箱）

### 如何管理 Node.js 中的环境变量？

#### 常见用法：使用 process.env

```js
const dbHost = process.env.DB_HOST;
const secretKey = process.env.SECRET_KEY;
```

#### 使用 .env 文件 + dotenv 库（最推荐）

```ini
PORT=3000
DB_HOST=localhost
SECRET_KEY=mysecret
```
安装 dotenv
```bash
npm install dotenv
```
在项目入口文件中加载 .env
```js
require('dotenv').config();

const port = process.env.PORT;
console.log(`🌍 Server running on port ${port}`);
```
dotenv 会把 .env 文件中的内容加载到 process.env 中。

### 如何使用 Helmet.js 增强 Express 的安全性？

### 如何存储用户密码？

## 8. 微服务架构

### 什么是微服务？

### Node.js 适合做微服务吗？

Node.js 非常适合做微服务架构，很多大型项目（如 Netflix、Uber、PayPal）都在使用 Node.js 构建微服务系统。下面我们详细分析为什么 Node.js 适合，以及在微服务中的典型应用方式。

| 优势	            | 说明                                    |
|:---------------|:--------------------------------------|
| ⚡ 高并发、I/O 非阻塞	 | Node.js 使用事件驱动 + 异步非阻塞，非常适合处理高并发的网络请求 |
| 📦 模块化强	       | 微服务鼓励“单一职责”，Node 的模块系统天然适配            |
| 🚀 启动快	        | 相比 Java 等，Node 启动更轻快，适合小型服务           |
| 🔁 生态丰富	       | 拥有大量 NPM 模块（如 HTTP、数据库、认证、消息队列）       |
| 🌐 JSON 天然支持	  | 前后端 JSON 通信天然契合（比如 REST、GraphQL）      |
| 🧩 易于集成	       | 可轻松与 Redis、Kafka、RabbitMQ、gRPC 等服务集成  |

#### 1. 服务划分

- 用户服务（User Service）
- 订单服务（Order Service）
- 商品服务（Product Service）
- 支付服务（Payment Service）

每个服务可使用独立的 Node 项目运行在不同端口或容器中。

#### 2. 通信方式

- 🔁 REST API（常见，简单）
- 📨 消息队列（Kafka、RabbitMQ，解耦）
- 🔗 gRPC（高性能通信）
- 📬 Event-driven（事件驱动架构）

#### 3. 常见技术栈

| 功能	      | 推荐方案                               |
|:---------|:-----------------------------------|
| 服务框架	    | Express、Fastify、NestJS（推荐）         |
| 配置管理	    | dotenv、config                      |
| 数据库访问	   | Sequelize、Prisma、Mongoose          |
| 认证	      | JWT、OAuth2、Passport.js             |
| 服务注册与发现	 | Consul、etcd、Kubernetes             |
| 接口通信	    | REST、gRPC、MQ（Kafka、Redis Pub/Sub）  |
| API网关	   | Kong、Nginx、BFF 服务                  |
| 容器化	     | Docker + Kubernetes                |
| 监控	      | Prometheus + Grafana、Elastic Stack |
| 日志	      | Winston、Pino、ElasticSearch         |

Node.js 做微服务的注意点

| 问题	              | 应对策略                            |
|:-----------------|:--------------------------------|
| CPU 密集型操作阻塞事件循环	 | 使用 Worker Threads、拆到 Go/Rust 服务 |
| 服务间通信复杂	         | 使用 API 网关或 gRPC 管理接口            |
| 分布式事务困难	         | 使用事件最终一致性 + 重试机制                |
| 日志和监控缺失	         | 接入日志收集、健康检查、中间件监控               |

### 如何在 Node.js 中实现微服务？

### 如何使用 gRPC 进行服务间通信？

### 如何使用 RabbitMQ/Kafka 进行消息队列处理？

### 如何使用 Redis 作为消息队列？

### 如何在 Node.js 中进行分布式追踪？

## 9. 部署与运维

### 如何部署 Node.js 应用？

### 如何使用 Docker 部署 Node.js 应用？

### 如何使用 Nginx 作为反向代理？

### 如何使用 CI/CD 部署 Node.js 应用？

### 如何监控 Node.js 应用的性能？

### 如何优化 Node.js 的日志管理？

### Node.js 在 Kubernetes 中如何运行？

## 10. 其他高级问题

### Node.js 如何进行无服务器（Serverless）开发？

### 如何在 Node.js 中进行 WebSocket 通信？

### NestJS 和 Express 有什么区别？

### 如何实现一个简单的 CLI 工具？

### 如何在 Node.js 中实现 GraphQL？

### 如何处理 Node.js 应用的异常？

### 如何优化 Node.js 的 GC（垃圾回收）？

### Node.js 的全局对象有哪些？