import React from 'react';
import { translate } from 'react-jhipster';

export interface IMoveToCategoryPopupProps {
  setShowPopupMoveToCategory: (show: boolean) => void,
  moveCategory: () => void
}

const MoveToCategoryPopup = (props: IMoveToCategoryPopupProps) => {
  return (
    <div className="wrap-container">
      <div className="popup-esr2" id="popup-esr2">
        <div className="popup-esr2-content">
          <div className="popup-esr2-body">
            <form>
              <div className="popup-esr2-title">{translate('employees.popup.move-to-department.title')}</div>
              <p className="text-center">{translate('messages.WAR_EMP_0003')}</p>
            </form>
          </div>
          <div className="popup-esr2-footer">
            <a className="button-cancel" onClick={() => props.setShowPopupMoveToCategory(false)}>
              {translate('employees.popup.move-to-department.cancel-text')}
            </a>
            <a className="button-red button-red-two" onClick={() => props.moveCategory()}>{translate('employees.popup.move-to-department.transfer-option')}</a>
          </div>
        </div>
      </div>
      <div className="modal-backdrop show"></div>
    </div>
  )
}

export default MoveToCategoryPopup
