import React, { useState, useEffect } from "react";
import "../../styles/global.css";
import styles from "./Pagination.module.css";
import Button from "../Button/Button";

function Pagination(props) {

    const { context, detail, onPaginationChange } = props;
    const [showNext, setShowNext] = useState(false);
    const [showPrev, setShowPrev] = useState(false);
    // console.log(props.detail);
    const {count, total, limit, offset} = detail;
    const [pagCount, setPagCount] = useState({
        start: 1,
        end: limit
    });

    useEffect(() => {
        // This function will run once when the component mounts
        // console.clear();
        // console.log('run useEffect');
        // console.log('count => ' + count + ' limit => ' + limit + ' offset => ' + offset + ' total => ' + total);

        function getStart() {
            // Set pagination count if before end or at end
            if ((offset > 0 && (offset + count) < total) || (offset > 0 && (offset + count) === total)) {
                return offset + 1;
            // Set pagination count, starting position
            } else {
                return 1;
            }
        }
        function getEnd() {
            // Set pagination count if before end
            if (offset > 0 && (offset + count) < total) {
                return (offset + 1) + count;
            // Set pagination count if at the end
            } else if (offset > 0 && (offset + count) === total) {
                return offset + count;
            // Set pagination count, starting position
            } else {
                return count;
            }
        }
        setPagCount({
            start: getStart(),
            end: getEnd()
        });

        // Control visibility of pagination buttons
        setShowNext((count + offset) < total ? true : false);
        setShowPrev((offset > 0) ? true : false);
    }, [offset]); // Run each time offset property changes

    function handlePaginationChange(name) {
        onPaginationChange(context, name)
    }

    return (
        <div className={styles.paginationContainer}>
            {showPrev && <Button variant="secondary" name="prev" text="Show Previous" onClick={handlePaginationChange} />}
            <div className={styles.paginationCounter}>
                Showing {pagCount.start} - {pagCount.end} of {total} results.
            </div>
            {showNext && <Button variant="secondary" name="next" text="Show Next" onClick={handlePaginationChange} />}
        </div>
    );
}

export default Pagination;