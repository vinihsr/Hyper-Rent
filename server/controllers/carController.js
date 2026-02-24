const CarModel = require('../models/carModel');
const catchAsync = require('../utils/catchAsync');

exports.getCars = catchAsync(async (req, res) => {
  const cars = await CarModel.findAll();
  res.json(cars);
});

exports.createCar = catchAsync(async (req, res) => {
    const { brand, model, year, plate, color, type, price } = req.body;

    if (!brand || !model || !year || !plate) {
        return res.status(400).json({ 
            message: "Marca, modelo, ano e placa são obrigatórios." 
        });
    }

    const newCar = await CarModel.createWithCTE({
        brand,
        model,
        year: parseInt(year),
        plate: plate.toUpperCase(),
        color,
        type,
        price: parseFloat(price)
    });

    res.status(201).json(newCar);
});

exports.getCarById = catchAsync(async (req, res) => {
    const car = await CarModel.findById(req.params.id);
    if (!car) {
        return res.status(404).json({ message: "Veículo não encontrado." });
    }
    res.status(200).json(car);
});

exports.deleteCar = catchAsync(async (req, res) => {
    const { id } = req.params;
    const deletedCar = await CarModel.delete(id);

    if (!deletedCar) {
        return res.status(404).json({ message: "Veículo não encontrado." });
    }

    res.status(200).json({ message: "Veículo removido com sucesso." });
});


exports.updateCar = catchAsync(async (req, res) =>{
    const { id } = req.params

    const updatedCar = await CarModel.update(id, req.body)

    if (!updatedCar) {
    return res.status(404).json({ 
      status: 'fail', 
      message: 'Veículo não encontrado' 
    });
  }

  res.status(200).json({
    status: 'success',
    data: updatedCar
  });
})