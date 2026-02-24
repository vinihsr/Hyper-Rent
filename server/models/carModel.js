const { pool } = require('../config/db');

const CarModel = {
  createWithCTE: async (carData) => {
    const { brand, model, type, color, plate, price, year } = carData;

    const query = `
      WITH 
      b AS (
          INSERT INTO brands (brand_name) 
          VALUES (UPPER($1))
          ON CONFLICT (brand_name) DO UPDATE SET brand_name = EXCLUDED.brand_name
          RETURNING id_brand
      ),
      m AS (
          INSERT INTO models (model_name, id_brand) 
          VALUES (UPPER($2), (SELECT id_brand FROM b))
          ON CONFLICT (model_name) DO UPDATE SET model_name = EXCLUDED.model_name
          RETURNING id_model
      ),
      t AS (
          INSERT INTO types (type_name) VALUES (UPPER($3))
          ON CONFLICT (type_name) DO UPDATE SET type_name = EXCLUDED.type_name
          RETURNING id_type
      ),
      co AS (
          INSERT INTO colors (color_name) VALUES (UPPER($4))
          ON CONFLICT (color_name) DO UPDATE SET color_name = EXCLUDED.color_name
          RETURNING id_color
      )
      INSERT INTO cars (plate, price, year, id_model, id_type, id_color, rent_status)
      VALUES (UPPER($5), $6, $7, (SELECT id_model FROM m), (SELECT id_type FROM t), (SELECT id_color FROM co), 'available')
      RETURNING *;
    `;

    const values = [brand, model, type, color, plate, price, year];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

findAll: async () => {
    const query = `
      SELECT 
        c.id_car, 
        c.plate, 
        c.year, 
        c.price, 
        c.rent_status,
        m.model_name, 
        b.brand_name, 
        t.type_name, 
        co.color_name
      FROM cars c
      LEFT JOIN models m ON c.id_model = m.id_model
      LEFT JOIN brands b ON m.id_brand = b.id_brand
      LEFT JOIN types t ON c.id_type = t.id_type
      LEFT JOIN colors co ON c.id_color = co.id_color
      ORDER BY c.id_car DESC;
    `;
    const { rows } = await pool.query(query);
    return rows;
  },


  updateStatus: async (id_car, status) => {
    const query = {
      name: 'update-car-status',
      text: 'UPDATE Cars SET rent_status = $1 WHERE id_car = $2',
      values: [status, id_car]
    };
    await pool.query(query);
  },

  delete: async (id_car) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      await client.query('DELETE FROM rent WHERE id_car = $1', [id_car]);

      const query = 'DELETE FROM cars WHERE id_car = $1 RETURNING *';
      const { rows } = await client.query(query, [id_car]);

      await client.query('COMMIT');
      return rows[0];
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  update: async (id, data) => {
    const { brand, model, year, plate, color, type, price } = data;

    const query = `
      WITH 
      -- 1. Upsert Brand
      brand_cte AS (
        INSERT INTO brands (brand_name)
        VALUES ($1)
        ON CONFLICT (brand_name) DO UPDATE SET brand_name = EXCLUDED.brand_name
        RETURNING id_brand
      ),
      -- 2. Upsert Model linked to Brand
      model_cte AS (
        INSERT INTO models (model_name, id_brand)
        SELECT $2, id_brand FROM brand_cte
        ON CONFLICT (model_name) DO UPDATE SET model_name = EXCLUDED.model_name
        RETURNING id_model
      ),
      -- 3. Upsert Color
      color_cte AS (
        INSERT INTO colors (color_name)
        VALUES ($5)
        ON CONFLICT (color_name) DO UPDATE SET color_name = EXCLUDED.color_name
        RETURNING id_color
      ),
      -- 4. Upsert Type
      type_cte AS (
        INSERT INTO types (type_name)
        VALUES ($6)
        ON CONFLICT (type_name) DO UPDATE SET type_name = EXCLUDED.type_name
        RETURNING id_type
      )
      -- 5. Update main Car table using the IDs from the CTEs
      UPDATE cars
      SET 
        id_model = (SELECT id_model FROM model_cte),
        id_color = (SELECT id_color FROM color_cte),
        id_type = (SELECT id_type FROM type_cte),
        year = $3,
        plate = $4,
        price = $7
      WHERE id_car = $8
      RETURNING *;
    `;

    const values = [
      brand,                        
      model,                        
      parseInt(year),               
      plate.toUpperCase().trim(),   
      color,                        
      type,                         
      parseFloat(price),           
      id                            
    ];

    try {
      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      console.error("Database Update Error:", error);
      throw error;
    }
  }
};

module.exports = CarModel;