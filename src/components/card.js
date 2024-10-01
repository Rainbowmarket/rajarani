import React from 'react';

const Card = ({ Name, content, imageURL, revil, contantKey, onClick}) => {
  return (
    <div className="card" onClick={onClick}>
      <img src={imageURL} alt={contantKey} />
      <h3>{Name}</h3>
      <p>{revil ? content : "******"}</p>
    </div>
  );
};

export default Card;
