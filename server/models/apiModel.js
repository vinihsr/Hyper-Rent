const pool = require('../config/db');

const ApiKeyModel = {
  create: async (userId) => {
    const query = `
      INSERT INTO api_keys (id_user) 
      VALUES ($1) 
      RETURNING key_value, created_at;
    `;
    const { rows } = await pool.query(query, [userId]);
    return rows[0];
  },

  findByKey: async (keyValue) => {
    const query = `
      SELECT id_user, is_active 
      FROM api_keys 
      WHERE key_value = $1;
    `;
    const { rows } = await pool.query(query, [keyValue]);
    return rows[0];
  },

  findByUserId: async (userId) => {
    const query = `
      SELECT key_value, created_at, is_active 
      FROM api_keys 
      WHERE id_user = $1 
      ORDER BY created_at DESC;
    `;
    const { rows } = await pool.query(query, [userId]);
    return rows;
  },

  deactivate: async (keyValue) => {
    const query = `
      UPDATE api_keys 
      SET is_active = FALSE 
      WHERE key_value = $1;
    `;
    await pool.query(query, [keyValue]);
    return { message: "Key deactivated" };
  }
};

module.exports = ApiKeyModel;