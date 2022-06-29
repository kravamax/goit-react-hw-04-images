import React, { useState, useEffect } from 'react';
import Searchbar from './Searchbar';
import ImageGallery from 'components/ImageGallery/';
import Button from './Button';
import Loader from './Loader';
import Modal from './Modal';
import api from '../services/image-search-api';

const Status = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

export const App = () => {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(Status.IDLE);
  const [page, setPage] = useState(1);
  const [totalImages, setTotalImages] = useState(null);
  const [modalImageURL, setModalImageURL] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!query) {
      return;
    }

    setStatus(Status.PENDING);

    if (page === 1) {
      api
        .fetchImages(query)
        .then(images => {
          if (!images.totalHits) {
            return Promise.reject(
              new Error(`Nothing found for the word: ${query}.`)
            );
          }
          return images;
        })
        .then(images => {
          setTotalImages(images.totalHits);
          setImages(images.hits);
          setStatus(Status.RESOLVED);
        })
        .catch(error => {
          setError(error);
          setStatus(Status.REJECTED);
        });
    }

    if (page > 1) {
      api
        .fetchImages(query, page)
        .then(images => {
          setImages(state => [...state, ...images.hits]);
          setStatus(Status.RESOLVED);
        })
        .catch(error => {
          setError(error);
          setStatus(Status.REJECTED);
        });
    }
  }, [query, page]);

  const handleImageClick = ImageURL => {
    setModalImageURL(ImageURL);

    toggleModal();
  };

  const handleSubmit = query => {
    setQuery(query);
    setImages([]);
    setTotalImages(null);
    setPage(1);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const totalAddImages = images.length;

  return (
    <div>
      {showModal && (
        <Modal modalImageURL={modalImageURL} onClose={toggleModal} />
      )}

      <Searchbar onSubmit={handleSubmit} />
      {images && (
        <ImageGallery images={images} handleImageClick={handleImageClick} />
      )}

      {status === Status.PENDING && <Loader />}

      {status === Status.REJECTED && <h2>{error.message}</h2>}

      {status === Status.RESOLVED && (
        <>
          {totalAddImages < totalImages ? (
            <Button onClick={() => setPage(page => page + 1)} />
          ) : null}
        </>
      )}
    </div>
  );
};
