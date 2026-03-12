import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async () => {
    if (!city) return;

    setLoading(true);
    setError('');
    setWeatherData(null);

    try {
      const response = await axios.get(`/api/weather?city=${city}`);
      setWeatherData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при получении данных');
    } finally {
      setLoading(false);
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
          onKeyPress={(e) => e.key === 'Enter' && fetchWeather()}
          placeholder="Введите город..."
        />
        <button onClick={fetchWeather} disabled={loading}>
          {loading ? 'Ищем...' : 'Узнать погоду'}
        </button>
      </div>

      {loading && <div className="loader"></div>}

      {error && <div className="error-message">{error}</div>}

      {weatherData && !loading && (
        <div className="result fade-in">
          <h2>
            {weatherData.city}: {Math.round(weatherData.temp)}°C
          </h2>
          <p className="description">{weatherData.description}</p>

          {weatherData.meme && (
            <div className="meme-section">
              <img
                src={weatherData.meme.imageUrl}
                alt="Weather Meme"
                className="meme-image"
              />
              <p className="meme-text">
                <i>
                  {weatherData.meme.text.includes('%CITY%')
                    ? weatherData.meme.text.replace('%CITY%', weatherData.city)
                    : weatherData.meme.text}
                </i>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
