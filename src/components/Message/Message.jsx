import React from "react";
import "../../styles/global.css";
import styles from "./Message.module.css";

function Message(props) {

    function handleClose(event) {
        event.preventDefault();
        props.onErrorMessageClose();
    }

    return (
        <div className={styles.messageError}>
            <span className={styles.messageErrorText}>{props.error}</span>
            <a className={styles.messageErrorClose} href="#" onClick={handleClose} title="Close Message">Close</a>
        </div>
    )
}

export default Message;