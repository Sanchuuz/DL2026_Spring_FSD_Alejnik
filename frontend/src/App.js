import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);

  const getWeather = async () => {
    try {
      const response = await axios.get(`/api/weather?city=${city}`);
      setWeatherData(response.data);
    } catch (error) {
      alert('Ошибка при получении данных');
    }
  };

  return (
    <div className="App">
      <h1>Погода с настроением 🌤️</h1>
      <div className="input-group">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Введите город..."
        />
        <button onClick={getWeather}>Узнать погоду</button>
      </div>

      {weatherData && (
        <div className="result">
          <h2>
            {weatherData.city}: {Math.round(weatherData.temp)}°C
          </h2>
          <p>{weatherData.description}</p>
          {weatherData.meme && (
            <div className="meme-section">
              <img
                src={weatherData.meme.imageUrl}
                alt="Weather Meme"
                style={{ maxWidth: '300px' }}
              />
              <p>
                <i>{weatherData.meme.text}</i>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
