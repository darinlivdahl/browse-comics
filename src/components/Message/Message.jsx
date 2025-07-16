import PropTypes from 'prop-types';
import "../../styles/global.css";
import styles from "./Message.module.css";

function Message(props) {

    const { error, onErrorMessageClose } = props;

    function handleClose(event) {
        event.preventDefault();
        onErrorMessageClose(error.type);
    }

    return (
        <div className={styles.messageError}>
            <span className={styles.messageErrorText}>{error.message}</span>
            <a className={styles.messageErrorClose} href="#" onClick={handleClose} title="Close Message">Close</a>
        </div>
    )
}

Message.propTypes = {
    error: PropTypes.string,
    onErrorMessageClose: PropTypes.func,
};

export default Message;