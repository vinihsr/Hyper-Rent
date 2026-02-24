const catchAsync = require('../utils/catchAsync');
const ApiModel = require('../models/apiModel'); 
const CarModel = require('../models/carModel');

exports.login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const masterEmail = process.env.ADMIN_EMAIL;
  const masterPass = process.env.ADMIN_PASSWORD;

  console.log(`Tentativa Admin: ${email} | Esperado: ${masterEmail}`);

  if (email === masterEmail && password === masterPass) {
    return res.json({ 
      admin: true, 
      user: { name: 'Admin OnCar', email: masterEmail } 
    });
  }

  return res.status(401).json({ error: "Credenciais de administrador incorretas" });
});

exports.getSystemKeys = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?.id_user; 
        if (!userId) return res.status(401).json({ error: "Usuário não identificado." });

        const keys = await ApiModel.findByUserId(userId);
        res.json(keys);
    } catch (err) {
        console.error("Admin Controller Error:", err);
        res.status(500).json({ error: "Erro ao buscar chaves do sistema." });
    }
};

exports.generateSystemKey = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?.id_user;
        if (!userId) return res.status(401).json({ error: "Sessão inválida." });

        const newKey = await ApiModel.create(userId);
        res.status(201).json(newKey);
    } catch (err) {
        console.error("Admin Generation Error:", err);
        res.status(500).json({ error: "Erro ao gerar credencial." });
    }
};

exports.getExternalFleet = async (req, res) => {
    try {
        const { apikey } = req.query;

        if (!apikey) {
            return res.status(401).json({ error: "API Key is missing from the URL." });
        }

        const keyData = await ApiModel.findByKey(apikey);
        
        if (!keyData || !keyData.is_active) {
            return res.status(403).json({ error: "Invalid or inactive API Key." });
        }

        const cars = await CarModel.findAll(); 
        
        res.json({ 
            source: "OnCar-External-Data",
            timestamp: new Date().toISOString(),
            count: cars.length,
            data: cars 
        });
    } catch (err) {
        console.error("External API Error:", err);
        res.status(500).json({ error: "Internal server error during data extraction." });
    }
};