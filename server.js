import http from "http";
import { router } from "./router.js";
import { logger } from "./middleware/logger.js";
import { jsonMiddleware } from "./middleware/jsonMiddleware.js";
import { sendJson } from "./utils.js";

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname;

  const page = url.searchParams.get("page");
  const limit = url.searchParams.get("limit");

  console.log("PathName =", path);
  console.log("Page =", page);
  console.log("Limit =", limit);

  logger(req, res, () => {
    jsonMiddleware(req, res, () => {
      try {
        router(req, res, path);
      } catch (error) {
        console.error(error);

        if (!res.writableEnded) {
          sendJson(res, 500, {
            error: "Internal Server Error",
          });
        }
      }
    });
  });
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
