import { sendJson } from "./utils.js";

const users = [
  { id: 1, name: "Sami" },
  { id: 2, name: "Alex" },
];

export function router(req, res, path) {
  const method = req.method;

  // GET /api/users
  if (path === "/api/users") {
    if (method === "GET") {
      sendJson(res, 200, users);
      return;
    }

    if (method === "POST") {
      const data = req.body;

      if (!data || typeof data.name !== "string" || !data.name.trim()) {
        sendJson(res, 400, { error: "Name is required" });
        return;
      }

      const newUser = {
        id: users.length ? Math.max(...users.map((user) => user.id)) + 1 : 1,
        name: data.name.trim(),
      };

      users.push(newUser);
      sendJson(res, 201, newUser);
      return;
    }

    sendJson(res, 405, { error: "Method not allowed" });
    return;
  }

  // GET /api/users/:id
  const userMatch = path.match(/^\/api\/users\/([^/]+)$/);

  if (userMatch) {
    if (method !== "GET") {
      sendJson(res, 405, { error: "Method not allowed" });
      return;
    }

    const id = Number(userMatch[1]);

    if (!Number.isInteger(id) || id <= 0) {
      sendJson(res, 400, { error: "Invalid user ID" });
      return;
    }

    const user = users.find((user) => user.id === id);

    if (!user) {
      sendJson(res, 404, { error: "User not found" });
      return;
    }

    sendJson(res, 200, user);
    return;
  }

  // Route introuvable
  sendJson(res, 404, { error: "Route not found" });
}
