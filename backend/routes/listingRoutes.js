import express from 'express';
import {pool} from '../app.js';

const router = express.Router();

//получаем все записи текущего пользователя
router.get('/', async (req, res) => {

    const {userId} = req.query; //предполагаем, что userId передается с фронтенда

    try {
      /*
      const result = await pool.query('SELECT * FROM listings WHERE user_id = $1', [userId]);
      */
     
      const result = await pool.query('SELECT listings.*, users.username FROM listings JOIN users ON listings.user_id = users.id WHERE listings.user_id = $1', [userId]);
      res.json(result.rows);
    } catch(err) {
        console.error(err);
        res.status(500).json({error: 'Ошибка сервера'});
    }
});

//добавить новую запись
router.post('/', async (req, res) => {
    const {title, price, city, userId} = req.body;

    try {
        await pool.query(
            'INSERT INTO listings (title, price, city, user_id) VALUES ($1, $2, $3, $4)', 
            [title, price, city, userId]
        );
        res.json({message: 'Объявление добавлено'});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Ошибка сервера'});
    }
});


//удаляем объявление
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;

    try {
        const result = await pool.query(
            'DELETE FROM listings WHERE id = $1 AND user_id = $2 RETURNING *',
            [id, userId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({error: 'Объявление не найдено или нет прав доступа'});
        }

        res.json({message: 'Объявление удалено'});
    }catch (err) {
        console.error('SQL Error:', err);
        res.status(500).json({error: 'Ошибка сервера'});
    }
}); 


//измененяем объявление
router.put('/:id', async (req, res) => {
    const {id} = req.params;
    const {title, price, city, userId} = req.body;

    try{
        //проверяем наличие объявления и права доступа
        const check = await pool.query(
            'SELECT user_id FROM listings WHERE id = $1', 
            [id]
        );

        if (check.rows.length === 0) {
        return res.status(404).json({ error: 'Объявление не найдено' });
        }

        if (check.rows[0].user_id !== userId) {
        return res.status(403).json({ error: 'Нет прав доступа' });
        }

        //обновление данных в бд
        const result = await pool.query(
            `UPDATE listings
            SET title = $1, price = $2, city = $3 
            WHERE id = $4
            RETURNING *`,
            [title, price, city, id]
        );

        res.json({updated: result.rows[0]});

    } catch (err) {
        console.log('Ошибка обновления', err);
        res.status(500).json({error: 'Ошибка сервера'});
    }
});


//добавляем аналитику
router.get('/analytics/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // 1. Общее количество объявлений
    const countQuery = await pool.query(
      'SELECT COUNT(*) FROM listings WHERE user_id = $1',
      [userId]
    );

    // 2. Средняя цена
    const avgPriceQuery = await pool.query(
      'SELECT AVG(price) FROM listings WHERE user_id = $1',
      [userId]
    );

    // 3. Топ-3 города
    const topCitiesQuery = await pool.query(
      `SELECT city, COUNT(*) as count 
       FROM listings 
       WHERE user_id = $1 
       GROUP BY city 
       ORDER BY count DESC 
       LIMIT 3`,
      [userId]
    );

    res.json({
      count: Number(countQuery.rows[0].count),
      avgPrice: Math.round(Number(avgPriceQuery.rows[0].avg) || 0),
      topCities: topCitiesQuery.rows
    });

  } catch (err) {
    console.error('Analytics error:', err);
    res.status(500).json({ error: 'Ошибка получения аналитики' });
  }
});



//фильтрация
router.get('/filtered', async (req, res) => {
  try {
    const { minPrice, maxPrice, city } = req.query;
    const userId = req.query.userId; // Для фильтрации только своих объявлений

    let query = 'SELECT * FROM listings WHERE user_id = $1';
    const params = [userId];
    let paramIndex = 2;

    if (minPrice) {
      query += ` AND price >= $${paramIndex}`;
      params.push(minPrice);
      paramIndex++;
    }

    if (maxPrice) {
      query += ` AND price <= $${paramIndex}`;
      params.push(maxPrice);
      paramIndex++;
    }

    if (city) {
      query += ` AND city = $${paramIndex}`;
      params.push(city);
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Filter error:', err);
    res.status(500).json({ error: 'Ошибка фильтрации' });
  }
});

export default router;