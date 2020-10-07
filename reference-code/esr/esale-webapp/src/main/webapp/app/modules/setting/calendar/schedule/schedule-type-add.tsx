import React, { useState, useEffect } from 'react';
import { translate } from 'react-jhipster';
import _ from 'lodash';
import DialogDirtyCheckReset from 'app/shared/layout/common/dialog-dirty-check-restart';

import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import DropFileCustom from './drop-file';

const enum TypeIcon {
  Person = 1,
  User = 2,
  Phone = 3,
  Bag = 4,
  RecycleBin = 5,
  Bell = 6,
  Text = 7,
  Other = 0
}

interface IScheduleType {
  scheduleItem,
  dataChange,
  dismissDialog
  langKey?,
  changeFileData,
  dataChangedCalendar
}

export const SchedulesTypeAdd = (props: IScheduleType) => {

  const { scheduleItem } = props;
  const [langsMore, setLangsMore] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [scheduleTypeIcons, setScheduleTypeIcons] = useState([
    { iconType: TypeIcon.Person, iconPath: "common/calendar/ic-calendar-person1.svg", isCheck: true },
    { iconType: TypeIcon.User, iconPath: "common/calendar/ic-calendar-user1.svg", isCheck: false },
    { iconType: TypeIcon.Phone, iconPath: "common/calendar/ic-calendar-phone.svg", isCheck: false },
    { iconType: TypeIcon.Bag, iconPath: "common/calendar/ic-calendar-bag.svg", isCheck: false },
    { iconType: TypeIcon.RecycleBin, iconPath: "common/calendar/ic-calendar-recyclebin.svg", isCheck: false },
    { iconType: TypeIcon.Bell, iconPath: "common/calendar/ic-calendar-bell.svg", isCheck: false },
    { iconType: TypeIcon.Text, iconPath: "common/calendar/ic-calendar-text.svg", isCheck: false },
    { iconType: TypeIcon.Other, iconPath: "", isCheck: false }
  ]);
  const [isUploadIcon, setIsUploadIcon] = useState(false);
  const [langs, setLangs] = useState({
    "ja_jp": "",
    "en_us": "",
    "zh_cn": ""
  });
  const [jaJp, setJaJp] = useState(true);
  const [enUS, setEnUS] = useState(true);
  const [zhCn, setZhCn] = useState(true);
  const [showValisMsg, setShowValisMsg] = useState(false);

  // File
  const [scheduleItemId, setScheduleItemId] = useState(0);
  const [fileDTOs, setFileDTOs] = useState(null);
  const [files, setFiles] = useState(null);
  const [titleLabel, setTitleLabel] = useState(true);
  const [checkMessage, setCheckMessage] = useState(false);
  const [checkData, setCheckData] = useState(false);
  const [isRemoveLinkIconServer, setIsRemoveLinkIconServer] = useState(false)
  const initFieldValue = (fieldValue) => {
    let filtered = [];
    if (fieldValue) {
      [fieldValue].forEach(file => {
        if (file) {
          file['status'] = 0;
          if (file['iconName'] !== undefined) {
            file['name'] = file['iconName'];
          }
          if (file['iconPath'] !== undefined) {
            file['file_path'] = file['iconPath'];
            file['file_url'] = file['iconPath'];
          }
          filtered.push(file);
        }
      })
      filtered = filtered.filter(fVal => !_.isNil(fVal['file_path']) && fVal['file_path'].length > 0);
    }
  }

  const initialize = () => {
    if (props.scheduleItem) {
      setCheckData(true)
      setTitleLabel(false)
      initFieldValue(props.scheduleItem);

    }
  }

  useEffect(() => {
    if (files || fileDTOs) {
      setCheckMessage(false)
    }
  }, [files, fileDTOs])

  useEffect(() => {
    initialize();
  }, []);

  const FILE_FOMATS = {
    DOC: ['doc', 'docx'],
    IMG: ['jpg', 'png', 'gif', 'bmp', 'svg'],
    PDF: ['pdf'],
    PPT: ['ppt'],
    XLS: ['xls', 'xlsx']
  };

  const handleRemoveFile = () => {
    setFiles(null);
    setFileDTOs(null);
    setIsRemoveLinkIconServer(true)
    props.changeFileData(null, scheduleItem ? scheduleItem.scheduleTypeId : scheduleItemId);
  };

  useEffect(() => {
    if (scheduleItem) {
      const langObj = JSON.parse(scheduleItem.scheduleTypeName);
      setLangs({ ...langObj });
      const icons = _.map(scheduleTypeIcons, icon => {
        if (icon.iconType === scheduleItem.iconType) {
          icon.isCheck = true;
          setIsUploadIcon(true)
        } else {
          icon.isCheck = false;
          setIsUploadIcon(false)
        }
        return icon;
      });
      setScheduleTypeIcons([...icons]);
      setIsActive(scheduleItem.isAvailable);
    } else {
      setScheduleItemId(0 - Math.floor(Math.random() * Math.floor(1000000)));
    }
  }, [scheduleItem]);

  const changeIconOption = (item) => {
    setCheckMessage(false)
    if (item.iconType === TypeIcon.Other)
      setIsUploadIcon(true);
    else
      setIsUploadIcon(false);

    const iconArrs = [];
    scheduleTypeIcons.forEach((obj) => {
      if (obj.iconType === item.iconType) {
        obj.isCheck = true;
      } else {
        obj.isCheck = false;
      }
      iconArrs.push(obj);
    })
    setScheduleTypeIcons([...iconArrs]);
    props.dataChangedCalendar(true)
  }

  const handleChangeUse = keyMap => event => {
    switch (keyMap) {
      case "isAvailable":
        setIsActive(true);
        props.dataChangedCalendar(true)
        break;
      case "noAvailable":
        setIsActive(false);
        props.dataChangedCalendar(true)
        break;
      default:
        props.dataChangedCalendar(true)
        break;
    }
  }

  const handleChangeLangs = keyMap => event => {
    setLangs({ ...langs, [keyMap]: event.target.value });
    props.dataChangedCalendar(true)
  }

  const onFileChange = event => {
    setFileDTOs(event)
    setFiles(event)
    props.dataChangedCalendar(true)
    props.changeFileData(event, scheduleItem ? scheduleItem.scheduleTypeId : scheduleItemId)
    // }
  }

  const checkLengthLang = (lang, length) => {
    if (length > 60) {
      switch (lang) {
        case "ja_jp":
          setJaJp(false)
          return false
        case "en_us":
          setEnUS(false)
          return false
        default:
          setZhCn(false)
          return false
      }
    } else {
      switch (lang) {
        case "ja_jp":
          setJaJp(true)
          return true
        case "en_us":
          setEnUS(true)
          return true
        default:
          setZhCn(true)
          return true
      }
    }
  }

  const valiLangAccount = () => {
    if (langs['ja_jp'].trim().length === 0 && langs['en_us'].trim().length === 0 && langs['zh_cn'].trim().length === 0) {
      langs['ja_jp'] = langs['ja_jp'].trim()
      langs['en_us'] = langs['en_us'].trim()
      langs['zh_cn'] = langs['zh_cn'].trim()
      setLangs(_.cloneDeep(langs))
      setShowValisMsg(true)
      return false
    } else {
      setShowValisMsg(false)
      return true
    }
  }

  const validate = (langsParam) => {
    const valiLangAcc = valiLangAccount()
    const jp = checkLengthLang('ja_jp', langsParam.ja_jp.length)
    const cn = checkLengthLang('zh_cn', langsParam.zh_cn.length)
    const us = checkLengthLang('en_us', langsParam.en_us.length)
    if (valiLangAcc && jp && cn && us) {
      return true
    } else {
      return false
    }
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
    langs["ja_jp"] = langs["ja_jp"] ? langs["ja_jp"].trim() : ""
    langs["en_us"] = langs["en_us"] ? langs["en_us"].trim() : ""
    langs["zh_cn"] = langs["zh_cn"] ? langs["zh_cn"].trim() : ""
    const typeIcon = _.find(scheduleTypeIcons, _.matchesProperty('isCheck', true));
    // setLangs(langs)
    if (validate(langs)) {
      const scheduleType = {
        scheduleTypeId: scheduleItem ? scheduleItem.scheduleTypeId : scheduleItemId,
        scheduleTypeName: JSON.stringify(trimTextValue(langs)),
        iconType: typeIcon.iconType,
        iconName: typeIcon.iconType !== 0 ? typeIcon.iconPath.split("/").pop() : (fileDTOs && fileDTOs.name ? fileDTOs.name: (scheduleItem && scheduleItem.scheduleTypeId ? scheduleItem.iconName :  null)),
        iconData: typeIcon.iconType === 0 ? typeIcon.iconPath : null,
        isAvailable: isActive,
        displayOrder: scheduleItem ? scheduleItem.displayOrder : null,
        updatedDate: scheduleItem ? scheduleItem.updatedDate : null,
        files: fileDTOs || files
      }
      if (typeIcon.iconType === TypeIcon.Other) {
        if (isUploadIcon && !files && !fileDTOs && isRemoveLinkIconServer) {
          setCheckMessage(true)
        } else {
          
          const newFile = (fileDTOs && !fileDTOs.files) ? URL.createObjectURL(fileDTOs) : ""
          if (newFile) {
            scheduleType['iconPath'] = newFile
          } else {
            scheduleType['iconPath'] = scheduleItem && scheduleItem.iconPath
          }
          props.dataChange(scheduleType);
        }
      } else {
        props.dataChange(scheduleType)
      }
    } else {
      if (typeIcon.iconType === TypeIcon.Other && !files) {
        setCheckMessage(true)
      }
    }
  }

  const checkLang = () => {
    if (scheduleItem === null) {
      return JSON.stringify(langs) === JSON.stringify({
        "ja_jp": "",
        "en_us": "",
        "zh_cn": ""
      })
    } else {
      const responseName = JSON.parse(scheduleItem.scheduleTypeName)
      if (langs["ja_jp"] === responseName["ja_jp"] &&
        langs["en_us"] === responseName["en_us"] &&
        langs["zh_cn"] === responseName["zh_cn"]) {

        return true
      }
      return false
    }
  }
  const checkIcons = () => {
    if (scheduleItem === null) {
      if (scheduleTypeIcons[0].isCheck !== true) {
        return false;
      }
      return true;
    } else {
      const typeIcon = _.find(scheduleTypeIcons, _.matchesProperty('isCheck', true));
      if (typeIcon && typeIcon.iconType !== scheduleItem.iconType) {
        return false;
      }
      return true;
    }
  }
  const isChangeInput = () => {
    if (scheduleItem === null) {
      if (isActive === false || !checkIcons() || checkLang() === false) {
        return false;
      }
      return true;
    } else if (isActive !== scheduleItem.isAvailable || !checkIcons() || checkLang() === false || isRemoveLinkIconServer && scheduleItem.iconPath) {
      return false;
    }
    return true;
  }

  const executeDirtyCheck = async (action: () => void) => {
    const isChange = isChangeInput();
    if (!isChange) {
      // await DialogDirtyCheck({ onLeave: action });
      await DialogDirtyCheckReset({ onLeave: action });
      props.dataChangedCalendar(false)
    } else {
      action();
    }
  }

  const cancel = () => {
    executeDirtyCheck(() => { props.dismissDialog(); 
      setIsRemoveLinkIconServer(false) })
  }
  

  const renderFileAndRadio = () => {
    return (
      <>
        <div className="select-language">
          <a className="setting-schedule-choose-lang button-primary btn-padding w100 mt-2 text-center font-size-12" onClick={() => setLangsMore(!langsMore)}>{langsMore ? translate('setting.calendar.scheduleType.new.hideMore') : translate('setting.calendar.scheduleType.new.langOther')}</a>
        </div>
        <div className="mt-2 font-size-12">
          <label className="title font-weight-bold">{translate('setting.calendar.scheduleType.new.icon')}</label>
          <div className="wrap-check select-image-area">
            <div className="wrap-check-radio">
              {scheduleTypeIcons.length > 0 && scheduleTypeIcons.map((item, index) => (
                <p className="radio-item" key={index}>
                  <input type="radio" id={'radio-' + index + 2} value={item.iconType} name='name-radio1' checked={item.isCheck} onClick={() => changeIconOption(item)} />
                  <label htmlFor={'radio-' + index + 2}>
                    {
                      item.iconPath ? <img className="icon-calendar-person" src={'../../../content/images/' + item.iconPath} /> : translate('setting.calendar.scheduleType.new.uploadFile')
                    }
                  </label>
                </p>
              ))}
            </div>
            <div className="form-group magin-top-15 schedule-setting">
              <DndProvider backend={Backend}>
                <DropFileCustom onFileChange={onFileChange}
                  deleteFile={handleRemoveFile}
                  isDisable={!isUploadIcon}
                  isFalse={checkMessage}
                  fileDefault={scheduleItem && scheduleItem.files}
                  iconImage={
                    {
                      iconName: scheduleItem && scheduleItem.iconName,
                      iconPath: scheduleItem && scheduleItem.iconPath
                    }
                  }
                />
              </DndProvider>
              {checkMessage && <p className="setting-input-valis-msg">{translate('setting.calendar.scheduleType.messageFile')}</p>}
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="table-tooltip-box table-tooltip-box-custome max-height-none">
        <div className="table-tooltip-box-body">
          <div>
            {
              titleLabel ? <label className="title font-weight-bold font-size-14">{translate('setting.calendar.scheduleType.new.title')}</label> :
                <label className="title font-weight-bold font-size-14">{translate('setting.calendar.scheduleType.new.titleEdit')}</label>
            }

          </div>
          <div>
            <label className="title mt-3 font-weight-bold font-size-12">
              {translate('setting.calendar.scheduleType.new.lang')}
            </label>
          </div>

          <div className="d-flex font-size-12">
            <input type="text"
              className={`input-normal mt-2 w70 ${!langsMore && "w100"}  ${showValisMsg && !langs["ja_jp"] && !langs["en_us"] && !langs["zh_cn"] ? "setting-input-valid" : ""}`}
              value={langs.ja_jp}
              onChange={handleChangeLangs('ja_jp')}
              placeholder={translate('setting.calendar.scheduleType.new.placeholder')} />
            {langsMore && <label className="text-input">{translate('setting.lang.jaJp')}</label>}
          </div>
          {
            langsMore &&
            (
              <div>
                <div className="d-flex font-size-12">
                  <input type="text" className={`input-normal mt-2 w70 ${showValisMsg && !langs["ja_jp"] && !langs["en_us"] && !langs["zh_cn"] ? "setting-input-valid" : ""}`}
                    value={langs.en_us} onChange={handleChangeLangs('en_us')}
                    placeholder={translate('setting.calendar.scheduleType.new.placeholder')} />
                  <label className="text-input">{translate('setting.lang.enUs')}</label>
                </div>
                <div className="d-flex font-size-12">
                  <input type="text" className={`input-normal mt-2 w70 ${showValisMsg && !langs["ja_jp"] && !langs["en_us"] && !langs["zh_cn"] ? "setting-input-valid" : ""}`}
                    value={langs.zh_cn} onChange={handleChangeLangs('zh_cn')}
                    placeholder={translate('setting.calendar.scheduleType.new.placeholder')} />
                  <label className="text-input">{translate('setting.lang.zhCn')}</label>
                </div>

              </div>
            )
          }
          {showValisMsg && !langs["ja_jp"] && !langs["en_us"] && !langs["zh_cn"] && <p className="setting-input-valis-msg">{translate('messages.ERR_COM_0013')}</p>}
          {renderFileAndRadio()}

          <div className="mt-3 font-size-12">
            <label className="title font-weight-bold">{translate('setting.calendar.scheduleType.new.active')}</label>
            <div className="wrap-check w100 mt-2">
              <div className="mt-0">
                <p className="radio-item normal d-inline mr-3">
                  <input type="radio" id="radio13" name="radio-group3" onChange={handleChangeUse("isAvailable")} checked={isActive} />
                  <label htmlFor="radio13" className="color-999">{translate('setting.calendar.scheduleType.new.isActive')}</label>
                </p>
                <p className="radio-item normal d-inline">
                  <input type="radio" id="radio14" name="radio-group3" onChange={handleChangeUse("noAvailable")} checked={!isActive} />
                  <label htmlFor="radio14" className="color-999">{translate('setting.calendar.scheduleType.new.noActive')}</label>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="table-tooltip-box-footer">
          <a tabIndex={0} className="button-cancel mr-2 button-cancel-setting" onClick={cancel}>{translate('setting.calendar.scheduleType.new.cancel')}</a>
          <a tabIndex={0} className="button-blue"  onClick={save}>
            {titleLabel ? <>{translate('setting.calendar.scheduleType.new.save')}</> : <>{translate('setting.calendar.scheduleType.new.edit')}</>
            }

          </a>
        </div>
      </div>
    </>
  )
}
export default SchedulesTypeAdd;
