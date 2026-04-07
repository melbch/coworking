# Coworking Space Booking API

## ✅ Project Overview
This project is a backend system for a coworking space booking platform. It allows users to register, log in, and manage bookings for workspaces and conference rooms. Users can also delete their own accounts. Administrators can manage rooms and users.

**Features include:**
- JWT authentication
- Role-based access control (User/Admin)
- Redis caching for rooms
- Real-time notifications via Socket.io

---

## 🛠️ Technologies
- Node.js / Express.js
- MongoDB with Mongoose
- Redis (for caching rooms)
- Socket.io (for real-time notifications)
- JWT (authentication)
- bcrypt for password hashing
- CORS
- Docker (for Redis)

## ⚡ Installation & Setup (Local)

1. **Clone the repository:**

```bash
git clone <my-repo-url>
cd <project-folder>/backend
```

2. **Install dependencies:**

```bash
npm install
```

3. **Create a `.env` file** in the backend folder:

```env
MONGO_URI=<my-mongodb-connection-string>
JWT_SECRET=<my-secret-key>
PORT=5000
REDIS_URL=redis://localhost:6379
```

4. **Start Redis** (for local development, via Docker):

```bash
docker run -p 6379:6379 redis
```

5. **Start the server:**

- Using Node.js (standard, production mode):
```bash
node server.js
```

- Using Nodemon (development mode):
```bash
npm run dev
```

> Note: The development mode (`npm run dev`) uses Nodemon, which restarts the server automatically on code changes.

> Note: Make sure you have installed nodemon globally (`npm install -g nodemon`) or that it is included in your local npm scripts.

---

## 🔗 API Documentation

### Auth

| Route | Method | Body | Response |
|-------|--------|------|----------| 
| `/api/auth/register` | POST | `{ "username": "user1", "password": "pass123" }` | `{ "message": "User created", "token": "JWT_TOKEN_HERE" "id": "...", "username": "user1", "role": "User" }`|
| `/api/auth/login` | POST | `{ "username": "user1", "password": "pass123" }` | `{ "token": "JWT_TOKEN_HERE" }` |

### Users (Admin only for GET)

| Route | Method | Body | Response |
|-------|--------|------|----------|
| `api/users` | GET | None | Array of users without passwords |
| `/api/users/me` | DELETE | None | `{ "message": "User deleted successfully, bookings deleted" }` |
| `/api/users/:id` | DELETE | None | `{ "message": "User deleted successfully, bookings deleted" }` |
> ⚠️ **Note:** All bookings associated with an account will also be automatically removed upon deletion of the account.

### Rooms (Admin only for POST/PUT/DELETE)

| Route | Method | Body | Response |
|-------|--------|------|----------|
| `/api/rooms` | GET | None | `[ { "name": "Room A", "capacity": 4, "type": "workspace" } ]` |
| `/api/rooms` | POST | `{ "name": "Room B", "capacity": 6, "type": "conference" }` | Created room object |
| `/api/rooms/:id` | PUT | `{ "name": "Updated Room Name" }` | Updated room object |
| `/api/rooms/:id` | DELETE | None | `{ "message": "Room deleted" }` |

### Bookings

| Route | Method | Body | Response |
|-------|--------|------|----------|
| `/api/bookings` | GET | None | List of bookings (all for Admin, user-specific otherwise) |
| `/api/bookings` | POST | `{ "roomId": "...", "startTime": "...", "endTime": "..." }` | Created booking object |
| `/api/bookings/:id` | PUT | `{ "startTime": "...", "endTime": "..." }` | Updated booking object |
| `/api/bookings/:id` | DELETE | None | `{ "message": "Booking deleted" }` |

---

## 📚 API Endpoints & Examples

### Auth

#### 1. **Register a new user**

**POST** `/api/auth/register`

**Request Body:**

```json
{
    "username": "user1",
    "password": "pass123"
}
```

**Example using curl:**

```bash
curl -X POST http://localhost:5000/api/auth/register \
-H "Content-Type: application/json" \
-d '{"username:"user1","password":"pass123"}'
```

**Reponse:**

```json
{
    "message": "User created",
    "token": "JWT_TOKEN_HERE",
    "user":
        {
            "id": "6425d3f1a1234567890abcde" ,
            "username": "user1" ,
            "role": "pass123" 
        }
}
```

---


