import React, { useState, useEffect, useRef } from 'react';
import { translate } from 'react-jhipster';
import { MODE_POPUP } from 'app/modules/setting/constant';
import DialogDirtyCheckRestart from 'app/shared/layout/common/dialog-dirty-check-restart';
import _ from 'lodash';

interface IProductTypeAddProps {
  productTypeItem,
  productTypeChange?,
  dismissDialog?,
  langKey,
  modePopup: number
}

export const ProductTypeAdd = (props: IProductTypeAddProps) => {
  const [jaJp, setJaJp] = useState(true);
  const [enUS, setEnUS] = useState(true);
  const [zhCn, setZhCn] = useState(true);
  const [accountLangky, setAccountLangky] = useState(0);
  const [showValisMsg, setShowValisMsg] = useState(false);
  const [langsMore, setLangsMore] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [productType, setproductType] = useState({});
  const [langs, setLangs] = useState({
    "ja_jp": "",
    "en_us": "",
    "zh_cn": ""
  });

  const { productTypeItem, modePopup } = props;

  const buttonToogle = useRef(null);

  const LANGUAGES = {
    JA_JP: 'ja_jp',
    EN_US: 'en_us',
    ZH_CN: 'zh_cn',
  }
  const MAX_INPUT_LENGTH = 60;

  useEffect(() => {
    if (productTypeItem) {
      setproductType(productTypeItem);
      const langObj = JSON.parse(productTypeItem.productTypeName);
      setLangs({ ...langObj });
      setIsActive(productTypeItem.isAvailable)
    }
  }, [productTypeItem]);

  useEffect(() => {
    switch (props.langKey) {
      case 'en_us':
        setAccountLangky(1)
        break;
      case 'zh_cn':
        setAccountLangky(2)
        break;
      default:
        setAccountLangky(0)
        break;
    }
  }, [props.langKey]);

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
    if (langs['ja_jp'].trim().length === 0 && langs['en_us'].trim().length === 0 && langs['zh_cn'].trim().length === 0) {
      setShowValisMsg(true)
      return false
    }
    setShowValisMsg(false)
    return true
  }

  const checkLang = () => {
    if (productTypeItem === null) {
      return JSON.stringify(langs) === JSON.stringify({
        "ja_jp": "",
        "en_us": "",
        "zh_cn": ""
      })
    } else {
      const responseName = JSON.parse(productTypeItem.productTypeName)
      if (langs["ja_jp"].trim() === responseName["ja_jp"] &&
        langs["en_us"].trim() === responseName["en_us"] &&
        langs["zh_cn"].trim() === responseName["zh_cn"]) {

        return true
      }
      return false
    }
  }
  const isChangeInput = () => {
    if (modePopup === MODE_POPUP.CREATE) {
      if (productType['isAvailable'] !== undefined && productType['isAvailable'] === false || checkLang() === false) {
        return false;
      }
      return true;
    } else {
      if (productType['isAvailable'] !== productTypeItem.isAvailable || checkLang() === false) {
        return false;
      }
      return true;
    }
  }
  const validate = () => {
    const valiLangAcc = validatelangkey()
    const jp = validateLang(LANGUAGES.JA_JP, langs.ja_jp.length)
    const cn = validateLang(LANGUAGES.ZH_CN, langs.zh_cn.length)
    const us = validateLang(LANGUAGES.EN_US, langs.en_us.length)
    return valiLangAcc && us && cn && jp;
  }

  const save = () => {
    if (productType['isAvailable'] === undefined) {
      productType['isAvailable'] = true;
    }
    if (validate()) {
      const tmpLangs = _.cloneDeep(langs);
      tmpLangs['ja_jp'] = langs['ja_jp'].trim();
      tmpLangs['en_us'] = langs['en_us'].trim();
      tmpLangs['zh_cn'] = langs['zh_cn'].trim();
      productType['productTypeName'] = JSON.stringify(tmpLangs);
      props.productTypeChange(productType);
    }
  }

  const executeDirtyCheck = async (action: () => void) => {
    const isChange = isChangeInput();
    if (!isChange) {
      await DialogDirtyCheckRestart({ onLeave: action });
    } else {
      action();
    }
  }

  const cancel = () => {
    executeDirtyCheck(() => { props.dismissDialog() })
  }

  const handleChangeInput = keyMap => e => {
    switch (keyMap) {
      case "isAvailable":
        setIsActive(true);
        setproductType({ ...productType, ['isAvailable']: true });
        break;
      case "noAvailable":
        setIsActive(false);
        setproductType({ ...productType, ['isAvailable']: false });
        break;
      default:
        break;
    }
  }

  return (
    <>
      <div className="table-tooltip-box top-modal-add">
        <div className="table-tooltip-box-body">
          <div>
            <label className="title font-weight-bold">
              {modePopup === MODE_POPUP.CREATE ? translate('setting.product.titleCreatr') : translate('setting.product.titleAdd')}
            </label>
          </div>
          <div>
            <label className="title mt-4 font-weight-bold">
              {translate('setting.product.productTypeName')}
            </label>
          </div>
          <div className="d-flex">
            <input type="text" className={`input-normal mt-2 ${langsMore && "w70"} ${(!jaJp || showValisMsg) && "setting-input-valid"}`} placeholder={modePopup === MODE_POPUP.CREATE ? translate('setting.product.defaultPlaceholder') : translate('setting.product.defaultPlaceholderAdd')}
              value={langs.ja_jp} onChange={handleChangeLangs('ja_jp')} />
            {langsMore && <label className="text-input">{translate('setting.lang.jaJp')}</label>}
          </div>
          {!jaJp && <p className="setting-input-valis-msg">{translate('messages.ERR_COM_0025', [60])}</p>}
          {!langsMore && accountLangky === 0 && showValisMsg && <p className="setting-input-valis-msg">{translate('messages.ERR_COM_0013')}</p>}
          {langsMore && <>
            <div className="d-flex">
              <input type="text" className={`input-normal mt-2 w70 ${(!enUS || showValisMsg) && "setting-input-valid"}`} placeholder={modePopup === MODE_POPUP.CREATE ? translate('setting.product.defaultPlaceholder') : translate('setting.product.defaultPlaceholderAdd')}
                value={langs.en_us} onChange={handleChangeLangs('en_us')} />
              <label className="text-input">{translate('setting.lang.enUs')}</label>
            </div>
            {!enUS && <p className="setting-input-valis-msg">{translate('messages.ERR_COM_0025', [60])}</p>}
            <div className="d-flex">
              <input type="text" className={`input-normal mt-2 w70 ${(!zhCn || showValisMsg) && "setting-input-valid"}`} placeholder={modePopup === MODE_POPUP.CREATE ? translate('setting.product.defaultPlaceholder') : translate('setting.product.defaultPlaceholderAdd')}
                value={langs.zh_cn} onChange={handleChangeLangs('zh_cn')} />
              <label className="text-input">{translate('setting.lang.zhCn')}</label>
            </div>
            {!zhCn && <p className="setting-input-valis-msg">{translate('messages.ERR_COM_0025', [60])}</p>}
          </>}
          {langsMore && showValisMsg && <p className="setting-input-valis-msg">{translate('messages.ERR_COM_0013')}</p>}
          <div>            
            <button ref={buttonToogle} type='button' className={`button-primary w70 btn-padding mt-2 text-center color-000  ${langsMore ? "w70" :'w100'} `} onClick={()=>{buttonToogle.current.blur(); toggleInputLang()}}>{langsMore ? translate('setting.employee.employeePosition.toggleOtherLanguages') : translate('setting.employee.employeePosition.toggleOtherLanguagesEdit')}</button>
            {/* <a className="button-primary btn-padding w100 mt-2 text-center color-000" onClick={toggleInputLang}>{translate('setting.employee.employeePosition.toggleOtherLanguages')}</a> */}
          </div>
          <div className="mt-3 font-size-14">
            <label className="title font-weight-bold">
              {translate('setting.employee.employeePosition.register')}
            </label>
            <div className={`wrap-check mt-2 ${langsMore ? "w70" :'w100'}`}>
              <div className="mt-0">
                <p className="radio-item normal d-inline mr-3">
                  <input type="radio" id="isAvailable" name="checkAvailable" onChange={handleChangeInput("isAvailable")} checked={isActive} />
                  <label htmlFor="isAvailable" >{translate('setting.employee.employeePosition.usable')}</label>
                </p>
                <p className="radio-item normal d-inline">
                  <input type="radio" id="noAvailable" name="checkAvailable" onChange={handleChangeInput("noAvailable")} checked={!isActive} />
                  <label htmlFor="noAvailable" >{translate('setting.employee.employeePosition.unUsable')}</label>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="table-tooltip-box-footer">
          <button type='button' className="button-cancel mr-2 button-cancel-setting" onClick={cancel}> {translate('setting.employee.employeePosition.cancel')}</button>
          <button type='button' className="button-blue" onClick={save}> {translate('setting.employee.employeePosition.btnAdd')}</button>
        </div>
      </div>
    </>
  )

}
export default ProductTypeAdd;