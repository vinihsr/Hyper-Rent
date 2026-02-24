require('dotenv').config();
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel'); 

const JWT_SECRET = process.env.JWT_SECRET;

exports.protect = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await UserModel.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'User not found' });

    req.user = user; 
    next();
  } catch (err) {
    res.clearCookie('token');
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

exports.adminOnly = (req, res, next) => {
  const isAdmin = req.user && req.user.email === process.env.ADMIN_EMAIL; 

  if (!isAdmin) {
    return res.status(403).json({ 
      message: 'Acesso negado: Requer privilégios de administrador.' 
    });
  }
  next();
};