# MERN Blog — API Documentation

Base URL: `http://localhost:5000` (development)
Auth: JWT Bearer Token in `Authorization: Bearer <token>` header

---

## Authentication APIs

### POST /api/auth/register
Register a new user. **Public.**

Request:
`{ "name": "John Doe", "email": "john@example.com", "password": "password123" }`

Success (201):
`{ "message": "Registration successful! Please login now." }`

Errors: `400` — Missing fields, invalid email, duplicate email.

### POST /api/auth/login
Login and receive JWT token. **Public.**

Request:
`{ "email": "john@example.com", "password": "password123" }`

Success (200):
`{ "message": "Login successful!", "token": "eyJ...", "user": { "id": "...", "name": "John Doe", "email": "john@example.com", "role": "user" } }`

Errors: `400` — Invalid credentials.

---

## Blog APIs (Public)

### GET /api/blog/public
Get approved blogs with search and pagination.

Params: `search` (string), `page` (number, default 1), `limit` (number, default 6)

Example: `GET /api/blog/public?search=react&page=1&limit=6`

Success (200): `{ "blogs": [...], "pagination": { "total": 10, "page": 1, "limit": 6, "totalPages": 2, "hasMore": true } }`

### GET /api/blog/:id
Get single blog with populated author and comments.

Errors: `404` — Blog not found.

---

## Blog APIs (Authenticated)

Require `Authorization: Bearer <token>` header.

### POST /api/blog/create
Create a new blog (status: pending).

Request: `{ "title": "My Blog", "content": "Blog content here..." }`

Success (201): `{ "message": "Blog created! Waiting for admin approval.", "blog": {...} }`

### GET /api/blog/myblogs
Get logged-in user's blogs.

Success (200): Array of blog objects.

### PUT /api/blog/update/:id
Update own blog.

Request: `{ "title": "Updated Title", "content": "Updated content..." }`

Success (200): `{ "message": "Blog updated successfully!", "blog": {...} }`

Errors: `403` — Not author. `404` — Not found.

### DELETE /api/blog/delete/:id
Delete own blog.

Success (200): `{ "message": "Blog deleted successfully!" }`

Errors: `403` — Not author. `404` — Not found.

---

## Admin APIs

Require `Authorization: Bearer <admin_token>` (role must be "admin").

### GET /api/admin/pending
Get all pending blogs. Returns array of blog objects.

### PUT /api/admin/approve/:id
Approve a blog.

Success (200): `{ "message": "Blog approved! It is now visible on the home page.", "blog": {...} }`

### PUT /api/admin/reject/:id
Reject a blog.

Success (200): `{ "message": "Blog rejected.", "blog": {...} }`

Errors: `403` — Not admin.

---

## Comment APIs

### POST /api/blog/:id/comment
Add comment to approved blog. **Auth required.**

Request: `{ "text": "Great article!" }`

Success (201): `{ "message": "Comment added successfully!", "comments": [...] }`

Errors: `400` — Blog not approved for comments.



---

## Error Codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request / Validation Error |
| 401 | Unauthorized (no token / invalid token) |
| 403 | Forbidden (not admin) |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## Postman Workflow

1. `POST /api/auth/register` — Create account
2. `POST /api/auth/login` — Get token
3. `POST /api/blog/create` — Create blog (use token)
4. `GET /api/blog/public` — View approved blogs
5. `PUT /api/admin/approve/:id` — Approve (use admin token)
6. `POST /api/blog/:id/comment` — Add comment (use token)
