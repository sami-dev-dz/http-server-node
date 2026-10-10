import http from "http";
import router from "./router.js";
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname;
  const page = url.searchParams.get("page");
  const limit = url.searchParams.get("limit");
  console.log("PathName = ", paht);
  console.log("Page = ", page);
  console.log("Limit = ", limit);
  router(req, path, res);
  res.setHeader("Content-Type", "text/plain");
  res.end("hello world");
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
