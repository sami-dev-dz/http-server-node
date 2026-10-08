import http from "http";
import router from "./router.js";
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname;
  const method = req.method;
  router(method, path, res);
  res.setHeader("Content-Type", "text/plain");
  res.end("hello world");
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
