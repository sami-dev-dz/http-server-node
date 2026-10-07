import http from "http";

const server = http.createServer();

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
