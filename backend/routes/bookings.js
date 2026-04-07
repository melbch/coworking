const express = require('express');
const router = express.Router();
const { createBooking, getBookings, updateBooking, deleteBooking } = require('../controllers/bookingController');
const auth = require('../middleware/auth');

router.post('/', auth(), createBooking);
router.get('/', auth(), getBookings);
router.put('/:id', auth(), updateBooking); 
router.delete('/:id', auth(), deleteBooking);

module.exports = router;