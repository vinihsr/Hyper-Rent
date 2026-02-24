require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const carRoutes = require('./routes/carRoutes');
const rentRoutes = require('./routes/rentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const errorMiddleware = require('./middlewares/errorMiddleware');
const termsRoutes = require('./routes/termsRoutes'); 

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: function (origin, callback) {
    callback(null, true); 
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS']
}));

app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/rent', rentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/api-keys', adminRoutes)
app.use('/api/external', adminRoutes);
app.use('/api/terms', termsRoutes);


app.use(errorMiddleware);

module.exports = app;