---
outline: deep
---

## 微信扫码登录

### OAuth 2.0 流程分析

- **授权码模式 (Authorization Code Grant)**：适用于 Web 应用和有浏览器交互的场景，安全性高。
- **简化模式 (Implicit Grant)**：适用于无后端的客户端应用（如 SPA），安全性较低。
- **密码模式 (Resource Owner Password Credentials Grant)**：适用于可信任的客户端应用，直接使用用户凭证。
- **客户端凭证模式 (Client Credentials Grant)**：适用于机器间通信，客户端通过自己的凭证获取令牌，无需用户参与。

`OAuth 2.0` 的授权模式一共有 4 种，我们常用的模式为 授权码模式。

**流程如下**：

1. 客户端（app / 浏览器）将用户导向第三方认证服务器


2. 用户在第三方认证服务器，选择是否给予客户端授权


3. 用户同意授权后，认证服务器将用户导向客户端事先指定的 重定向URI，同时附上一个授权码。


4. 客户端将授权码发送至服务器，服务器通过授权码以及 `APP_SECRET` 向第三方服务器申请 `access_token`


5. 服务器通过 access_token，向第三方服务器申请用户数据，完成登录流程

**对于 APP 第三方登录来说有两种实现方法**

1. `APP_SECRET` 存储在客户端，客户端获取授权码之后，直接通过授权码和 `APP_SECRET` 去第三方换取 `access_token`。


2. `APP_SECRET` 存储在服务端，客户端获取授权码之后，将授权码发送给服务器，服务器通过授权码和 `APP_SECRET` 去第三方换取 `access_token`。（推荐）

### 微信公众平台测试账号

申请公众平台测试账号十分方便，直接通过微信登录即可，[登录地址](https://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=sandbox/login)

登录后我们可以看到 `appID` 和 `appsecret`

关注自己的测试公众号，只有关注了测试公众号的用户，才可以进行授权操作，微信扫描 `测试号二维码` 即可

在下面的 `体验接口权限表` 中我们可以找到 `网页授权获取用户基本信息`，点击最后的修改按钮

填入 `xxx.com`，这个是 `OAuth` 流程中需要提前配置好的回调域名，回调地址必须在这个域名下。

### 测试 OAuth 流程

因为是公众平台测试账号，所以我们首先需要下载 [微信 web 开发者工具](https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/Web_Developer_Tools.html)，方便我们接下来的调试。

尝试一下 [微信网页授权](https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/Wechat_webpage_authorization.html) 的流程。下面这个链接为微信发起 OAuth 的跳转地址。

#### 第一步获取授权码code
```bash
https://open.weixin.qq.com/connect/oauth2/authorize?appid=APPID&redirect_uri=REDIRECT_URI&response_type=code&scope=SCOPE&state=STATE#wechat_redirect
```

注意链接中有几个变量需要替换

- `APPID` 测试账号中的 `appID`，填写自己账号的 `appID`
- `REDIRECT_URI` 用户同意授权后的回调地址，填写 http://xxx.com
- `SCOPE` 应用授权作用域，`scope=snsapi_login`（适用于 PC 网站微信扫码登录），`scope=snsapi_userinfo`（适用于公众号H5网页授权，必须微信内打开）
- `STATE` 随机参数，可以不填，我们保持 `STATE` 即可。

替换后我们得到的链接类似

```bash
https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxxxxxxxxxxxxx&redirect_uri=http://xxx.com&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect
```
在开发者工具中，访问该链接，可以看到微信授权页面，点击确认登录

成功的跳转回了 `REDIRECT_URI`，注意 url 中可以看到 `code` 参数。好了我们已经完成了 `OAuth` 流程中获取授权码的步骤。

#### 第二步获取access_token

请求以下链接获取 access_token：

```bash
https://api.weixin.qq.com/sns/oauth2/access_token?appid=APPID&secret=SECRET&code=CODE&grant_type=authorization_code
```

需要替换的变量

- `APPID` 测试账号中的 `appID`，填写自己账号的 `appID`
- `SECRET` 测试账号中的 `secret`，填写自己账号的 `secret`
- `CODE` 上一步获取的 `code`

替换后的链接如下

```bash
https://api.weixin.qq.com/sns/oauth2/access_token?appid=wxxxxxxxxxxxxx&secret=xxxxxxxxx&code=xxxxxxxxxxxxxxx&grant_type=authorization_code
```

使用 `PostMan` 访问该链接，获取到了 `access_token`，注意微信同时返回了 `open_id`，微信 `access_token` 和 `open_id` 一起请求用户信息。

#### 第三步获取userinfo

通过 `access_token` 获取个人信息

```bash
https://api.weixin.qq.com/sns/userinfo?access_token=ACCESS_TOKEN&openid=OPENID&lang=zh_CN
```

替换链接中的 `ACCESS_TOKEN` 和 `OPENID`，使用 `PostMan` 访问，可以获取到个人的微信信息


## 微信小程序登录

大概流程如下：

1. 小程序调用 wx.login() 接口获取临时登录凭证（code），这一步用户是无感知的，无需用户授权；


2. 小程序提交 code 到开发者服务器；


3. 开发者服务器通过 appid、appsecret 和 code 请求微信接口，换取用户的 session_key 和 openid；


4. 开发者服务器根据 openid 查找到对应的用户，存入 session_key，然后为该用户生成 access_token （JWT）返回给小程序。


5. 有了 access_token 小程序就可以调用需要身份认证的接口了。

> 注意这里的 `session_key` 是一个比较特殊的设计，是用户的 会话密钥，需要存储在服务器中，调用 获取用户信息、获取微信用户绑定的手机号 等微信接口时，需要用这个 会话密钥 才能解密获取相关数据。每次调用 `wx.login()` 之后，微信都会自动生成新的 `session_key` ，导致之前的 `session_key` 失效，所以在必要的时候再去调用 `wx.login()`，而且还要及时保存 `session_key` 到服务器，以备后续使用。