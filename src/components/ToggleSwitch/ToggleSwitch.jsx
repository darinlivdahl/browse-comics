import React from "react";
import styles from "./ToggleSwitch.module.css";

function ToggleSwitch(props) {

    return (
        <div className={styles.toggleSwitchContainer}>
            <label className={styles.switchControl}>
                <input id={props.id} type="checkbox" checked={props.isChecked} onChange={props.onChange} />
                <span className={styles.slider}></span>
            </label>
            {/* TODO: Figure out how to click and relate this span element to switch */}
            <span className={styles.switchControlLabel} htmlFor={props.id}>{props.label}</span>
        </div>
    );
}

export default ToggleSwitch;