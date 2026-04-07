const express = require('express');
const router = express.Router();
const { createRoom, getRooms, updateRoom, deleteRoom } = require('../controllers/roomController');
const auth = require('../middleware/auth');

// Admin only
router.post('/', auth('Admin'), createRoom);
router.put('/:id', auth('Admin'), updateRoom);
router.delete('/:id', auth('Admin'), deleteRoom);

// All logged in users
router.get('/', auth(), getRooms);

module.exports = router;