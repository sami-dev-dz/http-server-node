# HTTP Server with Node.js

A simple HTTP server built from scratch using Node.js native modules, without Express or any other framework. This project demonstrates how HTTP requests, routing, middleware, JSON APIs, and static file serving work internally.

## 📌 Overview

The goal of this project is to understand how to build a basic web server using Node.js's native `http` module.

The server provides:

- A REST API for managing users.
- Middleware for logging requests and parsing JSON bodies.
- Static file serving for HTML, CSS, and JavaScript.
- Basic path traversal protection.
- HTTP status codes and error handling.
- ETag-based cache validation using `If-None-Match`.

## 🛠️ Technologies

- **Node.js** — JavaScript runtime.
- **HTTP module** — Creates the HTTP server.
- **File System (`fs`)** — Reads files and checks file information.
- **Path (`path`)** — Resolves and validates file paths.
- **Crypto (`crypto`)** — Generates SHA-256 hashes for ETags.
- **ES Modules** — Uses `import` and `export`.
- **HTML, CSS, JavaScript** — Builds the static frontend.

No external runtime dependencies are required.

## 📁 Project Structure

```text
http-server-node/
├── middleware/
│   ├── jsonMiddleware.js
│   └── logger.js
├── public/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── src/
│   ├── mime.js
│   ├── router.js
│   ├── server.js
│   ├── static.js
│   └── utils.js
├── .gitignore
├── package.json
└── README.md
```

## ⚙️ Requirements

- Node.js installed on your computer.
- A terminal such as PowerShell, Command Prompt, or Bash.
- A browser or an HTTP client such as `curl`.

Check your Node.js installation:

```bash
node --version
npm --version
```

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/sami-dev-dz/http-server-node.git
```

### 2. Open the project directory

```bash
cd http-server-node
```

### 3. Start the server

```bash
node src/server.js
```

When the server starts successfully, the terminal displays:

```text
Server running on http://localhost:3000
```

### 4. Open the application

Visit:

http://localhost:3000

The server listens on port `3000`.

To stop the server, press `Ctrl + C` in the terminal.

## 🌐 API Endpoints

All API routes use the `/api` prefix.

| Method | Endpoint         | Description           | Success status |
| ------ | ---------------- | --------------------- | -------------- |
| GET    | `/api/users`     | Retrieve all users    | `200 OK`       |
| GET    | `/api/users/:id` | Retrieve a user by ID | `200 OK`       |
| POST   | `/api/users`     | Create a new user     | `201 Created`  |

The user data is stored in memory. This means the data resets when the server restarts.

### 1. Get all users

**Request**

```http
GET /api/users
```

Example using `curl`:

```bash
curl http://localhost:3000/api/users
```

**Example response**

```json
[
  {
    "id": 1,
    "name": "Sami"
  },
  {
    "id": 2,
    "name": "Alex"
  }
]
```

### 2. Get a user by ID

**Request**

```http
GET /api/users/1
```

Command:

```bash
curl http://localhost:3000/api/users/1
```

**Example response**

```json
{
  "id": 1,
  "name": "Sami"
}
```

If the user does not exist, the server returns `404 Not Found`.

### 3. Create a user

**Request**

```http
POST /api/users
```

Command:

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Karim\"}"
```

**Example response**

```json
{
  "id": 3,
  "name": "Karim"
}
```

The server validates the `name` property and returns `400 Bad Request` if the name is missing, empty, or invalid.

A successful creation returns `201 Created`.

> On Windows PowerShell, use `curl.exe` if `curl` resolves to a PowerShell alias.

## 🧩 Middleware

The project uses middleware functions to process requests before they reach the router.

### Request logger

File: `middleware/logger.js`

Logs incoming HTTP requests, including their method and URL.

Example:

```text
GET /
GET /api/users
POST /api/users
```

### JSON body parser

File: `middleware/jsonMiddleware.js`

The JSON middleware:

- Reads the request body.
- Parses valid JSON.
- Makes the parsed data available through `req.body`.
- Rejects malformed JSON with `400 Bad Request`.
- Limits request bodies to 1 MB and returns `413 Payload Too Large` when the limit is exceeded.

This allows the router to access the data sent in a POST request.

## 📂 Static File Serving

File: `src/static.js`

The server serves frontend files from the `public/` directory.

Examples:

| URL          | File                |
| ------------ | ------------------- |
| `/`          | `public/index.html` |
| `/style.css` | `public/style.css`  |
| `/app.js`    | `public/app.js`     |

The static file handler:

- Checks that the requested file exists.
- Serves files using streams.
- Sets the appropriate `Content-Type`.
- Returns `404 Not Found` for missing files.
- Includes basic path traversal protection.
- Generates an ETag to support cache validation.

