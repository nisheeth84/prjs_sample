import React, { useState, useEffect, useRef } from 'react';
import { translate } from 'react-jhipster';
import { MODE_POPUP } from 'app/modules/setting/constant';
import DialogDirtyCheck from 'app/shared/layout/common/dialog-dirty-check';
import _ from 'lodash';

interface IProductTradeAddProps {
  productTradeItem,
  productTradeChange,
  dismissDialog,
  langKey,
  modePopup: number
}

export const ProductTradeAdd = (props: IProductTradeAddProps) => {

  const buttonToggle = useRef(null);

  const [langsMore, setLangsMore] = useState(false);
  const [jaJp, setJaJp] = useState(true);
  const [enUS, setEnUS] = useState(true);
  const [zhCn, setZhCn] = useState(true);
  const [accountLangky, setAccountLangky] = useState(0);
  const [showValisMsg, setShowValisMsg] = useState(false);
  const [productTrade, setProductTrade] = useState({});
  const [isActive, setIsActive] = useState(true);
  const [langs, setLangs] = useState({
    "ja_jp": "",
    "en_us": "",
    "zh_cn": ""
  });

  const { productTradeItem, modePopup } = props;

  const LANGUAGES = {
    JA_JP: 'ja_jp',
    EN_US: 'en_us',
    ZH_CN: 'zh_cn',
  }
  const MAX_INPUT_LENGTH = 60;

  useEffect(() => {
    if (productTradeItem) {
      setProductTrade(productTradeItem);
      const langObj = JSON.parse(productTradeItem.progressName);
      // setLangs({ ...langObj });
      setLangs(_.cloneDeep(langObj));
      setIsActive(productTradeItem.isAvailable)
    }

  }, [productTradeItem]);

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

  const validateLang = (keyMap?, length?) => {
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

  const handleChangeInput = keyMap => e => {
    switch (keyMap) {
      case "isEnd":
        setProductTrade({ ...productTrade, [keyMap]: e.target.checked });
        break;
      case "bookedOrderTypeNo":
        setProductTrade({ ...productTrade, ['bookedOrderType']: 0 });
        break;
      case "bookedOrderTypeReceive":
        setProductTrade({ ...productTrade, ['bookedOrderType']: 1 });
        break;
      case "bookedOrderTypeLost":
        setProductTrade({ ...productTrade, ['bookedOrderType']: 2 });
        break;
      case "bookedOrderTypePending":
        setProductTrade({ ...productTrade, ['bookedOrderType']: 3 });
        break;
      case "isAvailable":
        setIsActive(true);
        setProductTrade({ ...productTrade, ['isAvailable']: true });
        break;
      case "noAvailable":
        setIsActive(false);
        setProductTrade({ ...productTrade, ['isAvailable']: false });
        break;
      default:
        break;
    }
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
    if (productTradeItem === null) {
      return JSON.stringify(langs) === JSON.stringify({
        "ja_jp": "",
        "en_us": "",
        "zh_cn": ""
      })
    } else {
      const responseName = JSON.parse(productTradeItem.progressName)
      if (langs["ja_jp"] === responseName["ja_jp"] &&
        langs["en_us"] === responseName["en_us"] &&
        langs["zh_cn"] === responseName["zh_cn"]) {

        return true
      }
      return false
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
    if (productTrade !== null && productTrade['isAvailable'] === undefined) {
      productTrade['isAvailable'] = true;
    }
    if (productTrade !== null && productTrade['bookedOrderType'] === undefined) {
      productTrade['bookedOrderType'] = 0;
    }
    if (productTrade !== null && productTrade['isEnd'] === undefined) {
      productTrade['isEnd'] = false;
    }

    if (validate()) {
      const tmpLangs = _.cloneDeep(langs);
      tmpLangs['ja_jp'] = langs['ja_jp'].trim();
      tmpLangs['en_us'] = langs['en_us'].trim();
      tmpLangs['zh_cn'] = langs['zh_cn'].trim();
      productTrade['progressName'] = JSON.stringify(tmpLangs);
      props.productTradeChange(productTrade);
    }
  }
  const isChangeInput = () => {
    if (modePopup === MODE_POPUP.CREATE) {
      if (productTrade['bookedOrderType'] !== undefined ||
        productTrade['isAvailable'] !== undefined ||
        checkLang() === false) {
        return false;
      }
    } else {
      if (productTrade['bookedOrderType'] !== productTradeItem.bookedOrderType ||
        productTrade['isAvailable'] !== productTradeItem.isAvailable ||
        checkLang() === false) {
        return false;
      }
    }
    return true;
  }

  const executeDirtyCheck = async (action: () => void) => {
    const isChange = isChangeInput();
    if (!isChange) {
      await DialogDirtyCheck({ onLeave: action });
    } else {
      action();
    }
  }

  const cancel = () => {
    executeDirtyCheck(() => { props.dismissDialog() })
  }

  return (
    <>
      <div className="table-tooltip-box w30 remove-max-height">
        <div className="table-tooltip-box-body">
          <div>
            <label className="title font-weight-bold">{
              modePopup === MODE_POPUP.CREATE ?
                translate('setting.product.edit.titleCreact') :
                translate('setting.product.edit.titleEdit')}</label>
          </div>
          <div>
            <label className="title mt-4 font-weight-bold">{translate('setting.product.edit.progressName')}</label>
          </div>
          <div className="d-flex font-size-12">
            <input type="text" className={`input-normal mt-2 ${langsMore && "w70"} ${(!jaJp || showValisMsg) && "setting-input-valid"}`} value={langs.ja_jp} onChange={handleChangeLangs('ja_jp')} placeholder={translate('setting.product.edit.placeholder')} />
            {langsMore && <label className="text-input">{translate('setting.lang.jaJp')}</label>}
          </div>
          {!jaJp && <p className="setting-input-valis-msg">{translate('messages.ERR_COM_0025', [60])}</p>}
          {!langsMore && accountLangky === 0 && showValisMsg && <p className="setting-input-valis-msg">{translate('messages.ERR_COM_0013')}</p>}
          {
            langsMore &&
            (
              <div>
                <div className="d-flex font-size-12">
                  <input type="text" className={`input-normal mt-2 w70 ${(!enUS || showValisMsg) && "setting-input-valid"}`} value={langs.en_us} onChange={handleChangeLangs('en_us')} placeholder={translate('setting.product.edit.placeholder')} />
                  <label className="text-input">{translate('setting.lang.enUs')}</label>
                </div>
                {!enUS && <p className="setting-input-valis-msg">{translate('messages.ERR_COM_0025', [60])}</p>}
                <div className="d-flex font-size-12">
                  <input type="text" className={`input-normal mt-2 w70 ${(!zhCn || showValisMsg) && "setting-input-valid"}`} value={langs.zh_cn} onChange={handleChangeLangs('zh_cn')} placeholder={translate('setting.product.edit.placeholder')} />
                  <label className="text-input">{translate('setting.lang.zhCn')}</label>
                </div>
                {!zhCn && <p className="setting-input-valis-msg">{translate('messages.ERR_COM_0025', [60])}</p>}
              </div>
            )
          }
          {langsMore && showValisMsg && <p className="setting-input-valis-msg">{translate('messages.ERR_COM_0013')}</p>}
          <div>
            <button ref={buttonToggle} type="button" className={`button-primary btn-padding mt-2 text-center w100`} onClick={() => {buttonToggle.current.blur(); setLangsMore(!langsMore)}}>{ langsMore ? translate('setting.employee.employeePosition.toggleOtherLanguages') : translate('setting.sales.productTrade.add.langMore')}</button>
          </div>
          <div className={`mt-3 font-size-12`}>
            <label className="title font-weight-bold">{translate('setting.sales.productTrade.add.bookedOrder.title')}</label>
            <div className="wrap-check">
              <div className="mt-0">
                <p className="radio-item normal d-inline mr-3">
                  <input type="radio" id="bookedOrderTypeNo" name="bookedOrderType" onChange={handleChangeInput('bookedOrderTypeNo')} checked={productTrade['bookedOrderType'] ? productTrade['bookedOrderType'] === 0 : true} />
                  <label htmlFor="bookedOrderTypeNo">{translate('setting.sales.productTrade.add.bookedOrder.no')}</label>
                </p>
                <p className="radio-item normal d-inline">
                  <input type="radio" id="bookedOrderTypeReceive" name="bookedOrderType" onChange={handleChangeInput('bookedOrderTypeReceive')} checked={productTrade['bookedOrderType'] && productTrade['bookedOrderType'] === 1} />
                  <label htmlFor="bookedOrderTypeReceive">{translate('setting.sales.productTrade.add.bookedOrder.receive')}</label>
                </p>
              </div>
              <div className="mt-2">
                <p className="radio-item normal d-inline mr-3">
                  <input type="radio" id="bookedOrderTypeLost" name="bookedOrderType" onChange={handleChangeInput('bookedOrderTypeLost')} checked={productTrade['bookedOrderType'] && productTrade['bookedOrderType'] === 2} />
                  <label htmlFor="bookedOrderTypeLost">{translate('setting.sales.productTrade.add.bookedOrder.lost')}</label>
                </p>
                <p className="radio-item normal d-inline">
                  <input type="radio" id="bookedOrderTypePending" name="bookedOrderType" onChange={handleChangeInput('bookedOrderTypePending')} checked={productTrade['bookedOrderType'] && productTrade['bookedOrderType'] === 3} />
                  <label htmlFor="bookedOrderTypePending">{translate('setting.sales.productTrade.add.bookedOrder.pending')}</label>
                </p>
              </div>
            </div>
          </div>
          <div className={`mt-3 font-size-12 `}>
            <label className="title font-weight-bold">{translate('setting.sales.productTrade.add.end.title')}</label>
            <div className="wrap-check">
              <p className="check-box-item mb-0 p-0">
                <label className="icon-check">
                  <input type="checkbox" checked={productTrade && productTrade['isEnd']} onChange={handleChangeInput('isEnd')} /><i /> {translate('setting.sales.productTrade.add.end.value')}
                </label>
              </p>
            </div>
          </div>
          <div className={`mt-3 font-size-12 `}>
            <label className="title font-weight-bold">{translate('setting.sales.productTrade.add.available.title')}</label>
            <div className="wrap-check">
              <div className="mt-0">
                <p className="radio-item normal d-inline mr-3">
                  <input type="radio" id="isAvailable" name="isAvailable" onChange={handleChangeInput('isAvailable')} checked={isActive} />
                  <label htmlFor="isAvailable">{translate('setting.sales.productTrade.add.available.active')}</label>
                </p>
                <p className="radio-item normal d-inline">
                  <input type="radio" id="noAvailable" name="isAvailable" onChange={handleChangeInput('noAvailable')} checked={!isActive} />
                  <label htmlFor="noAvailable">{translate('setting.sales.productTrade.add.available.noActive')}</label>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="table-tooltip-box-footer">
          {/* <input className="button-cancel button-small mr-1" value={translate('setting.task.activityFormat.add.cancel')} type="button"/>
          <a className="button-blue button-small" onClick={save}>{translate('setting.task.activityFormat.add.save')}</a> */}
          <button type="button" className="button-cancel mr-2 button-cancel-setting" onClick={cancel}>{translate('setting.task.activityFormat.add.cancel')}</button>
          <button  type="button"  className="button-blue button-small" onClick={save}>{productTradeItem ? translate('setting.employee.employeePosition.btnEdit') : translate('setting.task.activityFormat.add.save')}</button>
        </div>
      </div>
    </>
  )
}
export default ProductTradeAdd;