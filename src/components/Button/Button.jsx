import React from 'react';
import '../../styles/global.css';
import styles from './Button.module.css';

function Button(props) {
    const { text, name, type = "button", variant = "primary" } = props;
    // TODO: Create a more robust variant system
    const className = variant === 'primary' ? styles.btnPrimary : styles.btnSecondary;

    function handleClick(event) {
        const { name } = event.target;
        if (type !== "submit") { 
            props.onClick(name);
        }
    }

    return (
        <button name={name} type={type} className={className} onClick={handleClick}>
            {text}
        </button>
    );
}

export default Button;