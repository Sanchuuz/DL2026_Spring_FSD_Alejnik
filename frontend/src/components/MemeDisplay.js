import React from 'react';

const MemeDisplay = ({ meme, allMemes, city, onRefresh, onSelect }) => {
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
    <div className="meme-section fade-in">
      <div className="main-meme-container">
        <img src={meme.imageUrl} alt="Weather Meme" className="meme-image" />
        <p className="meme-text">
          <i>{displayText}</i>
        </p>
      </div>

      <div className="meme-actions">
        <button className="meme-btn" onClick={handleLike} title="Лайк">
          ❤️
        </button>
        <button
          className="meme-btn"
          onClick={onRefresh}
          title="Загрузить другие варианты"
        >
          🔄
        </button>
        <button className="meme-btn" onClick={handleShare} title="Поделиться">
          🔗
        </button>
      </div>

      {allMemes && allMemes.length > 1 && (
        <div className="meme-selector">
          <p className="selector-title">Выбери своё настроение:</p>
          <div className="meme-thumbnails">
            {allMemes.map((m) => (
              <div
                key={m._id}
                className={`thumbnail-wrapper ${m._id === meme._id ? 'active' : ''}`}
                onClick={() => onSelect(m)}
              >
                <img src={m.imageUrl} alt="Option" className="meme-thumbnail" />
                {m._id === meme._id && <div className="active-badge">✓</div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MemeDisplay;
