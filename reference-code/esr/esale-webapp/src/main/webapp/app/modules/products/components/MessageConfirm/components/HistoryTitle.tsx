import React from 'react';
import { HistoryItemDataType, HISTORY_TITLE } from '../constants';
import { translate, Storage } from 'react-jhipster';
import moment from 'moment';
import { PlaceHolderCircel } from './styles';
import EmployeeName from 'app/shared/layout/common/EmployeeName';

interface IProps {
  data: HistoryItemDataType;
  status: keyof typeof HISTORY_TITLE;
  toggleContent: (boolean) => void
}

const HistoryTitle: React.FC<IProps> = ({ data, status, toggleContent }) => {
  const renderTime = () => {
    const getLocale = Storage.session.get('locale', 'ja_jp');
    moment.locale(getLocale);
    return moment(data.createdDate).format('LLL');
  };

  const renderTitle = () => {
    return translate(HISTORY_TITLE[status]);
  };

  return (
    <div className="title item position-relative">
      <PlaceHolderCircel  onClick={toggleContent} />
      {renderTime()}
      <EmployeeName
        userName={data.createdUserName}
        userImage={data.createdUserImage}
        employeeId={data.createdUserId}
        sizeAvatar={24}
      />

      {renderTitle()}
    </div>
  );
};

export default React.memo(HistoryTitle);
