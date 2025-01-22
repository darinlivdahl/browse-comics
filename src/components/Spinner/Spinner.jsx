import React from "react";
import "../../styles/global.css";
import styles from "./Spinner.module.css";

function Spinner() {
    return (
        <div className={styles.spinnerContainer}>
            <div className={styles.spinnerInner}></div>
        </div>
    );
}

export default Spinner