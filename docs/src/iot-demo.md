---
outline: deep
---

物联网简单 Demo (Node.js +MQTT)

场景： 假设你有一个温度传感器，它会定期上传温度数据到服务器，服务器可以控制风扇开关。

## 服务器（IoT Broker）

服务器负责接收温度数据，并决定是否打开风扇。使用 MQTT（物联网常用的通信协议）。

新建一个`server.js`文件，代码如下：

```js
const mqtt = require("mqtt");
//  免费的 MQTT 服务器
const brokerUrl = "mqtt://test.mosquitto.org";

const client = mqtt.connect(brokerUrl);

client.on("connect", () => {
    console.log("✅ 服务器已连接到 MQTT");
    //  订阅温度数据
    client.subscribe("iot/temperature");
});

client.on("message", (topic, message) => {
    const temp = parseFloat(message.toString());
    console.log(`🌡️ 收到温度数据: ${temp}°C`);
    
    if (temp > 30) {
        console.log("🔥 太热了，打开风扇");
        client.publish("iot/fan", "ON");
    } else {
        console.log("😊 温度正常，风扇关闭");
        client.publish("iot/fan", "OFF");
    }
});
```

📌 **解释**：

- 连接到 MQTT 服务器。
- 监听 "iot/temperature" 主题，收到温度数据后进行判断。
- 如果温度大于 30°C，发送 "ON" 指令到 "iot/fan" 主题，否则发送 "OFF"。

## 设备端（传感器 + 风扇）

新建一个`device.js`文件，代码如下：

```js
const mqtt = require("mqtt");
//  免费的 MQTT 服务器
const brokerUrl = "mqtt://test.mosquitto.org";

const client = mqtt.connect(brokerUrl);

client.on("connect", () => {
    console.log("✅ 设备已连接到 MQTT");

    // 模拟温度传感器，每 3 秒发送一次数据
    setInterval(() => {
        // 生成 25°C - 35°C 之间的温度
        const temp = (Math.random() * 10 + 25).toFixed(2);
        console.log(`📡 发送温度: ${temp}°C`);
        client.publish("iot/temperature", temp);
    }, 3000);

    // 订阅风扇控制指令
    client.subscribe("iot/fan");
});

client.on("message", (topic, message) => {
    console.log(`💡 风扇状态: ${message.toString()}`);
});
```

📌 **解释**：

- 设备端每 3 秒模拟上传一次温度数据。
- 设备端订阅 "iot/fan"，接收服务器的风扇控制指令。

## 运行步骤

### 安装依赖

```bash
npm install mqtt
```

### 启动服务器

```bash
node server.js
```

### 启动设备

```bash
node device.js
```

### 观察控制台输出

- 设备每 3 秒上传温度
- 服务器判断温度，并控制风扇开/关
- 设备接收风扇指令并显示

## 注意

在 `client.on("message", (topic, message) => {})` 回调函数中：

- `topic`：表示 MQTT 主题（Topic），即消息发布的频道。
- `message`：表示 收到的消息内容，默认是 `Buffer` 类型，需要 `.toString()` 转换为字符串。

如果你在 MQTT 连接成功后立即发布消息，`client.publish` 应该放在 `client.on("connect")` 里面。

如果你要 收到某条 MQTT 消息后再发布，`client.publish` 应该放在 `client.on("message")` 里面。