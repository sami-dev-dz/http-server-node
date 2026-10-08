import http from "http";

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  const url = new URL(req.url, `http://${req.headers.host}`);
  console.log(url.pathname);
  console.log(url.searchParams);
  res.setHeader("Content-Type", "text/plain");
  res.end("hello world");
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
