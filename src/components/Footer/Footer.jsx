import React from "react";
import parse from "html-react-parser";
import styles from "./Footer.module.css";

function Footer(props) {

    const { credit } = props;

    return (
        <div className={styles.footerContainer}>
            <span className={styles.footerText}>Designed and Developed by <a href="https://darinlivdahl.co" target="_blank">Darin Livdahl</a> with <span className={styles.iconHeart}>♥</span>. This website is not affiliated with or endorsed by Marvel Entertainment.</span>
            <span className={styles.footerText}>{parse(credit)}</span>
        </div>
    );
}

export default Footer;