#### 2. **Login**

**POST** `/api/auth/login`

**Request Body:**

```json
{
    "username": "user1",
    "password": "pass123"
}
```

**Example using curl:**

```bash
curl -X POST http://localhost:5000/api/auth/login \
-H "Content-Type: application/json" \
-d '{"username:"user1","password":"pass123"}'
```

**Reponse:**

```json
{
    "token": "JWT_TOKEN_HERE"
}
```

---

### Users

#### 1. **Get all users (Admin)**

**GET** `/api/users`

**Example using curl:**

```bash
curl -X GET http://localhost:5000/api/users \
-H "Authorization: Bearer JWT_TOKEN_HERE"
```

**Reponse:**

```json
[
    {
        "_id": "6425d3f1a1234567890abcde",
        "username": "admin1",
        "role": "Admin",
    },
    {
        "_id": "6425d3f1a1234567890abcde",
        "username": "user1",
        "role": "User",
    }
]
```

---

#### 2. **Delete own account (User)**

**DELETE** `/api/users/me`

**Example using curl:**

```bash
curl -X DELETE http://localhost:5000/api/users/me \
-H "Authorization: Bearer JWT_TOKEN_HERE"
```

**Reponse:**

```json
[
    {
        "message": "User deleted successfully, bookings deleted"
    }
]
```

---

#### 3. **Delete any account (Admin)**

**DELETE** `/api/users/:id`

**Example using curl:**

```bash
curl -X DELETE http://localhost:5000/api/users/userid \
-H "Authorization: Bearer JWT_TOKEN_HERE"
```

**Reponse:**

```json
[
    {
        "message": "User deleted successfully, bookings deleted"
    }
]
```

---

### Rooms (Admin only for POST/PUT/DELETE)

#### 1. **Get all rooms**

**GET** `/api/rooms`

**Example using curl:**

```bash
curl -X GET http://localhost:5000/api/rooms \
-H "Authorization: Bearer JWT_TOKEN_HERE"
```

**Reponse:**

```json
[
    {
        "_id": "room123",
        "name": "Conference Room 1",
        "capacity": 6,
        "type": "conference"
    }
]
```

---

#### 2. **Create a new room (Admin)**

**POST** `/api/rooms`

**Request Body:**

```json
{
    "name": "Workspace 1",
    "capacity": 4,
    "type": "workspace",
}
```

**Example using curl:**

```bash
curl -X POST http://localhost:5000/api/rooms \
-H "Authorization: Bearer JWT_TOKEN_HERE" \
-H "Content-Type: application/json" \
-d '{"name:"Workspace 1","capacity":4,"type":"workspace"}'
```

**Reponse:**

```json
[
    {
        "_id": "room456",
        "name": "Workspace 1",
        "capacity": 4,
        "type": "workspace"
    }
]
```

---

#### 3. **Update a room (Admin)**

**PUT** `/api/rooms/:id`

**Request Body:**

```json
{
    "name": "Updated Room Name"
}
```

**Example using curl:**

```bash
curl -X PUT http://localhost:5000/api/rooms/room456 \
-H "Authorization: Bearer JWT_TOKEN_HERE" \
-H "Content-Type: application/json" \
-d '{"name:"Updated Room Name"}'
```

**Reponse:**

```json
[
    {
        "_id": "room456",
        "name": "Updated Room Name",
        "capacity": 4,
        "type": "workspace"
    }
]
```

---

#### 4. **Delete a room (Admin)**

**DELETE** `/api/rooms/:id`

**Example using curl:**

```bash
curl -X DELETE http://localhost:5000/api/rooms/room456 \
-H "Authorization: Bearer JWT_TOKEN_HERE" \
```

**Reponse:**

```json
[
    {
        "message": "Room deleted"
    }
]
```

---

### Bookings

#### 1. **Get bookings**

**GET** `/api/bookings`

- Admin: returns all bookings
- User: returns only the user's bookings

**Example using curl:**

```bash
curl -X GET http://localhost:5000/api/bookings \
-H "Authorization: Bearer JWT_TOKEN_HERE" \
```

**Reponse:**

