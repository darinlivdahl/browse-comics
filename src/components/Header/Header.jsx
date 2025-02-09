import React from "react";
import Heading from "../Heading/Heading";
import Button from "../Button/Button";
import "../../styles/global.css";
import styles from "./Header.module.css";
// import bgImg from "./half-tone-pattern.jpg";

function Header(props) {

    const { searchNav, headingText, headingSubText } = props;
        
    function handleNewSearchClick() {
        props.onNewSearch();
    }

    function handleStoredClick(name) {
        // const { name } = event.target;
        const context = name.replace("stored", "").toLowerCase();
        props.onStoredDisplay(context);
    }

    return (
      <header className={styles.headerContainer}>
        <Heading
          density="compact"
          level="1"
          text={headingText}
          subtext={headingSubText}
        />
        <nav className={styles.navContainer}>
          {/* TODO: Display storage item count */}
          {searchNav && (
            <Button
              variant="primary"
              name="newSearch"
              onClick={handleNewSearchClick}
              text="New Search"
            />
          )}
          <Button
            variant="secondary"
            name="storedCreators"
            onClick={handleStoredClick}
            text="Stored Creators"
          />
          <Button
            variant="secondary"
            name="storedComics"
            onClick={handleStoredClick}
            text="Stored Comics"
          />
        </nav>
      </header>
    );
}

export default Header;