const Booking = require('../models/Booking');

exports.createBooking = async (req, res) => {
    const { roomId, startTime, endTime } = req.body;
    const userId = req.user.id;

    try {
        // Check if room is already booked
        const conflict = await Booking.findOne({
            roomId,
            $or: [
                { startTime: { $lt: new Date(endTime), $gte: new Date(startTime) } },
                { endTime: { $gt: new Date(startTime), $lte: new Date(endTime) } },
                { startTime: { $lte: new Date(startTime) }, endTime: { $gte: new Date(endTime) } }
            ]
        });

        if (conflict) {
            return res.status(400).json({ error: 'The room is already booked during this time period.' });
        }

        const booking = await Booking.create({ roomId, userId, startTime, endTime, expiresAt: new Date(endTime) });
        
        // Real-time notification
        const io = req.app.get('io');
        io.emit('bookingCreated', {
            message: `New booking created for room ${roomId}`,
            booking,
        });
        
        res.status(201).json(booking);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getBookings = async (req, res) => {
    try {
        const filter = req.user.role === 'Admin' ? {} : { userId: req.user.id };
        const bookings = await Booking.find(filter).populate('roomId userId', 'name username');
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.updateBooking = async (req, res) => {
    const { startTime, endTime } = req.body;
    const bookingId = req.params.id;

    try {
        const booking = await Booking.findById(bookingId);
        if (!booking) return res.status(404).json({ error: 'Booking not found' });

        // Check permissons
        if (req.user.role !== 'Admin' && booking.userId.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Forbidden: cannot update this booking' });
        }

        // Check conflicts
        const conflict = await Booking.findOne({
            roomId: booking.roomId,
            _id: { $ne: bookingId },
            $or: [
                {startTime: { $lt: new Date(endTime), $gte: new Date(startTime) } },
                { endTime: { $gt: new Date(startTime), $lte: new Date(endTime) } },
                { startTime: { $lte: new Date(startTime) }, endTime: { $gte: new Date(endTime) } }
            ]
        });
        if (conflict) return res.status(400).json({ error: 'The room is already booked during this time period.' });

        // Update booking
        booking.startTime = startTime;
        booking.endTime = endTime;
        await booking.save();

        // Real-time notification
        const io = req.app.get('io');
        io.emit('bookingUpdated', {
            message: `Booking ${booking._id} updated for room ${booking.roomId}`,
            booking,
        });

        res.json(booking);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteBooking = async (req, res) => {
    const bookingId = req.params.id;

    try {
        const booking = await Booking.findById(bookingId);
        if (!booking) return res.status(404).json({ error: 'Booking not found' });

        // Check permissions
        if (req.user.role !== 'Admin' && booking.userId.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Forbidden: cannot delete this booking' });
        }

        await booking.deleteOne();
        
        // Real-time notification
        const io = req.app.get('io');
        io.emit('bookingDeleted', {
            message: `Booking deleted for room ${booking.roomId}`,
            booking,
        });
        
        res.json({ message: 'Booking deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};