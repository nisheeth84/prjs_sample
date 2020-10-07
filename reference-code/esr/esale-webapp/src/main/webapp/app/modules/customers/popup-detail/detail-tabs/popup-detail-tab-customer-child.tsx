import React, { useState, useEffect } from 'react';
import _ from 'lodash';

export interface ICustomerTabProps {
  customerChild?: any
}

const TabCustomerChild = (props: ICustomerTabProps) => {
  const [listChild, setlistChild] = useState({});

  /**
   * Expand/Collapse state for customer children
   * @param customerId id of customer parent
   */
  const setShowCustomerChild = (customerId) => {
    if (listChild[customerId] === undefined || listChild[customerId] === true) {
      listChild[customerId] = false;
    } else {
      listChild[customerId] = true;
    }
    const tmp = _.cloneDeep(listChild);
    setlistChild(tmp);
  }

  /**
   * Check customerChild is expanded or not
   * @param custmerId
   */
  const isExpanded = (custmerId) => {
    if (custmerId === undefined || custmerId === true) {
      return true;
    }
    return false;
  }

  /**
   * Render Customer Item
   * @param data
   */
  const CustomerItem = ({ data }) => {
    return (
      data && data.map((items) => (
        <li key={items.customerId}>
          <input type="text" className="input-normal input-common2" defaultValue={items.customerName} readOnly />
          {
            (Array.isArray(items.customerChild) && items.customerChild.length > 0) &&
            <i onClick={() => setShowCustomerChild(items.customerId)} className={"fas " + (!isExpanded(listChild[items.customerId]) ? "fa-minus" : "fa-plus")}></i>
          }
          {items.customerChild && !isExpanded(listChild[items.customerId])
            && <ul><CustomerItem data={items.customerChild} /></ul>}
        </li>
      ))
    )
  }


  if (!props.customerChild) {
    return <> </>;
  } else {
    return (
      <div className="tab-pane active mt-3 scroll-table">
        <div className="tree-map">
          <ul>
            {
              props.customerChild && Array.isArray(props.customerChild) && props.customerChild.length > 0 && props.customerChild.map((items) => (
                <li key={items && items.customerId}>
                  <input type="text" className="input-normal input-common2" defaultValue={items.customerName} readOnly />
                  {
                    (Array.isArray(items.customerChild) && items.customerChild.length > 0) && <ul><CustomerItem data={items.customerChild} /></ul>
                  }
                </li>
              ))
            }
          </ul>
        </div>
      </div>
    );
  }
}

export default TabCustomerChild;
