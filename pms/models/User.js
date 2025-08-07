const bcrypt = require('bcrypt');
const db = require('../config/db');

class User {
  static async findByUsername(username) {
    try {
      const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error('Error finding user by username:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await db.execute('SELECT id, username, email, created_at FROM users WHERE id = ?', [id]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  }

  static async create(userData) {
    const { username, email, password } = userData;
    
    try {
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Insert the user
      const [result] = await db.execute(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, hashedPassword]
      );
      
      return result.insertId;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async authenticate(username, password) {
    try {
      const user = await this.findByUsername(username);
      
      if (!user) {
        return null;
      }
      
      const isMatch = await bcrypt.compare(password, user.password);
      
      if (!isMatch) {
        return null;
      }
      
      return {
        id: user.id,
        username: user.username,
        email: user.email
      };
    } catch (error) {
      console.error('Error authenticating user:', error);
      throw error;
    }
  }
  
  static async getAll() {
    try {
      const [rows] = await db.execute('SELECT id, username, email, created_at FROM users');
      return rows;
    } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
  }
}

module.exports = User; 