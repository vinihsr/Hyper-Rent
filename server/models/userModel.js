const { Pool } = require('pg')

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgres://vini:vini@Oncar_test_db:5432/Oncar_test'
})

const UserModel = {
    findByEmail: async (email) => {
        const query = 'SELECT email, password FROM Users WHERE email = $1'
        const { rows } =  await pool.query(query, [email])
        return rows[0]
    },

   create: async (userData) => {
    const { name, last_name, cpf, email, password } = userData;
    const query = `
      INSERT INTO Users (name, last_name, cpf, email, password)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id_user, name, email;
    `;
    const values = [name, last_name, cpf, email, password];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }
};

module.exports = UserModel;