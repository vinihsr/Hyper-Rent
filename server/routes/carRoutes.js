const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

router.get('/', adminOnly, carController.getCars);     
router.post('/', protect, adminOnly, carController.createCar); 
router.delete('/:id', protect, adminOnly, carController.deleteCar);
router.put('/:id', protect, adminOnly, carController.updateCar)

module.exports = router;