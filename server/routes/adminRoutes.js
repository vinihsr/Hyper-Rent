const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/login', adminController.login);

router.get('/api-keys', protect, adminController.getSystemKeys);
router.post('/api-keys/generate', protect, adminController.generateSystemKey);
router.get('/cars', adminController.getExternalFleet);


module.exports = router;