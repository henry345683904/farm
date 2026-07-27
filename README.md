# 开心养羊场

一个竖屏单页网页小游戏。玩家初始拥有 100 金币，可以购买 1 级羊，拖动同等级羊合成更高等级。羊会留在牧场里自由走动并自动产出收益。

## 玩法

- 初始金币：100
- 购买 1 级羊：价格会随购买次数提升
- 最高等级：Lv.25
- Lv.1 到 Lv.14 的羊自动产出金币
- Lv.15 开始不再产出金币，只产出 NZD
- Lv.15 羊每秒产出 `NZ$0.000000001`，更高等级按 3 倍递增
- 等级越高升级越慢：Lv.1-5 需要 2 只同级羊，Lv.6-10 需要 3 只，Lv.11-15 需要 4 只，Lv.16-20 需要 5 只，Lv.21-24 需要 6 只
- 任务、图鉴、登录存档通过按钮弹窗打开
- 未配置 Firebase 时，游戏会使用浏览器 localStorage 本地存档

## Firebase 云存档

项目已经接入 Firebase Authentication 和 Firestore 的前端代码。要启用 Google 登录、邮箱登录和永久云存档：

1. 在 Firebase Console 创建 Web App。
2. 启用 Authentication 的 Google 和 Email/Password 登录方式。
3. 启用 Firestore Database。
4. 在 Authentication 的授权域名里加入 `henry345683904.github.io`。
5. 把 Firebase Web App 配置填入 `firebase-config.js`。

Firestore 规则可使用：

```js
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /farmSaves/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 本地打开

建议启动静态服务器：

```bash
python -m http.server 4177
```

然后打开 `http://127.0.0.1:4177/`。
