import React from "react";
import parse from "html-react-parser";
import styles from "./Footer.module.css";

function Footer() {

    function getAttribution() {
        return window.localStorage.getItem('attribution') || "";
    }

    return (
        <div className={styles.footerContainer}>
            <span className={styles.footerText}>Designed and developed by <a href="https://darinlivdahl.co" target="_blank">Darin Livdahl</a> with <span className={styles.iconHeart}>♥</span>. This website is not affiliated with or endorsed by Marvel Entertainment.</span>
            <span className={styles.footerText}>{parse(getAttribution())}</span>
        </div>
    );
}

export default Footer;