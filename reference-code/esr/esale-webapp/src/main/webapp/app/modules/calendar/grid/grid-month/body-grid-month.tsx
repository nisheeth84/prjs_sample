import React from 'react'
import TdGridMonth from './td-grid-month'
import { DataOfWeek } from '../common'
import { TabForcus } from '../../constants';
import { IRootState } from 'app/shared/reducers'
import { connect } from 'react-redux'

type IBodyGridMonthProp = StateProps & DispatchProps & {
    modeView: boolean,
    maxShowSchedule: number,
    widthOfTd: number
}

const BodyGridMonth = (props: IBodyGridMonthProp) => {
    let listWeeksInit: DataOfWeek[] = [];

    if (props.dataOfMonth && props.localNavigation) {
        listWeeksInit = props.localNavigation.tabFocus === TabForcus.Schedule ? props.dataOfMonth.listWeeksOfSchedule : props.dataOfMonth.listWeeksOfResource;
    }

    let hightPercent = null;
    if (props.optionAll) {
        hightPercent = (props.dataOfMonth && listWeeksInit && listWeeksInit.length > 0) ? (100 / listWeeksInit.length).toFixed(3) + '%' : 20;
    }

    const renderTD = (dataSchedule?: DataOfWeek) => {
        let maxShowSchedule = props.maxShowSchedule;
        /**
         * if optionAll == true, show props.maxShowSchedule schedule
         * else show max schedule in day of week
         */
        if (!props.optionAll) {
            maxShowSchedule = 0;
            dataSchedule.listDay.forEach(e => {
                const listSchedule = props.localNavigation.tabFocus === TabForcus.Schedule ? e.listSchedule : e.listResource;
                maxShowSchedule = Math.max(maxShowSchedule, listSchedule.length)
            })
        }
        return (
            <>
                {
                    dataSchedule && dataSchedule.listDay.map((e, index) => {
                        return (
                            <TdGridMonth
                                key={index}
                                dataOfDay={e}
                                listDayOfWeek={dataSchedule.listDay}
                                indexOfDay={index}
                                maxShowSchedule={maxShowSchedule}
                                widthOfTd={props.widthOfTd}
                                modeView={props.modeView}
                            />
                        )
                    })
                }
            </>
        )

    }
    const renderTR = () => {
        return (
            <>
                {props.dataOfMonth && listWeeksInit && listWeeksInit.map((e, index) => {
                    return (
                        <tr key={'tr' + index} style={{ height: hightPercent }}>{renderTD(e)}</tr>
                    )
                })}
            </>
        )
    }

    return (
        <tbody>
            {renderTR()}
        </tbody>
    )
}


const mapStateToProps = ({ dataCalendarGrid }: IRootState) => ({
    optionAll: dataCalendarGrid.optionAll,
    dataOfMonth: dataCalendarGrid.dataOfMonth,
    refreshDataFlag: dataCalendarGrid.refreshDataFlag,
    localNavigation: dataCalendarGrid.localNavigation,
});

const mapDispatchToProps = {
};


type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BodyGridMonth);
