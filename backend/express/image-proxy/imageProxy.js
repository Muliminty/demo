import express from "express";
import cors from "cors";
import fetch from "node-fetch"; // Node18+ 可直接用全局 fetch

const app = express();
const PORT = 4040;

// 允许所有域名跨域
app.use(cors());

// 简单的请求日志中间件
app.use((req, res, next) => {
  console.log(`➡️  ${req.method} ${req.originalUrl}`);
  next();
});

app.get("/proxy", async (req, res) => {
  const { url } = req.query;

  if (!url) {
    console.warn("❌ 缺少 url 参数");
    return res.status(400).send("❌ 缺少 url 参数");
  }

  try {
    console.log(`🔗 正在请求: ${url}`);
    const response = await fetch(url);

    if (!response.ok) {
      console.warn(`❌ 拉取失败: ${response.status} ${response.statusText}`);
      return res.status(response.status).send(`❌ 拉取失败: ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type") || "application/octet-stream";
    res.set("Content-Type", contentType);

    // 记录数据长度
    const chunks = [];
    response.body.on("data", (chunk) => {
      chunks.push(chunk);
    });

    response.body.on("end", () => {
      const bodyBuffer = Buffer.concat(chunks);
      console.log(`✅ 请求成功: ${url}，内容长度: ${bodyBuffer.length} bytes`);
      res.send(bodyBuffer);
    });

    response.body.on("error", (err) => {
      console.error("❌ 数据流错误:", err);
      res.status(500).send("❌ 数据流异常");
    });

  } catch (err) {
    console.error("❌ 代理失败:", err);
    res.status(500).send("❌ 代理异常");
  }
});

app.listen(PORT, () => {
  console.log(`✅ Proxy server running at http://localhost:${PORT}`);
});
