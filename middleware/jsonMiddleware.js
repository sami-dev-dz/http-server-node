import { sendJson } from "../src/utils.js";

const MAX_BODY_SIZE = 1 * 1024 * 1024; // 1 MB

export function jsonMiddleware(req, res, next) {
  const contentType = req.headers["content-type"] || "";

  // On ne traite que les requêtes JSON
  if (!contentType.includes("application/json")) {
    req.body = undefined;
    next();
    return;
  }

  let body = "";
  let bodySize = 0;
  let finished = false;

  req.on("data", (chunk) => {
    if (finished) return;

    bodySize += chunk.length;

    if (bodySize > MAX_BODY_SIZE) {
      finished = true;
      sendJson(res, 413, { message: "Payload Too Large" });
      req.resume(); // Continue à vider le flux sans accumuler le body
      return;
    }

    body += chunk;
  });

  req.on("end", () => {
    if (finished) return;

    try {
      req.body = body.length ? JSON.parse(body) : {};
      next();
    } catch {
      finished = true;
      sendJson(res, 400, { message: "Invalid JSON body" });
    }
  });

  req.on("error", () => {
    if (finished || res.writableEnded) return;

    finished = true;
    sendJson(res, 400, { message: "Error reading request body" });
  });
}
