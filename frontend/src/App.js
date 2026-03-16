import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';
import WeatherCard from './components/WeatherCard';
import MemeDisplay from './components/MemeDisplay';
import Forecast from './components/Forecast';

function App() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [forecastData, setForecastData] = useState(null);

  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const fetchWeather = async () => {
    if (!city) return;

    setLoading(true);
    setError('');

    try {
      const weatherRes = await axios.get(`/api/weather?city=${city}`);
      setWeatherData(weatherRes.data);

      const forecastRes = await axios.get(`/api/forecast?city=${city}`);
      setForecastData(forecastRes.data.forecast);
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при получении данных');
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshMeme = () => {
    fetchWeather();
  };

  return (
    <div className="App">
      <h1>Погода с настроением 🌤️</h1>

      <div className="input-group">
        <input
          type="text"
          ref={inputRef}
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
          <WeatherCard data={weatherData} />
          <MemeDisplay
            meme={weatherData.meme}
            city={weatherData.city}
            onRefresh={handleRefreshMeme}
          />
        </div>
      )}

      {forecastData && weatherData && (
        <Forecast data={forecastData} city={weatherData.city} />
      )}
    </div>
  );
}

export default App;
