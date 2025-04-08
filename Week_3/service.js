const express = require("express");

const fs = require("fs"); // 引入文件系统模块

const app = express();
// 启⽤ JSON 解析中间件[9,10](@ref)
app.use(express.json({ limit: "10mb" }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS"); // 允许的请求⽅法
  res.header("Access-Control-Allow-Headers", "Content-Type"); // 允许的请求头
  if (req.method === "OPTIONS") {
    return res.sendStatus(200); // 直接响应预检请求
  }
  next();
});

const path = require("path"); // 引入 path 模块

// 处理 POST 请求
app.post("/api", (req, res) => {
  const requestBody = req.body; // 获取请求体

  // // 保存到本地文件（追加模式）
  // const logData = `
  // ====== 新请求 [${new Date().toISOString()}] ======
  // ${JSON.stringify(requestBody, null, 2)}
  // `;

  // fs.appendFile("requests.log", logData, (err) => {
  //   if (err) console.error("保存文件失败:", err);
  // });

  // console.log("接收到的请求体:", requestBody);
  // res.json({ status: "success", data: requestBody });

  // 创建存放请求的目录
  const dir = path.join(__dirname, "requests"); // 使用绝对路径
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // 生成唯一文件名（使用ISO时间戳并替换非法字符）
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `${dir}/request_${timestamp}.json`;

  // 保存到独立文件
  fs.writeFile(filename, JSON.stringify(requestBody, null, 2), (err) => {
    if (err) {
      console.error("保存文件失败:", err);
      return res.status(500).json({ status: "error", message: "保存失败" });
    }
    console.log(`请求已保存至 ${filename}`);
    res.json({ status: "success", filename });
  });
});
app.listen(3000, () => console.log("后端运⾏在 http://localhost:3000"));
