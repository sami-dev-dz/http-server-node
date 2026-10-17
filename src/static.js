import { createReadStream } from "fs";
import { stat, readFile } from "fs/promises";
import { createHash } from "crypto";
import path from "path";
import { fileURLToPath } from "url";
import { sendJson } from "./utils.js";
import { getMimeType } from "./mime.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, "..", "public");

function getSafeFilePath(pathname) {
  const relativePath = pathname === "/" ? "index.html" : pathname.slice(1);

  const filePath = path.resolve(publicDir, relativePath);
  const relative = path.relative(publicDir, filePath);

  if (
    relative === ".." ||
    relative.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relative)
  ) {
    return null;
  }

  return filePath;
}

async function generateETag(filePath) {
  const content = await readFile(filePath);

  const hash = createHash("sha256").update(content).digest("hex");

  return `"${hash}"`;
}

export async function serveStatic(req, res, pathname) {
  if (pathname.startsWith("/api/")) {
    return false;
  }

  if (req.method !== "GET") {
    return false;
  }

  const filePath = getSafeFilePath(pathname);

  if (!filePath) {
    sendJson(res, 403, { error: "Access denied" });
    return true;
  }

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

  try {
    const etag = await generateETag(filePath);
    res.setHeader("ETag", etag);

    const clientETag = req.headers["if-none-match"];

    if (
      clientETag === "*" ||
      clientETag
        ?.split(",")
        .some((value) => value.trim().replace(/^W\//, "") === etag)
    ) {
      res.statusCode = 304;
      res.end();
      return true;
    }
    res.statusCode = 200;
    res.setHeader("Content-Type", getMimeType(filePath));

    const stream = createReadStream(filePath);

    stream.on("error", (error) => {
      console.error(error);

      if (!res.headersSent) {
        sendJson(res, 500, {
          error: "Internal Server Error",
        });
      } else {
        res.destroy(error);
      }
    });

    stream.pipe(res);
    return true;
  } catch (error) {
    console.error(error);

    if (!res.headersSent) {
      sendJson(res, 500, {
        error: "Internal Server Error",
      });
    }

    return true;
  }
}
