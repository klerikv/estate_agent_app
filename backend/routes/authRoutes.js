import express from 'express';
import {pool} from '../app.js';
//import bcrypt from 'bcrypt';

const router = express.Router();

//роут для входа
router.post('/login', async (req, res) => {
    //получаем данные из тела запроса
    const {login, password} = req.body;

    try {
        //ищем пользователя в БД по логину
        const result = await pool.query(
            'SELECT * FROM users WHERE login = $1',
            [login]
        );

        const user = result.rows[0];
        
        //проверка наличия пользователя в БД
        if (!user) {
            return res.status(401).json({error: 'Неверный логин или пароль'});
        }

        //проверка пароля C ХЕШИРОВАНИЯ
        //const isPasswordValid = await bcrypt.compare(password, user.user_password);

         //проверка пароля БЕЗ ХЕШИРОВАНИЯ
        const isPasswordValid = password === user.user_password;
        if (!isPasswordValid) {
            return res.status(401).json({error: 'Неверный логин или пароль'});
        }

        //возвращаем данные пользователя (без пароля)
        res.json({
            message: 'Успешный вход',
            user: {
                id: user.id,
                name: user.username
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Ошибка сервера'});
    };
});

export default router;