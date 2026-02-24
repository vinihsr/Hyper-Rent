const pool = require('../config/db'); 

const TermsModel = {
  findPendingForUser: async (id_user) => {
    const query = `
      SELECT t.id, t.content, t.version 
      FROM terms t
      LEFT JOIN user_acceptances ua ON t.id = ua.term_id AND ua.user_id = $1
      WHERE t.is_active = TRUE AND ua.id IS NULL
      LIMIT 1;
    `;
    const { rows } = await pool.query(query, [id_user]);
    return rows[0];
  },

  accept: async (id_user, term_id, opt_in_study) => {
    const query = `
      INSERT INTO user_acceptances (user_id, term_id, opt_in_study)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [id_user, term_id, opt_in_study]);
    return rows[0];
  }
};

module.exports = TermsModel;