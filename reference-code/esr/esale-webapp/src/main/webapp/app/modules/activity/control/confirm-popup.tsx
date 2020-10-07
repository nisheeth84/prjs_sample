import React, { useRef, useEffect, useState } from 'react';
import { ConfirmPopupItem, ConfirmButton } from '../models/confirm-popup-item';
import { Modal } from 'reactstrap';
import { MODE_CONFIRM } from '../constants';

type IConfirmPopup = {
  infoObj?: ConfirmPopupItem
}

/**
 * component for show confirm popup
 * @param props 
 */
const ConfirmPopup = (props: IConfirmPopup) => {
  const spanRef = useRef<HTMLSpanElement>(null);
  const [contentHTML,] = useState(props.infoObj.content);

  useEffect(() => {
    if (spanRef.current) {
      spanRef.current.innerHTML = contentHTML;
    }
  }, [spanRef.current, contentHTML]);

  const genClassModal = () => {
    if(props.infoObj.modeConfirm === MODE_CONFIRM.DELETE) {
      return "popup-esr2";
    }
    else return "popup-esr2 popup-activity-es3";
  }

  return (
    <Modal
        isOpen
        className="z-index-99"
        zIndex="auto"
      >
        <div className={genClassModal()} id="popup-esr2">
          <div className="popup-esr2-content">
            <div className="popup-esr2-body">
              <form className="form-group">
                <div className="popup-esr2-title">{props.infoObj.title}</div>
                <span ref={spanRef}></span >
              </form>
            </div>
            <div className="popup-esr2-footer d-flex justify-content-center">
              {props.infoObj.listButton.map((e: ConfirmButton, index) => {
                return (
                  <a key={index} className={"button-" + e.type} onClick={() => e.callback()}>{e.title}</a>
                );
              })}
            </div>
          </div>
        </div>
        <div className="modal-backdrop-two show" />
      </Modal>
  )
};

export default ConfirmPopup;
