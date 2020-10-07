import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import React from 'react';
import { translate } from 'react-jhipster';
import { isViewAsModal } from '../constants';
import {
  openBusinessCardDetailModal,
  onOpenActivityDetail
} from '../network-map-modal/add-edit-network-map.reducer'
import { DATE_TIME_FORMAT, utcToTz } from 'app/shared/util/date-utils';

interface ITooltipBusinessCardDetailProps extends StateProps, DispatchProps {
  cardData;
  viewType;
}

const TooltipBusinessCardDetail = (props: ITooltipBusinessCardDetailProps) => {
  const { cardData } = props;
  return (
    <>
      {cardData &&
        <div className="box-user-status">
          <div className={`${cardData.businessCardImagePath ? '' : 'pl-0'} box-user-status-header`}>
            {cardData.businessCardImagePath &&
              <img className="avatar" src={cardData.businessCardImagePath} />
            }
            <div className="text-blue font-size-10 word-break-all">
              {cardData.companyName}
            </div>
            <div className="font-size-10 word-break-all">{cardData.departmentName} {cardData.position}</div>
            <div className="font-size-10 text-blue word-break-all" onClick={() => isViewAsModal(props.viewType) && props.openBusinessCardDetailModal(cardData?.businessCardId)}>
              {cardData.firstNameKana}
              {cardData.lastNameKana}
            </div>
            <div className="text-blue font-size-12 word-break-all" onClick={() => isViewAsModal(props.viewType) && props.openBusinessCardDetailModal(cardData?.businessCardId)}>
              {cardData.firstName} {cardData.lastName}
            </div>
            <a className={`${cardData.lastContactDate && cardData.lastContactDate !== "null" ? 'with-interview' : 'interview'} font-size-10`}>
              {cardData.lastContactDate && cardData.lastContactDate !== "null" ?
                translate('business-card-details.acquainted') :
                translate('business-card-details.acquainted-disable')}
            </a>
          </div>
          <div className="box-user-group font-size-12 border-0">
            {cardData.phoneNumber && <a><img src="../../../content/images/common/ic-call.svg" alt="" title="" />{cardData.phoneNumber}</a>}
            {cardData.mobileNumber && <a><img src="../../../content/images/common/ic-phone.svg" alt="" title="" />{cardData.mobileNumber}</a>}
            {cardData.emailAddress && <a className="text-blue word-break-all" href={`mailto:${cardData.emailAddress}`}>
              <img src="../../../content/images/common/ic-mail.svg" alt="" title="" />
              {cardData.emailAddress}
            </a>}
          </div>
          <div className="box-user-group font-size-10 border-0 m-0 p-0">
            {translate('business-card-details.last-contact-date')}
            <div>
              {cardData.lastContactDate && cardData.lastContactDate !== "null" &&
                <span className="date text-blue" onClick={() => isViewAsModal(props.viewType) && props.onOpenActivityDetail(cardData?.activityId)}>
                  {utcToTz(cardData.lastContactDate + '', DATE_TIME_FORMAT.User).split(' ')[0]}
                </span>}
            </div>
          </div>
        </div>
      }
    </>
  );
};

const mapStateToProps = null;

const mapDispatchToProps = {
  openBusinessCardDetailModal,
  onOpenActivityDetail
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TooltipBusinessCardDetail);
