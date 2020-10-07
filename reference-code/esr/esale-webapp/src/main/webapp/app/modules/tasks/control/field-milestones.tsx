import React, { useState, useRef, useEffect } from 'react';
import StringUtils from 'app/shared/util/string-utils';
import { ControlType } from 'app/config/constants';
import { connect } from 'react-redux';
import {
    TASK_ACTION_TYPES,
    TASK_VIEW_MODES
} from '../constants';
import _ from 'lodash';
import {
    getMilestoneList
} from './field-milestones.reducer';
import { IRootState } from 'app/shared/reducers';

export interface IFieldMilestone {
    label: string,
    placeHolder: string,
    listMilestone: any[];
    milestoneId: any;
    onSelectMilestone: (milestoneId: number) => void;
    getMilestoneList: () => void;
}

const FieldMilestone = (props: IFieldMilestone) => {
    const [valueSelect, setValueSelect] = useState(props.milestoneId);
    const [openDropdown, setOpenDropdown] = useState(false);
    const openDropdownRef = useRef(null);

    const {listMilestone, label, placeHolder} = props;

    useEffect(() => {
        props.getMilestoneList();
    }, []);

    const onSelectItemChange = (milestoneId) => {
        setValueSelect(milestoneId);
        setOpenDropdown(false);
        props.onSelectMilestone(milestoneId);
    }

    const selectedIndex = listMilestone.findIndex( e => e.milestoneId === valueSelect);
    const text = selectedIndex >= 0 ? listMilestone[selectedIndex].milestoneName : placeHolder;

    return <>
        <label>{label}</label>
        <div className={`select-option form-group`}>
            <span className={`select-text`} onClick={() => setOpenDropdown(!openDropdown)}>{text}</span>
            {openDropdown &&
            <ul className={`drop-down drop-down2`} ref={openDropdownRef}>
                {listMilestone.map((e, idx) =>
                <li key={idx} className={`item ${selectedIndex === idx ? 'active' : ''} smooth`}
                    onSelect={() => onSelectItemChange(e.milestoneId)}
                    onClick={() => onSelectItemChange(e.milestoneId)}
                >
                    {e.milestoneName}
                </li>
                )}
            </ul>
            }
        </div>
    </>
    ;
};

const mapStateToProps = ({ dataMilestone }: IRootState) => ({
    listMilestone: dataMilestone.listMilestone
});

const mapDispatchToProps = {
    getMilestoneList
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FieldMilestone);
