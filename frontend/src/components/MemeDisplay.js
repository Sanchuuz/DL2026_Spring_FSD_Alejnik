import React from 'react';

const MemeDisplay = ({ meme, city }) => {
  if (!meme) return null;

  const displayText = meme.text.includes('%CITY%')
    ? meme.text.replace('%CITY%', city)
    : meme.text;

  return (
    <div className="meme-section">
      <img src={meme.imageUrl} alt="Weather Meme" className="meme-image" />
      <p className="meme-text">
        <i>{displayText}</i>
      </p>
    </div>
  );
};

export default MemeDisplay;
