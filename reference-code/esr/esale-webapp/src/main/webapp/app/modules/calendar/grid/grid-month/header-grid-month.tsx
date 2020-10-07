import React from 'react';
import { IRootState } from 'app/shared/reducers'
import { connect } from 'react-redux'
import { DataOfDay } from '../common'
import { translate } from 'react-jhipster';

type IHeaderGridMonth = StateProps & DispatchProps & {
    listDay: DataOfDay[],
    widthOfTd: number
}

const HeaderGridMonth = (props: IHeaderGridMonth) => {
    const renderTh = (day: DataOfDay, index: number) => {
        const className = day.dataHeader.isWeekend ? 'color-red text-center' : 'text-center';
        const dateNameLang = "calendars.commons.dayOfWeek." + day.dataHeader.dateMoment.day();
        return (
            <th key={"th_" + index} className={className} style={{ width: props.widthOfTd }} >{translate(dateNameLang)}</th>
        );
    }
    
    return (
        <thead>
            <tr>

                {props.listDay && props.listDay.map((e, index) => {
                    return (
                        renderTh(e, index)
                    )
                })}
            </tr>
        </thead>
    );
}


const mapStateToProps = ({ dataCalendarGrid }: IRootState) => ({
});

const mapDispatchToProps = {
};


type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HeaderGridMonth);