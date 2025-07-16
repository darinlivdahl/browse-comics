import PropTypes from 'prop-types';
import "../../styles/global.css";
// import styles from "./FeaturedCreator.module.css";
import Button from "../Button/Button";

function FeaturedCreator(props) {
    const { creator, onCreatorSelect } = props;

    function handleClick() {
        onCreatorSelect(creator.id, creator.name);
    }

    return <Button variant="secondary" id={creator.id} name={creator.name} text={creator.name} type="button" onClick={handleClick} />;
}

FeaturedCreator.propTypes = {
    creator: PropTypes.object,
    onCreatorSelect: PropTypes.func,
};

export default FeaturedCreator;