import React from "react";
import "../../styles/global.css";
import styles from "./Results.module.css";
import Heading from "../Heading/Heading";
import Card from "../Card/Card";
import Pagination from "../Pagination/Pagination";

function Results(props) {

    const { context, results, indicator, pagination, onCardSelect, onPaginationChange } = props;

    function handleCardClick(id, name = "") {
        // console.log('run handleComicClick from ComicResults, id is: ' + id);
        if (context === "comic") {
            onCardSelect(id);
        } else if (context === "creator") {
            onCardSelect(id, name)
        }
    }

    return (
        <section className={styles.resultsSection}>
            {/* Heading */}
            {(context === "comic") && (
                (indicator === "Stored Comics") ? <Heading level="2" text="Stored Comics" subtext="Comics are persistently stored on your web browser's local storage until removed." /> : <Heading level="2" text={`Comics by ${indicator}`} />
            )}
            {(context === "creator") && (
                (indicator === "Stored Creators") ? <Heading level="2" text="Stored Creators" subtext="Creators are persistently stored on your web browser's local storage until removed." /> : <Heading level="2" text={`Search Results for ${props.indicator}`} />
            )}
            
            {/* Results container */}
            {(results.length > 0) ? <div className={styles.resultsContainer} id="results-container">
                {results.map(c =>
                    <Card
                        key={c.id}
                        id={c.id}
                        context={context}
                        title={(context === "creator") ? c.fullName : c.title}
                        thumb={c.thumbnail.path + '.' + c.thumbnail.extension}
                        onCardClick={handleCardClick}
                    />
                )}
            </div> : <p className={styles.noResults}>No results for "{indicator}".</p>}
            {/* Pagination */}
            {(results.length > 0 && pagination.count < pagination.total) && <Pagination context={context} onPaginationChange={onPaginationChange} detail={pagination} />}
        </section>
    );
}

export default Results;