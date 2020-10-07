import React, { useImperativeHandle, forwardRef, useRef, useEffect, useState } from 'react';
import _ from 'lodash';
import { Options, connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { DEFINE_FIELD_TYPE, FIELD_ITEM_TYPE_DND, FIELD_NAME } from '../../constants';
import FieldSearchText from './field-search-text';
import FieldSearchPhone from './field-search-phone';
import FieldSearchSelect from './field-search-select';
import FieldSearchNumeric from './field-search-numeric';
import FieldSearchTime from './field-search-time';
import FieldSearchDate from './field-search-date';
import FieldSearchDateTime from './field-search-date-time';
import { translate } from 'react-jhipster';
import { useDrag, DragSourceMonitor, useDrop } from 'react-dnd';
import { getFieldByIds, reset } from 'app/shared/reducers/dynamic-field.reducer';
import { getIconSrc } from 'app/config/icon-loader';
import StringUtils, { getFieldLabel } from 'app/shared/util/string-utils';
import { FIELD_BELONG } from 'app/config/constants';
import FieldSpecialSearchContactDate from './field-special-search-contact-date';
import { isPathNameLocation } from 'app/shared/util/utils';

interface IFieldSearchDispatchProps {
  getFieldByIds;
  reset;
}

interface IFieldSearchStateProps {
  fieldInfoRelation: any;
}

type IFieldSearchBoxProps = IFieldSearchDispatchProps & IFieldSearchStateProps & IDynamicFieldProps;

const FieldSearchBox: React.FC<IFieldSearchBoxProps> = forwardRef((props, ref) => {
  const fieldSearchRef = useRef(null); // React.createRef();
  const [valueSearch, setValueSearch] = useState(null);
  const [fieldRelation, setFieldRelation] = useState(null);

  useImperativeHandle(ref, () => ({}));

  const idControl = `Search_${props.belong}_${props.fieldInfo.fieldId}_${props.fieldInfo.relationFieldId}`;
  useEffect(() => {
    // if (props.fieldInfo && !props.fieldInfo.fieldRelation && props.fieldInfo.relationFieldId > 0) {
    //   props.getFieldByIds(idControl, [props.fieldInfo.relationFieldId]);
    // }
    if (props.fieldInfo.fieldRelation) {
      setFieldRelation([props.fieldInfo.fieldRelation])
    }
    return () => {
      props.reset(idControl);
    };
  }, [props.fieldInfo]);

  useEffect(() => {
    if (props.updateStateElement) {
      if (!props.fieldInfo.fieldRelation && props.fieldInfo.relationFieldId > 0 && props.fieldInfoRelation && props.fieldInfoRelation.length > 0) {
        if (!fieldRelation) {
          setFieldRelation(props.fieldInfoRelation)
          const field = _.cloneDeep(props.fieldInfo);
          field.fieldRelation = props.fieldInfoRelation[0];
          // field.fieldRelation.fieldBelong = props.belong;
          field.fieldBelong = props.belong;
          props.updateStateElement(field, props.fieldInfo.fieldType, valueSearch);
        }
      }
    }
  }, [props.fieldInfoRelation]);

  const renderHeaderTitle = () => {
    const headerClass = '';
    if (
      props.fieldInfo.fieldType &&
      (props.fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.DATE ||
        props.fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.DATE_TIME)
    ) {
      return (<></>)
    }
    let label = StringUtils.escapeSpaceHtml(getFieldLabel(props.fieldInfo, 'fieldLabel'));
    let iconSrc = getIconSrc(props.belong)
    if (props.fieldInfo.relationFieldId > 0 && fieldRelation && fieldRelation.length > 0) {
      label = `${label} (${StringUtils.escapeSpaceHtml(getFieldLabel(fieldRelation[0], 'fieldLabel'))})`;
      iconSrc = getIconSrc(_.get(fieldRelation[0], 'relationData.fieldBelong'))
    }
    return (
      <>
        {props.showFieldLabel && props.isRequired && (
          <label className={headerClass}>
            <img className="mr-2 badge-icon" src={getIconSrc(props.belong)} alt="" />{label}
            <label className="label-red">{translate('dynamic-control.fieldFilterAndSearch.common.required')}</label>
          </label>
        )}
        {props.showFieldLabel && !props.isRequired && <label className={headerClass}><img className="mr-2 badge-icon" src={iconSrc} alt="" />{label}</label>}
        {!props.showFieldLabel && props.isRequired && (
          <label className={`${headerClass} label-red`}><img className="mr-2 badge-icon" src={iconSrc} alt="" />{translate('dynamic-control.fieldFilterAndSearch.common.required')}</label>
        )}
      </>
    );
  };

  const updateStateField = (fieldKey, type, val) => {
    if (props.updateStateElement) {
      if (props.fieldInfo.relationFieldId > 0 && !props.fieldInfo.fieldRelation && props.fieldInfoRelation && props.fieldInfoRelation.length > 0) {
        fieldKey.fieldRelation = props.fieldInfoRelation[0];
        // fieldKey.fieldRelation.fieldBelong = props.belong;
        fieldKey.fieldBelong = props.belong;
      }
      setValueSearch(val);
      props.updateStateElement(fieldKey, type, val);
    }
  };

  const renderDynamicControl = fieldType => {
    // case field special contact date
    if (
      // Number(props.fieldInfo.fieldType) === Number(DEFINE_FIELD_TYPE.OTHER) &&
      isPathNameLocation('sales') &&
      props.fieldInfo.fieldName === FIELD_NAME.CONTACT_DATE &&
      Number(props.fieldInfo.fieldBelong) === Number(FIELD_BELONG.ACTIVITY)
    ) {
      return (
       <FieldSpecialSearchContactDate ref={fieldSearchRef} {...props} updateStateElement={updateStateField} />
      );
    }

    switch (fieldType) {
      case DEFINE_FIELD_TYPE.SINGER_SELECTBOX:
        return <FieldSearchSelect ref={fieldSearchRef} {...props} updateStateElement={updateStateField} />;
      case DEFINE_FIELD_TYPE.MULTI_SELECTBOX:
        return <FieldSearchSelect ref={fieldSearchRef} {...props} updateStateElement={updateStateField} />;
      case DEFINE_FIELD_TYPE.CHECKBOX:
        return <FieldSearchSelect ref={fieldSearchRef} {...props} updateStateElement={updateStateField} />;
      case DEFINE_FIELD_TYPE.RADIOBOX:
        return <FieldSearchSelect ref={fieldSearchRef} {...props} updateStateElement={updateStateField} />;
      case DEFINE_FIELD_TYPE.NUMERIC:
        return <FieldSearchNumeric ref={fieldSearchRef} {...props} updateStateElement={updateStateField} />;
      case DEFINE_FIELD_TYPE.DATE:
        return <FieldSearchDate ref={fieldSearchRef} {...props} updateStateElement={updateStateField} fieldRelation={fieldRelation} />;
      case DEFINE_FIELD_TYPE.DATE_TIME:
        return <FieldSearchDateTime ref={fieldSearchRef} {...props} updateStateElement={updateStateField} fieldRelation={fieldRelation} />;
      case DEFINE_FIELD_TYPE.TIME:
        return <FieldSearchTime ref={fieldSearchRef} {...props} updateStateElement={updateStateField} />;
      case DEFINE_FIELD_TYPE.TEXT:
        return <FieldSearchText ref={fieldSearchRef} {...props} updateStateElement={updateStateField} />;
      case DEFINE_FIELD_TYPE.TEXTAREA:
        return <FieldSearchText ref={fieldSearchRef} {...props} updateStateElement={updateStateField} />;
      case DEFINE_FIELD_TYPE.FILE:
        return <FieldSearchText ref={fieldSearchRef} {...props} updateStateElement={updateStateField} />;
      case DEFINE_FIELD_TYPE.LINK:
        return <FieldSearchText ref={fieldSearchRef} {...props} updateStateElement={updateStateField} />;
      case DEFINE_FIELD_TYPE.PHONE_NUMBER:
        return <FieldSearchPhone ref={fieldSearchRef} {...props} updateStateElement={updateStateField} />;
      case DEFINE_FIELD_TYPE.ADDRESS:
        return <FieldSearchText ref={fieldSearchRef} {...props} updateStateElement={updateStateField} />;
      case DEFINE_FIELD_TYPE.EMAIL:
        return <FieldSearchText ref={fieldSearchRef} {...props} updateStateElement={updateStateField} />;
      case DEFINE_FIELD_TYPE.CALCULATION:
        return <FieldSearchNumeric ref={fieldSearchRef} {...props} updateStateElement={updateStateField} />;
      case DEFINE_FIELD_TYPE.SELECT_ORGANIZATION:
        return <FieldSearchText ref={fieldSearchRef} {...props} updateStateElement={updateStateField} />;
      case DEFINE_FIELD_TYPE.RELATION:
        return <FieldSearchText ref={fieldSearchRef} {...props} updateStateElement={updateStateField} />;
      case DEFINE_FIELD_TYPE.OTHER:
        return <FieldSearchText ref={fieldSearchRef} {...props} updateStateElement={updateStateField} />;
      default:
        return <></>;
    }
  };

  // let styleDisplay = 'col-lg-6 break-line form-group';
  let styleDisplay = 'break-line form-group';
  if (props.className) {
    styleDisplay = props.className;
  }

  const isSameFieldBelong = (field, fieldBelong) => {
    if (_.get(field, 'fieldBelong') === fieldBelong || _.get(field, 'fieldRelation.fieldBelong') === fieldBelong) {
      return true
    }
    return false;
  }

  const [{ isDragging }, connectDragSource] = useDrag({
    item: { type: FIELD_ITEM_TYPE_DND.MOVE_CARD, sourceField: props.fieldInfo },
    end(item, monitor: DragSourceMonitor) {
      const dropResult = monitor.getDropResult();
      if (dropResult && props.moveFieldCard) {
        props.moveFieldCard(props.fieldInfo, dropResult.fieldInfo);
      }
    },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const [{ isOver, canDrop }, connectDropTarget] = useDrop({
    accept: [FIELD_ITEM_TYPE_DND.MOVE_CARD, FIELD_ITEM_TYPE_DND.ADD_CARD],
    drop(item, monitor) {
      return { targetId: props.fieldInfo.fieldId, fieldInfo: props.fieldInfo };
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      isOverCurrent: monitor.isOver({ shallow: false }),
      canDrop: monitor.canDrop(),
      itemType: monitor.getItemType(),
      dragSource: monitor.getItem(),
    }),
    canDrop(item, monitor) {
      let fBelong = props.belong;
      if (props.fieldInfo.relationFieldId > 0 && monitor.getItemType() === FIELD_ITEM_TYPE_DND.MOVE_CARD) {
        fBelong = _.get(props.fieldInfo, 'fieldRelation.fieldBelong');
      }
      if ((_.get(monitor.getItem(), 'isDnDWithBelong') || _.get(props, 'isDnDWithBelong')) 
            && !isSameFieldBelong(_.get(monitor.getItem(), 'fieldInfo') || _.get(monitor.getItem(), 'sourceField'), fBelong)) {
        return false;
      }
      return true;
    }
  });

  const renderComponent = () => {
    const opacity = isDragging ? 0 : 1;
    return (
      <div className={styleDisplay} style={{ opacity }}>
        {renderHeaderTitle()}
        {renderDynamicControl(props.fieldInfo.fieldType && props.fieldInfo.fieldType.toString())}
        {!isDragging && isOver && canDrop && <div className='location-drop-drag' style={{ marginTop: '20px' }} />}
      </div>
    );
  };

  if (props.isDnDMoveField || props.isDnDAddField) {
    return (
      <>
        {connectDragSource(connectDropTarget(renderComponent()))}
      </>
    );
  }
  return renderComponent();
});

const mapStateToProps = ({ dynamicField }: IRootState, ownProps: IDynamicFieldProps) => {
  const defaultValue = {
    fieldInfoRelation: null
  };
  const id = `Search_${ownProps.belong}_${ownProps.fieldInfo.fieldId}_${ownProps.fieldInfo.relationFieldId}`;
  if (dynamicField && dynamicField.data.has(id)) {
    defaultValue.fieldInfoRelation = dynamicField.data.get(id).fieldByIds;
  }
  return defaultValue;
};

const mapDispatchToProps = {
  getFieldByIds,
  reset
};

const options = { forwardRef: true };

export default connect<IFieldSearchStateProps, IFieldSearchDispatchProps, IDynamicFieldProps>(
  mapStateToProps,
  mapDispatchToProps,
  null,
  options as Options
)(FieldSearchBox);
