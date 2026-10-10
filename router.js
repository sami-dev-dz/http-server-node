import { sendJson } from "./utils.js";

export function router(method, path, res) {
  if (method === "GET" && path === "/") {
    sendJson(res, 200, {
      message: "Home Page",
    });
    return;
  }

  if (method === "GET" && path === "/users") {
    sendJson(res, 200, {
      message: "Page Users",
    });
    return;
  }

  // GET /users/:id
  const userMatch = path.match(/^\/users\/([^/]+)$/);
  if (method === "GET" && userMatch) {
    const params = {
      id: userMatch[1],
    };

    sendJson(res, 200, params);
    return;
  }
  if (method === "POST" && path === "/users") {
    sendJson(res, 201, {
      message: "Users created",
    });
    return;
  }

  sendJson(res, 404, {
    message: "Route not found",
  });
}
