// src/application/use_cases/findUser.js

const findUserByUsername = async (userRepository, { username }) => {
    // Lógica del caso de uso
    return await userRepository.findByUsername(username);
  };
  
  module.exports = { findUserByUsername };