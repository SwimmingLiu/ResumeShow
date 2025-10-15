# 简历展示网页

这是一个基于 Node.js 的简历展示网页应用，可以自动定时从指定 URL 下载 PDF 简历并在网页上展示。

## ✨ 功能特性

- 📄 在线预览 PDF 简历
- ⏰ 定时任务：每5分钟自动更新简历
- 📥 支持简历下载
- 🔄 实时刷新功能
- 📱 响应式设计，支持移动端访问
- 🎨 精美的 UI 界面

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 启动服务

```bash
npm start
```

或使用开发模式（支持热重载）：

```bash
npm run dev
```

### 访问应用

打开浏览器访问：[http://localhost:3000](http://localhost:3000)

## 📁 项目结构

```
resume-swimmingliu/
├── server.js           # 主服务器文件
├── package.json        # 项目依赖配置
├── public/            # 前端静态文件
│   └── index.html     # 首页
├── static/            # PDF 存储目录
│   └── resume.pdf     # 自动下载的简历文件
└── README.md          # 项目说明
```

## 🛠️ 技术栈

- **后端**: Node.js + Express
- **定时任务**: node-cron
- **HTTP 客户端**: axios
- **前端**: HTML + CSS + JavaScript

## 📝 配置说明

如需修改 PDF 下载地址或定时任务间隔，请编辑 `server.js` 文件：

```javascript
// PDF 下载地址
const PDF_URL = 'https://storage.rxresu.me/cm3femb4504r2dbpoxl4f9zev/resumes/resume.pdf';

// 定时任务：每5分钟执行一次
cron.schedule('*/5 * * * *', () => {
  downloadPDF();
});
```

### Cron 表达式说明

- `*/5 * * * *` - 每5分钟执行一次
- `*/10 * * * *` - 每10分钟执行一次
- `0 * * * *` - 每小时执行一次
- `0 0 * * *` - 每天凌晨执行一次

## 🔧 环境变量

可以通过环境变量修改端口：

```bash
PORT=8080 npm start
```

## 📄 License

MIT

## 👨‍💻 作者

swimmingliu

