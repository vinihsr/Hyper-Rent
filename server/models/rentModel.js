const { pool } = require('../config/db');

const RentModel = {
create: async (id_user, id_car) => {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const rentQuery = `
                INSERT INTO rent (id_user, id_car, datetime, rent_status)
                VALUES ($1, $2, NOW(), 'active')
                RETURNING *`;
            const rentResult = await client.query(rentQuery, [id_user, id_car]);

            await client.query(
                "UPDATE cars SET rent_status = 'rented' WHERE id_car = $1",
                [id_car]
            );

            await client.query('COMMIT');
            return rentResult.rows[0];
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    },

    findAllHistory: async () => {
        const query = `
            SELECT r.id_rent, r.datetime as rent_date, r.rent_status,
                   u.name as user_name, u.cpf,
                   m.model_name, c.plate, c.price
            FROM rent r
            JOIN users u ON r.id_user = u.id_user
            JOIN cars c ON r.id_car = c.id_car
            JOIN models m ON c.id_model = m.id_model
            ORDER BY r.datetime DESC`;
        return (await pool.query(query)).rows;
    },

    findUserHistory: async (id_user) => {
        const query = `
            SELECT r.id_rent, r.datetime as rent_date, r.rent_status,
                   m.model_name, c.plate, c.price
            FROM rent r
            JOIN cars c ON r.id_car = c.id_car
            JOIN models m ON c.id_model = m.id_model
            WHERE r.id_user = $1
            ORDER BY r.datetime DESC`;
        return (await pool.query(query, [id_user])).rows;
    },

    findActiveByUser: async (id_user) => {
        const query = `
            SELECT r.id_rent, r.datetime as rent_date, r.id_car,
                   m.model_name, c.plate, c.price
            FROM rent r
            JOIN cars c ON r.id_car = c.id_car
            JOIN models m ON c.id_model = m.id_model
            WHERE r.id_user = $1 AND r.rent_status = 'active'`;
        return (await pool.query(query, [id_user])).rows;
    },
    finishRent: async (id_rent, id_car) => {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            await client.query(
                "UPDATE rent SET rent_status = 'finished' WHERE id_rent = $1",
                [id_rent]
            );

            await client.query(
                "UPDATE cars SET rent_status = 'available' WHERE id_car = $1",
                [id_car]
            );

            await client.query('COMMIT');
            return { success: true };
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    }
};

module.exports = RentModel;