import React, { useState, useEffect } from 'react';
import { translate } from 'react-jhipster';
import DialogDirtyCheck from 'app/shared/layout/common/dialog-dirty-check';
import DialogDirtyCheckReset from 'app/shared/layout/common/dialog-dirty-check-restart';
import DatePicker from 'app/shared/layout/common/date-picker';
import moment from 'moment';

interface IHolidayCompany {
    holidayCompany?: any
    indexCompanyHolidayEditing?: number
    dismissDialog
    toggleOpenPopup
    dataChange
    dateFormatSetting: string
    dirtyCheckModal: (init) => void
}

export const HolidayCompany = (props: IHolidayCompany) => {


    const [langs, setLangs] = useState({
        "ja_jp": "",
        "en_us": "",
        "zh_cn": ""
    });
    const [isActive, setIsActive] = useState(true);
    const [holidayCompanyItem, setHolidayCompanyItem] = useState(props.holidayCompany);
    const [langsMore, setLangsMore] = useState(false);
    const [changeData, setChangeData] = useState()
    const [validateName, setValidateName] = useState(false)
    const [isDirty, setIsDirty] = useState(false)
    const [initDate, setInitDate] = useState(null)

    useEffect(() => {
        if (props.holidayCompany) {
            setHolidayCompanyItem(props.holidayCompany)
            const langObj = JSON.parse(props.holidayCompany !== null ? props.holidayCompany.companyHolidayName : "");
            setLangs({ ...langObj });
            setIsActive(props.holidayCompany.isRepeat)
            setInitDate(moment(props.holidayCompany.companyHolidayDate).toDate())
        }
    }, [props.holidayCompany])

    const handleChangeLangs = keyMap => event => {
        setLangs({ ...langs, [keyMap]: event.target.value });
        if (!isDirty) {
            setChangeData(holidayCompanyItem)
            props.dirtyCheckModal(holidayCompanyItem)
            setIsDirty(true)
        }
    }

    useEffect(() => {
        setHolidayCompanyItem({ ...holidayCompanyItem, ['companyHolidayName']: JSON.parse(JSON.stringify(langs)) })
    }, [langs])

    const handleChangeData = keyMap => event => {
        switch (keyMap) {
            case "isRepeat":
                setIsActive(true);
                // setHolidayCompanyItem({...holidayCompanyItem,['isRepeat']:true});
                break;
            case "noIsRepeat":
                setIsActive(false);
                // setHolidayCompanyItem({...holidayCompanyItem,['isRepeat']:false});
                break;
            case "companyHolidayDate":
                setHolidayCompanyItem({ ...holidayCompanyItem, [keyMap]: event.target.value });
                break;
            default:
                break;
        }
        setChangeData(holidayCompanyItem)
        props.dirtyCheckModal(holidayCompanyItem)
    }

    const executeDirtyCheck = async (action: () => void) => {

        if (changeData) {
            await DialogDirtyCheckReset({ onLeave: action });
        } else {
            action();
        }
    }
    const cancel = () => {
        // props.dismissDialog();
        executeDirtyCheck(() => { props.toggleOpenPopup() })
    }


    const save = () => {

        langs["ja_jp"] = langs["ja_jp"] ? langs["ja_jp"].trim() : ""
        langs["en_us"] = langs["en_us"] ? langs["en_us"].trim() : ""
        langs["zh_cn"] = langs["zh_cn"] ? langs["zh_cn"].trim() : ""

        if (langs["ja_jp"] || langs["en_us"] || langs["zh_cn"]) {
            const companyHoliday = {
                companyHolidayName: JSON.stringify(langs),
                isRepeat: isActive,
                companyHolidayDate: moment(moment(holidayCompanyItem?.companyHolidayDate).toDate()).format('YYYY/MM/DD'),
                companyHolidayId: holidayCompanyItem.companyHolidayId || 0
            }
            if (props.indexCompanyHolidayEditing !== undefined && props.indexCompanyHolidayEditing >= 0) {
                props.dataChange(companyHoliday, props.indexCompanyHolidayEditing)
            } else {
                props.dataChange(companyHoliday)
            }
            props.toggleOpenPopup()
        } else {

            setValidateName(true)
        }
    }

    return (
        <>
            <div className="table-tooltip-box table-tooltip-box-custome" style={{ zIndex: 999999 }}>
                <div className="table-tooltip-box-body">
                    <div>
                        <label className="title font-weight-bold font-size-14">
                            {holidayCompanyItem && holidayCompanyItem.companyHolidayId ? translate("setting.calendar.holiday.company.formAdd.titleEdit") : translate("setting.calendar.holiday.company.formAdd.title")}
                        </label>
                    </div>
                    <div>
                        <label className="title mt-3 font-weight-bold ">{translate("setting.calendar.holiday.company.formAdd.labelNameHoliday")}</label>
                    </div>
                    <div className="d-flex font-size-12">
                        <input type="text"
                            className={`input-normal mt-2 w70 ${!langsMore && "w100"} ${validateName && !langs["ja_jp"] && !langs["en_us"] && !langs["zh_cn"] ? "setting-input-valid" : ""}`}
                            value={langs.ja_jp} onChange={handleChangeLangs('ja_jp')}
                            placeholder={translate("setting.calendar.holiday.company.formAdd.placeholderName")} />
                        {langsMore && <label className="text-input">{translate('setting.lang.jaJp')}</label>}
                    </div>
                    {
                        langsMore &&
                        (
                            <div>
                                <div className="d-flex font-size-12">
                                    <input type="text" className={`input-normal mt-2 w70 ${validateName && !langs["ja_jp"] && !langs["en_us"] && !langs["zh_cn"] ? "setting-input-valid" : ""}`} value={langs.en_us} onChange={handleChangeLangs('en_us')} placeholder={translate("setting.calendar.holiday.company.formAdd.placeholderName")} />
                                    <label className="text-input">{translate('setting.lang.enUs')}</label>
                                </div>
                                <div className="d-flex font-size-12">
                                    <input type="text" className={`input-normal mt-2 w70 ${validateName && !langs["ja_jp"] && !langs["en_us"] && !langs["zh_cn"] ? "setting-input-valid" : ""}`} value={langs.zh_cn} onChange={handleChangeLangs('zh_cn')} placeholder={translate("setting.calendar.holiday.company.formAdd.placeholderName")} />
                                    <label className="text-input">{translate('setting.lang.zhCn')}</label>
                                </div>
                            </div>
                        )
                    }
                    {validateName && !langs["ja_jp"] && !langs["en_us"] && !langs["zh_cn"] && <p className="setting-input-valis-msg">{translate('messages.ERR_COM_0013')}</p>}
                    <div>
                        <a className="setting-holiday-choose-lang button-primary button-simple-edit w100 text-center mt-2 " onClick={() => setLangsMore(!langsMore)}>{langsMore ? translate('setting.employee.employeePosition.toggleOtherLanguages') : translate('setting.employee.employeePosition.toggleOtherLanguagesEdit')}</a>
                    </div>
                    <div className="mt-3 font-size-12">
                        <label className="title font-weight-bold">
                            {translate("setting.calendar.holiday.company.formAdd.labelOptionLoop")}
                        </label>
                        <div className="wrap-check w100 mt-2">
                            <div className="mt-0">
                                <p className="radio-item normal d-inline mr-3">
                                    <input type="radio" id="isRepeat" name="isRepeat" onChange={handleChangeData("isRepeat")} checked={isActive} />
                                    <label htmlFor="isRepeat">{translate("setting.calendar.holiday.company.formAdd.labelIsRepeat")}</label>
                                </p>
                                <p className="radio-item normal d-inline">
                                    <input type="radio" id="noIsRepeat" name="noAvailable" onChange={handleChangeData("noIsRepeat")} checked={!isActive} />
                                    <label htmlFor="noIsRepeat">{translate("setting.calendar.holiday.company.formAdd.labelNonRepeat")}</label>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="title mt-3 font-weight-bold ">{translate("setting.calendar.holiday.company.formAdd.labelChosenDate")}</label>
                    </div>
                    <div>
                        <DatePicker
                            placeholder={translate("setting.calendar.holiday.company.formAdd.placeholderInputDate")}
                            date={initDate ? initDate : null}
                            inputClass="input-normal mt-2 w100"
                            onDateChanged={(date: Date) => {
                                const temp = moment(date).format("YYYY-MM-DD");
                                if (temp !== "Invalid date") {
                                    setHolidayCompanyItem({
                                        ...holidayCompanyItem,
                                        companyHolidayDate: moment(new Date(temp)).format()
                                    })
                                }
                            }}
                        />
                        {/* <input type="text" className="input-normal mt-2" placeholder="日付を選択" onChange={handleChangeData("companyHolidayDate")} /> */}
                    </div>
                </div>
                <div className="table-tooltip-box-footer">
                    <a className="button-cancel mr-1" onClick={cancel}>{translate("setting.calendar.holiday.company.buttonCancel")}</a>
                    <a className="button-blue" onClick={save}>{holidayCompanyItem && holidayCompanyItem.companyHolidayId ? translate("setting.calendar.holiday.company.edit") : translate("setting.calendar.holiday.company.add")}</a>
                </div>
            </div>
        </>
    )

}
export default HolidayCompany;
