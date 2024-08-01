// src/infrastructure/server/server.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const userController = require('../controllers/UserController');
const connectDB = require('../database/database');

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Conectar a la base de datos
connectDB();

// Configura CORS para permitir solicitudes desde http://localhost:3000
app.use(cors({ origin: 'http://localhost:3000' }));

app.use(bodyParser.json());

app.use('/api/users', userController);

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});