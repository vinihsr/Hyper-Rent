const RentModel = require('../models/rentModel');
const catchAsync = require('../utils/catchAsync');

exports.createRent = catchAsync(async (req, res) => {
    const { id_car } = req.body;
    const userId = req.user.id_user;
    const result = await RentModel.create(userId, id_car);
    res.status(201).json(result);
});

exports.getMyRentals = catchAsync(async (req, res) => {
    const rentals = await RentModel.findActiveByUser(req.user.id_user);
    res.status(200).json(rentals);
});

exports.returnCar = catchAsync(async (req, res) => {
    const { id_rent } = req.params;
    const { id_car } = req.body;
    await RentModel.finishRent(id_rent, id_car);
    res.status(200).json({ message: 'Veículo devolvido' });
});

exports.getAdminHistory = catchAsync(async (req, res) => {
    const history = await RentModel.findAllHistory();
    res.status(200).json(history);
});

exports.getMyHistory = catchAsync(async (req, res) => {
    const history = await RentModel.findUserHistory(req.user.id_user);
    res.status(200).json(history);
});