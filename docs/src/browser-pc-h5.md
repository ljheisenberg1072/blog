---
outline: deep
---

## PC/H5判断

### 1. 通过 User-Agent 判断

`User-Agent` 是浏览器请求头中的一部分，它包含了设备的信息，比如 `Windows、Mac、Android、iPhone` 等。

#### 📌JavaScript（前端判断）

```js
function isMobile() {
    return /Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);
}

if (isMobile()) {
    console.log("H5（移动端）");
} else {
    console.log("PC端");
}
```

#### 📌PHP（后端判断）

```php
function isMobile() {
    return preg_match('/Android|iPhone|iPad|iPod|Windows Phone/i', $_SERVER['HTTP_USER_AGENT']);
}

if (isMobile()) {
    echo "H5（移动端）";
} else {
    echo "PC端";
}
```

### ~~2. 通过 window.innerWidth 判断~~

移动端屏幕一般较窄，可以通过 window.innerWidth 判断设备类型。

<strong style="color:red;">不推荐</strong>，有时候PC端会缩放网页窗口，不够准确

```js
function isMobile() {
    return window.innerWidth < 768; // 768px 作为 PC 和移动端的分界线
}

if (isMobile()) {
    console.log("H5（移动端）");
} else {
    console.log("PC端");
}
```

### 3. 通过 TouchEvent 判断

移动端支持 TouchEvent（触摸事件），而 PC 端不支持，可以用这个特性来判断。

- PC模式时：`'ontouchstart' in window` 为 false，`navigator.maxTouchPoints` = 0；
- H5模式时：`'ontouchstart' in window` 为 true，`navigator.maxTouchPoints` = 1；

```js
function isMobile() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

if (isMobile()) {
    console.log("H5（移动端）");
} else {
    console.log("PC端");
}
```

### 4. 结合多种方法（更精准）

```js
function isMobile() {
    return (/Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent)
            || 'ontouchstart' in window || navigator.maxTouchPoints > 0);
}

if (isMobile()) {
    console.log("H5（移动端）");
} else {
    console.log("PC端");
}
```

## Browser判断

### User-Agent解析类型

- Mozilla/5.0 → 兼容 Mozilla 规范，所有现代浏览器基本都有这个前缀
- Windows NT 10.0; Win64; x64 → 操作系统是 Windows 10 64 位
- AppleWebKit/537.36 → 使用 WebKit 内核（Chrome、Safari、Edge 也用）
- Chrome/133.0.0.0 → 浏览器是 Google Chrome，版本 133.0.0.0
- Safari/537.36 → Chrome 兼容 Safari（但并不是 Safari）

✅最终结论：这个 User-Agent 来自 Google Chrome 133.0.0.0，运行在 Windows 10 64 位 系统上。

#### 📌JavaScript 解析浏览器

你可以用 JavaScript 解析 User-Agent 来判断浏览器类型：

```js
function getBrowser() {
    let userAgent = navigator.userAgent;
    if (userAgent.includes("Chrome") && !userAgent.includes("Edg") && !userAgent.includes("OPR")) {
        return "Google Chrome";
    }
    if (userAgent.includes("Edg")) {
        return "Microsoft Edge";
    }
    if (userAgent.includes("Firefox")) {
        return "Mozilla Firefox";
    }
    if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
        return "Apple Safari";
    }
    if (userAgent.includes("OPR") || userAgent.includes("Opera")) {
        return "Opera";
    }
    return "Unknown";
}

console.log("当前浏览器是：" + getBrowser());
```

#### 📌PHP 解析浏览器

如果你需要在服务器端（PHP）判断：

```php
function getBrowser($userAgent) {
    if (strpos($userAgent, 'Chrome') !== false && strpos($userAgent, 'Edg') === false
        && strpos($userAgent, 'OPR') === false) {
        return "Google Chrome";
    }
    if (strpos($userAgent, 'Edg') !== false) {
        return "Microsoft Edge";
    }
    if (strpos($userAgent, 'Firefox') !== false) {
        return "Mozilla Firefox";
    }
    if (strpos($userAgent, 'Safari') !== false && strpos($userAgent, 'Chrome') === false) {
        return "Apple Safari";
    }
    if (strpos($userAgent, 'OPR') !== false || strpos($userAgent, 'Opera') !== false) {
        return "Opera";
    }
    return "Unknown";
}

echo "当前浏览器是：" . getBrowser($_SERVER['HTTP_USER_AGENT']);
```