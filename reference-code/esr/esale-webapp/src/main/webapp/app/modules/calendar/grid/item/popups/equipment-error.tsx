import React, {useEffect, useState} from 'react';
import {translate} from "react-jhipster";
import {IRootState} from "app/shared/reducers";
import {connect} from "react-redux";
import {DataOfResource} from "app/modules/calendar/grid/common";
import {resetPopupEquipmentError, setPreScheduleData} from "../../../popups/create-edit-schedule.reducer";

type IEquipmentError = StateProps & DispatchProps & {
  dataOfResource: DataOfResource,
  isEdit?: boolean,
  isDrag?: boolean
}

const EquipmentError = (props: IEquipmentError) => {
  const [showPopupEquipmentsError, setShowPopupEquipmentsError] = useState(false);

  useEffect(() => {
    if (props.popupEquipmentError === props.dataOfResource.scheduleId && !props.isDrag) {
      setShowPopupEquipmentsError(true);
    }
    if ((props.popupEquipmentError === `${props.dataOfResource.scheduleId}_${props.dataOfResource.uniqueId}`) && props.isDrag) {
      setShowPopupEquipmentsError(true);
    }
  }, [props.popupEquipmentError]);

  return (showPopupEquipmentsError && <>
    <div className="popup-esr2 popup-normal" id="popup-esr2">
      <div className="popup-esr2-content">
        <div className="popup-esr2-body">
          <div className="popup-esr2-title">
            {props.isEdit ? (props.isDrag ? translate('calendars.equipments.titlePopupErrorEditDrag') : translate('calendars.equipments.titlePopupErrorEdit')) : translate('calendars.equipments.titlePopupErrorAdd')}
          </div>
        </div>
        <div className="popup-esr2-footer">
          <a title="" className="button-blue"
            onClick={() => {
              props.isDrag && props.resetScheduleData({});
              setShowPopupEquipmentsError(false);
              props.resetPopupEquipmentError();
          }}>
            {translate('calendars.equipments.ok')}
          </a>
        </div>
      </div>
    </div>
    <div className="modal-backdrop show"/>
  </>)
}
const mapStateToProps = ({ dataCreateEditSchedule }: IRootState) => ({
  popupEquipmentError: dataCreateEditSchedule.popupEquipmentError,
});

const mapDispatchToProps = {
  resetPopupEquipmentError,
  resetScheduleData: setPreScheduleData
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EquipmentError);
