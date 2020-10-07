import React, { useEffect, useState, useRef } from 'react';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { reset, handleGetData, updateNotification } from './notification.reducer';
import { translate } from 'react-jhipster';
import { getJsonBName } from 'app/modules/setting/utils';
import { utcToTz, DATE_TIME_FORMAT } from 'app/shared/util/date-utils';

export interface IMenuLeftNotificationProps extends StateProps, DispatchProps {
  toggleModalNoti,
  isExpand,
  toggleOpenModalTargetDetail,
  getCountNotification
}

const MenuLeftNotification = (props: IMenuLeftNotificationProps) => {
  const [notification, setNotification] = useState([]);
  const [hoverbtnViewAll, setHoverbtnViewAll] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);
  const timerRef = useRef(null);

  const { dataInfo } = props;

  useEffect(() => {
    props.handleGetData({ limit: 5 });
  }, []);

  useEffect(() => {
    if (props.idUpdate !== null) {
      props.reset();
    }
  }, [props.idUpdate]);

  useEffect(() => {
    if (dataInfo !== null) {
      setNotification(dataInfo.data);
      setEmployeeId(dataInfo.employeeId);
    }
  }, [dataInfo]);

  const watchedNotification = notifi => {
    if (notifi.confirmNotificationDate === null) {
      props.updateNotification({ employeeId, notifi });
      
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        props.getCountNotification();
      }, 500);
    }
    props.toggleOpenModalTargetDetail(notifi);
  };

  const colorNotification = items => {
    if (items.confirmNotificationDate !== null) {
      return 1;
    }
    return 2;
  };

  return (
    <div className={`popup-list-alert-membership  notification-width ${!props.isExpand ? 'noti-modal-close' : ''}`}>
      <div onMouseEnter={() => setHoverbtnViewAll(true)} onMouseLeave={() => setHoverbtnViewAll(false)} className="title">
        <p>{translate('notification.title')}</p>
        <p onClick={props.toggleModalNoti} className={hoverbtnViewAll ? 'hoverP' : ''}>
          {translate('notification.modelNoti')}
        </p>
      </div>

      {notification.length > 0 ? (
        notification.map(notifi => (
          <div key={notifi.notificationId} className={`noiti-items active ${colorNotification(notifi) !== 2 ? 'watched': ''}`}>
            <div className="member item wrapleft" >
              {notifi.icon ? 
                (<img className="user" src={notifi.icon} />) 
                : (<span className="no-avatar green">{notifi.notificationSender ? notifi.notificationSender.charAt(0) : ''}</span>)}
              <div className="name">{notifi.notificationSender}</div>
            </div>
            <p onClick={() => watchedNotification(notifi)} style={{cursor: 'pointer'}}>
              {getJsonBName(notifi.message).length > 5 ? getJsonBName(notifi.message).slice(0, 50) + '...' : getJsonBName(notifi.message)}
            </p>
            <span className="date">{utcToTz(notifi.createdNotificationDate, DATE_TIME_FORMAT.User)}</span>
          </div>
        ))
      ) : (
        <div className="noiti-items" />
      )}
    </div>
  );
};

const mapStateToProps = ({ notification, applicationProfile, authentication }: IRootState) => ({
  tenant: applicationProfile.tenant,
  dataInfo: notification.dataInfo,
  idUpdate: notification.idUpdate,
  account: authentication.account
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
)(MenuLeftNotification);
