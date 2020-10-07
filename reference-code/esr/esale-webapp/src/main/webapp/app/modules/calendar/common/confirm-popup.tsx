import React from 'react';
import { translate } from "react-jhipster";
import { ItemTypeSchedule, ModeAction } from "app/modules/calendar/constants";
import '../style/custom.scss';
import { getFieldLabel } from 'app/shared/util/string-utils';

type IConfirmPopup = {
  infoObj?: {},
  callbackOk?: () => void,
  callbackCancel?: () => void
  type?: ItemTypeSchedule.Schedule
}

const ConfirmPopup = (props: IConfirmPopup) => {


  const renderTitle = () => {
    if (props.infoObj['mode']) {
      switch (props.infoObj['mode']) {
        case ModeAction.Delete:
          return translate('calendars.modal.delete');
        case ModeAction.Create:
          return translate('calendars.modal.create');
        case ModeAction.Edit:
          return translate('calendars.modal.edit');
        default:
          return translate('calendars.modal.detail');
      }
    }
  }

  const renderBody = () => {
    if (props.infoObj['mode']) {
      switch (props.infoObj['mode']) {
        case ModeAction.Delete:
          return <>
            <p className='radio-item'>
              <div>{translate('calendars.modal.confirmDelete', { name: getFieldLabel(props.infoObj, 'name') })}</div>
            </p>
            {props.type === ItemTypeSchedule.Schedule &&
              <p className='radio-item'>
                <pre>{translate('calendars.modal.fromTo',
                  { startDate: props.infoObj['startDate'], finishDate: props.infoObj['finishDate'] })
                }</pre>
              </p>
            }
          </>;
        case ModeAction.Create:
          return null;
        case ModeAction.Edit:
          return null;
        default:
          return null;
      }
    }
  }

  return <div className='ConfirmDelete'>
    <div className='popup-esr2' id='popup-esr2'>
      <div className='popup-esr2-content'>
        <div className='popup-esr2-body'>
          <div className='popup-esr2-title'>{renderTitle()}</div>
          <div className='wrap-check-radio'>
            {renderBody()}
          </div>
        </div>
        <div className='popup-esr2-footer'>
          <a title=''
            className='button-cancel'
            onClick={() => props.callbackCancel ? props.callbackCancel() : null}>
            {translate('calendars.modal.cancel')}
          </a>
          <a title=''
            className='button-red'
            onClick={() => props.callbackOk ? props.callbackOk() : null}>
            {translate('calendars.modal.delete')}
          </a>
        </div>
      </div>
    </div>
    <div className='modal-backdrop show' />
  </div>
}

export default ConfirmPopup;
