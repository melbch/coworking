require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/rooms');
const bookingRoutes = require('./routes/bookings');
const userRoutes = require('./routes/users');

const app = express();
const server = http.createServer(app);

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Connect to database
connectDB();

app.use(express.json());

// Middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', FRONTEND_URL);
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Routes
app.get('/', (req, res) => {
    res.send('API is running');
});
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);

const io = new Server(server, {
    cors: { 
        origin: FRONTEND_URL,
        methods: ['GET', 'POST'],
        credentials: true
    }
});

app.set('io', io);

io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);
    socket.on("disconnect", () => {
        console.log("Socket disconnected:", socket.id);
    });
});

const PORT = process.env.PORT || 5000;
console.log("Trying to start server...");
console.log("PORT =", PORT);
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports.io = io;