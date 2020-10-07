import React, { useState, useEffect, useRef } from 'react';
import { translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import BoxMessage, { MessageType } from 'app/shared/layout/common/box-message';
import { SHOW_MESSAGE, TIME_OUT_MESSAGE } from '../../constant';
import { isNullOrUndefined } from 'util';
import _ from 'lodash';
import useEventListener from 'app/shared/util/use-event-listener';

export interface IPublicAPIProps extends StateProps, DispatchProps {
  changeUrlAPI;
  initUrlAPIDate;
  dirtyReload;
  //   setDirtyReload
}
export const PublicAPI = (props: IPublicAPIProps) => {
  const [isPublicUrlApi, setIsPublicUrlApi] = useState(true);
  const [expiredTime, setExpiredTime] = useState('');

  const handelChangeInput = e =>{
      setExpiredTime(e.target.value)
    }

    const handelChangeRadio = e =>{
      setIsPublicUrlApi(e.target.value)
    }

  return (
    <>
      <div className="form-group">
        <div className="block-feedback block-feedback-blue">{translate('setting.system.urlAPI.notifi')}</div>
      </div>
      <div className="form-group">
        <label className="mb-2">{translate('setting.system.urlAPI.isPublicUrlApi')}</label>
        <div className="wrap-check py-0">
          <div className="wrap-check-radio">
            <p className="radio-item mr-5 pr-5">
              <input type="radio" id="isUrl" name="isPublicUrlApi" onChange={handelChangeRadio} value="true" defaultChecked />
              <label className="mb-0" htmlFor="isUrl">
                {translate('setting.system.urlAPI.apiRadio1')}
              </label>
            </p>
            <p className="radio-item">
              <input type="radio" id="noUrl" name="isPublicUrlApi" onChange={handelChangeRadio} value="false" />
              <label className="mb-0" htmlFor="noUrl">
                {translate('setting.system.urlAPI.apiRadio2')}
              </label>
            </p>
          </div>
        </div>
      </div>
      <div className="form-group">
        <label className="mb-2">{translate('setting.system.urlAPI.authenticationType')} </label>
        <div className="wrap-check">
          <div className="mt-0">
            <label className="icon-check icon-check-disable font-weight-normal gray">
              <input type="checkbox" defaultChecked disabled />
              <i />
            </label>
            各ユーザのログインパスワードを使用する
          </div>
        </div>
      </div>
      <div className="form-group w13">
        <label className="mb-2">{translate('setting.system.urlAPI.authenticationType')} </label>
        <div className="form-control-wrap currency-form">
          <input type="text" className="input-normal" name={expiredTime} placeholder={translate('setting.system.urlAPI.placeholder')} value={expiredTime} onChange={handelChangeInput} />
          <span className="currency color-999">{translate('setting.system.urlAPI.expiredTime')}</span>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ publicAPI }: IRootState) => ({
  urlApi : publicAPI.urlApiInfo,
  apiUpdateSuccess: publicAPI.urlApiUpdateSuccess
});

const mapDispatchToProps = {};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PublicAPI);
