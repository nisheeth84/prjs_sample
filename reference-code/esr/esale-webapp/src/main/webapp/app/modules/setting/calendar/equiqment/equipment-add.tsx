import React, { useState, useEffect, useRef } from 'react';
import { translate } from 'react-jhipster';
import _ from 'lodash';
import { getJsonBName } from "app/modules/setting/utils";
import { LANG_KEY_ACCAUNT, CALENDAR_TYPE, MODE_POPUP } from "app/modules/setting/constant";
// import DialogDirtyCheckPopup from 'app/shared/layout/common/dialog-dirty-check-popup';
import DialogDirtyCheckReset from 'app/shared/layout/common/dialog-dirty-check-restart';
import equipmentType from './equipment-type';

interface IEquipmentAddProps {
    dataEquiqmentChange,
    equiqmensItem,
    modePopup,
    equiqmensType?
    langKey?
    toggleOpenPopup
    modeEqupmet?
    equiqmensTypeItem?
    dataTypeChange?
    equipmentTypeId?
    dataChangedCalendar
}
export const EquipmentAdd = (props: IEquipmentAddProps) => {

    const [langsMore, setLangsMore] = useState(false);
    const [equiqmens, setEquiqmens] = useState({});
    const [isvailable, setIsvailable] = useState(true);
    const [validateType, setValidateType] = useState(false);
    const [typeName, setTypeName] = useState("");
    const [showOption, setShowOption] = useState(false);
    const [jaJp, setJaJp] = useState(true);
    const [enUS, setEnUS] = useState(true);
    const [zhCn, setZhCn] = useState(true);
    const [showValisMsg, setShowValisMsg] = useState(false);
    const [accountLangky, setAccountLangky] = useState(0);
    const [langs, setLangs] = useState({
        "ja_jp": "",
        "en_us": "",
        "zh_cn": ""
    });
    const [langDraft, setLangDraft] = useState({
        "ja_jp": "",
        "en_us": "",
        "zh_cn": ""
    });
    const wrapperRef = useRef(null);


    useEffect(() => {
        if (props.equiqmensItem !== null || props.equiqmensTypeItem !== null) {
            setEquiqmens(props.equiqmensItem !== null ? props.equiqmensItem : props.equiqmensTypeItem)
            const langObj = JSON.parse(props.equiqmensItem !== null ? props.equiqmensItem.equipmentName : props.equiqmensTypeItem.equipmentTypeName);
            setLangs({ ...langObj });
            setIsvailable(props.equiqmensItem !== null && props.equiqmensItem.isAvailable);
            const equiqmensType = props.equiqmensItem !== null && props.equiqmensType.find(e => e.equipmentTypeId === props.equiqmensItem['equipmentTypeId']);
            setTypeName(props.equiqmensItem !== null && getJsonBName(equiqmensType.equipmentTypeName))
        } else {
            setTypeName(translate('setting.calendar.equiqment.tblType'))
        }
    }, [props.equiqmensItem, props.equiqmensTypeItem]);

    useEffect(() => {
        if (props.modePopup === MODE_POPUP.EDIT && props.modeEqupmet === CALENDAR_TYPE.EQUIPMENT_TYPE) {
            setLangDraft(props.equiqmensTypeItem && typeof props.equiqmensTypeItem.equipmentTypeName === 'string' && JSON.parse(props.equiqmensTypeItem.equipmentTypeName))
        }
    }, [props.modePopup])

    useEffect(() => {
        switch (props.langKey) {
            case 'en_us':
                setAccountLangky(LANG_KEY_ACCAUNT.US)
                break;
            case 'zh_cn':
                setAccountLangky(LANG_KEY_ACCAUNT.ZH)
                break;
            default:
                setAccountLangky(LANG_KEY_ACCAUNT.JP)
                break;
        }
    }, [props.langKey]);


    const handleChangeLangs = keyMap => event => {
        setLangs({ ...langs, [keyMap]: event.target.value });
        props.dataChangedCalendar(true)
    }
    const handleChangeInput = keyMap => e => {
        switch (keyMap) {
            case "isAvailable":
                setIsvailable(true);
                setEquiqmens({ ...equiqmens, ['isAvailable']: true });
                props.dataChangedCalendar(true)
                break;
            case "noAvailable":
                setIsvailable(false);
                setEquiqmens({ ...equiqmens, ['isAvailable']: false });
                props.dataChangedCalendar(true)
                break;
            default:
                break;
        }
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


    const valiType = () => {
        if (equiqmens['equipmentTypeId'] !== undefined) {
            setValidateType(false)
            return true
        } else {
            setValidateType(true)
            return false
        }
    }

    const validate = () => {
        const valiLangAcc = valiLangAccount()
        const validateEqType = valiType()
        const jp = checkLengthLang('ja_jp', langs.ja_jp.length)
        const cn = checkLengthLang('zh_cn', langs.zh_cn.length)
        const us = checkLengthLang('en_us', langs.en_us.length)
        if (props.modeEqupmet === CALENDAR_TYPE.EQUIPMENT && valiLangAcc && validateEqType && jp && cn && us) {
            return true
        } else if (props.modeEqupmet === CALENDAR_TYPE.EQUIPMENT_TYPE && valiLangAcc && jp && cn && us) {
            return true
        } else {
            return false
        }
    }

    const save = () => {
        let isCreate = false;
        if (props.modeEqupmet === CALENDAR_TYPE.EQUIPMENT) {
            if (props.modePopup === MODE_POPUP.CREATE) {
                isCreate = true;
            }
            if (equiqmens['isAvailable'] === undefined) {
                equiqmens['isAvailable'] = true;
            }
            const newLang = langs
            newLang['ja_jp'] = langs.ja_jp.trim()
            newLang['en_us'] = langs.en_us.trim()
            newLang['zh_cn'] = langs.zh_cn.trim()
            equiqmens['equipmentName'] = JSON.stringify(newLang)
        } else {
            equiqmens['equipmentTypeName'] = JSON.stringify(langs);
        }

        if (validate()) {
            props.modeEqupmet === CALENDAR_TYPE.EQUIPMENT ? props.dataEquiqmentChange(equiqmens, isCreate) :
                props.dataTypeChange(equiqmens);
        }
    }

    const toggleShowOption = () => {
        setShowOption(!showOption);
    };

    const checkLang = () => {
        if (props.equiqmensItem === null && props.equiqmensTypeItem === null) {
            return JSON.stringify(langs) === JSON.stringify({
                "ja_jp": "",
                "en_us": "",
                "zh_cn": ""
            })
        } else {
            if (props.modeEqupmet === CALENDAR_TYPE.EQUIPMENT) {
                const responseName = JSON.parse(equiqmens["oldLangs"])
                if (langs["ja_jp"] === responseName["ja_jp"] &&
                    langs["en_us"] === responseName["en_us"] &&
                    langs["zh_cn"] === responseName["zh_cn"]) {
                    return true
                }
                equiqmens['equipmentName'] = equiqmens['oldLangs']
                setEquiqmens({ ...equiqmens })
                return false
            } else {
                const responseName = JSON.parse(props.equiqmensItem !== null ? props.equiqmensItem.equipmentName : props.equiqmensTypeItem.equipmentTypeName)
                if (langs["ja_jp"] === responseName["ja_jp"] &&
                    langs["en_us"] === responseName["en_us"] &&
                    langs["zh_cn"] === responseName["zh_cn"]) {
                    return true
                }
                return false
            }
        }
    }

    const checkLangType = () => {
        if (langs["ja_jp"] === langDraft["ja_jp"] &&
            langs["en_us"] === langDraft["en_us"] &&
            langs["zh_cn"] === langDraft["zh_cn"]) {
            return true
        }
        return false
    }

    const isChangeInput = () => {
        if (props.modePopup === MODE_POPUP.CREATE) {
            if ((props.modeEqupmet === CALENDAR_TYPE.EQUIPMENT &&
                equiqmens['isAvailable'] !== undefined &&
                equiqmens['isAvailable'] === false) || checkLang() === false) {
                return false;
            }
            return true;
        } else {
            if ((props.modeEqupmet === CALENDAR_TYPE.EQUIPMENT &&
                props.equiqmensItem !== null &&
                equiqmens['isAvailable'] !== props.equiqmensItem.isAvailable) ||
                checkLang() === false) {
                return false;
            }
            if (equiqmens['orderOfTypeChoose'] && (props.equiqmensItem.orderOfType !== equiqmens['orderOfTypeChoose'])) {
                return false;
            }
            if (props.modeEqupmet === CALENDAR_TYPE.EQUIPMENT_TYPE && checkLangType() === false) {
                return false
            }
            return true;
        }
    }

    const onSelectItemChange = (item) => {
        setTypeName(getJsonBName(item.equipmentTypeName));
        equiqmens['equipmentTypeId'] = item.equipmentTypeId;
        equiqmens['orderOfTypeChoose'] = item.displayOrder;
        toggleShowOption();
    };
    const executeDirtyCheck = async (action: () => void) => {
        const isChange = isChangeInput();
        if (!isChange) {
            await DialogDirtyCheckReset({ onLeave: action });

            equiqmens['equipmentTypeName'] = JSON.stringify(langDraft);
            equiqmens['equipmentTypeId'] = equiqmens['equipmentTypeIdOld']
            delete equiqmens['equipmentTypeIdOld']
            setEquiqmens({ ...equiqmens })
            props.dataChangedCalendar(false)
        } else {
            action();
        }
    }
    /**
  * hidden component if clicked on outside of element
  */
    const handleClickOutside = (event) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            setShowOption(false);
        }
    }

    useEffect(() => {
        // Bind the event listener
        document.addEventListener("click", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("click", handleClickOutside);
        };
    }, [wrapperRef]);


    const closePopup = () => {
        executeDirtyCheck(() => { props.toggleOpenPopup() })
    }
    const renderOption = item => {
        if (!item.isDelete) {
            return (
                <>
                    <li key={item.equipmentTypeId} className="item smooth"
                        onClick={() => onSelectItemChange(item)}>
                        <div className="text text2">{getJsonBName(item.equipmentTypeName)}</div>
                    </li>
                </>
            )
        } else {
            return (<></>)
        }
    }
    const addMoreLang = () => {
        return (
            <>
                <div>
                    <div className="d-flex font-size-12">
                        <input type="text" className={`input-normal mt-2 w70 ${(showValisMsg && !langs["ja_jp"] && !langs["en_us"] && !langs["zh_cn"])  || !enUS ? "setting-input-valid" : ""}`}
                            value={langs.en_us} onChange={handleChangeLangs('en_us')}
                            placeholder={props.modeEqupmet !== CALENDAR_TYPE.EQUIPMENT ? translate('setting.calendar.equiqment.placeholderType') : translate('setting.calendar.equiqment.placeholderEquiqment')} />
                        <label className="text-input">{translate('setting.lang.enUs')}</label>
                    </div>
                    {(!enUS && (jaJp || zhCn)) && <p className="setting-input-valis-msg">{translate('messages.ERR_COM_0025', [60])}</p>}
                    <div className="d-flex font-size-12">
                        <input type="text" className={`input-normal mt-2 w70 ${(showValisMsg && !langs["ja_jp"] && !langs["en_us"] && !langs["zh_cn"]) || !zhCn ? "setting-input-valid" : "" }`}
                            value={langs.zh_cn} onChange={handleChangeLangs('zh_cn')}
                            placeholder={props.modeEqupmet !== CALENDAR_TYPE.EQUIPMENT ? translate('setting.calendar.equiqment.placeholderType') : translate('setting.calendar.equiqment.placeholderEquiqment')} />
                        <label className="text-input">{translate('setting.lang.zhCn')}</label>
                    </div>
                    {(!zhCn && (jaJp || enUS)) && <p className="setting-input-valis-msg">{translate('messages.ERR_COM_0025', [60])}</p>}
                </div>
            </>)
    }
    return (
        <>
            <div className={`table-tooltip-box w30 box-other__right border-707 ${props.modeEqupmet !== CALENDAR_TYPE.EQUIPMENT ? "modal-equipmant" : "modal-equipmantType"}`}>
                <div className="table-tooltip-box-body">
                    <div>
                        <label className="title font-weight-bold">
                            {props.modeEqupmet !== CALENDAR_TYPE.EQUIPMENT
                                ? (props.modePopup === MODE_POPUP.CREATE ? translate('setting.calendar.equiqment.btnType') : translate('setting.calendar.equiqment.titleEdit'))
                                : (props.modePopup === MODE_POPUP.CREATE ? translate('setting.calendar.equiqment.btnEquiqment') : translate('setting.calendar.equiqment.titleBtnEquiqment'))}
                        </label>
                    </div>
                    <div>
                        <label className="title mt-4 font-weight-bold">
                            {props.modeEqupmet !== CALENDAR_TYPE.EQUIPMENT ? translate('setting.calendar.scheduleType.name') : translate('setting.calendar.equiqment.titleEquiqment')}
                        </label>
                    </div>
                    <div className="d-flex font-size-12">
                        <input type="text" className={`input-normal mt-2 w70 ${!langsMore && "w100"} ${(showValisMsg && !langs["ja_jp"] && !langs["en_us"] && !langs["zh_cn"]) || !jaJp ? "setting-input-valid" : ""}`}
                            value={langs.ja_jp} onChange={handleChangeLangs('ja_jp')}
                            placeholder={props.modeEqupmet !== CALENDAR_TYPE.EQUIPMENT ? translate('setting.calendar.equiqment.placeholderType') : translate('setting.calendar.equiqment.placeholderEquiqment')} />
                        {langsMore && <label className="text-input">{translate('setting.lang.jaJp')}</label>}
                    </div>
                    {(!jaJp && (enUS || zhCn))  && <p className="setting-input-valis-msg">{translate('messages.ERR_COM_0025', [60])}</p>}
                    {
                        (langsMore) &&
                        (
                            addMoreLang()
                        )
                    }
                    {showValisMsg && !langs["ja_jp"] && !langs["en_us"] && !langs["zh_cn"] && <p className="setting-input-valis-msg">{translate('messages.ERR_COM_0013')}</p>}
                    {(!jaJp && !enUS && !zhCn) && <p className="setting-input-valis-msg">{translate('messages.ERR_COM_0025', [60])}</p>}
                    <div>
                        <a className="setting-equipment-choose-lang button-primary btn-padding w100 mt-2 text-center hoverBtn" onClick={() => setLangsMore(!langsMore)}>{langsMore ? translate('setting.calendar.scheduleType.new.hideMore') : translate('setting.calendar.scheduleType.new.langOther')}</a>
                    </div>
                    {props.modeEqupmet === CALENDAR_TYPE.EQUIPMENT && <>
                        <div className="mt-3">
                            <label className="title font-weight-bold">
                                {translate('setting.calendar.equiqment.equiqmentAdd.titleCheck')}
                            </label>
                            <div className="wrap-check border-none pl-0">
                                <div className="mt-0">
                                    <p className="radio-item normal d-inline mr-3">
                                        <input type="radio" id="radio5" name="radio-group" checked={isvailable} onChange={handleChangeInput("isAvailable")} />
                                        <label htmlFor="radio5">{translate('setting.calendar.equiqment.equiqmentAdd.isvailable')}</label>
                                    </p>
                                    <p className="radio-item normal d-inline">
                                        <input type="radio" id="radio6" name="radio-group" checked={!isvailable} onChange={handleChangeInput("noAvailable")} />
                                        <label htmlFor="radio6">{translate('setting.calendar.equiqment.equiqmentAdd.noIsvailable')}</label>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="form-group mt-2">
                            <label className="title font-weight-bold">
                                {translate('setting.calendar.equiqment.equiqmentAdd.Type')}
                            </label>
                            <div className="select-option mt-2" ref={wrapperRef} >
                                <span className={`select-text ${(validateType) && "setting-input-valid"}`} onClick={toggleShowOption}>
                                    {typeName}
                                </span>
                                {showOption &&
                                    <ul className="drop-down drop-down2" >
                                        {props.equiqmensType.map((e) =>
                                            renderOption(e)
                                        )}
                                    </ul>}
                            </div>
                            {validateType && <p className="setting-input-valis-msg">{translate('messages.ERR_COM_0013')}</p>}
                        </div>
                    </>
                    }
                </div>
                <div className="table-tooltip-box-footer box-footer_custom p-0 pb-5">
                    <button className="button-cancel border-color mr-2" onClick={closePopup}>{translate('setting.employee.employeePosition.cancel')}</button>
                    <button className="button-blue" onClick={save}>
                        {[
                            props.modePopup === MODE_POPUP.CREATE && translate('calendars.equipments.btnAdd'),
                            props.modePopup === MODE_POPUP.EDIT && translate('calendars.equipments.btnEdit')
                        ]}
                    </button>
                </div>
            </div>
        </>
    )
}
export default EquipmentAdd;
