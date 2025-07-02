import express from 'express';
import cors from 'cors';
import {Pool} from 'pg';

import authRoutes from './routes/authRoutes.js';
import listingRoutes from './routes/listingRoutes.js';
import dotenv from 'dotenv-flow';
dotenv.config();

//инициализация express
const app = express();

//middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true})); //разрешить запросы от React
app.use(express.json()); //для парсинга JSON

//подключение роутов и адресов
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);

//настройка подключения к БД
export const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});


//проверка подключения к БД
pool.connect((err) => {
    if (err) console.log('Ошибка подключения к БД:',process.env.DB_USER, err);
    else console.log('Успешное подключение к БД');
});

//Запуск сервера
const PORT = process.env.DB_PORT || 5000;
app.listen(PORT, () => {
    console.log('Сервер запущен на порту', PORT)
});
