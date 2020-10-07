import React, { useRef, useEffect, useState } from 'react';
import { ConfirmPopupItem, ConfirmButton } from '../../models/confirm-popup-item'
// import { Modal } from 'reactstrap';

type IConfirmPopup = {
  infoObj?: ConfirmPopupItem
  isCommon?: boolean
}

const ConfirmPopup = (props: IConfirmPopup) => {
  const spanRef = useRef<HTMLSpanElement>(null);
  const [contentHTML,] = useState(props.infoObj.content);

  useEffect(() => {
    if (spanRef.current) {
      spanRef.current.innerHTML = contentHTML;
    }
  }, [spanRef.current, contentHTML]);

  return (
      <>
        <div className="popup-esr2 z-index-1112 font-size-14" id="popup-esr2">
          <div className="popup-esr2-content">
            <div className="popup-esr2-body">
              <form className="form-group">
                <div className="popup-esr2-title">{props.infoObj.title}</div>
                <span ref={spanRef}></span >
              </form>
            </div>
            <div className={`popup-esr2-footer d-flex justify-content-center ${props.isCommon ? 'timeline-footer' : ''}`}>
              {props.infoObj.listButton.map((e: ConfirmButton, index) => {
                return (
                  <a key={index} className={["button-" + e.type, ""].join(" ")} onClick={() => e.callback()}>{e.title}</a>
                );
              })}
            </div>
          </div>
        </div>
        <div className="show z-index-1111 modal-backdrop" />
        </>
  )
};

export default ConfirmPopup;
