import React, { useState, useEffect } from 'react';
import { translate } from 'react-jhipster';
import TimePicker from 'app/shared/layout/dynamic-form/control-field/component/time-picker';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  reset,
  getGeneral
} from "./general.reducer";
import { jsonParse } from 'app/shared/util/string-utils';
import { SHOW_MESSAGE, TIME_OUT_MESSAGE, } from 'app/modules/setting/constant';
import { isNullOrUndefined } from "util";
import BoxMessage, { MessageType } from 'app/shared/layout/common/box-message';
import { timeTzToUtc, timeUtcToTz } from 'app/shared/util/date-utils';

export interface IGeneralProps extends StateProps, DispatchProps {
  changeTimeEdit,
  initGeneralSetting,
  dirtyReload,
  errorInfo
}

export const General = (props: IGeneralProps) => {

  const [defaultTime, setDefaultTime] = useState('');
  const [generalSetting, setGeneralSetting] = useState(null);
  const [codeMessage, setCodeMessage] = useState(SHOW_MESSAGE.NONE);

  useEffect(() => {
    props.reset()
    props.getGeneral("list_update_time");
    if (generalSetting && !_.isEmpty(generalSetting)) {
      setDefaultTime(timeUtcToTz(jsonParse(generalSetting.settingValue).listUpdateTime));
    }
  }, [props.dirtyReload]);

  useEffect(() => {
    props.getGeneral("list_update_time");
  }, [props.generalSettingId]);

  useEffect(() => {
    if (props.generalSetting) {
      if (!_.isEmpty(props.generalSetting)) {
        setDefaultTime(timeUtcToTz(jsonParse(props.generalSetting.settingValue).listUpdateTime));
      } else {
        setDefaultTime('')
      }
      // return;
      setGeneralSetting(_.cloneDeep(props.generalSetting));
      props.initGeneralSetting(_.cloneDeep(props.generalSetting));

      props.changeTimeEdit(_.cloneDeep(props.generalSetting));

    }

  }, [props.generalSetting]);

  const getErrorMessage = (errorCode) => {
    let errorMessage = '';
    if (!isNullOrUndefined(errorCode)) {
      errorMessage = translate('messages.' + errorCode);
    }
    return errorMessage;
  }

  const renderErrorMessage = () => {
    if (codeMessage === SHOW_MESSAGE.ERROR) {
      return <BoxMessage messageType={MessageType.Error}
        message={getErrorMessage(props.messageError[0] && props.messageError[0]['errorCode'])} />
    }
  }

  const changeTime = (event) => {
    const paramUpdate = {
      ...generalSetting,
      listUpdateTime: timeTzToUtc(event)
    }
    props.changeTimeEdit(!_.isEmpty(event) ? paramUpdate : {});
    setDefaultTime(event ? event : '');
  }

  useEffect(() => {
    setCodeMessage(SHOW_MESSAGE.NONE);
    if (props.messageError && props.messageError.length > 0) {
      setCodeMessage(SHOW_MESSAGE.ERROR);
    }
  }, [props.generalSettingId && props.messageError]);

  const styleErrror = {};
  if (props.errorInfo) {
    styleErrror['marginLeft'] = '129px';
  }

  return (
    <>
      <div className="mb-3"><label>{translate('setting.system.general.title')}</label></div>
      <div className="show-message-general position-absolute">
        {renderErrorMessage()}
      </div>
      <div className="d-flex align-items-center">
        <label className="mr-3">{translate('setting.system.general.action')}</label>
        <div className="wrap-input-date wrap-input-date-4-input w16">
          {<TimePicker placeholder={translate('setting.system.general.placeholder')}
            onChangeTime={(e) => changeTime(e)}
            divClass="form-group form-group2 common has-delete m-0"
            inputClass="input-normal"
            isWithoutOuterDiv={false}
            isWithoutInnerDiv={false}
            timeInit={defaultTime}
            errorInfo={props.errorInfo}
          />}
        </div>
      </div>
      {props.errorInfo && <p className="setting-input-valis-msg" style={styleErrror}>{translate('messages.ERR_COM_0013')}</p>}
    </>
  )
}

const mapStateToProps = ({ general, }: IRootState) => ({
  generalSetting: general.generalSetting,
  generalSettingId: general.generalSettingId,
  messageError: general.errorItems
});

const mapDispatchToProps = {
  getGeneral,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(General);