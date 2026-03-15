"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = me;
async function me(req, res) {
    try {
        const user = req.user;
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({
            user: {
                email: user.email,
                name: user.name,
                phone: user.phone,
                role: user.role,
            },
            message: 'User information retrieved successfully',
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
