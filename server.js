const express = require('express');
const cron = require('node-cron');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 静态文件目录
const STATIC_DIR = path.join(__dirname, 'static');
const PDF_TARGETS = [
  {
    key: 'zh',
    filepath: path.join(STATIC_DIR, 'resume.pdf'),
    url: 'https://storage.rxresu.me/cm3femb4504r2dbpoxl4f9zev/resumes/resume-non-yoloshow.pdf'
  },
  {
    key: 'en',
    filepath: path.join(STATIC_DIR, 'resume-en.pdf'),
    url: 'https://storage.rxresu.me/cm3femb4504r2dbpoxl4f9zev/resumes/resume-english.pdf'
  }
];

// 确保 static 目录存在
if (!fs.existsSync(STATIC_DIR)) {
  fs.mkdirSync(STATIC_DIR, { recursive: true });
  console.log('✅ 已创建 static 目录');
}

// 下载 PDF 文件的函数
async function downloadPDF({ key, filepath, url }) {
  try {
    console.log(`⏬ 开始下载 ${key.toUpperCase()} 简历...`);
    const response = await axios({
      method: 'GET',
      url,
      responseType: 'stream'
    });

    const writer = fs.createWriteStream(filepath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        console.log(`✅ ${key.toUpperCase()} 简历下载成功！时间:`, new Date().toLocaleString('zh-CN'));
        resolve();
      });
      writer.on('error', (err) => {
        console.error(`❌ ${key.toUpperCase()} 简历写入失败:`, err.message);
        reject(err);
      });
    });
  } catch (error) {
    console.error(`❌ ${key.toUpperCase()} 简历下载失败:`, error.message);
  }
}

// 设置静态文件服务
app.use('/static', express.static(STATIC_DIR));
app.use(express.static('public'));

// 首页路由（包含英文页）
app.get(['/', '/en'], (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 检查 PDF 是否存在的 API
app.get('/api/check-pdf', (req, res) => {
  const statuses = PDF_TARGETS.reduce((acc, target) => {
    const exists = fs.existsSync(target.filepath);
    acc[target.key] = {
      exists,
      lastModified: exists ? fs.statSync(target.filepath).mtime : null
    };
    return acc;
  }, {});

  res.json(statuses);
});

// 启动时立即下载一次
Promise.all(PDF_TARGETS.map((target) => downloadPDF(target))).catch((error) => {
  console.error('❌ 初始下载失败:', error?.message || error);
});

// 设置定时任务：每5分钟执行一次
cron.schedule('*/5 * * * *', () => {
  console.log('⏰ 定时任务触发');
  PDF_TARGETS.forEach((target) => {
    downloadPDF(target);
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   🚀 简历展示服务已启动                ║
║   📍 访问地址: http://localhost:${PORT}    ║
║   ⏰ 定时任务: 每5分钟更新一次         ║
╚════════════════════════════════════════╝
  `);
});
