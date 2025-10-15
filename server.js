const express = require('express');
const cron = require('node-cron');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 静态文件目录
const STATIC_DIR = path.join(__dirname, 'static');
const PDF_PATH = path.join(STATIC_DIR, 'resume.pdf');
const PDF_URL = 'https://storage.rxresu.me/cm3femb4504r2dbpoxl4f9zev/resumes/resume.pdf';

// 确保 static 目录存在
if (!fs.existsSync(STATIC_DIR)) {
  fs.mkdirSync(STATIC_DIR, { recursive: true });
  console.log('✅ 已创建 static 目录');
}

// 下载 PDF 文件的函数
async function downloadPDF() {
  try {
    console.log('⏬ 开始下载 PDF...');
    const response = await axios({
      method: 'GET',
      url: PDF_URL,
      responseType: 'stream'
    });

    const writer = fs.createWriteStream(PDF_PATH);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        console.log('✅ PDF 下载成功！时间:', new Date().toLocaleString('zh-CN'));
        resolve();
      });
      writer.on('error', (err) => {
        console.error('❌ PDF 写入失败:', err.message);
        reject(err);
      });
    });
  } catch (error) {
    console.error('❌ PDF 下载失败:', error.message);
  }
}

// 设置静态文件服务
app.use('/static', express.static(STATIC_DIR));
app.use(express.static('public'));

// 首页路由
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 检查 PDF 是否存在的 API
app.get('/api/check-pdf', (req, res) => {
  const exists = fs.existsSync(PDF_PATH);
  res.json({ 
    exists,
    lastModified: exists ? fs.statSync(PDF_PATH).mtime : null
  });
});

// 启动时立即下载一次
downloadPDF();

// 设置定时任务：每5分钟执行一次
cron.schedule('*/5 * * * *', () => {
  console.log('⏰ 定时任务触发');
  downloadPDF();
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

