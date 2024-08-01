// src/domain/entities/User.js

class User {
    constructor(id, name, username, password) {
      this.id       = id;
      this.name     = name;
      this.username = username;
      this.password = password;
    }
  }
  
  module.exports = User;  