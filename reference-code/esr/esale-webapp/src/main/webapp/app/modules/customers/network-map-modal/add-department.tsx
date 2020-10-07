import React, { useEffect, useState } from 'react';
import DialogDirtyCheck from 'app/shared/layout/common/dialog-dirty-check';
import { translate } from 'react-jhipster';
import { Modal } from 'reactstrap';
import { connect } from 'react-redux';
import { handleGetDepartmentsByCustomerId, NetworkMapAction } from './add-edit-network-map.reducer';
import { IRootState } from 'app/shared/reducers';
import BeautyPullDown from './beauty-pull-down';
import { ADD_DEPARTMENT_TO_BUSINESS_CARD } from '../constants';

export interface IAddDepartmentProps extends StateProps, DispatchProps {
  // departments list from AddEditNetworkMapModeTable 
  // close popup
  onClosePopupAddDepartment: () => void;
  // call action save department at AddEditNetworkMapModeTable
  onSaveDepartment: (departments) => void;
  customerId,
  iconFunction?: any;
  errorItems?: any;
}

/**
 * Add department to AddEditNetworkMapModeTable
 * @param props 
 */
const AddDepartment = (props: IAddDepartmentProps) => {
  const [departmentDto, setDepartmentDto] = useState({
    departmentId: null,
    departmentName: null,
    parentId: 1
  });
  const [errorItem, setErrorItem] = useState(null);
  const [departments, setDepartments] = useState([]);

  const baseUrl = window.location.origin.toString();
  const getIconFunction = () => {
    if (props.iconFunction) {
      return <img className="icon-group-user" src={baseUrl + `/content/images/${props.iconFunction}`} alt="" />
    }
    return <></>
  }

  /**
   * Check dirty when close the modal
   */
  const isChangeInputEdit = () => {
    if (departmentDto.departmentName && departmentDto.departmentName.trim()) {
      return true;
    }
    return false;
  }

  useEffect(() => {
    if (props.errorItems?.length > 0) {
      setErrorItem(props.errorItems[0].errorCode);
    }
  }, [props.errorItems]);

  /**
   * Save data when change input on screen
   */
  const handleEventInput = ({ target }) => {
    const { name, value } = target;
    setDepartmentDto({ ...departmentDto, [name]: (name === 'parentId') ? (Number(value) || null) : value });
    setErrorItem(null);
  }

  const onDepartmentChange = (value) => {
    setDepartmentDto({ ...departmentDto, ['parentId']: (value || null) });
  }

  const tranferCurrentData = (departmentCurrent) => {
    const result = {};
    result['itemId'] = departmentCurrent.departmentId;
    result['itemLabel'] = departmentCurrent.departmentName;
    result['itemParentId'] = departmentCurrent.parentId;
    return result;
  }

  const convertDataBeautyPullDown = (departmentArray) => {
    const data = {};
    data['fieldName'] = ADD_DEPARTMENT_TO_BUSINESS_CARD;
    data['fieldItems'] = departmentArray.map(dep => tranferCurrentData(dep));
    return data;
  }

  /**
   * Process dirty check
   */
  const executeDirtyCheck = async (action: () => void, cancel?: () => void) => {
    if (isChangeInputEdit()) {
      await DialogDirtyCheck({ onLeave: action, onStay: cancel });
    } else {
      action();
    }
  }

  /**
   * Close AddDepartment popup
   */
  const handleClosePopup = () => {
    executeDirtyCheck(() => {
      props.onClosePopupAddDepartment();
    });
  }

  /**
   * Action add department
   */
  const handleAddDepartment = () => {
    setErrorItem(null);
    if (isChangeInputEdit()) {
      const data = [];
      if (departments) {
        departments.forEach(department => {
          delete department['businessCardIds'];
          data.push(department);
        });
      }
      data.push(departmentDto);
      props.onSaveDepartment(data);
    } else {
      setErrorItem('ERR_COM_0013');
    }
  }

  useEffect(() => {
    if (props.customerId) {
      props.handleGetDepartmentsByCustomerId(props.customerId);
    }
  }, [])

  useEffect(() => {
    if (props.departmentListMapTable && props.departmentListMapTable.length > 0) {
      setDepartments(props.departmentListMapTable);
    }
  }, [props.departmentListMapTable])

  return (
    <Modal isOpen={true} fade toggle={() => { }} backdrop id="network-map-add-department" zIndex="9999">
      <div className="modal popup-esr popup-esr4 user-popup-page popup-align-right show" id="popup-esr" aria-hidden="true">
        <div className="modal-dialog small-modal form-popup">
          <div className="modal-content">
            <div className="modal-header">
              <div className="left">
                <div className="popup-button-back">
                  <a className="icon-small-primary icon-return-small" onClick={handleClosePopup} />
                  <span className="text">{getIconFunction()}{translate('customers.network-map.add-department.title')}</span>
                </div>
              </div>
              <div className="right">
                <a className="icon-small-primary icon-close-up-small line" onClick={handleClosePopup} />
              </div>
            </div>
            <div className="modal-body style-3 body-padding height-auto">
              <div className="popup-content style-3">
                <div className="row break-row">
                  {departments && <div className="col-lg-6">
                    <div className="form-group">
                      <label>{translate('customers.network-map.add-department.department-name.label')}</label>
                      <div className={errorItem ? "input-common-wrap error" : "input-common-wrap"}>
                        <input type="text" className="input-normal"
                          name="departmentName"
                          value={departmentDto.departmentName}
                          onChange={handleEventInput}
                          maxLength={100}
                          placeholder={translate('customers.network-map.add-department.department-name.placeholder')} autoFocus />
                        {errorItem && <span className="messenger">{translate(`messages.${errorItem}`, {0: departmentDto.departmentName})}</span>}
                      </div>
                    </div>
                    <div className="form-group">
                      <BeautyPullDown
                        showLabel={true}
                        value={departmentDto.parentId}
                        data={convertDataBeautyPullDown(departments)}
                        updateStateField={onDepartmentChange}
                        className="custom-row-invite-department"
                        defaultBlank={translate('customers.network-map.add-department.department-belong.placeholder')}
                        classPulldown={'max-height-200 w-100'}
                      />
                    </div>
                  </div>}
                </div>
              </div>
            </div>
            <div className="user-popup-form-bottom">
              <a className="button-cancel btn-cancel_custom" onClick={handleClosePopup}>{translate('customers.network-map.add-department.btn-cancel')}</a>
              <a className="button-blue button-form-register" onClick={handleAddDepartment}>{translate('customers.network-map.add-department.btn-add')}</a>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
};

const mapStateToProps = ({ addEditNetworkMap, }: IRootState) => ({
  departmentListMapTable: addEditNetworkMap.departmentListMapTable,
});
const mapDispatchToProps = {
  handleGetDepartmentsByCustomerId
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddDepartment);