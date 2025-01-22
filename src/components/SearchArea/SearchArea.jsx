import React, { useState } from "react";
import "../../styles/global.css";
import styles from "./SearchArea.module.css";
import Heading from "../Heading/Heading";
import FormField from "../FormField/FormField";
import FeaturedCreator from "../FeaturedCreator/FeaturedCreator";
import Button from '../Button/Button';
import bgImg from "./old-comic-stack-binding.jpg"

function SearchArea(props) {

    const [searchName, setSearchName] = useState({
        firstName: "",
        lastName: ""
    });

    const featuredCreators = [
        {
            id: 32,
            name: "Steve Ditko"
        },
        {
            id: 75,
            name: "Todd McFarlane"
        },
        {
            id: 1827,
            name: "John Byrne"
        },
        {
            id: 5044,
            name: "Marc Silvestri"
        },
        {
            id: 314,
            name: "Neal Adams"
        }
    ];

    const customStyle = {
        textAlign: "center",
        marginBottom: "1rem"
    }

    function handleChange(name, value) {
        // const {name, value} = event.target;
        setSearchName(prevValue => {
            return ({
                ...prevValue,
                [name]: value
            });
        });
    }

    function handleSearch(event) {
        event.preventDefault();
        // console.log('run handle search');
        props.onSearch(searchName);
        setSearchName({
            firstName: "",
            lastName: ""
        });
    }

    function handleFeaturedCreatorSelect(id, name) {
        props.onFeaturedCreatorSelect(id, name);
    }

    return (
        <div className={styles.searchAreaContainer} style={{ '--bg-img': `url(${bgImg})` }}>
            <section className={styles.searchAreaInner}>
                <Heading style={customStyle} density="compact" level="2" text="Search Comics by Creator" subtext="Search by first name and/or last name." />
                <form className={styles.searchAreaForm} method="post" onSubmit={handleSearch}>
                    <fieldset className={styles.searchAreafieldSet}>
                        <FormField id="first-name" name="firstName" label="First Name" type="text" onChange={handleChange} placeholder="Sam" setFocus="true" />
                        <FormField id="last-name" name="lastName" label="Last Name" type="text" onChange={handleChange} placeholder="Rosen" />
                        <Button variant="primary" name="searchCreator" text="Search" type="submit" />
                    </fieldset>
                </form>

                <Heading level="3" text="Featured Creators" />
                <div className={styles.featuredCreatorsList}>
                {featuredCreators.map((fc, index) => <FeaturedCreator key={"fc-" + index} creator={fc} onCreatorSelect={handleFeaturedCreatorSelect} />)}
                </div>
            </section>
        </div>
    )
}

export default SearchArea;