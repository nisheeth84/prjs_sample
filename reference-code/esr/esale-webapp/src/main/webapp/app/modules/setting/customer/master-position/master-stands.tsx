import React, { useState, useEffect, useRef } from 'react';
import { translate } from 'react-jhipster';
import _ from 'lodash';
import { DEFAULT_LANG_STATE } from '../../constant';
import { deepEqual } from '../../utils';
import DialogDirtyCheck from 'app/shared/layout/common/dialog-dirty-check';


interface IMasterStandsProps {
  dismissDialogMasterStands,
  masterStandItem,
  masterStandChange
}

export const MasterStands = (props: IMasterStandsProps) => {

  const MAX_LENGTH = 15;
  const [langsMore, setLangsMore] = useState(false);
  const [masterStandItem, setMasterStandItem] = useState({
    ...props.masterStandItem,
    isAvailable: true,
  });
  const [isError, setIsError] = useState(false);
  const [errorCode, setErrorCode] = useState(null);
  const [errorlang, setErrorLang] = useState([]);
  const [isDirty, setIsDirty] = useState(null);
  const [langs, setLangs] = useState(DEFAULT_LANG_STATE);

  const buttonToogle = useRef(null);

  const [originalLangs, setOriginalLangs] = useState(
    props.masterStandItem ? JSON.parse(props.masterStandItem.masterStandName) : DEFAULT_LANG_STATE
  );


  useEffect(() => {
    if (!props.masterStandItem) {
      return;
    }
    setMasterStandItem(props.masterStandItem);
    const langObj = JSON.parse(props.masterStandItem.masterStandName);
    setLangs({ ...langObj });
  }, [props.masterStandItem]);


  useEffect(() => {
    let p1 = props.masterStandItem;
    let p2 = masterStandItem;

    let checkIsDirty = false;
    if (p1 !== null) {
      const isAvailableDiff = p1.isAvailable !== p2.isAvailable;
      p1 = originalLangs;
      p2 = langs;
      checkIsDirty = !deepEqual(p1, p2) || !deepEqual(p2, p1) || isAvailableDiff;
    } else {
      const isAvailableDiff = p2.isAvailable !== true;
      checkIsDirty = !deepEqual(langs, DEFAULT_LANG_STATE) || isAvailableDiff;
    }
    setIsDirty(checkIsDirty);
  }, [masterStandItem, langs]);


  const handleChangeLangs = keyMap => event => {
    setLangs({ ...langs, [keyMap]: event.target.value });
  }

  const handleChangeInput = keyMap => e => {
    switch (keyMap) {
      case "isAvailable":
        setMasterStandItem({ ...masterStandItem, ['isAvailable']: true });
        break;
      case "noAvailable":
        setMasterStandItem({ ...masterStandItem, ['isAvailable']: false });
        break;
      default:
        break;
    }
  }

  const cancel = async () => {
    if (isDirty) {
      await DialogDirtyCheck({ onLeave: props.dismissDialogMasterStands, partternType: 2 });
      return;
    }
    props.dismissDialogMasterStands();
  }

  const checkMaxLength = () => {
    const langErr = [];
    if (langs["ja_jp"].trim().length > MAX_LENGTH) {
      langErr.push("ja_jp");
    }
    if (langs["en_us"].trim().length > MAX_LENGTH) {
      langErr.push("en_us");
    }
    if (langs["zh_cn"].trim().length > MAX_LENGTH) {
      langErr.push("zh_cn");
    }
    setErrorLang(langErr);
    return langErr;
  }

  const checkError = () => {
    if (_.isEmpty(langs["ja_jp"].trim()) && _.isEmpty(langs["en_us"].trim()) && _.isEmpty(langs["zh_cn"].trim())) {
      setIsError(true);
      setErrorCode("ERR_COM_0013");
      return true;
    }
    const langErr = checkMaxLength();
    if (langErr.length > 0) {
      setIsError(true);
      setErrorCode("ERR_COM_0025");
      return true;
    }
    return false;
  }

  const save = () => {
    const sendData = masterStandItem;
    if ("createdDate" in sendData) {
      delete sendData['createdDate']
    }
    if ("createdUser" in sendData) {
      delete sendData['createdUser']
    }
    if ("updatedUser" in sendData) {
      delete sendData['updatedUser']
    }
    const isErrorInput = checkError();
    if (!isErrorInput) {
      const tmpLangs = _.cloneDeep(langs);
      tmpLangs['ja_jp'] = langs['ja_jp'].trim();
      tmpLangs['en_us'] = langs['en_us'].trim();
      tmpLangs['zh_cn'] = langs['zh_cn'].trim();
      masterStandItem.masterStandName = JSON.stringify(tmpLangs);
      props.masterStandChange(sendData);
    }
  }

  return (
    <>
      <div className="table-tooltip-box w30">
        <div className="table-tooltip-box-body">
          <div>
            <label className="title font-weight-bold">{!props.masterStandItem ? translate('setting.sales.productTrade.addStandard.title') : translate('setting.sales.productTrade.addStandard.titleEdit')}</label>
          </div>
          <div>
            <label className="title mt-4 font-weight-bold">{translate('setting.sales.productTrade.addStandard.langs')}</label>
          </div>

          <div className="d-flex font-size-14">
            {
              langsMore ? (
                <>
                  <input type="text" className={"input-normal mt-2 w70 " + `${(isError ? (errorlang.length > 0 ? (errorlang.includes("ja_jp") ? "error" : null) : "error") : null)}`} value={langs.ja_jp} onChange={handleChangeLangs('ja_jp')} placeholder={translate('setting.customer.masterPosition.placeHolderMasterStands')} />
                  <label className="text-input">{translate('setting.lang.jaJp')}</label>
                </>
              ) : (
                  <>
                    <input type="text" className={"input-normal mt-2 " + `${(isError ? (errorlang.length > 0 ? (errorlang.includes("ja_jp") ? "error" : null) : "error") : null)}`} value={langs.ja_jp} onChange={handleChangeLangs('ja_jp')} placeholder={translate('setting.customer.masterPosition.placeHolderMasterStands')} />
                  </>
                )
            }
          </div>
          {isError && !(errorlang.length > 0) && !langsMore && <p className="setting-input-valis-msg">{translate('messages.' + errorCode)}</p>}
          {isError && errorlang.includes("ja_jp") && <p className="setting-input-valis-msg">{translate('messages.' + errorCode, [MAX_LENGTH])}</p>}
          {
            langsMore &&
            (
              <div>
                <div className="d-flex font-size-14">
                  <input type="text" className={"input-normal mt-2 w70 " + `${(isError ? (errorlang.length > 0 ? (errorlang.includes("en_us") ? "error" : null) : "error") : null)}`} value={langs.en_us} onChange={handleChangeLangs('en_us')} placeholder={translate('setting.customer.masterPosition.placeHolderMasterStands')} />
                  <label className="text-input">{translate('setting.lang.enUs')}</label>
                </div>
                {isError && errorlang.includes("en_us") && <p className="setting-input-valis-msg">{translate('messages.' + errorCode, [MAX_LENGTH])}</p>}
                <div className="d-flex font-size-14">
                  <input type="text" className={"input-normal mt-2 w70 " + `${(isError ? (errorlang.length > 0 ? (errorlang.includes("zh_cn") ? "error" : null) : "error") : null)}`} value={langs.zh_cn} onChange={handleChangeLangs('zh_cn')} placeholder={translate('setting.customer.masterPosition.placeHolderMasterStands')} />
                  <label className="text-input">{translate('setting.lang.zhCn')}</label>
                </div>
                {isError && errorlang.includes("zh_cn") && <p className="setting-input-valis-msg">{translate('messages.' + errorCode, [MAX_LENGTH])}</p>}
              </div>
            )
          }
          {isError && langsMore && !(errorlang.length > 0) && <p className="setting-input-valis-msg">{translate('messages.' + errorCode, [MAX_LENGTH])}</p>}
          <div>
            <button ref={buttonToogle} className={langsMore ? "button-primary btn-padding w70 mt-2 text-center" : "button-primary btn-padding w100 mt-2 text-center"} onClick={() => {buttonToogle.current.blur(); setLangsMore(!langsMore)}}>
              {!langsMore ? translate('setting.sales.productTrade.add.langMore') : translate('setting.sales.productTrade.add.langLess')}
            </button>
          </div>
          <div className="mt-3 font-size-14">
            <label className="title font-weight-bold">{translate('setting.sales.productTrade.add.available.title')}</label>
            <div className={langsMore ? "wrap-check w70 mt-2" : "wrap-check w100 mt-2"}>
              <div className="mt-0">
                <p className="radio-item normal d-inline mr-3">
                  <input type="radio" id="isAvailable" name="isAvailable" onChange={handleChangeInput('isAvailable')} checked={masterStandItem && masterStandItem.isAvailable} />
                  <label htmlFor="isAvailable">{translate('setting.sales.productTrade.add.available.active')}</label>
                </p>
                <p className="radio-item normal d-inline radio-item-edit-t">
                  <input type="radio" id="noAvailable" name="isAvailable" onChange={handleChangeInput('noAvailable')} checked={masterStandItem && !masterStandItem.isAvailable} />
                  <label htmlFor="noAvailable">{translate('setting.sales.productTrade.add.available.noActive')}</label>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="table-tooltip-box-footer">
          <button className="button-cancel button-small mr-1" onClick={cancel}>{translate('setting.task.activityFormat.add.cancel')}</button>
          <button className="button-blue button-small" onClick={save}>{!props.masterStandItem ? translate('setting.task.activityFormat.add.save') : translate('setting.customer.btnEdit')}</button>
        </div>
      </div>
    </>
  )

}
export default MasterStands;