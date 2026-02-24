const { pool } = require('../config/db');

const UserModel = {
    findByEmail: async (email) => {
        const query = {
          name: 'find-by-email',
          text: 'SELECT id_user, email, password FROM Users WHERE email = $1',
          values: [email]
        }
        const { rows } =  await pool.query(query)
        return rows[0]
    },

    createWithCTE: async (userData) => {
            const { 
                state, city, street, number, neighborhood, 
                name, last_name, email, password, cpf, phone 
            } = userData;

            const query = `
                WITH 
                s AS (
                    INSERT INTO states (state_name) 
                    VALUES (UPPER($1))
                    ON CONFLICT (state_name) DO UPDATE SET state_name = EXCLUDED.state_name
                    RETURNING id_state
                ),
                ci AS (
                    INSERT INTO cities (city_name, id_state) 
                    VALUES (UPPER($2), (SELECT id_state FROM s))
                    ON CONFLICT (city_name) DO UPDATE SET city_name = EXCLUDED.city_name
                    RETURNING id_city
                ),
                addr AS (
                    INSERT INTO addresses (street, number, district, id_city) 
                    VALUES ($3, $4, $5, (SELECT id_city FROM ci))
                    RETURNING id_address
                )
                INSERT INTO Users (name, last_name, cpf, email, password, id_address, phone) 
                VALUES ($6, $7, $8, LOWER($9), $10, (SELECT id_address FROM addr), $11) 
                RETURNING id_user, name, email;
            `;

            const values = [
                state, city, street, number, neighborhood,
                name, last_name, cpf, email, password, phone
            ];

            const { rows } = await pool.query(query, values);
            return rows[0];
        },

    findById: async (id) => {
        const query = {
          name: 'find-user-by-id',
          text: 'SELECT id_user, name, last_name, email, cpf FROM Users WHERE id_user = $1',
          values: [id]
        };
        const { rows } = await pool.query(query);
        return rows[0];
      }
};

module.exports = UserModel;