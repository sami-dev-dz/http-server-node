# HTTP Server Node

A lightweight HTTP server built from scratch with Node.js native modules — no Express, no web framework.

This project explores the fundamentals of HTTP by implementing request handling, custom routing, middleware, a REST API, static file serving, and HTTP caching.

## Overview

The goal of this project is to understand how a web server works internally by building its core features with native Node.js APIs.

Rather than relying on a framework, the server handles HTTP requests and responses directly, with separate modules for routing, middleware, JSON processing, and static file delivery.

## Features

- **Native HTTP server** — request and response handling with Node.js `http`
- **Custom routing** — method-based routes and dynamic URL parameters
- **REST API** — retrieve users and create new ones
- **Custom middleware** — request logging and JSON body parsing
- **Input validation** — validate request data and handle malformed JSON
- **Error handling** — meaningful HTTP status codes and JSON error responses
- **Static file serving** — serve HTML, CSS, and JavaScript files
- **MIME type detection** — set the appropriate `Content-Type`
- **File streaming** — deliver files using `createReadStream()`
- **Path traversal protection** — validate resolved file paths
- **HTTP caching** — generate SHA-256 ETags and handle conditional requests with `If-None-Match`

## Tech Stack

| Technology             | Purpose                          |
| ---------------------- | -------------------------------- |
| Node.js                | JavaScript runtime               |
| JavaScript ES Modules  | Modular code organization        |
| Native `http` module   | HTTP server                      |
| `fs` and `fs/promises` | File access and streaming        |
| `path` and `url`       | URL and filesystem path handling |
| `crypto`               | SHA-256 hashing for ETags        |

No external runtime dependencies are required.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) installed
- Git

### Installation

Clone the repository:

```bash
git clone https://github.com/sami-dev-dz/http-server-node.git
cd http-server-node
```

### Start the server

```bash
node server.js
```

The server listens on:

**http://localhost:3000**

Stop the server with `Ctrl + C`.

## Project Structure

```text
http-server-node/
├── middleware/
│   ├── logger.js
│   └── jsonMiddleware.js
├── public/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── mime.js
├── router.js
├── server.js
├── static.js
├── utils.js
└── package.json
```

- `server.js` — creates the HTTP server and coordinates middleware, static files, and API routing.
- `router.js` — defines API endpoints and handles user operations.
- `static.js` — serves static files, protects file paths, and implements ETag validation.
- `mime.js` — maps file extensions to MIME types.
- `utils.js` — provides reusable JSON response utilities.
- `middleware/logger.js` — logs incoming requests.
- `middleware/jsonMiddleware.js` — parses JSON request bodies and handles body-related errors.
- `public/` — contains the frontend files served by the server.

## API Reference

All API endpoints use the `/api` prefix.

| Method | Endpoint         | Description           |
| ------ | ---------------- | --------------------- |
| `GET`  | `/api/users`     | Retrieve all users    |
| `GET`  | `/api/users/:id` | Retrieve a user by ID |
| `POST` | `/api/users`     | Create a new user     |

### Get all users

```http
GET /api/users
```

Example response:

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

### Get a user by ID

```http
GET /api/users/1
```

Example response:

```json
{
  "id": 1,
  "name": "Sami"
}
```

### Create a user

```http
POST /api/users
Content-Type: application/json
```

Request body:

```json
{
  "name": "Amine"
}
```

Example response with status `201 Created`:

```json
{
  "id": 3,
  "name": "Amine"
}
```

**Note:** User data is stored in memory. Newly created users are not persisted after the server restarts.

### HTTP status codes

| Status                      | Meaning                                   |
| --------------------------- | ----------------------------------------- |
| `200 OK`                    | Request completed successfully            |
| `201 Created`               | Resource created successfully             |
| `304 Not Modified`          | Cached resource remains valid             |
| `400 Bad Request`           | Invalid input or malformed JSON           |
| `403 Forbidden`             | File path rejected                        |
| `404 Not Found`             | Resource or route not found               |
| `405 Method Not Allowed`    | Unsupported HTTP method                   |
| `413 Payload Too Large`     | Request body exceeds the configured limit |
| `500 Internal Server Error` | Unexpected server error                   |

## Static Files

The server delivers frontend assets from the `public/` directory.

| URL          | File                |
| ------------ | ------------------- |
| `/`          | `public/index.html` |
| `/style.css` | `public/style.css`  |
| `/app.js`    | `public/app.js`     |

The static file handler uses MIME types to tell the browser how to interpret each resource and streams file contents to the response.

### HTTP caching with ETags

For static files, the server generates an ETag using a SHA-256 hash of the file contents.

When a client sends an `If-None-Match` header containing a matching ETag, the server responds with `304 Not Modified` and no response body. Otherwise, it returns `200 OK` with the file content.

This reduces unnecessary data transfer when a cached copy is still valid.

## Usage Examples

Run these commands while the server is running.

### Request the homepage

```bash
curl -i http://localhost:3000/
```

### Retrieve all users

```bash
curl -i http://localhost:3000/api/users
```

### Retrieve one user

```bash
curl -i http://localhost:3000/api/users/1
```

### Create a user

```bash
curl -i -X POST http://localhost:3000/api/users -H "Content-Type: application/json" -d "{\"name\":\"Amine\"}"
```

### Test conditional caching

First, request a static file and copy the `ETag` response header.

Then send that value back:

```bash
curl -i -H 'If-None-Match: "YOUR_ETAG_HERE"' http://localhost:3000/style.css
```

If the ETag matches, the expected response is `304 Not Modified`.

## What I Learned

- How HTTP requests, responses, headers, and status codes work
- How to build an HTTP server using Node.js native modules
- How to implement routing and reusable middleware
- How to parse and validate JSON request bodies
- How to serve and stream static files
- How to work with MIME types and filesystem paths
- How to prevent basic path traversal attempts
- How ETags and conditional requests support HTTP caching
- How to organize a Node.js application into reusable modules

## Future Improvements

- Support additional HTTP methods and routes
- Improve ETag comparison for all valid `If-None-Match` forms
- Add automated tests for routes, middleware, and caching
- Persist API data in a database
- Improve caching performance by avoiding repeated file reads

---

**Built as a hands-on project to understand HTTP and Node.js fundamentals.**
