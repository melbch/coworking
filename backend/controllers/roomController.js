const Room = require('../models/Room');
const redisClient = require('../config/redis');

exports.createRoom = async (req, res) => {
    try {
        const room = await Room.create(req.body);

        await redisClient.del('rooms');

        res.status(201).json(room);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateRoom = async (req, res) => {
    try {
        const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true});
        
        if (!room) return res.status(404).json({ error: 'Room not found' });
        
        await redisClient.del('rooms');
        
        res.json(room);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteRoom = async (req, res) => {
    try {
        const room = await Room.findByIdAndDelete(req.params.id);
        
        if (!room) return res.status(404).json({ error: 'Room not found' });
        
        await redisClient.del('rooms');
        
        res.json({ message: 'Room deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getRooms = async (req, res) => {
    try {
        const cachedRooms = await redisClient.get('rooms'); // Check cache first

        if (cachedRooms)  {
            console.log('Serving from Redis');
            return res.json(JSON.parse(cachedRooms));
        }

        console.log('Fetching from DB'); // get from database if cache is empty
        const rooms = await Room.find();

        await redisClient.setEx('rooms', 60, JSON.stringify(rooms)); // save in Redis

        res.json(rooms);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}