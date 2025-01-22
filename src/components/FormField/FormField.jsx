import React, { useState, useEffect, useRef } from "react";
import "../../styles/global.css";
import styles from "./FormField.module.css";

function FormField(props) {
    const { id, name, type, label, placeholder, setFocus } = props;
    const [fieldValue, setFieldValue] = useState("");
    const inputRef = useRef(null);

    useEffect(() => {
        if (setFocus) {
            inputRef.current.focus();
        }
    }, [setFocus]);

    function handleChange(event) {
        const { name, value } = event.target;
        setFieldValue(value);
        props.onChange(name, value);
    }

    return (
        <div className={styles.formFieldContainer}>
            <label className={styles.formFieldLabel} htmlFor={id}>{label}</label>
            <input
                className={styles.formFieldInput}
                id={id}
                name={name}
                type={type}
                value={fieldValue}
                onChange={handleChange}
                placeholder={placeholder}
                ref={inputRef} // Add ref to the input element
            />
        </div>
    );
}

export default FormField;