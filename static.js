import { createReadStream } from "fs";
import { stat } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { sendJson } from "./utils.js";
import { getMimeType } from "./mime.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, "public");

const routes = {
  "/": "index.html",
  "/style.css": "style.css",
  "/app.js": "app.js",
};

export async function serveStatic(req, res, pathname) {
  if (req.method !== "GET") {
    return false;
  }

  const filename = routes[pathname];

  if (!filename) {
    return false;
  }

  const filePath = path.join(publicDir, filename);

  try {
    const fileInfo = await stat(filePath);

    if (!fileInfo.isFile()) {
      sendJson(res, 404, { error: "File not found" });
      return true;
    }
  } catch (error) {
    if (error.code === "ENOENT" || error.code === "ENOTDIR") {
      sendJson(res, 404, { error: "File not found" });
      return true;
    }

    console.error(error);
    sendJson(res, 500, { error: "Internal Server Error" });
    return true;
  }

  res.statusCode = 200;
  res.setHeader("Content-Type", getMimeType(filePath));

  const stream = createReadStream(filePath);

  stream.on("error", (error) => {
    console.error(error);

    if (!res.headersSent) {
      sendJson(res, 500, { error: "Internal Server Error" });
    } else {
      res.destroy(error);
    }
  });

  stream.pipe(res);

  return true;
}
