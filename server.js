import http from "http";

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  console.log(req.url);
  console.log(req.method);
  console.log(req.headers);
  res.setHeader("Content-Type", "text/plain");
  res.end("hello world");
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