API requests are excluded from static file handling so that `/api/...` requests can be processed by the router.

## 🗂️ MIME Types

File: `src/mime.js`

The server determines the content type from the file extension.

Supported types include:

| Extension       | Content-Type       |
| --------------- | ------------------ |
| `.html`         | `text/html`        |
| `.css`          | `text/css`         |
| `.js`           | `text/javascript`  |
| `.json`         | `application/json` |
| `.png`          | `image/png`        |
| `.jpg`, `.jpeg` | `image/jpeg`       |
| `.svg`          | `image/svg+xml`    |

Unknown extensions use `application/octet-stream`.

## ⚡ HTTP Caching with ETag

The static file handler generates an ETag using a SHA-256 hash of the file contents.

When a client requests a file, the server sends an `ETag` response header.

On a subsequent request, the client can send that value through the `If-None-Match` request header.

If the ETag matches, the server returns:

```http
HTTP/1.1 304 Not Modified
```

A `304` response tells the client that its cached copy can be reused, so the server does not need to send the file contents again.

## 🛡️ Error Handling

The server handles common errors with appropriate HTTP status codes.

| Status                      | Meaning                        | Example                           |
| --------------------------- | ------------------------------ | --------------------------------- |
| `200 OK`                    | Request succeeded              | Retrieving users                  |
| `201 Created`               | Resource created               | Creating a user                   |
| `304 Not Modified`          | Cached resource is still valid | Matching ETag                     |
| `400 Bad Request`           | Invalid request data           | Malformed JSON or invalid ID      |
| `403 Forbidden`             | File path rejected             | Path outside the public directory |
| `404 Not Found`             | Resource not found             | Unknown route or user             |
| `405 Method Not Allowed`    | HTTP method unsupported        | POST to a GET-only route          |
| `413 Payload Too Large`     | Request body exceeds the limit | JSON body larger than 1 MB        |
| `500 Internal Server Error` | Unexpected server error        | Unhandled processing error        |

## 🧪 Testing the Server

Start the server first:

```bash
node src/server.js
```

Open another terminal and run the following commands.

### Test the homepage

```bash
curl.exe -i http://localhost:3000/
```

### Test the users endpoint

```bash
curl.exe -i http://localhost:3000/api/users
```

### Test a specific user

```bash
curl.exe -i http://localhost:3000/api/users/1
```

### Test a missing user

```bash
curl.exe -i http://localhost:3000/api/users/999
```

Expected status: `404 Not Found`.

### Test creating a user

```bash
curl.exe -i -X POST http://localhost:3000/api/users -H "Content-Type: application/json" -d "{\"name\":\"Karim\"}"
```

Expected status: `201 Created`.

### Test an invalid JSON body

```bash
curl.exe -i -X POST http://localhost:3000/api/users -H "Content-Type: application/json" -d "{invalid}"
```

Expected status: `400 Bad Request`.

### Test an unsupported HTTP method

```bash
curl.exe -i -X DELETE http://localhost:3000/api/users
```

Expected status: `405 Method Not Allowed`.

### Test ETag caching

First, retrieve the response headers:

```bash
curl.exe -i http://localhost:3000/style.css
```

Copy the `ETag` value from the response. Then use it in the next request, replacing `YOUR_ETAG` with the actual value:

```bash
curl.exe -i http://localhost:3000/style.css -H "If-None-Match: YOUR_ETAG"
```

If the file has not changed and the ETag matches, the server should return `304 Not Modified`.

## 📚 What I Learned

Through this project, I practiced:

- Creating an HTTP server with Node.js's native `http` module.
- Understanding HTTP requests and responses.
- Working with HTTP methods and status codes.
- Building a basic REST API without a framework.
- Separating routing logic from server logic.
- Implementing middleware and request body parsing.
- Handling JSON data and validating user input.
- Reading and serving static files.
- Working with file streams and MIME types.
- Resolving file paths and preventing basic path traversal.
- Understanding ETags and conditional HTTP requests.
- Handling common errors in an HTTP server.

## 🔮 Possible Improvements

Future improvements could include:

- Adding automated tests with Node.js's built-in test runner.
- Supporting `PUT` and `DELETE` endpoints.
- Replacing in-memory storage with a database.
- Improving ETag generation efficiency.
- Adding more robust request validation and security checks.
- Supporting environment variables for server configuration.
- Improving logging and centralized error handling.

## 👨‍💻 Author

**Sami Ghoul**

- GitHub: [sami-dev-dz](https://github.com/sami-dev-dz)

---

_Built as a learning project to understand the fundamentals of HTTP servers with Node.js, without relying on a web framework._
