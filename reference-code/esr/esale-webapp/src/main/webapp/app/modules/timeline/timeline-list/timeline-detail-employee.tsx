import React, { useEffect, useState } from 'react'
import { IRootState } from 'app/shared/reducers'
import { connect } from 'react-redux'
import { useId } from "react-id-generator";
import PopupEmployeeDetail from "app/modules/employees/popup-detail/popup-employee-detail";
import { handleToggleDetailModalOther } from '../timeline-reducer'


type ITimelineDetailEmployeeProp = StateProps & DispatchProps

const TimelineDetailEmployee = (props: ITimelineDetailEmployeeProp) => {

  const [showEmployeeDetails, setShowEmployeeDetails] = useState(false);
  const [employeeId, setEmployeeId] = useState();
  const employeeDetailCtrlId = useId(1, "timelineDetailEmployeeDetail_")
  
  useEffect(() => {
    return () => props.handleToggleDetailModalOther(false)
  }, [])

  const onClosePopupEmployeeDetail = () => {
    setShowEmployeeDetails(false);
  }
 /**
   * check and render modal employee detail
   */
  const renderPopUpEmployeeDetails = () => {
    if (showEmployeeDetails) {
      return <PopupEmployeeDetail
        id={employeeDetailCtrlId[0]}
        showModal={true}
        openFromModal={true}
        employeeId={employeeId}
        listEmployeeId={[employeeId]}
        toggleClosePopupEmployeeDetail={onClosePopupEmployeeDetail}
        resetSuccessMessage={() => { }} />
    }
  }

  /**
   * set employeeId and set show modal employee details
   * @param itemId
   */
  const openPopUpEmployeeDetails = (itemId) => {
    setShowEmployeeDetails(true);
    setEmployeeId(itemId);
  }

  useEffect(() => {
    if(props.showDetailModalOther?.detailObjectId > 0 && props.showDetailModalOther?.detailType >= 0){
      openPopUpEmployeeDetails(props.showDetailModalOther?.detailObjectId);
    }
  }, [props.showDetailModalOther])

return (<>
    {renderPopUpEmployeeDetails()}
  </>);}

const mapStateToProps = ({ timelineReducerState }: IRootState) => ({
  showDetailModalOther: timelineReducerState.showDetailModalOther,
});

const mapDispatchToProps = {
  handleToggleDetailModalOther
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
mapStateToProps,
mapDispatchToProps
)(TimelineDetailEmployee);
