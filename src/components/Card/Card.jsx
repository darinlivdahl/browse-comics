import React from 'react';
import '../../styles/global.css';
import styles from './Card.module.css';

function Card(props) {

    const { id, title, thumb } = props;
    
    function handleClick() {
        props.onCardClick(id, title);
    }

    return (
        <div className={styles.card} id={"card-" + id} onClick={handleClick} title={title}>
            <img className={styles.cardImg} src={thumb} width="200" />
            <div className={styles.cardTitle}>{title}</div>
        </div>
    )
}

export default Card;