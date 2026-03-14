import React from 'react';

const WeatherCard = ({ data }) => {
  return (
    <div className="weather-info">
      <h2>
        {data.city}: {Math.round(data.temp)}°C
      </h2>
      <p className="description">{data.description}</p>
    </div>
  );
};

export default WeatherCard;
