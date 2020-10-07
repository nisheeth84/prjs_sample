import React from 'react';
import { translate } from 'react-jhipster';
import { MOVE_TYPE } from '../../constants';

export interface IMoveToDepartmentPopupProps {
  setShowPopupMoveToDepartment: (show: boolean) => void,
  moveType: (type) => void,
  locale?: string
}

const MoveToDepartmentPopup = (props: IMoveToDepartmentPopupProps) => {
  return (
    <div className="wrap-container">
      <div className={`popup-esr2 ${props.locale && props.locale === 'en_us' ? 'local-en-us' : ''}`} id="popup-esr2">
        <div className="popup-esr2-content">
          <div className="popup-esr2-body">
            <form>
              <div className="popup-esr2-title">{translate('employees.popup.move-to-department.title')}</div>
              <p className="text-center">{translate('employees.list.dialog.message-move-to-department')}</p>
            </form>
          </div>
          <div className="popup-esr2-footer">
            <a className="button-cancel" onClick={() => props.setShowPopupMoveToDepartment(false)}>
              {translate('employees.popup.move-to-department.cancel-text')}
            </a>
            <a className="button-red button-red-two" onClick={() => props.moveType(MOVE_TYPE.TRANSFER)}>{translate('employees.popup.move-to-department.transfer-option')}</a>
            <a className="button-red button-red-two" onClick={() => props.moveType(MOVE_TYPE.CONCURRENT)}>{translate('employees.popup.move-to-department.concurrent-option')}</a>
          </div>
        </div>
      </div>
      <div className="modal-backdrop show"></div>
    </div>
  )
}

export default MoveToDepartmentPopup