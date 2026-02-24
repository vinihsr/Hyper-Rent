const express = require('express');
const router = express.Router();
const rentController = require('../controllers/rentController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

router.get('/me', protect, rentController.getMyRentals);
router.get('/history/all', protect, adminOnly, rentController.getAdminHistory);
router.get('/history/me', protect, rentController.getMyHistory);

router.post('/', protect, rentController.createRent);
router.patch('/return/:id_rent', protect, rentController.returnCar);

module.exports = router;