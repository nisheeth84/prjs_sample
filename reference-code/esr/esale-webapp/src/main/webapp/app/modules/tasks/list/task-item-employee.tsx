import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import React, { useState, useRef, useMemo } from 'react';
import InfoEmployeeCard from 'app/shared/layout/common/info-employee-card/info-employee-card';
import { TaskOperatorAva } from '../control/task-operator-ava';

export interface ITaskItemEmployeeProps {
    employees: any;
    index: number,
    onOpenModalEmployeeDetail: (employeeId: number) => void
}

export const TaskItemEmployee = (props: ITaskItemEmployeeProps) => {
    const employees = useMemo(() => {
        if (props.employees) {
            return props.employees;
        }
    }, [props.employees]);

    /**
    * render user box info
    * @param employee
    */
    const renderBoxOperators = (employee, type) => {
        return <TaskOperatorAva employeeData={employee} taskType={type} onOpenModalEmployeeDetail={props.onOpenModalEmployeeDetail}/>
    }

    return (
        <div className="list-user">
            {employees && employees.length <= 3 && employees.map((employee) =>
                renderBoxOperators(employee, props.index)
            )}
            {employees && employees.length > 3 &&
            <>
                {employees.slice(0, 2).map((employee) =>
                    renderBoxOperators(employee, props.index)
                )}
                <TaskOperatorAva
                    onOpenModalEmployeeDetail={props.onOpenModalEmployeeDetail}
                    employeeData={employees[2]}
                    employees={employees}
                    taskType={props.index}
                />
            </>
            }
        </div>
    )
};

export default TaskItemEmployee;
