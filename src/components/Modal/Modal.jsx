import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import s from './Modal.module.css';

const modalRoot = document.querySelector('#modal-root');

const Modal = ({ onClose, modalImageURL }) => {
  useEffect(() => {
    window.addEventListener('click', handleOverlayClick);
    window.addEventListener('keydown', handleEscClick);

    return () => {
      window.removeEventListener('click', handleOverlayClick);
      window.removeEventListener('keydown', handleEscClick);
    };
  });

  const handleOverlayClick = event => {
    if (event.currentTarget === event.target) {
      onClose();
    }
  };

  const handleEscClick = event => {
    if (event.code === 'Escape') {
      onClose();
    }
  };

  return createPortal(
    <div className={s.overlay} onClick={handleOverlayClick}>
      <div className={s.modal}>
        <img src={modalImageURL} alt="" />
      </div>
    </div>,
    modalRoot
  );
};

Modal.propTypes = {
  modalImageURL: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Modal;
