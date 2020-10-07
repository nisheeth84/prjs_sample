import React, { useState, useEffect , useRef } from 'react';
import { translate } from 'react-jhipster';
import { MODE_POPUP } from 'app/modules/setting/constant';
import DialogDirtyCheckRestart from 'app/shared/layout/common/dialog-dirty-check-restart';
import _ from 'lodash'

interface IActivityFormatProps {
  activityFormatItem,
  changeStatusDialog,
  addactivity,
  langKey,
  modePopup: number,
  setDataChanged?
}

export const ActivityFormatAdd = (props: IActivityFormatProps) => {

  const [jaJp, setJaJp] = useState(true);
  const [enUS, setEnUS] = useState(true);
  const [zhCn, setZhCn] = useState(true);
  const [showValisMsg, setShowValisMsg] = useState(false);
  const [langsMore, setLangsMore] = useState(false);
  const [available, setAvailable] = useState(true);
  const [actiformat, setctiformat] = useState({});
  const [langs, setLangs] = useState({
    "ja_jp": "",
    "en_us": "",
    "zh_cn": ""
  });


  const { activityFormatItem, modePopup } = props;

  const buttonToogle = useRef(null);

  useEffect(() => {
    if (activityFormatItem) {
      setctiformat(_.cloneDeep(activityFormatItem));
      const langObj = JSON.parse(activityFormatItem.name);
      setLangs({ ...langObj });
      setAvailable(activityFormatItem.isAvailable);
    }
  }, [activityFormatItem]);

  const validateLang = (keyMap?, length?) => {
    if (length > 60) {
      switch (keyMap) {
        case "ja_jp":
          setJaJp(false)
          break;
        case "en_us":
          setEnUS(false)
          break;
        default:
          setZhCn(false)
          break;
      }
      return false;
    } else {
      switch (keyMap) {
        case "ja_jp":
          setJaJp(true)
          break;
        case "en_us":
          setEnUS(true)
          break;
        default:
          setZhCn(true)
          break;
      }
      return true;
    }
  }

  const handleChangeLangs = keyMap => event => {
    // let value = event.target.value;
    // if (value) {
    //   value = value.trim();
    // }
    // validateLang(keyMap, value.length)
    // if (langs[`${props.langKey}`].length > 0) {
    //   setShowValisMsg(false)
    // }
    setLangs({ ...langs, [keyMap]: event.target.value });
  }

  const handleChangeUse = keyMap => event => {
    if (keyMap === "isAvailable") {
      actiformat['isAvailable'] = true
      setAvailable(true);
    } else {
      actiformat['isAvailable'] = false
      setAvailable(false);
    }
  }

  const validatelangkey = () => {
    if (langs[`${props.langKey}`].length === 0) {
      setShowValisMsg(true)
      return false
    }
    setShowValisMsg(false)
    return true
  }

  /**
   * validateBeforeSave
   */
  const validateBeforeSave = () => {
    let _res = true;
    let _required = true;
    for (const [key, value] of Object.entries(langs)) {
      if (!validateLang(key, value ? value.trim().length : value)) {
        _res = false;
      }
      if (value && value.trim().length > 0) {
        _required = false;
      }
    }
    setShowValisMsg(_required);
    return _res && !_required;
  }

  /**
  *
  * @param _langs
  */
  const trimTextValue = (_langs) => {
    let _res = _.cloneDeep(langs);
    for (const [key, value] of Object.entries(langs)) {
      if (value) {
        _res = { ..._res, [key]: value.trim() }
      }
    }
    return _res;
  }

  const save = () => {
    if (!validateBeforeSave()) {
      return;
    }
    if (actiformat['isAvailable'] === undefined) {
      actiformat["isAvailable"] = available;
    }
    const tmpLangs = _.cloneDeep(langs);
    tmpLangs['ja_jp'] = langs['ja_jp'].trim();
    tmpLangs['en_us'] = langs['en_us'].trim();
    tmpLangs['zh_cn'] = langs['zh_cn'].trim();
    actiformat["name"] = JSON.stringify(trimTextValue(tmpLangs));
    props.addactivity(actiformat)
  }
  const checkLang = () => {
    if (activityFormatItem === null) {
      return JSON.stringify(langs) === JSON.stringify({
        "ja_jp": "",
        "en_us": "",
        "zh_cn": ""
      })
    } else {
      const responseName = JSON.parse(activityFormatItem.name)
      if (langs["ja_jp"] === responseName["ja_jp"] &&
        langs["en_us"] === responseName["en_us"] &&
        langs["zh_cn"] === responseName["zh_cn"]) {

        return true
      }
      return false
    }
  }
  const isChangeInput = () => {
    if (modePopup === MODE_POPUP.CREATE) {
      if (actiformat['isAvailable'] !== undefined && actiformat['isAvailable'] === false || checkLang() === false) {
        return false;
      }
      return true;
    } else {
      if (actiformat['isAvailable'] !== activityFormatItem.isAvailable || checkLang() === false) {
        return false;
      }
      return true;
    }
  }
  const executeDirtyCheck = async (action: () => void) => {
    const isChange = isChangeInput();
    if (!isChange) {
      await DialogDirtyCheckRestart({
        onLeave() {
          props.setDataChanged(false);
          action();
        }
      });
    } else {
      action();
    }
  }

  const cancel = () => {
    executeDirtyCheck(() => { props.changeStatusDialog() })
  }

  useEffect(() => {
    const isChange = isChangeInput();
    if (!isChange) {
      props.setDataChanged && props.setDataChanged(true);
    } else {
      props.setDataChanged && props.setDataChanged(false);
    }
  }, [langs, actiformat['isAvailable']]);

  return (
    <>
      <div className={`table-tooltip-box ${langsMore ? "w40" : "w30"}`}>
        <div className="table-tooltip-box-body">
          <div>
            <label className="title font-weight-bold">{translate(`${modePopup === MODE_POPUP.CREATE ? "setting.task.activityFormat.add.title" : "setting.task.activityFormat.add.titleEdit"}`)}</label>
          </div>
          <div>
            <label className="title mt-4 font-weight-bold">{translate('setting.task.activityFormat.add.lang')}</label>
          </div>

          <div className="d-flex font-size-12">
            <input type="text" className={`input-normal mt-2 ${langsMore && "w70"} ${(!jaJp || showValisMsg) && "setting-input-valid"}`}
              value={langs.ja_jp}
              onChange={handleChangeLangs('ja_jp')}
              placeholder={translate('setting.task.activityFormat.add.placeholder')} />
            {langsMore && <label className="text-input">{translate('setting.lang.jaJp')}</label>}
          </div>
          {(!jaJp && (enUS || zhCn)) && <p className="setting-input-valis-msg">{translate('messages.ERR_COM_0025', [60])}</p>}
          {
            langsMore &&
            (
              <div>
                <div className="d-flex font-size-12">
                  <input type="text" className={`input-normal mt-2 w70 ${(!enUS || showValisMsg) && "setting-input-valid"}`}
                    value={langs.en_us}
                    onChange={handleChangeLangs('en_us')}
                    placeholder={translate('setting.task.activityFormat.add.placeholder')} />
                  <label className="text-input">{translate('setting.lang.enUs')}</label>
                </div>
                {(!enUS && (jaJp || zhCn)) && <p className="setting-input-valis-msg">{translate('messages.ERR_COM_0025', [60])}</p>}
                <div className="d-flex font-size-12">
                  <input type="text" className={`input-normal mt-2 w70 ${(!zhCn || showValisMsg) && "setting-input-valid"}`}
                    value={langs.zh_cn}
                    onChange={handleChangeLangs('zh_cn')}
                    placeholder={translate('setting.task.activityFormat.add.placeholder')} />
                  <label className="text-input">{translate('setting.lang.zhCn')}</label>
                </div>
                {(!zhCn && (jaJp || enUS)) && <p className="setting-input-valis-msg">{translate('messages.ERR_COM_0025', [60])}</p>}
              </div>
            )
          }
          {showValisMsg && <p className="setting-input-valis-msg">{translate('messages.ERR_COM_0013')}</p>}
          {(!jaJp && !enUS && !zhCn) && <p className="setting-input-valis-msg">{translate('messages.ERR_COM_0025', [60])}</p>}
          <div>
            <button ref={buttonToogle} className={`setting-activity-choose-lang button-primary btn-padding mt-2 text-center ${langsMore ? "w70" : "w100"}`} onClick={()=>{buttonToogle.current.blur(); setLangsMore(!langsMore)}}>{!langsMore ? translate('setting.task.activityFormat.add.langMore') : translate('setting.task.activityFormat.add.hideMore')}</button>
          </div>
          <div>
            <label className="title font-weight-bold">{translate('setting.task.activityFormat.add.use')}</label>
            <div className={`wrap-check mt-2 ${langsMore ? "w70" : 'w100'}`}>
              <div className="mt-0">
                <p className="radio-item normal d-inline mr-3">
                  <input type="radio" id="isAvailable" name="checkAvailable" onChange={handleChangeUse("isAvailable")} checked={available} />
                  <label htmlFor="isAvailable" >{translate('setting.employee.employeePosition.usable')}</label>
                </p>
                <p className="radio-item normal d-inline">
                  <input type="radio" id="noAvailable" name="checkAvailable" onChange={handleChangeUse("noAvailable")} checked={!available} />
                  <label htmlFor="noAvailable" >{translate('setting.employee.employeePosition.unUsable')}</label>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="table-tooltip-box-footer">
          <a tabIndex={0} className="button-cancel mr-2 button-cancel-setting" onClick={cancel}>{translate('setting.task.activityFormat.add.cancel')}</a>
          <a tabIndex={0} className="button-blue button-small" onClick={save}>{activityFormatItem?.activityFormatId ? translate('setting.task.activityFormat.add.edit') : translate('setting.task.activityFormat.add.save')}</a>
        </div>
      </div>
    </>
  )

}
export default ActivityFormatAdd;
