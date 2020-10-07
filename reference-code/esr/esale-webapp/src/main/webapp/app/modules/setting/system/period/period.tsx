import React, { useState, useEffect, useRef } from 'react';
import { translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import BoxMessage, { MessageType } from 'app/shared/layout/common/box-message';
import { SHOW_MESSAGE, TIME_OUT_MESSAGE } from '../../constant';
import { isNullOrUndefined } from "util";
import {
    getPeriod,
    reset
} from "./period.reducer";
import _ from 'lodash'
import useEventListener from 'app/shared/util/use-event-listener';

export interface IPeriodProps extends StateProps, DispatchProps {
    changePeriod,
    initPeriodData,
    dirtyReload,
    setDirtyReload
}
export const Period = (props: IPeriodProps) => {

    const [period, setPeriod] = useState({});
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [year, setYear] = useState(null);
    const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const [showMessage, setShowMessage] = useState(SHOW_MESSAGE.NONE);
    const [isYearActive, setIsYearActive] = useState(true);
    const [isShowList, setIsShowList] = useState(false);


    useEffect(() => {
        props.reset();
        props.getPeriod();
        if (!period['createdUser']) {
            setPeriod({})
        }
    }, [props.periodUpdate, props.dirtyReload]);

    useEffect(() => {
        if (_.isEmpty(period)) {
            const periodDefault = {
                monthBegin: 4,
                isCalendarYear: true
            }
            setPeriod(periodDefault);
            setIsYearActive(true);
            setYear(new Date().getFullYear());
            props.initPeriodData(periodDefault);
            props.changePeriod(periodDefault , true);
        } else if (props.period) {
            const isCalendarYear = props.period.isCalendarYear;
            let periodYear = new Date().getFullYear();
            if (!isCalendarYear) {
                periodYear--;
            }
            setYear(periodYear);
            setIsYearActive(isCalendarYear);
            setPeriod(_.cloneDeep(props.period));
            props.initPeriodData(_.cloneDeep(props.period));
            // props.changePeriod(_.cloneDeep(props.period));
        }
    }, [props.period]);

    useEffect(() => {

        if (props.errorItems.length > 0 && !props.periodUpdateSuccess) {
            setShowMessage(SHOW_MESSAGE.ERROR)
        }
    }, [props.periodUpdate, props.errorItems]);

    const getErrorMessage = (errorCode) => {
        let errorMessage = '';
        if (!isNullOrUndefined(errorCode)) {
            errorMessage = translate('messages.' + errorCode);
        }
        return errorMessage;
    }

    const renderBoxMessage = (isSuccess: boolean, messageCode: string) => {
        if (!messageCode) {
            return;
        }

        setTimeout(() => {
            setShowMessage(SHOW_MESSAGE.NONE);
        }, TIME_OUT_MESSAGE);

        return (
            <div className="setting-message-show">
                <BoxMessage messageType={isSuccess ? MessageType.Success : MessageType.Error} message={getErrorMessage(messageCode)} />
            </div>
        );
    }

    const renderErrorMessage = () => {
        if (!showMessage) {
            return;
        }
        return renderBoxMessage(false, props.periodUpdate ? props.periodUpdate.errorCodeList : null);
    }


    const handleChangeInput = (keyMap, value) => {
        const data = _.cloneDeep(period)
        switch (keyMap) {
            case "isCalendarYear":
                setYear(currentYear);
                setIsYearActive(true);
                setPeriod({ ...period, ['isCalendarYear']: true });
                data['isCalendarYear'] = true;
                break;
            case "noCalendarYear":
                setYear(currentYear - 1);
                setIsYearActive(false);
                setPeriod({ ...period, ['isCalendarYear']: false });
                data['isCalendarYear'] = false;
                break;
            case "monthBegin":
                setPeriod({ ...period, ['monthBegin']: value });
                data['monthBegin'] = value;
                break;
            default:
                break;
        }
        props.changePeriod(data , false);
    }

    const handleChoosePeriod = (value) => {
        handleChangeInput('monthBegin', value);
        setIsShowList(false);
    }

    const dropDownList = useRef(null);

    const handleMouseClose = e => {
        if (dropDownList && dropDownList.current && !dropDownList.current.contains(e.target)) {
            setIsShowList(false);
        }
    }

    useEventListener('mousedown', handleMouseClose);
    /**
   * handle key down or key up to choose item in pulldown
   * @param event 
   */
    const keyDownHandler = (event) => {
        // Enter
        if (event.keyCode === 13) {
            setIsShowList(!isShowList);
        }

        // Down
        if (event.keyCode === 40) {
            if (!_.isEmpty(months)) {
                const indexOfDefault = months.indexOf(period['monthBegin']);
                if (indexOfDefault === months.length - 1) {
                    handleChoosePeriod(months[0]);
                } else {
                    handleChoosePeriod(months[indexOfDefault + 1]);
                }
            } else {
                handleChoosePeriod(months[0]);
            }
        }

        // Up
        if (event.keyCode === 38) {
            if (!_.isEmpty(months)) {
                const indexOfDefault = months.indexOf(period['monthBegin']);
                if (indexOfDefault === 0) {
                    handleChoosePeriod(months[months.length - 1]);
                } else {
                    handleChoosePeriod(months[indexOfDefault - 1]);
                }
            } else {
                handleChoosePeriod(months[months.length - 1]);
            }
        }
        event.view.event.preventDefault();
    }

    return (
        <>
            <label className="color-333">{translate('setting.system.period.title')}</label>
            <div className="block-feedback background-feedback font-size-12 magin-top-5">
                {translate('setting.system.period.titleWarning')}
            </div>

            <div className="magin-top-10">
                <div className="wrap-check-n-border w-100">
                    <div className="mt-0">
                        <p className="select-box-item normal d-inline magin-right-70 d-flex align-items-center mb-0">
                            <div className="drop-select-down"
                                style={{ zIndex: 1000 }}
                                onClick={e => setIsShowList(!isShowList)} ref={dropDownList}>
                                <button className="button-pull-down width-100" onKeyDown={e => { e.keyCode !== 9 && keyDownHandler(e) }}>
                                    <span>{period && period['monthBegin']}</span>
                                </button>
                                {isShowList && (
                                    <div className="box-select-option">
                                        <ul>
                                            {
                                                months.map((item, index) => (
                                                    <li key={index} onClick={e => handleChoosePeriod(item)}>
                                                        <a>{item}</a>
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                    </div>
                                )}
                            </div>
                            <label className="d-block ml-1">
                                {translate('setting.system.period.month')}
                            </label>
                        </p>
                    </div>
                </div>
            </div>

            <div className="magin-top-10">
                <label className="color-333">{translate('setting.system.period.startYear')}</label>
            </div>
            <div className="magin-top-10">
                <div className="wrap-check w-100">
                    <div className="mt-0">
                        <p className="radio-item normal d-inline magin-right-70">
                            <input type="radio" id="isCalendarYear" name="isCalendarYear" onChange={e => handleChangeInput('isCalendarYear', null)} checked={isYearActive} />
                            <label htmlFor="isCalendarYear">{translate('setting.system.period.calendarYear')}</label>
                        </p>
                        <p className="radio-item normal d-inline">
                            <input type="radio" id="noCalendarYear" name="isCalendarYear" onChange={e => handleChangeInput('noCalendarYear', null)} checked={!isYearActive} />
                            <label htmlFor="noCalendarYear">{translate('setting.system.period.LastYear')}</label>
                        </p>
                    </div>
                </div>
            </div>
            <div className="magin-top-15">
                <div className="year-item color-333">{translate('setting.system.period.description', { 0: currentYear, 1: year, 2: period && period['monthBegin'] })}</div>
            </div>

            {renderErrorMessage()}
        </>
    )
}

const mapStateToProps = ({ period }: IRootState) => ({
    period: period.period,
    periodUpdate: period.periodUpdate,
    errorItems: period.errorItems,
    periodUpdateSuccess: period.periodUpdateSuccess,
});

const mapDispatchToProps = {
    getPeriod,
    reset
};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Period);