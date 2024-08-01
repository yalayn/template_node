// src/application/use_cases/authenticateUser.js

const jwt = require('jsonwebtoken');
const { UserNotFoundError, InvalidPasswordError } = require('../errors');

const authenticateUser = async (userRepository, { username, password }) => {
  const user = await userRepository.findByUsername(username);
  if (!user) {
    throw new UserNotFoundError('User not found');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new InvalidPasswordError('Invalid password');
  }

  const payload = { id: user.id, username: user.username };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

  return { token };
};

module.exports = { authenticateUser };
