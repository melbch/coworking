const express = require('express');
const router = express.Router();
const { deleteUser } = require('../controllers/userController');
const auth = require('../middleware/auth');

router.get("/", auth('Admin'), async (req, res) => {
    const User = require('../models/User');
    try {
        const users = await User.find({}, { password: 0 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

router.delete('/me', auth(), deleteUser); // User can delete their own account
router.delete('/:id', auth('Admin'), deleteUser); //Admin can delete any user-account but not their own

module.exports = router;