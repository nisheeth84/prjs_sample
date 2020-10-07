import React, { useEffect, useState } from 'react';
import { translate } from "react-jhipster";
import { IRootState } from "app/shared/reducers";
import { connect } from "react-redux";
import { DataOfResource } from "app/modules/calendar/grid/common";
import {
  storeScheduleConfirmEquip,
  TYPE_SCREEN,
  updateScheduleHasEquipmentDuplicate,
  resetPopupConfirmScheduleLoop,
  setPreScheduleData
} from "../../../popups/create-edit-schedule.reducer";
import moment from 'moment';
import {CONVERT_DATE} from '../../../constants';

type IEquipmentConfirm = StateProps & DispatchProps & {
  dataOfResource: DataOfResource,
  isEdit?: boolean,
  isDrag?: boolean,
  isNotSave?: boolean
}

const EquipmentConfirm = (props: IEquipmentConfirm) => {
  const [showPopupEquipmentsConfirm, setShowPopupEquipmentsConfirm] = useState(false);
  const [equipmentFlag, setEquipmentFlag] = useState<any>(null);

  useEffect(() => {
    if (props.popupEquipmentConfirm === props.dataOfResource.scheduleId) {
      setShowPopupEquipmentsConfirm(true);
    } else {
      setShowPopupEquipmentsConfirm(false);
    }
  }, [props.popupEquipmentConfirm]);

  const renderDuplicate = () => {
    const equipmentsData = props.dataEquipments
    return (
      <>
        {
          equipmentsData && Array.isArray(equipmentsData) &&
          equipmentsData.map(equipment => {
            // if (equipment.periods && Array.isArray(equipment.periods) && equipment.equipmentId === props.dataOfResource.resourceId) {
            if (equipment.periods && Array.isArray(equipment.periods)) {
              return equipment.periods.map((item, idx) => {
                if (!item.canUse) {
                  return <p className={props.isDrag ? "date mb-4 layout-confirm-equip-loop-default" : "date mb-4"} 
                    key={`confirm_equip_${idx}`}>
                      {CONVERT_DATE(moment(item.startDate), moment(item.endDate), true)}
                  </p>
                }
              });
            }
          })

        }
      </>
    )
  }

  const renderPopupConfirm = () => {
    return <>
      <div className="popup-esr2 popup-normal" id="popup-esr2">
        <div className="popup-esr2-content">
          <div className="popup-esr2-body">
            <div className="popup-esr2-title font-weight-normal">
              {!props.isEdit ? translate('calendars.equipments.titlePopupConfirmAdd') : translate('calendars.equipments.titlePopupConfirmEdit')}
            </div>
            {renderDuplicate()}
            <div className="wrap-check-radio">
              <p className="radio-item">
                <input type="radio"
                  id="radio_equip_confirm_1"
                  name="radio1_confirm_equip_loop"
                  value={0}
                  checked={equipmentFlag === 0}
                  onClick={() => setEquipmentFlag(0)}
                />
                <label htmlFor="radio_equip_confirm_1">
                  {!props.isEdit ? translate('calendars.equipments.optionFirstAdd') : translate('calendars.equipments.optionFirstEdit')}
                </label>
              </p>
              <p className="radio-item">
                <input type="radio"
                  id="radio_equip_confirm"
                  name="radio1_confirm_equip_loop"
                  value={1}
                  checked={equipmentFlag === 1}
                  onClick={() => setEquipmentFlag(1)}
                />
                <label htmlFor="radio_equip_confirm">
                  {!props.isEdit ? translate('calendars.equipments.optionTwoAdd') : translate('calendars.equipments.optionTwoEdit')}
                </label>
              </p>
            </div>
            <p className="note color-red mt-2 pl-3">
              {!props.isEdit ? translate('calendars.equipments.noteAdd') : translate('calendars.equipments.noteEdit')}
            </p>
          </div>
          <div className="popup-esr2-footer">
            <a title=""
              className="button-cancel"
              onClick={() => {
                props.isDrag && props.resetScheduleData({});
                setShowPopupEquipmentsConfirm(false);
                props.resetPopupConfirmScheduleLoop();
              }}
            >
              {translate('calendars.equipments.cancel')}
            </a>
            <a title=""
              className="button-blue"
              onClick={() => {
                if (!props.isEdit) {
                  props.storeScheduleConfirmEquip(equipmentFlag, props.isNotSave);
                } else {
                  props.updateScheduleHasEquipmentDuplicate(
                      props.updateFlag,
                      equipmentFlag,
                      props.isNotSave
                  )
                }
              }}
            >
              {translate('calendars.equipments.confirmEquip')}
            </a>
          </div>
        </div>
      </div>
      <div className="modal-backdrop show" />
    </>
  }

  const renderPopupConfirmWhenDrag = () => {
    return <div className="popup-align-right">
      <div className="form-popup">
        <div className="popup-content max-height-auto style-3 popup-calendar-tool-1">
          {renderPopupConfirm()}
        </div>
      </div>
    </div>
  }

  const renderContentBody = () => {
    return props.isDrag ? renderPopupConfirmWhenDrag() : renderPopupConfirm();
  }

  return (showPopupEquipmentsConfirm && 
    renderContentBody()
  )
}
const mapStateToProps = ({ dataCreateEditSchedule }: IRootState) => ({
  popupEquipmentConfirm: dataCreateEditSchedule.popupEquipmentConfirm,
  updateFlag: dataCreateEditSchedule.updateFlag,
  dataEquipments: dataCreateEditSchedule.dataEquipments,
});

const mapDispatchToProps = {
  updateScheduleHasEquipmentDuplicate,
  storeScheduleConfirmEquip,
  resetPopupConfirmScheduleLoop,
  resetScheduleData: setPreScheduleData
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EquipmentConfirm);
