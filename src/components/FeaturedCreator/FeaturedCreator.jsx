import React from "react";
import "../../styles/global.css";
// import styles from "./FeaturedCreator.module.css";
import Button from "../Button/Button";

function FeaturedCreator(props) {
    const { id, name } = props.creator;

    function handleClick() {
        props.onCreatorSelect(id, name);
    }

    return <Button variant="secondary" id={id} name={name} text={name} type="button" onClick={handleClick} />;
}

export default FeaturedCreator;