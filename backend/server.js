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

const allowedOrigins = [
  'https://coworking-frontend-6vjn.onrender.com',
];


// Connect to database
connectDB();

// Middleware
app.use(cors({
    origin: function(origin, callback) {
        if(!origin) return callback(null, true); // Postman / curl / server-side requests
        if(allowedOrigins.includes(origin)) return callback(null, true);
        callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET','POST','PUT','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization'],
    credentials: true
}));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API is running');
})

app.options('*', cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);

const io = new Server(server, {
    cors: { 
        origin: "https://coworking-frontend-6vjn.onrender.com",
        methods: ["GET", "POST"],
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