import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { sendJson } from "./utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, "public");

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
};

export async function serveStatic(req, res, pathname) {
  if (req.method !== "GET") {
    return false;
  }

  const routes = {
    "/": "index.html",
    "/style.css": "style.css",
    "/app.js": "app.js",
  };

  const filename = routes[pathname];

  if (!filename) {
    return false;
  }

  try {
    const filePath = path.join(publicDir, filename);
    const content = await readFile(filePath);

    res.statusCode = 200;
    res.setHeader("Content-Type", contentTypes[path.extname(filename)]);
    res.end(content);

    return true;
  } catch (error) {
    console.error(error);

    sendJson(res, 500, {
      error: "Internal Server Error",
    });

    return true;
  }
}
