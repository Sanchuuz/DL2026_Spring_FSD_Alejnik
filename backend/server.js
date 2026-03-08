const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Разрешаем кросс-доменные запросы (понадобится для связи с фронтендом)
app.use(cors());
app.use(express.json());

// Эндпоинт для получения погоды
app.get('/api/weather', async (req, res) => {
  const city = req.query.city;
  const apiKey = process.env.WEATHER_API_KEY;

  // Проверка: ввел ли пользователь название города
  if (!city) {
    return res
      .status(400)
      .json({ message: 'Пожалуйста, укажите название города.' });
  }

  try {
    // Делаем запрос к OpenWeatherMap
    // units=metric нужен для получения градусов Цельсия
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=ru`,
    );

    // Извлекаем только нужные нам данные
    const data = {
      city: response.data.name,
      temp: response.data.main.temp,
      description: response.data.weather[0].description,
      condition: response.data.weather[0].main, // Понадобится позже для подбора мема
    };

    res.json(data);
  } catch (error) {
    // Обработка ошибок (например, если город не найден)
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

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
