import { sendJson } from "./utils.js";

const users = [
  { id: 1, name: "Sami" },
  { id: 2, name: "Alex" },
];

//GET /api/users
export function router(req, path, res) {
  const method = req.method;
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
    sendJson(res, 200, user);
    return;
  }

  if (method === "POST" && path === "/api/users") {
    const MAX_BODY_SIZE = 1 * 1024 * 1024; // 1 MB

    let body = "";
    let bodySize = 0;
    let tooLarge = false;

    req.on("data", (chunk) => {
      if (tooLarge) return;

      bodySize += chunk.length;

      if (bodySize > MAX_BODY_SIZE) {
        tooLarge = true;

        sendJson(res, 413, {
          message: "Payload Too Large",
        });

        return;
      }

      body += chunk;
    });

    req.on("end", () => {
      if (tooLarge) return;
      try {
        const data = JSON.parse(body);
        if (typeof data.name !== "string" || !data.name.trim()) {
          sendJson(res, 400, { message: "Name is required" });
          return;
        }

        const newUser = {
          id: users.length ? Math.max(...users.map((user) => user.id)) + 1 : 1,
          name: data.name.trim(),
        };

        users.push(newUser);

        sendJson(res, 201, newUser);
      } catch {
        sendJson(res, 400, { message: "Invalid JSON body" });
      }
    });
    return;
  }
  // Route introuvable
  sendJson(res, 404, {
    message: "Route not found",
  });
}
