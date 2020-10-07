import React, { useState } from 'react';
import DynamicList from 'app/shared/layout/dynamic-form/list/dynamic-list';
import { FieldInfoType } from 'app/shared/layout/dynamic-form/constants';
import _ from 'lodash';
import { TAB_ID_LIST } from '../../constants';

export interface IPopupEmployeeDetailTabTaskProps {
    task: any;
    conditionSearch?: any[],
    handleReorderField?: (dragIndex, dropIndex) => void;
    screenMode?: any,
    taskFields?: any
    onChangeFields?: (value) => void;
}

export const TabTask = (props: IPopupEmployeeDetailTabTaskProps) => {

    const [fields] = useState(props.taskFields ? props.taskFields : props.task.data.fieldInfo);

    return (
        <DynamicList
            id="EmployeeDetailTabTask"
            tableClass="table-list"
            keyRecordId="taskId"
            records={props.task.data.dataInfo}
            belong={1}
            extBelong={+TAB_ID_LIST.task}
            fieldInfoType={FieldInfoType.Tab}
            forceUpdateHeader={false}
            fields={fields}
            fieldLinkHolver={[{ fieldName: 'taskName', link: '#', hover: '', action: [] }]}
        >
        </DynamicList>
    )

}

export default TabTask;
