import React from 'react'
import { DepartmentTimelineType } from '../models/get-local-navigation-model';

type ILocalNavigationDepartmentItemProp = {
  departmentData: DepartmentTimelineType
  link: string
  onSelectOption: (data) => void
  classActiveId: any
  listType: any
  mapCountnewDepartment?: Map<number, number>
}

const LocalNavigationDepartmentItem = (props: ILocalNavigationDepartmentItemProp) => {

  return (
    <div className={`d-flex ${props.classActiveId === (props.listType + "_" + props.departmentData?.departmentId) ? "active" : ""}`}
      onClick={() => { props.onSelectOption(props.departmentData) }}>
      <a role="button" tabIndex={0} className="link-expand" >
        <span className="text-ellipsis">{props.departmentData.departmentName}  </span>
        {props.mapCountnewDepartment?.get(Number(props.departmentData.departmentId)) > 0 && props.classActiveId !== (props.listType + "_" + props.departmentData?.departmentId) &&
          <span className="number">{props.mapCountnewDepartment.get(Number(props.departmentData.departmentId))} </span>}
      </a>
    </div>
  );
}

export default LocalNavigationDepartmentItem;
