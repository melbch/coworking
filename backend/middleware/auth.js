const jwt = require('jsonwebtoken');

const auth = (requiredRole) => {
    return (req, res, next) => {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) return res.status(401).json({ error: 'Access denied, no token' });

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = {
                id: decoded.id,
                role: decoded.role
            };

            //If a role is needed, verify it
            if (requiredRole && decoded.role !== requiredRole) {
                return res.status(403).json({ error: 'Forbidden: insufficient permissions' });
            }

            next();
        } catch (err) {
            res.status(400).json({ error: 'Invalid token' });
        }
    };
};

module.exports = auth;