import React from 'react';
import styles from '../style/Card.module.css';

const Card = ({ Name, content, imageURL, revil, contantKey, onClick }) => {
  return (
    <div className={styles.card + ' ' + styles.cursor} onClick={onClick}>
      <img src={imageURL} alt={contantKey} />
      <h3>{Name}</h3>
      <p>{revil ? content : "******"}</p>
    </div>
  );
};

export default Card;
