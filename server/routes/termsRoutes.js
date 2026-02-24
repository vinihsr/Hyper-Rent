const express = require('express');
const router = express.Router();
const termsController = require('../controllers/termsController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/check', protect, termsController.checkUserTerms);
router.post('/accept', protect, termsController.acceptTerms);

module.exports = router;