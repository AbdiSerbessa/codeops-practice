import PropTypes from 'prop-types';
import './DishImage.css'; // New CSS file for the image

export default function DishImage({ url, altText }) {
  return (
    <div className="dish-image-container">
      <img src={url} alt={altText} className="dish-image" />
    </div>
  );
}

DishImage.propTypes = {
  url: PropTypes.string.isRequired,
  altText: PropTypes.string.isRequired
};