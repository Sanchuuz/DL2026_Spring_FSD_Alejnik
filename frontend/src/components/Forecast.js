import React from 'react';

const Forecast = ({ data, city }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="forecast-section fade-in">
      <h3>Прогноз настроения на 3 дня</h3>
      <div className="forecast-container">
        {data.map((day, index) => {
          const date = new Date(day.date).toLocaleDateString('ru-RU', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
          });

          const displayText = day.meme.text.replace('%CITY%', city);

          return (
            <div key={index} className="forecast-card">
              <span className="forecast-date">{date}</span>
              <img src={day.meme.imageUrl} alt="Forecast Meme" />
              <div className="forecast-info">
                <strong>{Math.round(day.temp)}°C</strong>
                <p>{day.description}</p>
              </div>
              <p className="forecast-meme-text">
                <i>{displayText}</i>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Forecast;
