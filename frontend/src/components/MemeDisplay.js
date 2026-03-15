import React from 'react';

const MemeDisplay = ({ meme, city, onRefresh }) => {
  if (!meme) return null;

  const displayText = meme.text.includes('%CITY%')
    ? meme.text.replace('%CITY%', city)
    : meme.text;

  const handleLike = async () => {
    try {
      await fetch(`http://localhost:5000/api/memes/${meme._id}/like`, {
        method: 'PATCH',
      });
      alert('Спасибо за лайк!');
    } catch (err) {
      console.error('Ошибка при лайке:', err);
    }
  };

  const handleShare = () => {
    const shareText = `${displayText}. Посмотри мой мем дня!`;
    if (navigator.share) {
      navigator.share({
        title: 'Weather Mood',
        text: shareText,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Текст скопирован в буфер обмена!');
    }
  };

  return (
    <div className="meme-section fadeIn">
      <img src={meme.imageUrl} alt="Weather Meme" className="meme-image" />
      <p className="meme-text">
        <i>{displayText}</i>
      </p>

      <div className="meme-actions">
        <button className="meme-btn" onClick={handleLike} title="Лайк">
          ❤️
        </button>
        <button className="meme-btn" onClick={onRefresh} title="Другой мем">
          🔄
        </button>
        <button className="meme-btn" onClick={handleShare} title="Поделиться">
          🔗
        </button>
      </div>
    </div>
  );
};

export default MemeDisplay;
