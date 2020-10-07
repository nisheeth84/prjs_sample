import React from 'react';
import Popover from 'app/shared/layout/common/Popover';
import { connect } from 'react-redux';
import { ScreenMode, ControlType } from 'app/config/constants';
import DynamicControlField from 'app/shared/layout/dynamic-form/control-field/dynamic-control-field';
import { getValueProp } from 'app/shared/util/entity-utils';
import StringUtils, { getFieldLabel } from 'app/shared/util/string-utils';
import { PRODUCT_SPECIAL_FIELD_NAMES } from '../constants';
import OpenModalDetail from 'app/shared/layout/common/open-modal-detail';

export interface IProps extends StateProps {
  rowData: any;
  mode: ScreenMode;
  field;
  errorInfo;
  updateStateField;
  nameKey;
  firstFocus;
  onOpenPopupProductDetail
  fieldName
}

const objTmp = {
  [PRODUCT_SPECIAL_FIELD_NAMES.productId]: {
    name: "productName",
    type: "product"
  },
  [PRODUCT_SPECIAL_FIELD_NAMES.productTradingProgressId]: {
    name: "progressName",
    type: null
  },
  ["customer_id"]: {
    name: 'customerName',
    type: "customer"
  }
  // PRODUCT_SPECIAL_FIELD_NAMES.createBy,
  // PRODUCT_SPECIAL_FIELD_NAMES.updateBy,
}

const SpecialNameField: React.FC<IProps> = ({ rowData, tenant, mode, firstFocus, nameKey, errorInfo, fieldName, ...props }) => {
  const getId = getValueProp(rowData, nameKey)
  const fieldValue = getFieldLabel(rowData, objTmp[fieldName].name)
  const type: any = objTmp[fieldName].type
  // if (mode === ScreenMode.EDIT) {
  //   const isFocus = firstFocus && firstFocus?.id === rowData[firstFocus.nameId] &&
  //     StringUtils.equalPropertyName(firstFocus.item, fieldName)


  //   return <div style={{ width: 200 }} >
  //     <Popover x={-20} y={25}>

  //       <DynamicControlField
  //         errorInfo={errorInfo}
  //         controlType={ControlType.EDIT_LIST}
  //         fieldInfo={props.field}
  //         elementStatus={{ fieldValue, key: getId }}
  //         updateStateElement={props.updateStateField ? props.updateStateField : (d, t, e) => { }}
  //         idUpdate={getId}
  //         // idUpdate={185}
  //         isFocus={isFocus}
  //       />
  //     </Popover>
  //   </div>
  // }
  return (
    <div className='overflow-menu margin-left-4 d-flex'>


      <span className="d-inline-block text-ellipsis max-calc-product-name" onClick={() => props.onOpenPopupProductDetail(getId, null, true)} >
        {type ? <OpenModalDetail id={getId} type={type}>
          {handleOpen => (
            <Popover x={-20} y={25}>
              <a onClick={handleOpen}>{fieldValue}</a>
            </Popover>
          )
          }
        </OpenModalDetail> : fieldValue
        }
      </span>
      {/* <a
        title=""
        className="icon-small-primary icon-link-small overflow-menu-item"
        href={`${window.location.origin}/${tenant}/${rowData.is_set ? 'product-set-detail' : 'product-detail'}/${rowData.product_id}`}
        target="_blank"
        rel="noopener noreferrer"
      ></a> */}
    </div>
  );
}

const mapStateToProps = ({ applicationProfile }) => ({
  tenant: applicationProfile.tenant,
})

type StateProps = ReturnType<typeof mapStateToProps>;
export default connect(mapStateToProps)(SpecialNameField)

