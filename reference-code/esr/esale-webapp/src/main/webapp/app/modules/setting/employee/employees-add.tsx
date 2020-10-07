import React, { useState, useEffect, useRef } from 'react';
import { translate } from 'react-jhipster';
import { MODE_POPUP, LANG_KEY_ACCAUNT, DEFAULT_LANG_STATE, MAX_INPUT_LENGTH, LANGUAGES } from 'app/modules/setting/constant';
import DialogDirtyCheckRestart from 'app/shared/layout/common/dialog-dirty-check-restart';
import { checkLang } from '../utils';
import _ from 'lodash';

interface IEmployeesAddProps {
  positionsItem,
  positionsChange?,
  dismissDialog?,
  langKey,
  modePopup: number
}

export const EmployeesAdd = (props: IEmployeesAddProps) => {

  const [jaJp, setJaJp] = useState(true);
  const [enUS, setEnUS] = useState(true);
  const [zhCn, setZhCn] = useState(true);
  const [accountLangky, setAccountLangky] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [langsMore, setLangsMore] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [positions, setPositions] = useState({});
  const [langs, setLangs] = useState(DEFAULT_LANG_STATE);

  const buttonToogle = useRef(null);  

  const { positionsItem, modePopup } = props;

  const validateLang = (keyMap, length) => {
    const isValid = length <= MAX_INPUT_LENGTH;
    switch (keyMap) {
      case LANGUAGES.JA_JP:
        setJaJp(isValid);
        break;
      case LANGUAGES.EN_US:
        setEnUS(isValid);
        break;
      default:
        setZhCn(isValid);
        break;
    }
    return isValid;
  }

  const handleChangeLangs = keyMap => event => {
    setLangs({ ...langs, [keyMap]: event.target.value });
  }

  const toggleInputLang = () => {
    setLangsMore(!langsMore);
  }

  const validatelangkey = () => {
    // const isInvalid = langs[`${props.langKey}`].length === 0;
    const isInvalid = (langs[`${LANGUAGES.JA_JP}`].trim().length === 0 &&
      langs[`${LANGUAGES.EN_US}`].trim().length === 0 &&
      langs[`${LANGUAGES.ZH_CN}`].trim().length === 0);
    setHasError(isInvalid)
    return !isInvalid
  }

  const validate = () => {
    const valiLangAcc = validatelangkey()
    const jp = validateLang(LANGUAGES.JA_JP, langs.ja_jp.trim().length)
    const cn = validateLang(LANGUAGES.ZH_CN, langs.zh_cn.trim().length)
    const us = validateLang(LANGUAGES.EN_US, langs.en_us.trim().length)
    return valiLangAcc && jp && cn && us;
  }

  const save = () => {
    if (positions['isAvailable'] === undefined) {
      positions['isAvailable'] = true;
    }
    if (positions['positionId'] === undefined) {
      positions['positionId'] = 0;
    }
    if (validate()) {
      const tmpLangs = _.cloneDeep(langs);
      tmpLangs['ja_jp'] = langs['ja_jp'].trim();
      tmpLangs['en_us'] = langs['en_us'].trim();
      tmpLangs['zh_cn'] = langs['zh_cn'].trim();
      positions['positionName'] = JSON.stringify(tmpLangs);
      props.positionsChange(positions);
    }
  }

  const isChangeInput = () => {
    const isPosChanged = checkLang(langs, positionsItem);
    return modePopup === MODE_POPUP.CREATE ?
      ((positions['isAvailable'] === undefined || positions['isAvailable'] === true) && isPosChanged) :
      positions['isAvailable'] === positionsItem.isAvailable && isPosChanged;
  }

  const executeDirtyCheck = async (action: () => void) => {
    if (!isChangeInput()) {
      await DialogDirtyCheckRestart({ onLeave: action });
    }else{
      action()
    }
  }

  const cancel = async () => {
    await executeDirtyCheck(() => { props.dismissDialog() })
  }

  const handleChangeInput = keyMap => e => {
    switch (keyMap) {
      case "isAvailable":
        setIsActive(true);
        setPositions({ ...positions, ['isAvailable']: true });
        break;
      case "noAvailable":
        setIsActive(false);
        setPositions({ ...positions, ['isAvailable']: false });
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    if (positionsItem) {
      setPositions(positionsItem);
      const langObj = JSON.parse(positionsItem.positionName);
      setLangs({ ...langObj });
      setIsActive(positionsItem.isAvailable)
    }
  }, [positionsItem]);

  useEffect(() => {
    switch (props.langKey) {
      case LANGUAGES.EN_US:
        setAccountLangky(LANG_KEY_ACCAUNT.US)
        break;
      case LANGUAGES.ZH_CN:
        setAccountLangky(LANG_KEY_ACCAUNT.ZH)
        break;
      default:
        setAccountLangky(LANG_KEY_ACCAUNT.JP)
        break;
    }
  }, [props.langKey]);

  // useEffect(() => {
  //   setHasError(false);
  // }, [{ ...langs }])

  return (
    <>
      <div className="table-tooltip-box box-other__40">
        <div className="table-tooltip-box-body">
          <div>
            <label className="title font-weight-bold">
              {modePopup === MODE_POPUP.CREATE ? translate('setting.employee.employeePosition.titlePopup') : translate('setting.employee.employeePosition.titleEditPopup')}
            </label>
          </div>
          <div>
            <label className="title mt-4 font-weight-bold">
              {translate('setting.employee.employeePosition.titlePosition')}
            </label>
          </div>
          <div className="d-flex">
            <input type="text" className={`input-normal mt-2 ${langsMore && "w70"} ${(hasError || !jaJp) && "setting-input-valid"}`} placeholder={modePopup === MODE_POPUP.CREATE ? translate('setting.employee.employeePosition.positionPlahorder') : translate('setting.employee.employeePosition.editPlahorder')}
              value={langs.ja_jp} onChange={handleChangeLangs(LANGUAGES.JA_JP)} />
            {langsMore && <label className="text-input">{translate('setting.lang.jaJp')}</label>}
          </div>
          {!jaJp && <p className="setting-input-valis-msg">{translate('messages.ERR_COM_0025', [60])}</p>}
          {!langsMore && hasError && <p className="setting-input-valis-msg mb-0">{translate('messages.ERR_COM_0013')}</p>}
          {langsMore && <>
            <div className="d-flex">
              <input type="text" className={`input-normal mt-2 w70 ${(hasError || !enUS) && "setting-input-valid"}`} placeholder={translate('setting.employee.employeePosition.positionPlahorder')}
                value={langs.en_us} onChange={handleChangeLangs(LANGUAGES.EN_US)} />
              <label className="text-input">{translate('setting.lang.enUs')}</label>
            </div>
            {!enUS && <p className="setting-input-valis-msg">{translate('messages.ERR_COM_0025', [60])}</p>}
            <div className="d-flex">
              <input type="text" className={`input-normal mt-2 w70 ${(hasError || !zhCn) && "setting-input-valid"}`} placeholder={translate('setting.employee.employeePosition.positionPlahorder')}
                value={langs.zh_cn} onChange={handleChangeLangs(LANGUAGES.ZH_CN)} />
              <label className="text-input">{translate('setting.lang.zhCn')}</label>
            </div>
            {!zhCn && <p className="setting-input-valis-msg">{translate('messages.ERR_COM_0025', [60])}</p>}
            {langsMore && hasError && <p className="setting-input-valis-msg mb-0">{translate('messages.ERR_COM_0013')}</p>}
          </>}
          <div>
            <button ref={buttonToogle} type='button' className={`button-primary btn-padding mt-2 text-center color-000  ${langsMore ? "w70" : 'w100'} `} onClick={()=>{buttonToogle.current.blur(); toggleInputLang()}}>{langsMore ? translate('setting.employee.employeePosition.toggleOtherLanguages') : translate('setting.employee.employeePosition.toggleOtherLanguagesEdit')}</button>
          </div>
          <div>
            <label className="title font-weight-bold">
              {translate('setting.employee.employeePosition.register')}
            </label>
            <div className={`wrap-check mt-2 ${langsMore ? "w70" : 'w100'}`}>
              <div className="mt-0">
                <p className="radio-item normal d-inline mr-3">
                  <input type="radio" id="isAvailable" name="isAvailable" onChange={handleChangeInput("isAvailable")} checked={isActive} />
                  <label htmlFor="isAvailable" className="color-999">{translate('setting.employee.employeePosition.usable')}</label>
                </p>
                <p className="radio-item normal d-inline">
                  <input type="radio" id="noAvailable" name="noAvailable" onChange={handleChangeInput("noAvailable")} checked={!isActive} />
                  <label htmlFor="noAvailable" className="color-999">{translate('setting.employee.employeePosition.unUsable')}</label>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="table-tooltip-box-footer">
          <button type='button' className="button-cancel mr-1" onClick={cancel}>{translate('setting.employee.employeePosition.cancel')}</button>
          <button type='button' className="button-blue" onClick={save}>{modePopup === MODE_POPUP.CREATE ? translate('setting.employee.employeePosition.btnAdd') : translate('setting.employee.employeePosition.btnEdit')}</button>
        </div>
      </div>
    </>
  )

}
export default EmployeesAdd;