const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET || 'oncar_secret_key';

const AuthService = {
  register: async (userData) => {
    const userExists = await UserModel.findByEmail(userData.email);
    if (userExists) throw new Error('User already exists');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    return await UserModel.create({ ...userData, password: hashedPassword });
  },

  login: async (email, password) => {
    const user = await UserModel.findByEmail(email);
    if (!user) throw new Error('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');

    const token = jwt.sign({ id: user.id_user }, JWT_SECRET, { expiresIn: '1d' });
    return { token, user: { id: user.id_user, name: user.name, email: user.email } };
  }
};

module.exports = AuthService;