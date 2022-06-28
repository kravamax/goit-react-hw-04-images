import React from 'react';
import ImageGalleryItem from 'components/ImageGalleryItem';
import PropTypes from 'prop-types';
import s from './ImageGallery.module.css';

const ImageGallery = ({ images, handleImageClick }) => {
  const handleItemClick = event => {
    event.preventDefault();

    if (event.currentTarget === event.target) {
      return;
    }

    const imageURL = event.target.attributes.largeimg.value;
    handleImageClick(imageURL);
  };

  return (
    <>
      <ul className={s.gallery} onClick={handleItemClick}>
        {images.map(image => (
          <ImageGalleryItem image={image} key={image.id} />
        ))}
      </ul>
    </>
  );
};

ImageGallery.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
    })
  ),
  handleImageClick: PropTypes.func.isRequired,
};

export default ImageGallery;