```json
[
    {
        "_id": "69d52597b776b7cb87849d0c",
        "roomId": {
            "_id": "69d52334b776b7cb87849cfa",
            "name": "Workspace 1"
        },
        "userId": {
            "_id": "69d521d6b776b7cb87849cf5",
            "username": "admin"
        },
        "startTime": "2026-04-24T09:00:00.000Z",
        "endTime": "2026-04-24T12:00:00.000Z",
        "expiresAt": "2026-04-24T12:00:00.000Z",
        "__v": 0
    }
]
```

---

#### 2. **Create a booking**

**POST** `/api/bookings`

**Request Body:**

```json
{
    "roomId": "room123",
    "startTime": "2026-03-24T09:00:00.000Z",
    "endTime": "2026-03-24T12:00:00.000Z"
}
```

**Example using curl:**

```bash
curl -X POST http://localhost:5000/api/bookings \
-H "Authorization: Bearer JWT_TOKEN_HERE" \
-H "Content-Type: application/json" \
-d '{"roomId":"room123","startTime":"2026-03-24T09:00:00.000Z","endTime":"2026-03-24T12:00:00.000Z"}'
```

**Reponse:**

```json
[
    {
        "_id": "booking123",
        "roomId": "room123",
        "userId": "user1",
        "startTime": "2026-03-24T09:00:00.000Z",
        "endTime": "2026-03-24T12:00:00.000Z"
    }
]
```

---

#### 3. **Update a booking**

**PUT** `/api/bookings/:id`

**Request Body:**

```json
{
    "startTime": "2026-03-24T10:00:00.000Z",
    "endTime": "2026-03-24T13:00:00.000Z"
}
```

**Example using curl:**

```bash
curl -X POST http://localhost:5000/api/bookings/booking123 \
-H "Authorization: Bearer JWT_TOKEN_HERE" \
-H "Content-Type: application/json" \
-d '{"startTime":"2026-03-24T10:00:00.000Z","endTime":"2026-03-24T13:00:00.000Z"}'
```

**Reponse:**

```json
[
    {
        "_id": "booking123",
        "roomId": "room123",
        "userId": "user1",
        "startTime": "2026-03-24T10:00:00.000Z",
        "endTime": "2026-03-24T13:00:00.000Z",
        "expiresAt": "2026-04-24T12:00:00.000Z"
    }
]
```

---

#### 4. **Delete a booking**

**DELETE** `/api/bookings/:id`

**Example using curl:**

```bash
curl -X DELETE http://localhost:5000/api/bookings/booking123 \
-H "Authorization: Bearer JWT_TOKEN_HERE" \
```

**Reponse:**

```json
[
    {
        "message": "Booking deleted"
    }
]
```

---

## ⚡ Real-time Notifications

- Uses Socket.io to send real-time updates when bookings are **created, updated, or deleted**.
- Clients must connect using the JWT token to subscribe to notifications.

Example message:

```json
{
    "message": "Booking created for room 123",
    "booking": {
        "id": "abc123",
        "roomId": "123",
        "userId": "user123",
        "startTime": "...",
        "endTime": "...",
    }
}
```

## 📌 Notes

- **Authentication:**
All protected routes require a JWT token. Include it in the request header as: `Authorization: Bearer <your_token_here>`

- **Date & Time Format:**
All booking times use ISO 8601 format.
Example: `"2026-03-24T09:00:00.000Z"`

- **User Roles:**
    - **User:** Can create, view, update, and delete their own bookings. Can delete their own accounts.
    - **Admin:** Can manage all bookings, rooms, and users. Can delete all other accounts but not their own.

- **Bookings:**
    - **Account Deletion:** All bookings associated with an account will also be automatically removed upon deletion of the account.
    - **Expiration:** Bookings will automatically be removed after the scheduled end time.

- **Caching (Redis):**
Room data is cached for improved performance.
Cache duration: 60 seconds.
Cache is refreshed when rooms are updated.

- **Real-time Notifications:**
Backend uses Socket.io to emit events when bookings are created, updated, or deleted. Frontend can listen to these events to update the UI in real-time.

- **Error Handling:**
Errors are returned in JSON format.
Example: `{ "error": "The room is already booked during this time period." }`

- **Data Types:**
    - `capacity`is a Number
    - `type`is a String (`workspace` or `conference`)
    - `startTime`and `endTime` are ISO date strings.

- **Testing:**
API endpoints can be tested using Postman or curl (see examples above). 

## 🏁 Deployment

- The backend can be deployed to Heroku or any cloud provider supporting Node.js.