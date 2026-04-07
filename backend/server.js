require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/rooms');
const bookingRoutes = require('./routes/bookings');
const userRoutes = require('./routes/users');

const app = express();
const server = http.createServer(app);

// Connect to database
connectDB();

// Middleware
app.use(cors({
    origin: "https://coworking-frontend-6vjn.onrender.com",
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'], 
}));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API is running');
})

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);

const io = new Server(server, {
    cors: { origin: "*" }
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