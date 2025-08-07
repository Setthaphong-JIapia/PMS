const db = require('../config/db');

class Task {
  static async getAll() {
    try {
      const [rows] = await db.execute(`
        SELECT t.*, p.name as project_name, u.username as assigned_username 
        FROM tasks t 
        LEFT JOIN projects p ON t.project_id = p.id
        LEFT JOIN users u ON t.assigned_to = u.id
        ORDER BY t.due_date ASC
      `);
      return rows;
    } catch (error) {
      console.error('Error getting all tasks:', error);
      throw error;
    }
  }

  static async getById(id) {
    try {
      const [rows] = await db.execute(`
        SELECT t.*, p.name as project_name, u.username as assigned_username 
        FROM tasks t 
        LEFT JOIN projects p ON t.project_id = p.id
        LEFT JOIN users u ON t.assigned_to = u.id
        WHERE t.id = ?
      `, [id]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error('Error getting task by ID:', error);
      throw error;
    }
  }

  static async create(taskData) {
    const { title, description, project_id, assigned_to, due_date, priority, status } = taskData;
    
    try {
      const [result] = await db.execute(
        'INSERT INTO tasks (title, description, project_id, assigned_to, due_date, priority, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [title, description, project_id, assigned_to, due_date, priority, status]
      );
      
      return result.insertId;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  static async update(id, taskData) {
    const { title, description, project_id, assigned_to, due_date, priority, status } = taskData;
    
    try {
      const [result] = await db.execute(
        'UPDATE tasks SET title = ?, description = ?, project_id = ?, assigned_to = ?, due_date = ?, priority = ?, status = ? WHERE id = ?',
        [title, description, project_id, assigned_to, due_date, priority, status, id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await db.execute('DELETE FROM tasks WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }

  static async getByProjectId(projectId) {
    try {
      const [rows] = await db.execute(`
        SELECT t.*, p.name as project_name, u.username as assigned_username 
        FROM tasks t 
        LEFT JOIN projects p ON t.project_id = p.id
        LEFT JOIN users u ON t.assigned_to = u.id
        WHERE t.project_id = ?
        ORDER BY t.due_date ASC
      `, [projectId]);
      return rows;
    } catch (error) {
      console.error('Error getting tasks by project ID:', error);
      throw error;
    }
  }

  static async search(query) {
    try {
      const searchTerm = `%${query}%`;
      const [rows] = await db.execute(`
        SELECT t.*, p.name as project_name, u.username as assigned_username 
        FROM tasks t 
        LEFT JOIN projects p ON t.project_id = p.id
        LEFT JOIN users u ON t.assigned_to = u.id
        WHERE t.title LIKE ? OR t.description LIKE ?
        ORDER BY t.due_date ASC
      `, [searchTerm, searchTerm]);
      return rows;
    } catch (error) {
      console.error('Error searching tasks:', error);
      throw error;
    }
  }
}

module.exports = Task; 