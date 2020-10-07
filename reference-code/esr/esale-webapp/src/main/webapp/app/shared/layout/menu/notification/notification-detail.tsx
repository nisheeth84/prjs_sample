import React, { useEffect, useState, useRef } from 'react';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { reset, handleGetData, updateNotification } from './notification.reducer';
import { getJsonBName } from 'app/modules/setting/utils';
import { utcToTz, DATE_TIME_FORMAT } from 'app/shared/util/date-utils';
import { translate } from 'react-jhipster';
import HelpPopup from 'app/modules/help/help';

export interface IMenuLeftNotificationDetailProps extends StateProps, DispatchProps {
  toggleModalNoti;
  toggleNotificationDetail;
  dialogSetting,
  toggleOpenModalTargetDetail,
  getCountNotification
}
const MenuLeftNotificationDetail = (props: IMenuLeftNotificationDetailProps) => {
  const [notification, setNotification] = useState([]);
  const [employeeId, setEmployeeId] = useState(null);
  const [valueTextSearch, setValueTextSearch] = useState('');
  const [urlSwich] = useState('');
  const [checkAdmin, setCheckAdmin] = useState(false);
  const [css, setCss] = useState(false);
  const { toggleModalNoti, dialogSetting, dataInfo } = props;
  const timerRef = useRef(null);
  const [onOpenPopupHelp, setOnOpenPopupHelp] = useState(false);

  useEffect(() => {
    const a = props.account.authorities;
    a.forEach(e => {
      if (e === 'ROLE_ADMIN') {
        setCheckAdmin(true);
      }
    });

    props.handleGetData();
  }, []);
  useEffect(() => {
    if (props.idUpdate !== null) {
      props.reset();
      window.location.href = `${props.tenant}${urlSwich}`;
    }
  }, [props.idUpdate]);

  useEffect(() => {
    if (dataInfo !== null) {
      setNotification(dataInfo.data);
      setEmployeeId(dataInfo.employeeId);
    }
  }, [dataInfo]);

  const colorNotification = items => {
    if (items.confirmNotificationDate !== null) {
      return 1;
    }
    return 2;
  };

  const handleCloseModal = () => {
    props.reset()
    toggleModalNoti()
  };

  const seachNotification = (event, type?) => {
    if (event.charCode === 13 || type) {
      props.handleGetData({ textSearch: valueTextSearch });
    }
  };
  const watchedNotification = notifi => {
    if (notifi.confirmNotificationDate === null) {
      props.updateNotification({ employeeId, notifi });

      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        props.getCountNotification();
      }, 500);
    } else {
      props.reset();
    }
    props.toggleOpenModalTargetDetail(notifi);
    props.toggleNotificationDetail();
  };



  const openDialogSetting = () => {
    props.reset()
    dialogSetting()
  }

  /**
* handle close popup Help
*/
  const dismissDialogHelp = () => {
    setOnOpenPopupHelp(false);
  }

  /**
     * handle action open popup help
     */
  const handleOpenPopupHelp = () => {
    setOnOpenPopupHelp(!onOpenPopupHelp);
  }

  return (
    // <Modal isOpen className="modal-dialog form-popup">
    <div className="wrap-membership">
      <div className="modal-backdrop show"></div>
      <div
        className="modal popup-esr popup-esr4 user-popup-page popup-align-right popup-fix-height show show membership-dropdown"
        id="popup-esr"
        aria-hidden="true"
      >
        <div className="modal-dialog form-popup">
          <div className="modal-content">
            <div className="modal-header">
              <div className="left">
                <div className="popup-button-back">
                  <button className="icon-small-primary icon-return-small disable" />
                  <span className="line-col" />
                </div>
              </div>
              <div className="right">
                <a tabIndex={0} className="icon-small-primary icon-help-small" />
                {checkAdmin && <a tabIndex={0} className="icon-small-primary icon-setting-small" onClick={() => openDialogSetting()} />}
                <button className="icon-small-primary icon-close-up-small line" onClick={handleCloseModal} />
              </div>
            </div>
            <div className="modal-body style-3">
              <div className="popup-content  style-3">
                <div className="user-popup-form popup-task-form">
                  <div className="form-group flex-end">
                    <div onMouseEnter={() => setCss(true)}
                      onMouseLeave={() => setCss(false)} className={`search-box-button-style ${css ? 'search-box-button' : 'input-defauld'}`}>
                      <input
                        defaultValue={valueTextSearch}
                        className={`search-box-button-style ${css ? 'search-box-button search-box-button-no-hover' : 'input-defauld'}`}
                        onKeyPress={() => seachNotification(event)}
                        value={valueTextSearch}
                        onChange={e => setValueTextSearch(e.target.value)}
                        type="text"
                        placeholder={translate('notification.detail.placehoder')}
                      />
                      <button onClick={() => seachNotification(event, true)} className={`icon-search ${css ? 'search-box-button' : 'input-defauld'}`}>
                        <i className="far fa-search" />
                      </button>
                    </div>
                  </div>
                  {notification.length > 0 ? (
                    notification.map(notifi => (
                      <div tabIndex={0} key={notifi.notificationId} className={`noiti-items active ${colorNotification(notifi) !== 2 ? 'watched' : ''}`}>
                        <div className="member item  wrapleft" >
                          {notifi.icon ?
                            (<img className="user" src={notifi.icon} />)
                            : (<span className="no-avatar green">{notifi.notificationSender ? notifi.notificationSender.charAt(0) : ''}</span>)}
                          <div className="name">{notifi.notificationSender}</div>
                        </div>
                        <p className="noti-mess" onClick={() => watchedNotification(notifi)} style={{ cursor: 'pointer' }}>
                          {getJsonBName(notifi.message)}
                        </p>
                        <span className="date">{utcToTz(notifi.createdNotificationDate, DATE_TIME_FORMAT.User)}</span>
                      </div>
                    ))
                  ) : (
                      <></>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {onOpenPopupHelp && <HelpPopup currentCategoryId={null} dismissDialog={dismissDialogHelp} />}
    </div>
    // </Modal>
  );
};

const mapStateToProps = ({ notification, applicationProfile, authentication }: IRootState) => ({
  tenant: applicationProfile.tenant,
  account: authentication.account,
  dataInfo: notification.dataInfo,
  idUpdate: notification.idUpdate
});

const mapDispatchToProps = {
  updateNotification,
  handleGetData,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MenuLeftNotificationDetail);
