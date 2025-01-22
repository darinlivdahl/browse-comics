import React, { useState, useEffect } from "react";
import "../../styles/global.css";
import styles from "./ComicPreview.module.css";
import Button from "../Button/Button";
import Heading from "../Heading/Heading";
import bgImg from "./green-lightning.jpg";
import ToggleSwitch from "../ToggleSwitch/ToggleSwitch";

function ComicPreview(props) {
    // console.log(props.comic);
    const { characters, creators, dates, description, id, images, pageCount, title, urls } = props.comic;
    const [isStored, setIsStored] = useState(false);
    const storageName = "comics";

    useEffect(() => {
        const storage = localStorage.getItem(storageName) || null;
        if (storage !== null) {
            const itemArr = JSON.parse(storage);
            const findIndexCallback = (item) => item.id === id;
            const itemIndex = itemArr.findIndex(findIndexCallback);
            setIsStored((itemIndex !== -1) ? true : false);
        }
        document.getElementById("comic-preview").scrollIntoView({
            behavior: "smooth"
        });
    }, [id]);

    function handleStoreComicChange(event) {
        const { checked } = event.target;
        // const comicImageSource = images[0];
        setIsStored(checked);
        const comicObj = {
            id: id,
            title: title,
            thumbnail: {
                path: images[0].path || "",
                extension: images[0].extension || ""
            }
        };
        props.onComicStorage(storageName, comicObj, checked);
    }

    function formatDate(date) {
        const newDate = new Date(date).toDateString();
        return newDate;
    }

    function handleBackClick() {
        props.onHandleBack("comic", id);
    }

    function handleCreatorClick(event) {
        event.preventDefault();
        const {id, name} = event.target;
        // console.log("run handleCreatorClick and id => " + id + " and name => " + name);
        // let updatedId = id.replace("creator-", "");
        props.onRelatedCreator(id, name);
    }

    function handleMoreClick() {
        if (urls.length > 0 && urls[0].type === "detail") {
            window.open(urls[0].url, "_blank");
        } else {
            window.open("https://marvel.com", "_blank");
        }
    }

    function getId(resourceURI) {
        const urlArr = resourceURI.split("//")[1];
        const pathArr = urlArr.split("/");
        const pathLength = (pathArr.length -1);
        return pathArr[pathLength];
    }

    return (
        <div id="comic-preview" className={styles.comicPreviewContainer} style={{ '--bg-img': `url(${bgImg})` }}>
            <div className={styles.comicView}>
                <div className={styles.comicImg}>
                    {(images.length > 0) && <img src={images[0].path + '.' + images[0].extension} onClick={handleMoreClick} title={title} />}
                </div>
                <div className={styles.comicInfo}>
                    <Heading density="compact" level="2" text={title} />
                    {(description !== "" && description !== null) && <section><Heading level="3" text="Description" subtext={description} /></section>}
                    {(characters.items.length > 0) && (
                        <section>
                            <Heading level="3" text="Characters" />
                            <ul className={styles.defaultList}>
                                {characters.items.map((character, index) => <li key={"character-" + index}>{character.name}</li>)}
                            </ul>
                        </section>
                    )}
                    {(creators.items.length > 0) && (
                        <section>
                            <Heading level="3" text="Creators" />
                            <ul className={styles.defaultList}>
                                {creators.items.map((creator, index) => <li key={"creator-" + index}>
                                    <a href="#" name={creator.name} id={getId(creator.resourceURI)} onClick={handleCreatorClick}>
                                        {creator.name} / {creator.role}
                                    </a>
                                </li>)}
                            </ul>
                        </section>
                    )}
                    {dates.map((d, index) => (
                        (d.type === "onsaleDate" && formatDate(d.date) !== "Invalid Date") && <section key={"on-sale-date-" + index}><Heading level="3" text="On Sale Date" /><ul className={styles.defaultList}><li>{formatDate(d.date)}</li></ul></section>
                    ))}
                    {(pageCount !== 0) && <section><Heading level="3" text="Page Count" /><ul className={styles.defaultList}><li>{pageCount}</li></ul></section>}
                    <div className={styles.comicViewControls}>
                        {/* TODO: https://www.w3schools.com/howto/howto_css_switch.asp */}
                        <div className={styles.comicStorageControl}>
                            <ToggleSwitch id="comicStoragetoggle" label="Store Comic" onChange={handleStoreComicChange} isChecked={isStored} />
                        </div>
                        <Button text="More Details" variant="secondary" onClick={handleMoreClick} />
                        <Button text="Back to Results" variant="primary" onClick={handleBackClick} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ComicPreview;