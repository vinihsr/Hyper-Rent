require('dotenv').config();
const app = require('./app');
const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`----------------------------`);
    console.log(`Backend Live on Port ${PORT}`);
    console.log(`----------------------------`);
});
