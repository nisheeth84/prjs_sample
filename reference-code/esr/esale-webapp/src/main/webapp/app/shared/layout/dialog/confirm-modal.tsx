import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'reactstrap';

const ConfirmModal = ({
  onClose,
  message,
  title,
  confirmText,
  cancelText,
  confirmClass,
  cancelClass,
  className,
  buttonsComponent,
  size,
  zIndex
}) => {
  let buttonsContent = (
      <>
        {cancelText && (
          <a className={cancelClass} onClick={() => onClose(false)}>
            {cancelText}
          </a>
        )}{' '}
        <a className={confirmClass} style={{color: 'white'}} onClick={() => onClose(true)}>
          {confirmText}
        </a>
      </>
  );

  if (buttonsComponent) {
      const CustomComponent = buttonsComponent;
      buttonsContent = <CustomComponent onClose={onClose} />;
  }

  return (
    <Modal
          size={size}
          isOpen
          style={{overlay: {zIndex: 10}}}
          // toggle={() => onClose(false)}
          zIndex={zIndex ? zIndex : "auto"}
          className={className}
      >
        <div className="popup-esr2" style={{minWidth: '340px'}} id="popup-esr2">
          <div className="popup-esr2-content">
            <div className="popup-esr2-body">
              <form>
              {title && <div className="popup-esr2-title">{title || null}</div>}
                <div className="align-center">
                  {message}
                </div>
              </form>
            </div>
            <div className="popup-esr2-footer">
              {buttonsContent}
            </div>
          </div>
        </div>
      </Modal>
  );
};

ConfirmModal.defaultProps = {
  message: 'Are you sure?',
  title: 'Warning!',
  confirmText: 'Ok',
  confirmClass: 'primary',
  cancelText: 'Cancel',
  cancelClass: '',
  className: '',
  buttonsComponent: null,
  size: null
};

ConfirmModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  message: PropTypes.node,
  title: PropTypes.node,
  confirmText: PropTypes.node,
  cancelText: PropTypes.node,
  confirmClass: PropTypes.string,
  cancelClass: PropTypes.string,
  className: PropTypes.string,
  size: PropTypes.string,
  buttonsComponent: PropTypes.func
};

export default ConfirmModal;
