import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import CreateEditSchedule from "app/modules/calendar/popups/create-edit-schedule";

type ComponentProps = {}

export type CompositeModalChildProps = {
  setTitleModal?: React.Dispatch<any>,
  setLoading?: React.Dispatch<boolean>
  setSubmitText?: React.Dispatch<string>,
  backUrl?: string,
}

export const NewPopupCreateEditSchedule = (props: ComponentProps) => {
  const [modalTitle, setModalTitle] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [submitText, setSubmitText] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    document.body.className = 'wrap-calendar';
  }, []);

  const renderComponent = (propsItem) => (
    <div className="modal popup-esr popup-esr4 user-popup-page popup-align-right show" id="popup-esr" aria-hidden="true">
      <div className="form-popup">
        <div className="modal-content">
          <div className="modal-header">
            <div className="left">
              <div className="popup-button-back">
                <a title="" className="icon-small-primary icon-return-small disable"/>
                <span className="text">
                {modalTitle}
              </span>
              </div>
            </div>
            <div className="right">
            </div>
          </div>
          <div className="modal-body style-3">
            <div className='popup-content max-height-auto style-3 popup-calendar-tool-1'>
              <CreateEditSchedule {...propsItem} setTitleModal={setModalTitle} setSubmitText={setSubmitText} setLoading={setIsLoading} ref={ref}/>
            </div>
          </div>
          <div className="user-popup-form-bottom">
            <a title={submitText} className={`button-blue button-form-register ${isLoading ? 'disabled' : ''}`} onClick={() => {
              ref.current && ref.current.submitData()
            }}>{submitText}</a>
          </div>
        </div>
      </div>
    </div>
  );

  return renderComponent(props);
}

export default connect()(NewPopupCreateEditSchedule);

