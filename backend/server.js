const express = require('express');
const axios = require('axios');
const cors = require('cors');
const mongoose = require('mongoose');
const Meme = require('./models/Meme');
require('dotenv').config();

// Подключаемся к локальной базе
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('🚀 База данных подключена локально!'))
  .catch((err) => console.error('❌ Ошибка подключения к базе:', err));

const app = express();
const PORT = process.env.PORT || 5000;

// Разрешаем кросс-доменные запросы (понадобится для связи с фронтендом)
app.use(cors());
app.use(express.json());

// Эндпоинт для получения погоды
app.get('/api/weather', async (req, res) => {
  const city = req.query.city;
  const apiKey = process.env.WEATHER_API_KEY;

  if (!city) {
    return res
      .status(400)
      .json({ message: 'Пожалуйста, укажите название города.' });
  }

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=ru`,
    );

    const data = {
      city: response.data.name,
      temp: response.data.main.temp,
      description: response.data.weather[0].description,
      condition: response.data.weather[0].main,
    };

    // Находим ВСЕ мемы для этой погоды
    let matchedMemes = await Meme.find({ condition: data.condition });

    // Если мемов для такой погоды нет, берем дефолтные
    if (matchedMemes.length === 0) {
      matchedMemes = await Meme.find({ condition: 'Default' });
    }

    // Возвращаем данные о погоде и массив мемов (ограничим до 4-х для интерфейса)
    res.json({
      ...data,
      memes: matchedMemes.slice(0, 4),
    });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      res
        .status(404)
        .json({
          message: 'Город не найден. Проверьте правильность написания.',
        });
    } else {
      res
        .status(500)
        .json({ message: 'Ошибка сервера при получении данных о погоде.' });
    }
  }
});

app.get('/api/forecast', async (req, res) => {
  const { city } = req.query;
  const apiKey = process.env.WEATHER_API_KEY;

  if (!city) return res.status(400).json({ message: 'Город не указан' });

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=ru`,
    );

    // Фильтруем данные: берем только прогнозы на 12:00 дня
    // Это позволит нам получить четкие предсказания на следующие дни
    const dailyData = response.data.list.filter((reading) =>
      reading.dt_txt.includes('12:00:00'),
    );

    // Для каждого дня прогноза ищем подходящий мем в нашей базе
    const forecastWithMemes = await Promise.all(
      dailyData.slice(0, 3).map(async (day) => {
        const condition = day.weather[0].main;

        // Ищем случайный мем для этой погоды
        const matchedMemes = await Meme.find({ condition });
        const selectedMeme =
          matchedMemes.length > 0
            ? matchedMemes[Math.floor(Math.random() * matchedMemes.length)]
            : await Meme.findOne({ condition: 'Default' });

        return {
          date: day.dt_txt,
          temp: day.main.temp,
          condition: condition,
          description: day.weather[0].description,
          meme: selectedMeme,
        };
      }),
    );

    res.json({
      city: response.data.city.name,
      forecast: forecastWithMemes,
    });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении прогноза' });
  }
});

app.patch('/api/memes/:id/like', async (req, res) => {
  try {
    const meme = await Meme.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true },
    );
    res.json(meme);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при сохранении лайка' });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
