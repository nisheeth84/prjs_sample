import React, { useEffect, useState } from 'react'
import { IRootState } from 'app/shared/reducers'
import { connect } from 'react-redux'
import { translate } from 'react-jhipster';
import { STATUS_ONLINE } from 'app/modules/timeline/common/constants'
import { checkOnline, resetOnline } from 'app/shared/reducers/authentication.ts';

type IStatusDetailEmployeeProp = StateProps & DispatchProps & {
    employeeId: number;
}

const StatusDetailEmployee = (props: IStatusDetailEmployeeProp) => {

    const [online, setOnline] = useState(-1);

    useEffect(() => {
        setOnline(props.onlineNumber);
    }, [props.onlineNumber]);

    useEffect(() => {
        if (props.employeeId) {
            props.checkOnline(props.employeeId);
        }
    }, [props.employeeId]);

    /**
    * Render status Online, Ofline, Away
    * @param numberOnline
    */
    const renderStatusOnline = (numberOnline) => {
        if (numberOnline === STATUS_ONLINE.ONLINE) {
            return <div className="status position-static online">{translate("status.online")} </div>
        }
        if (numberOnline === STATUS_ONLINE.AWAY) {
            return <div className="status position-static busy">{translate("status.away")}</div>
        }
        return <div className="status position-static offline">{translate("status.offline")}</div>
    }

    return (
        <>
            {renderStatusOnline(online)}
        </>
    );
}

const mapStateToProps = ({ authentication }: IRootState) => ({
    onlineNumber: authentication.online
});

const mapDispatchToProps = {
    checkOnline,
    resetOnline
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(StatusDetailEmployee);
