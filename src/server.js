import http from "http";
import { router } from "../router.js";
import { logger } from "../middleware/logger.js";
import { jsonMiddleware } from "../middleware/jsonMiddleware.js";
import { serveStatic } from "./static.js";

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  logger(req, res, () => {
    jsonMiddleware(req, res, async () => {
      try {
        const served = await serveStatic(req, res, pathname);

        if (served || res.writableEnded) {
          return;
        }

        router(req, res, pathname);
      } catch (error) {
        console.error(error);

        if (!res.writableEnded) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({
              error: "Internal Server Error",
            }),
          );
        }
      }
    });
  });
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
