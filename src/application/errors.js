// src/application/errors.js

class UserNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'UserNotFoundError';
    }
}
  
class InvalidPasswordError extends Error {
    constructor(message) {
        super(message);
        this.name = 'InvalidPasswordError';
    }
}
  
module.exports = {
    UserNotFoundError,
    InvalidPasswordError,
};