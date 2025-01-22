import React, { useState, useEffect } from "react";
import "../../styles/global.css";
import styles from "../ComicPreview/ComicPreview.module.css";
import Button from "../Button/Button";
import Heading from "../Heading/Heading";
import bgImg from "../ComicPreview/green-lightning.jpg";
import ToggleSwitch from "../ToggleSwitch/ToggleSwitch";

function CreatorPreview(props) {
    // console.log(props.creator);
    // TODO: Figure out way to show more series and events
    const { events, fullName, id, series, thumbnail, urls } = props.creator;
    const [isStored, setIsStored] = useState(false);
    const storageName = "creators";

    useEffect(() => {
        const storage = localStorage.getItem(storageName) || null;
        if (storage !== null) {
            const itemArr = JSON.parse(storage);
            const findIndexCallback = (item) => item.id === id;
            const itemIndex = itemArr.findIndex(findIndexCallback);
            setIsStored((itemIndex !== -1) ? true : false);
        }
    }, [id]);

    function handleStoreCreatorChange(event) {
        const { checked } = event.target;
        setIsStored(checked);
        const creatorObj = {
            id: id,
            fullName: fullName,
            thumbnail: {
                path: thumbnail.path,
                extension: thumbnail.extension
            }
        };
        props.onCreatorStorage(storageName, creatorObj, checked);
    }

    // function handleBackClick() {
    //     // console.log("run handleBackClick, id is: " + id);
    //     props.onHandleBack("creator", id);
    // }

    function handleMoreClick() {
        if (urls.length > 0 && urls[0].type === "detail") {
            window.open(urls[0].url, "_blank");
        } else {
            window.open("https://marvel.com", "_blank");
        }
    }

    // function getId(resourceURI) {
    //     const urlArr = resourceURI.split("//")[1];
    //     const pathArr = urlArr.split("/");
    //     const pathLength = (pathArr.length -1);
    //     return pathArr[pathLength];
    // }

    function handleCreatorComicsBrowse() {
        // console.log("run handleCreatorComicsBrowse, id is: " + id);
        props.onCreatorComicsBrowse(id, fullName)
    }

    return (
        <div id="creator-preview" className={styles.comicPreviewContainer} style={{ '--bg-img': `url(${bgImg})` }}>
            <div className={styles.comicView}>
                <div className={styles.comicImg}>
                { /* TODO: Find a way to show alt (hand-picked) image if "no image is available" */ }
                {(thumbnail) && <img src={thumbnail.path + '.' + thumbnail.extension} onClick={handleMoreClick} title={fullName} />}
                </div>
                <div className={styles.comicInfo}>
                    <Heading density="compact" level="2" text={fullName} />
                    {(series.available > 0) && (
                        <section>
                            <Heading level="3" text={`Series (${series.available})`} />
                            <ul className={styles.defaultList}>
                                {series.items.map((s, index) => <li key={"series-" + index}>{s.name}</li>)}
                            </ul>
                        </section>
                    )}
                    {(events.available > 0) && (
                        <section>
                            <Heading level="3" text={`Events (${events.available})`} />
                            <ul className={styles.defaultList}>
                            {events.items.map((e, index) => <li key={"events-" + index}>{e.name}</li>)}
                            </ul>
                        </section>
                    )}
                    <div className={styles.comicViewControls}>
                        {/* TODO: https://www.w3schools.com/howto/howto_css_switch.asp */}
                        <div className={styles.comicStorageControl}>
                            <ToggleSwitch id="comicStoragetoggle" label="Store Creator" onChange={handleStoreCreatorChange} isChecked={isStored} />
                        </div>
                        <Button text="More Details" variant="secondary" onClick={handleMoreClick} />
                        <Button text={`Comics by ${fullName}`} variant="primary" onClick={handleCreatorComicsBrowse} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreatorPreview;