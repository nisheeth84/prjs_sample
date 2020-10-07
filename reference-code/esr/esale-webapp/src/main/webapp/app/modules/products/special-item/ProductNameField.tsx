import _ from 'lodash';
import React from 'react';
import Popover from 'app/shared/layout/common/Popover';
import { connect } from 'react-redux';
import { ScreenMode, ControlType } from 'app/config/constants';
import DynamicControlField from 'app/shared/layout/dynamic-form/control-field/dynamic-control-field';
import { getValueProp } from 'app/shared/util/entity-utils';
import StringUtils from 'app/shared/util/string-utils';
import { stringify } from 'querystring';

export interface IProps extends StateProps{
  rowData: any;
  mode: ScreenMode;
  field;
  errorInfo;
  updateStateField;
  nameKey;
  firstFocus;
  onOpenPopupProductDetail
}

const ProductNameField: React.FC<IProps> = ({rowData, tenant,mode,firstFocus, nameKey, errorInfo,...props}) => {
  const getId = getValueProp(rowData, nameKey)
  const fieldValue = getValueProp(rowData, props.field.fieldName);

 if(mode === ScreenMode.EDIT){
    const isFocus = firstFocus?.id === rowData[firstFocus.nameId] &&
          StringUtils.equalPropertyName(firstFocus.item, props.field.fieldName);

    const errorByField = errorInfo && errorInfo.length > 0 ? errorInfo.find(
      error => 
        error && error.rowId.toString() === getValueProp(rowData, 'productId').toString() && StringUtils.equalPropertyName(error.item, props.field?.fieldName)
    ) : null;
   
    return <div className="width-200" ><DynamicControlField
              errorInfo={errorByField}
              controlType={ControlType.EDIT_LIST}
              fieldInfo={props.field}
              elementStatus={{ fieldValue, key:getId }}
              updateStateElement={props.updateStateField ? props.updateStateField : (d, t, e) => {}}
              idUpdate={getId}
              isFocus={isFocus}
          /></div> 
  } 

  return (
    <div  className='overflow-menu margin-left-4 d-flex'>
              <a className="d-inline-block text-ellipsis max-calc-product-name" onClick={() => props.onOpenPopupProductDetail(getId, null, true)} >
                <Popover x={-20} y={25}>
                    {rowData.product_name}
                </Popover>
              </a>
      <a
        title=""
        className="icon-small-primary icon-link-small overflow-menu-item"
        href={`${window.location.origin}/${tenant}/${rowData.is_set ?'product-set-detail' :'product-detail'}/${rowData.product_id}`}
        target="_blank"
        rel="noopener noreferrer"
      ></a>
    </div>
  );
}

const mapStateToProps = ({applicationProfile}) => ({
  tenant: applicationProfile.tenant,
})

type StateProps = ReturnType<typeof mapStateToProps>;
export default connect(mapStateToProps)(ProductNameField)

