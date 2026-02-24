require('dotenv').config(); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET;

const AuthService = {
  register: async (userData) => {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    return await UserModel.create({ ...userData, password: hashedPassword });
  },

  login: async (email, password) => {
    const user = await UserModel.findByEmail(email);
    if (!user) throw new Error('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');

    const token = jwt.sign({ id: user.id_user }, JWT_SECRET, { expiresIn: '1d' });
    
    delete user.password;
    return { token, user };
  },

  getUserById: async (id) => {
    const user = await UserModel.findById(id); 
    if (!user) throw new Error('User not found');
    delete user.password;
    return user;
  }
};

module.exports = AuthService;