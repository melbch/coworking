const User = require('../models/User');
const Booking = require('../models/Booking');

exports.deleteUser = async (req, res) => {
    try {
        const requesterId = req.user.id;
        const requesterRole = req.user.role;
        const targetId = req.params.id || requesterId;

        if (requesterRole === 'Admin' && targetId === requesterId && req.params.id) {
            return res.status(403).json({ error: "Admin cannot delete their own account" });
        }

        const user = await User.findById(targetId);
        if (!user) return res.status(404).json({ error: "User not found" });

        await Booking.deleteMany({ userId: targetId });
        
        await User.findByIdAndDelete(targetId);

        res.status(200).json({ message: "User deleted successfully, bookings removed" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};