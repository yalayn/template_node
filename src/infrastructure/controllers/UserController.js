// src/infrastructure/controllers/UserController.js

const express = require('express');
const router = express.Router();
const UserRepositoryImpl = require('../repositories/UserRepositoryImpl');
const { registerUser } = require('../../application/use_cases/registerUser');
const { findUserByUsername } = require('../../application/use_cases/findUser');
const { authenticateUser } = require('../../application/use_cases/authenticateUser');
const authMiddleware = require('../middleware/auth');
const redisClient = require('../config/redis');
const { UserNotFoundError, InvalidPasswordError } = require('../../application/errors');


// Ruta para crear un usuario
router.post('/register', authMiddleware, async (req, res) => {
  const userRepository = new UserRepositoryImpl();
  const { name, username, password } = req.body;
  try {
    const user = await registerUser(userRepository, { name, username, password });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Ruta protegida para obtener el usuario autenticado
router.get('/me', authMiddleware, async (req, res) => {
  const userRepository = new UserRepositoryImpl();
  try {
    const user = await userRepository.findById(req.user.id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.log(`*** Error me:`,error);
    res.status(500).json({ error: error.message });
  }
});

// Ruta protegida para obtener usuario segun su username.
router.get('/', authMiddleware, async (req, res) => {
  const userRepository = new UserRepositoryImpl();
  const { username } = req.body;
  try {
    const user = await findUserByUsername(userRepository, { username });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: `${username} User not found` });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Ruta para gestionar el login de un usuario
router.post('/login', async (req, res) => {
  let response  = {"success":false,"message":"","data":""}
  const userRepository = new UserRepositoryImpl();
  const { username, password } = req.body;
  try {
    const { token } = await authenticateUser(userRepository, { username, password });
    response["success"] = true;
    response["data"]    = token;
    res.status(200).json({ response });
  } catch (error) {
    if (error instanceof UserNotFoundError || error instanceof InvalidPasswordError) {
      response["message"] = error.message;
      res.status(200).json(response);
    } else {
      console.log(`*** Error login:`,error);
      response["message"] = "Internal server error";
      res.status(500).json(response);
    }
  }
});

// Ruta de cierre de sesión
router.post('/logout', authMiddleware, (req, res) => {
  let response  = {"success":false,"message":"","data":""}
  const token = req.header('Authorization').replace('Bearer ', '');

  // Agregar el token a la lista negra en Redis
  redisClient.set(token, 'blacklisted', 'EX', process.env.JWT_EXPIRATION, (error) => {
    if (error) {
      console.log(`*** Error logout:`,error);
      response["message"] = 'Internal server error';
      return res.status(500).json(response);
    }
    response["success"] = true;
    response["message"] = 'Logged out successfully';
    res.status(200).json(response);
  });
});

module.exports = router;
