import jwt from 'jsonwebtoken';
export const makeToken = user => jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
export const publicUser = user => ({ id: user._id, name: user.name, email: user.email, role: user.role, favorites: user.favorites || [] });
