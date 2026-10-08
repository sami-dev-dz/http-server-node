export function router(method, path, res) {
  if (method === "GET" && path === "/") {
    res.statusCode = 200;
    res.end("Home Page");
    return;
  }

  if (method === "GET" && path === "/users") {
    res.statusCode = 200;
    res.end("Users Page");
    return;
  }

  if (method === "POST" && path === "/users") {
    res.statusCode = 201;
    res.end("Users Created");
    return;
  }

  res.statusCode = 404;
  console.log("Route not found");
}
