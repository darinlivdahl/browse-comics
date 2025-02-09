import React from "react";
import styles from "./Heading.module.css";
import "../../styles/global.css";

function Heading(props) {
    return (
        <div style={props.style} className={(props.density === "compact") ? styles.headingContainerCompact : styles.headingContainer}>
            {props.level == 1 && <h1 className={styles.h1}><i className="fa-solid fa-comment"></i> &nbsp;{props.text}</h1>}
            {props.level == 2 && <h2 className={styles.h2}>{props.text}</h2>}
            {props.level == 3 && <h3 className={styles.h3}>{props.text}</h3>}
            {props.subtext && <p className={styles.headingSubText}>{props.subtext}</p>}
        </div>
    )
}

export default Heading;