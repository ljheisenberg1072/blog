---
outline: deep
---

`WebSocket` 是一种 全双工（双向通信）协议，它允许客户端（如浏览器）和服务器之间保持长连接，并实现 实时数据交互。

## 核心特点

- **双向通信**：客户端和服务器可以相互主动发送消息，而不需要客户端每次发请求。

- **低延迟**：相比传统的 HTTP 轮询，WebSocket 只建立一次连接，减少了额外的 HTTP 开销，提高了实时性。

- **基于 TCP**：使用 ws://（或加密的 wss://）协议，在单个 TCP 连接上进行全双工通信。

## 常见应用场景

- **实时聊天**（如微信网页版、客服系统）

- **在线游戏**（如多人在线竞技）

- **股票/币价实时更新**

- **协同编辑**（如 Google Docs）

下面是一个基于 PHP 和 Ratchet 库实现简单 WebSocket 聊天项目的示例

## **步骤概述**：

- 使用 Composer 安装 Ratchet 库
- 编写 WebSocket 服务器端代码，实现基本的连接、消息广播和错误处理
- 编写简单的 HTML + JavaScript 客户端来与服务器交互

## 1. 安装 Ratchet

在你的项目目录下使用 Composer 安装 Ratchet：

```bash
composer require cboden/ratchet
```

## 2. 编写服务器端代码

新建一个文件，例如 `server.php`，内容如下：

```php
<?php

require __DIR__ . '/vendor/autoload.php';

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

class Chat implements MessageComponentInterface {

    protected $clients;

    public function __construct() {
        // 使用 SplObjectStorage 存储所有连接的客户端
        $this->clients = new \SplObjectStorage;
        echo "Chat server started...\n";
    }

    // 新客户端连接时调用
    public function onOpen(ConnectionInterface $conn) {
        $this->clients->attach($conn);
        echo "New connection: ({$conn->resourceId})\n";
    }

    // 接收到消息时调用
    public function onMessage(ConnectionInterface $from, $msg) {
        $numRecv = count($this->clients) - 1;
        echo sprintf('Connection %d sending message "%s" to %d other connection%s' . "\n",
            $from->resourceId, $msg, $numRecv, $numRecv == 1 ? '' : 's');

        // 将消息广播给所有的客户端包括发送者
        foreach ($this->clients as $client) {
            $client->send($msg);
            //  排除发送者
            //  if ($from !== $client) {
            //      $client->send($msg);
            //  }
        }
    }

    // 客户端断开连接时调用
    public function onClose(ConnectionInterface $conn) {
        $this->clients->detach($conn);
        echo "Connection {$conn->resourceId} has disconnected\n";
    }

    // 发生错误时调用
    public function onError(ConnectionInterface $conn, \Exception $e) {
        echo "An error has occurred: {$e->getMessage()}\n";
        $conn->close();
    }
}

// 设置服务器监听的端口（例如 8080）
$port = 8080;
$server = \Ratchet\Server\IoServer::factory(
    new \Ratchet\Http\HttpServer(
        new \Ratchet\WebSocket\WsServer(
            new Chat()
        )
    ),
    $port
);

echo "Server is running on port {$port}\n";
$server->run();

```
**说明**：

- **onOpen**：当有新的 `WebSocket` 连接时，将连接存入客户端集合中。
- **onMessage**：当接收到消息时，将消息广播给所有其他连接的客户端。
- **onClose**：当连接关闭时，从客户端集合中移除该连接。
- **onError**：当发生错误时，输出错误并关闭连接。

## 3. 编写客户端页面

创建一个简单的 `HTML` 文件（例如 `index.html`），用于与 `WebSocket` 服务器通信：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>PHP WebSocket 聊天</title>
  <style>
    #chat {
      width: 500px;
      height: 300px;
      border: 1px solid #ccc;
      overflow-y: scroll;
      margin-bottom: 10px;
      padding: 10px;
    }
    #message {
      width: 400px;
    }
  </style>
</head>
<body>
  <div id="chat"></div>
  <input type="text" id="message" placeholder="输入消息">
  <button id="send">发送</button>

  <script>
    // 建立 WebSocket 连接（注意：如果服务器不在本机，请修改地址）
    var conn = new WebSocket('ws://localhost:8080');
    var chat = document.getElementById('chat');

    conn.onopen = function(e) {
      console.log("WebSocket 连接成功！");
    };

    // 接收到服务器消息时添加到聊天窗口
    conn.onmessage = function(e) {
      var p = document.createElement('p');
      p.textContent = e.data;
      chat.appendChild(p);
      // 滚动到聊天窗口底部
      chat.scrollTop = chat.scrollHeight;
    };

    // 点击发送按钮时，将消息发送给服务器
    document.getElementById('send').onclick = function() {
      var msgInput = document.getElementById('message');
      var msg = msgInput.value;
      if (msg !== '') {
        conn.send(msg);
        msgInput.value = '';
      }
    };
  </script>
</body>
</html>

```

**说明**：

- 页面中有一个显示聊天内容的 `div` 和一个文本输入框、发送按钮。
- 使用 `JavaScript` 的 `WebSocket` 对象连接到 `ws://localhost:8080`。
- 当收到消息时，在聊天窗口中添加一个段落；点击按钮时，将输入内容发送到服务器。

## 4. 运行测试
在命令行中运行服务器端代码：

```bash
php server.php
```

控制台会输出 “Server is running on port 8080”

用浏览器打开 `index.html` 文件，打开多个浏览器窗口或标签页进行测试。

输入消息后点击“发送”，你会看到所有其他窗口都会收到该消息，从而实现简单的聊天功能。