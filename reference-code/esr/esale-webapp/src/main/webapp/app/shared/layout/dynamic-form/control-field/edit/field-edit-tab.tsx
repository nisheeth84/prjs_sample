import React, { useState, useEffect, forwardRef } from 'react';
import { Storage } from 'react-jhipster';
import { ControlType } from 'app/config/constants';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { getValueProp } from 'app/shared/util/entity-utils';
import _ from 'lodash';
import { DEFINE_FIELD_TYPE } from '../../constants';
import { getFieldLabel } from 'app/shared/util/string-utils';


type IFieldEditTabProps = IDynamicFieldProps;

const FieldEditTab = forwardRef((props: IFieldEditTabProps, ref) => {
  const [listTab, setListTab] = useState([])
  const [listFieldTabContent, setListFieldTabContent] = useState([]);
  const [currentTab, setCurrentTab] = useState(null)

  useEffect(() => {
    if (props.listFieldInfo) {
      setListTab(props.listFieldInfo.filter( e => e.fieldType.toString() === DEFINE_FIELD_TYPE.TAB))
    }
  }, [props.listFieldInfo])

  useEffect(() => {
    if (!listTab || listTab.length < 1) {
      return;
    }
    if (_.isNil(currentTab)) {
      setCurrentTab(listTab[0])
    } else {
      const idx = listTab.findIndex( e => e.fieldId === currentTab.fieldId)
      if (idx < 0) {
        setCurrentTab(listTab[0])
      }
    }
  }, [listTab])

  useEffect(() => {
    if (!props.listFieldInfo || _.isNil(currentTab)) {
      setListFieldTabContent([])
    } else {
      const idx = listTab.findIndex( e => e.fieldId === currentTab.fieldId)
      if (idx < 0) {
        setListFieldTabContent([])
      } else {
        let tabData = listTab[idx].tabData;
        if (!tabData) {
          tabData = []
        }
        const tmp = props.listFieldInfo.filter( e => tabData.findIndex( o => o === e.fieldId) >= 0)
        setListFieldTabContent(tmp)
      }
    }
  }, [currentTab])

  let type = ControlType.EDIT;
  if (props.controlType) {
    type = props.controlType;
  }

  const onChangeTab = (tab) => {
    setCurrentTab(tab);
  }

  const renderComponentEdit = () => {
    return (<>
      {listTab && listTab.length > 0 &&
      <div className='col-lg-12 tab-detault enable-position-relative w100'>
        <ul className="nav nav-tabs mb-0 w100">
          {listTab.map((tab, idx) => {
            return (
              <li className="nav-item" key={idx}>
              {_.get(currentTab, 'fieldId') === tab.fieldId ? 
                <a onClick={() => onChangeTab(tab)} className="nav-link active" data-toggle="tab">{getFieldLabel(tab, 'fieldLabel')}</a>
              : <a onClick={() => onChangeTab(tab)} className="nav-link" data-toggle="tab">{getFieldLabel(tab, 'fieldLabel')}</a>}
              </li>
            )
          })}
        </ul>
        <div className="tab-content table-margin-bottom-10 clearfix nobor-top">
          {props.renderControlContent && props.renderControlContent(listFieldTabContent)}
        </div>
      </div>
    }
    </>)
  }

  const renderComponentEditList = () => {
    return <></>;
  }

  const renderComponent = () => {
    if (type === ControlType.EDIT || type === ControlType.ADD) {
      return renderComponentEdit();
    } else if (type === ControlType.EDIT_LIST) {
      return renderComponentEditList();
    }
    return <></>;
  }

  return renderComponent();
});

export default FieldEditTab
