// src/application/use_cases/registerUser.js

const registerUser = async (userRepository, { name, username, password}) => {
  // Lógica del caso de uso
  let id   = UniqueValue();
  const user = { id, name, username, password };
  return await userRepository.save(user);
};

const UniqueValue = function() {
  let currentDate   = new Date().getTime();
  let randomValue   = Math.floor(Math.random() * 100000);
  let combinedValue = currentDate.toString() + randomValue.toString();
  let uniqueValue   = combinedValue.slice(-5);
  return uniqueValue;
}

module.exports = { registerUser };