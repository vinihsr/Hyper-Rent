const catchAsync = require('../utils/catchAsync');
const AuthService = require('../services/authService');
const bcrypt = require('bcryptjs');
const UserModel = require('../models/userModel')

exports.signup = catchAsync(async (req, res) => {
    const { 
        name, last_name, cpf, email, password, phone,
        state, city, street, number, district 
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserModel.createWithCTE({
        state, city, street, number, district,
        name, last_name, cpf, email, 
        password: hashedPassword, 
        phone
    });

    res.status(201).json(newUser);
});

exports.login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const { token, user } = await AuthService.login(email, password);

  res.cookie('token', token, {
    httpOnly: true,
    secure: false, 
    sameSite: 'lax',
    path: '/',
    maxAge: 86400000 
  });

  res.status(200).json({ status: 'success', user });
});


exports.logout = (req, res) => {
  res.clearCookie('token', { path: '/' });
  res.clearCookie('admin_flag', { path: '/' });
  res.status(200).json({ message: 'Logged out successfully' });
};