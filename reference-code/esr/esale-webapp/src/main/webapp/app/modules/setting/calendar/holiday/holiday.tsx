import React, { useState, useEffect, CSSProperties } from 'react';
import { IRootState } from 'app/shared/reducers';
import { translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { getJsonBName } from "app/modules/setting/utils";
import {
    reset,
    getHoliday,
    updateHoliday,
    initDataOfMonth,
    DayName,
    onChangeDateShow,
    onStartWeekSetting, getNationalHolidays
} from "./holiday.reducer";
import moment from 'moment'
import HolidayCompany from './holiday-company';
import { DataOfDaySetting } from './model/holiday-calendar-model';
import { isNullOrUndefined } from 'util';
import { SHOW_MESSAGE } from '../../constant';
import _ from 'lodash';

export interface IHolidayProps extends StateProps, DispatchProps {
    isSave,
    resetpapge?,
    changeDateUpdate?: (init) => void
    dataChangedCalendar?: (init) => void
    showMessage?: (type, message) => void
    setStatusSave?: (status) => void
}

export const Holiday = (props: IHolidayProps) => {

    const [holiday, setHoliday] = useState(null);
    // const [monthOfYear, setMonthOfYear] = useState(null);
    const [month, setMonth] = useState(null);
    const [year, setYear] = useState(null);
    const [years, setYears] = useState([]);
    const [isDialog, setIsDialog] = useState(false);

    const [notifyChange, setNotifyChange] = useState(false)
    const [companyHolidayEdit, setCompanyHolidayEdit] = useState()
    const [companyHolidayEditIndex, setCompanyHolidayEditIndex] = useState()
    const [deletedCompanyHolidays, setDeletedCompanyHolidays] = useState([]);
    const [isNational, setIsNational] = useState(false);

    const dayStart = [
        { id: DayName.Monday, name: translate("setting.calendar.holiday.dayName", translate("setting.calendar.holiday.monday")) },
        { id: DayName.Tuesday, name: translate("setting.calendar.holiday.dayName", translate("setting.calendar.holiday.tuesday")) },
        { id: DayName.Wednesday, name: translate("setting.calendar.holiday.dayName", translate("setting.calendar.holiday.wednesday")) },
        { id: DayName.Thurday, name: translate("setting.calendar.holiday.dayName", translate("setting.calendar.holiday.thursday")) },
        { id: DayName.Friday, name: translate("setting.calendar.holiday.dayName", translate("setting.calendar.holiday.friday")) },
        { id: DayName.Saturday, name: translate("setting.calendar.holiday.dayName", translate("setting.calendar.holiday.saturday")) },
        { id: DayName.Sunday, name: translate("setting.calendar.holiday.dayName", translate("setting.calendar.holiday.sunday")) }
    ];

    const getErrorMessage = (errorCode) => {
        let errorMessage = '';
        if (!isNullOrUndefined(errorCode)) {
            errorMessage = translate('messages.' + errorCode);
        }
        return errorMessage;
    }

    useEffect(() => {
        if (props.holidayUpdatedId) {
            props.showMessage(SHOW_MESSAGE.SUCCESS, getErrorMessage("INF_COM_0008"))
        }
    }, [props.holidayUpdatedId])

    const genYearOfMonth = (yearData) => {
        const lstYear = [];
        for (let i = (yearData - 5); i <= (yearData + 5); i++) {
            lstYear.push(i);
        }
        setYears(lstYear);
    }

    const initMonthOfYear = () => {
        const yearCurrent = new Date().getFullYear();
        const monthCurrent = new Date().getMonth() + 1;
        setMonth(monthCurrent);
        setYear(yearCurrent);
        genYearOfMonth(yearCurrent);
    }

    useEffect(() => {
        props.reset();
        props.getHoliday();
        if (month && year)
            props.getNationalHolidays(month, year);
        initMonthOfYear();
    }, [props.resetpapge])

    useEffect(() => {
        if (props.holiday) {
            if (props.holiday.haveHoliday === null || props.holiday.haveHoliday === undefined) {
                props.holiday.haveHoliday = 1
            }
            setHoliday(props.holiday);
            if(props.holiday.haveHoliday === 1){
                setIsNational(true);
            }
            setNotifyChange(!notifyChange)
            props.initDataOfMonth(props.holiday)
        }
    }, [props.holiday]);

    useEffect(() => {
        if (props.isSave) {
            props.reset()
            if (deletedCompanyHolidays && deletedCompanyHolidays.length > 0) {
                holiday.deletedCompanyHolidays = []
                deletedCompanyHolidays.forEach(e => holiday.deletedCompanyHolidays.push(e.companyHolidayId))
            }
            props.updateHoliday(holiday);
            props.setStatusSave(false)
        }
    }, [props.isSave]);

    /**
     * init data of grid when dataShow or startWeekDay change
     */
    useEffect(() => {
        setMonth(moment(props.dateShow).format('MM'))
        setYear(moment(props.dateShow).format('YYYY'))
        props.getNationalHolidays(Number(moment(props.dateShow).format('MM')), Number(moment(props.dateShow).format('YYYY')));
        // genYearOfMonth(moment(props.dateShow).format('YYYY'))
    }, [props.dateShow, props.startWeekDay, holiday, notifyChange])

    const monthOfYearChoice = event => {
        setYear(Number(event.target.value));
        genYearOfMonth(Number(event.target.value));
        props.changeDateUpdate(holiday)
        props.onChangeDateShow(moment(props.dateShow).add(Number(event.target.value) - Number(moment(props.dateShow).format("YYYY")), "year").toDate())
        props.dataChangedCalendar(holiday)
    }

    const handleChangeInput = keyMap => e => {
        switch (keyMap) {
            case "haveHoliday":
                setHoliday({ ...holiday, ['haveHoliday']: 1 });
                setIsNational(true);
                break;
            case "noHaveHoliday":
                setHoliday({ ...holiday, ['haveHoliday']: 0 });
                setIsNational(false);
                break
            default:
                props.onStartWeekSetting(e.target.value)
                setHoliday({ ...holiday, [keyMap]: e.target.value });
                break;
        }
        props.initDataOfMonth(holiday)
        setNotifyChange(!notifyChange)
        props.changeDateUpdate(holiday)
        props.dataChangedCalendar(holiday)


    }

    const handleChangeListHoliday = (obj, option) => {
        switch (obj) {
            case DayName.Monday:
                holiday.monday = option.target.checked
                break;
            case DayName.Tuesday:
                holiday.tuesday = option.target.checked
                break;
            case DayName.Wednesday:
                holiday.wednesday = option.target.checked
                break;
            case DayName.Thurday:
                holiday.thursday = option.target.checked
                break;
            case DayName.Friday:
                holiday.friday = option.target.checked
                break;
            case DayName.Saturday:
                holiday.saturday = option.target.checked
                break;
            case DayName.Sunday:
                holiday.sunday = option.target.checked
                break;
            default:
                break;
        }
        props.changeDateUpdate(holiday)
        props.initDataOfMonth(holiday)
        setHoliday(holiday)
        setNotifyChange(!notifyChange)
        props.dataChangedCalendar(holiday)
    }

    // ______________part list day holiday of company : start______________________________
    const removeCompanyHoliday = (item, index) => {
        if (item.companyHolidayId || item.companyHolidayId > 0) {
            deletedCompanyHolidays.push(item)
            if (!holiday.deletedCompanyHolidays) {
                holiday.deletedCompanyHolidays = []
            }
            holiday.deletedCompanyHolidays.push(item.companyHolidayId)
            holiday.companyHolidays.splice(index, 1)
            props.changeDateUpdate(holiday)
            props.dataChangedCalendar(holiday)
        } else {
            holiday.companyHolidays.splice(index, 1)
        }
        setHoliday(holiday)
        setDeletedCompanyHolidays(deletedCompanyHolidays)
        setNotifyChange(!notifyChange)
    }

    const dataChange = (item, index?: number) => {
        if (!holiday.companyHolidays || holiday.companyHolidays.length < 1) {
            holiday.companyHolidays = []
            holiday.companyHolidays.push(item)
        } else if (!item.companyHolidayId && (index < 0 || index === undefined || index === null)) {
            holiday.companyHolidays.push(item)
        } else {
            holiday.companyHolidays.forEach((e, indexElement) => {
                if ((e.companyHolidayId && item.companyHolidayId && e.companyHolidayId === item.companyHolidayId) || indexElement === index) {
                    e.companyHolidayName = item.companyHolidayName
                    e.isRepeat = item.isRepeat
                    e.companyHolidayDate = item.companyHolidayDate
                }
            })
        }
        setHoliday(holiday)
        setNotifyChange(!notifyChange)
        props.changeDateUpdate(holiday)
        props.initDataOfMonth(holiday)
        props.onChangeDateShow(moment(item.companyHolidayDate).toDate())
        genYearOfMonth(Number(moment(item.companyHolidayDate).format('YYYY')))
    }

    const toggleOpenPopup = () => {
        setIsDialog(false)
    }
    // ______________part list day holiday of company : end______________________________

    // ______________render table grid month: start______________________________
    /**
     * render name of day in week
     * @param day
     */
    const renderDayName = (day) => {
        console.log("DAYS OF MONTH: ",day);
        switch (day) {
            case DayName.Monday:
                return translate('setting.calendar.holiday.monday')
            case DayName.Tuesday:
                return translate('setting.calendar.holiday.tuesday')
            case DayName.Wednesday:
                return translate('setting.calendar.holiday.wednesday')
            case DayName.Thurday:
                return translate('setting.calendar.holiday.thursday')
            case DayName.Friday:
                return translate('setting.calendar.holiday.friday')
            case DayName.Saturday:
                return translate('setting.calendar.holiday.saturday')
            case DayName.Sunday:
                return translate('setting.calendar.holiday.sunday')
            default:
                return translate('setting.calendar.holiday.saturday')
        }
    }

    /**
     * check day is holiday
     * @param dataOfHeader
     */
    const isHoliday = (dataOfHeader: DataOfDaySetting) => {

        return dataOfHeader.isWeekend || dataOfHeader.isHoliday || (dataOfHeader.isNationalHoliday && isNational)
    }

    

    /**
     * render header of table grid
     */
    const renderThOfMonth = () => {
        const dataOfHeader = props.dataOfMonth && props.dataOfMonth.listDataOfWeekSetting && props.dataOfMonth.listDataOfWeekSetting.length && props.dataOfMonth.listDataOfWeekSetting[0].listDataOfDaySetting
        return (
            <>
                {dataOfHeader && dataOfHeader.map((dataOfDay: DataOfDaySetting) => {
                    return (
                        <th align="center" className={`${isHoliday(dataOfDay) ? "color-red" : ""} holiday-width`} key={`header_${moment(dataOfDay.date).day()}`} >
                            {renderDayName(moment(dataOfDay.date).day())}
                        </th>
                    )
                })}
            </>
        )
    }

    const backgroundHoliday = (dataOfHeader: DataOfDaySetting) => {
        let backGround = '';
         if (dataOfHeader.isCompanyHoliday) {
            backGround = 'background-light-yellow';
        }else if (dataOfHeader.isWeekend || (dataOfHeader.isNationalHoliday && isNational)) {
            backGround = 'background-light-red';
        }
        return backGround;
    }

    /**
     * render row of table grid
     */
    const renderTrOfMonth = () => {
        return (
            <>
                {props.dataOfMonth.listDataOfWeekSetting.map(dataOfWeek => {
                    return (
                        <tr key={`tr_${moment(dataOfWeek.startDate).format("DDMMYYYY")}`}>
                            {dataOfWeek.listDataOfDaySetting.map((dataOfDay, index) => {
                                if (moment(dataOfDay.date).month() === moment(props.dateShow).month()) {
                                    return (
                                        <td key={`td_${moment(dataOfWeek.startDate).format("DDMMYYYY")}_${index}`} className={backgroundHoliday(dataOfDay)}>
                                            <div className="date">
                                                <span>{moment(dataOfDay.date).format("DD")}</span>
                                                {dataOfDay.companyHolidayName && <div>{getJsonBName(dataOfDay.companyHolidayName)}</div>}
                                                {isHoliday(dataOfDay) && (<div>{dataOfDay.holidayCommon}</div>)}
                                                {isHoliday(dataOfDay) && isNational && (<div>{dataOfDay.nationalHolidayName}</div>)}
                                            </div>
                                        </td>
                                    )
                                } else {
                                    return (
                                        <td key={`td_${moment(dataOfWeek.startDate).format("DDMMYYYY")}_${index}`}>
                                        </td>
                                    )
                                }

                            })}
                        </tr>
                    )
                })}
            </>
        )
    }

    const changeMonth = (action: string) => {
        let dateChange: Date = null;
        if (action === 'next') {
            dateChange = moment(props.dateShow).add(1, "month").toDate()
        } else {
            dateChange = moment(props.dateShow).add(-1, "month").toDate();
        }
        props.onChangeDateShow(dateChange);
    }

    useEffect(() => {
        if (holiday) {
            if(props.nationHoliday && props.nationHoliday.length > 0){
                holiday.nationalHolidays = _.cloneDeep(props.nationHoliday);
            }
            props.initDataOfMonth(holiday);
        }
    }, [props.nationHoliday]);

    const tableCSS: CSSProperties = {
        height: "auto"
    }

    // ______________render table grid month: end______________________________

    return (
        <>
            <div className="form-group">
                <label>{translate('setting.calendar.holiday.label')}</label>
                <div className="block-feedback block-feedback-radious block-feedback-blue magin-top-5">
                    {translate('setting.calendar.holiday.notification')}
                </div>
                <div className="wrap-check wrap-check2 mt-2">
                    <div className="wrap-check-box">
                        <p className="check-box-item">
                            <label className="icon-check">
                                <input type="checkbox" name={`${DayName.Monday}`} value={DayName.Monday} checked={holiday && holiday.monday} onChange={(obj) => handleChangeListHoliday(DayName.Monday, obj)} /><i />
                                {translate('setting.calendar.holiday.monday')}
                            </label>
                        </p>
                        <p className="check-box-item">
                            <label className="icon-check">
                                <input type="checkbox" name={`${DayName.Tuesday}`} value={DayName.Tuesday} checked={holiday && holiday.tuesday} onChange={(obj) => handleChangeListHoliday(DayName.Tuesday, obj)} /><i />
                                {translate('setting.calendar.holiday.tuesday')}
                            </label>
                        </p>
                        <p className="check-box-item">
                            <label className="icon-check">
                                <input type="checkbox" name={`${DayName.Wednesday}`} value={DayName.Wednesday} checked={holiday && holiday.wednesday} onChange={(obj) => handleChangeListHoliday(DayName.Wednesday, obj)} /><i />
                                {translate('setting.calendar.holiday.wednesday')}
                            </label>
                        </p>
                        <p className="check-box-item">
                            <label className="icon-check">
                                <input type="checkbox" name={`${DayName.Thurday}`} value={DayName.Thurday} checked={holiday && holiday.thursday} onChange={(obj) => handleChangeListHoliday(DayName.Thurday, obj)} /><i />
                                {translate('setting.calendar.holiday.thursday')}
                            </label>
                        </p>
                        <p className="check-box-item">
                            <label className="icon-check">
                                <input type="checkbox" name={`${DayName.Friday}`} value={DayName.Friday} checked={holiday && holiday.friday} onChange={(obj) => handleChangeListHoliday(DayName.Friday, obj)} /><i />
                                {translate('setting.calendar.holiday.friday')}
                            </label>
                        </p>
                        <p className="check-box-item">
                            <label className="icon-check">
                                <input type="checkbox" name={`${DayName.Saturday}`} value={DayName.Saturday} checked={holiday && holiday.saturday} onChange={(obj) => handleChangeListHoliday(DayName.Saturday, obj)} /><i />
                                {translate('setting.calendar.holiday.saturday')}
                            </label>
                        </p>
                        <p className="check-box-item">
                            <label className="icon-check">
                                <input type="checkbox" name={`${DayName.Sunday}`} value={DayName.Sunday} checked={holiday && holiday.sunday} onChange={(obj) => handleChangeListHoliday(DayName.Sunday, obj)} /><i />
                                {translate('setting.calendar.holiday.sunday')}
                            </label>
                        </p>
                    </div>
                </div>
            </div>
            <div className="form-group">
                <label>{translate('setting.calendar.holiday.haveHoliday.title')}</label>
                <div className="block-feedback block-feedback-radious block-feedback-blue magin-top-5">
                    {translate('setting.calendar.holiday.haveHoliday.notification')}
                </div>
                <div className="wrap-check mt-2">
                    <div className="wrap-check-radio">
                        <p className="radio-item">
                            <input type="radio" id="haveHoliday" value={1} checked={holiday && holiday.haveHoliday === 1 || (!holiday || holiday.haveHoliday !== 0 && holiday.haveHoliday !== 1)} name="haveHoliday" onChange={handleChangeInput('haveHoliday')} />
                            <label htmlFor="haveHoliday">{translate('setting.calendar.holiday.haveHoliday.yes')}</label>
                        </p>
                        <p className="radio-item">
                            <input type="radio" id="noHaveHoliday" value={0} checked={holiday && holiday.haveHoliday === 0} name="nohaveHoliday" onChange={handleChangeInput('noHaveHoliday')} />
                            <label htmlFor="noHaveHoliday">{translate('setting.calendar.holiday.haveHoliday.no')}</label>
                        </p>
                    </div>
                </div>
            </div>
            <div className="form-group">
                <label>{translate('setting.calendar.holiday.company.title')}</label>
                <div className="block-feedback block-feedback-radious block-feedback-blue magin-top-5">
                    {translate('setting.calendar.holiday.company.notification')}
                </div>
                <div className="position-relative">
                    <a className="setting-holiday-add button-primary button-simple-edit mt-2" onClick={() => { setIsDialog(!isDialog); setCompanyHolidayEdit(null); setCompanyHolidayEditIndex(null) }}>{translate('setting.calendar.holiday.company.add')}</a>
                    {
                        isDialog && <HolidayCompany dismissDialog={() => { setIsDialog(false) }} dataChange={dataChange} dirtyCheckModal={props.dataChangedCalendar} toggleOpenPopup={toggleOpenPopup} holidayCompany={companyHolidayEdit} indexCompanyHolidayEditing={companyHolidayEditIndex} dateFormatSetting={props.dateFormatSetting} />
                    }
                </div>
            </div>
            <div className="form-group">
                {
                    (holiday && holiday.companyHolidays && holiday.companyHolidays.length > 0)
                        ?
                        <table className="table-default">
                            <tbody>
                                <tr>
                                    <td className="title-table text-center">{translate('setting.calendar.holiday.company.no')}</td>
                                    <td className="title-table text-center">{translate('setting.calendar.holiday.company.name')}</td>
                                    <td className="title-table text-center">{translate('setting.calendar.holiday.company.date')}</td>
                                    <td className="title-table text-center">{translate('setting.calendar.holiday.company.action')}</td>
                                </tr>
                                {
                                    holiday && holiday.companyHolidays.map((item, index) => {
                                        return (
                                            <tr key={`holiday_companyHolidayId_${item.companyHolidayId}_${index}`}>
                                                <td className="text-center">{index + 1}</td>
                                                <td className="text-center">{getJsonBName(item.companyHolidayName)}</td>
                                                <td className="text-center">{moment(item.companyHolidayDate).format('DD/MM/YYYY')}</td>
                                                <td className=" text-center color-999">
                                                    <a className="icon-primary icon-edit icon-edit-t icon-custom" onClick={() => { setIsDialog(true); setCompanyHolidayEdit(item); setCompanyHolidayEditIndex(index); }} />
                                                    <a className="icon-primary icon-erase icon-edit-t icon-custom" onClick={() => { removeCompanyHoliday(item, index) }} />
                                                </td>
                                            </tr>
                                        )
                                    }
                                    )
                                }
                            </tbody>
                        </table>
                        :
                        <div className="block-feedback block-feedback-radious block-feedback-blue magin-top-5">
                            {translate("messages.INF_COM_0013")}
                        </div>
                }
            </div>
            <div className="form-group">
                <label>{translate('setting.calendar.holiday.start.title')}</label>
                <div className="block-feedback block-feedback-radious block-feedback-blue magin-top-5">
                    {translate('setting.calendar.holiday.start.notification')}
                </div>
                <div className="w60 ">
                    <div className="select-option mt-2">
                        <select className="select-text" value={holiday && holiday.dayStart} defaultValue={holiday && holiday.dayStart ? holiday.dayStart : DayName.Monday} onChange={handleChangeInput('dayStart')}>
                            {
                                dayStart.map((item, index) => (
                                    <option value={item.id} key={item.id}>{item.name}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div className="control-top  mt-3 flex-space-between p-0">
                        <div className="left">
                            <div className="button-next-prev-wrap">
                                <a className="prev setting-holiday-add" id="prevBtn" onClick={() => changeMonth("prev")} />
                                <a className="next setting-holiday-add" id="nextBtn" onClick={() => changeMonth("next")} />
                            </div>
                        </div>
                        <div>
                            <div className="select-option mt-2">
                                <select className="select-text" value={year} onChange={monthOfYearChoice}>
                                    {
                                        years && years.map((item, index) => (
                                            <option value={item} key={item}>{item + translate('setting.calendar.holiday.year') + month + translate('setting.calendar.holiday.month')}</option>
                                        ))
                                    }
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="table-calendar-wrap" style={tableCSS}>
                <table className="table-default mb-5">
                    <thead>
                        <tr>
                            {renderThOfMonth()}
                        </tr>
                    </thead>
                    <tbody>
                        {/* <HolidayCalendar calendarYear={year} calendarMonth={month} /> */}
                        {renderTrOfMonth()}
                    </tbody>
                </table>
            </div>
        </>
    )

}
const mapStateToProps = ({ holiday, authentication }: IRootState) => ({
    holiday: holiday.holiday,
    dateShow: holiday.dateShowCurrent,
    startWeekDay: holiday.startWeekSetting,
    dataOfMonth: holiday.dataOfMonthSetting,
    dateFormatSetting: authentication.account.formatDate,
    holidayUpdatedId: holiday.holidayUpdatedId,
    nationHoliday: holiday.nationHoliday
});

const mapDispatchToProps = {
    reset,
    getHoliday,
    updateHoliday,
    initDataOfMonth,
    onChangeDateShow,
    onStartWeekSetting,
    getNationalHolidays
};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Holiday);
