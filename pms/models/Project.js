const db = require('../config/db');

class Project {
  static async getAll() {
    try {
      const [rows] = await db.execute(`
        SELECT p.*, u.username as creator_name 
        FROM projects p 
        LEFT JOIN users u ON p.created_by = u.id
        ORDER BY p.created_at DESC
      `);
      return rows;
    } catch (error) {
      console.error('Error getting all projects:', error);
      throw error;
    }
  }

  static async getById(id) {
    try {
      const [rows] = await db.execute(`
        SELECT p.*, u.username as creator_name 
        FROM projects p 
        LEFT JOIN users u ON p.created_by = u.id
        WHERE p.id = ?
      `, [id]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error('Error getting project by ID:', error);
      throw error;
    }
  }

  static async create(projectData) {
    const { name, description, start_date, end_date, status, created_by } = projectData;
    
    try {
      const [result] = await db.execute(
        'INSERT INTO projects (name, description, start_date, end_date, status, created_by) VALUES (?, ?, ?, ?, ?, ?)',
        [name, description, start_date, end_date, status, created_by]
      );
      
      return result.insertId;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }

  static async update(id, projectData) {
    const { name, description, start_date, end_date, status } = projectData;
    
    try {
      const [result] = await db.execute(
        'UPDATE projects SET name = ?, description = ?, start_date = ?, end_date = ?, status = ? WHERE id = ?',
        [name, description, start_date, end_date, status, id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await db.execute('DELETE FROM projects WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  }

  static async search(query) {
    try {
      const searchTerm = `%${query}%`;
      const [rows] = await db.execute(`
        SELECT p.*, u.username as creator_name 
        FROM projects p 
        LEFT JOIN users u ON p.created_by = u.id
        WHERE p.name LIKE ? OR p.description LIKE ?
        ORDER BY p.created_at DESC
      `, [searchTerm, searchTerm]);
      return rows;
    } catch (error) {
      console.error('Error searching projects:', error);
      throw error;
    }
  }
}

module.exports = Project; 