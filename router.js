import { sendJson } from "./utils.js";

const users = [
  { id: 1, name: "Sami" },
  { id: 2, name: "Alex" },
];

//GET /api/users
export function router(method, path, res) {
  if (method === "GET" && path === "/api/users") {
    sendJson(res, 200, users);
    return;
  }

  // GET /users/:id
  const userMatch = path.match(/^\/api\/users\/([^/]+)$/);
  if (method === "GET" && userMatch) {
    const id = Number(userMatch[1]);
    const user = users.find((user) => user.id === id);
    if (!user) {
      sendJson(res, 404, {
        message: "User not found",
      });
    }
    sendJson(res, 201, user);
    return;
  }
  // Route introuvable
  sendJson(res, 404, {
    message: "Route not found",
  });
}
