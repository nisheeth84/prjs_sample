import React, { useState } from 'react';
import { TYPE_SALES_CONTROL } from '../constants'
import  GlobalControlTask  from 'app/modules/global/task/global-control-task';
import GlobalControlList from 'app/modules/global/list/global-control-list';


/**
 * Component show global tool in right side of screen
 * @param props
 */

const SalesControlRight = (props) => {
  const GLOBAL_STATE = {
    OPEN: 1,
    MINIMIZE: 2,
    CLOSE: 3
  }

  const [typeGlobal, setTypeGlobal] = useState(TYPE_SALES_CONTROL.LIST)
  const [state, setState] = useState(GLOBAL_STATE.MINIMIZE);
  const [oldState, setOldState] = useState(null);
  /**
* event button 5 click
*/
  const onCollapGlobalControll = () => {
    if (state === GLOBAL_STATE.OPEN) {
      setOldState(GLOBAL_STATE.OPEN);
      setState(GLOBAL_STATE.CLOSE);
    } else if (state === GLOBAL_STATE.MINIMIZE) {
      setOldState(GLOBAL_STATE.MINIMIZE);
      setState(GLOBAL_STATE.OPEN);
    } else {
      setState(oldState ? oldState : GLOBAL_STATE.MINIMIZE)
    }
  }


  /**
   * render global tool for calendar or list
   */
  const renderGlobalControl = () => {
    switch (typeGlobal) {
      case TYPE_SALES_CONTROL.LIST:
        return <GlobalControlList onClose={() => setState(GLOBAL_STATE.MINIMIZE)} />;
      case TYPE_SALES_CONTROL.TASK:
        return <div className="sidebar-right"></div>;
      default:
        return <div></div>
    }
  }



  /**
   * event click icon calendar
   * @param type
   */
  const onClickTool = (type) => {
    setTypeGlobal(type);
    setState(GLOBAL_STATE.OPEN)
  }


  return (
    <>
      <div className={`control-right ${(state === GLOBAL_STATE.OPEN) ? "control-right-open" : ""} ${(state === GLOBAL_STATE.CLOSE) ? "close" : ""}`}>
        <ul>
          <li className={(typeGlobal === TYPE_SALES_CONTROL.TASK) ? "active" : ""}><a onClick={() => onClickTool(TYPE_SALES_CONTROL.TASK)} className="button-popup button-right-note"><img src="/content/images/ic-right-note.svg" alt="" /></a></li>
          <li className={(typeGlobal === TYPE_SALES_CONTROL.LIST) ? "active" : ""}><a onClick={() => onClickTool(TYPE_SALES_CONTROL.LIST)} className="button-popup button-right-list"><img src="/content/images/ic-right-list.svg" alt="" /></a></li>
        </ul>
        <a className="expand-control-right" onClick={onCollapGlobalControll}><i className={(state !== GLOBAL_STATE.OPEN) ? "far fa-angle-left" : "far fa-angle-right"} /></a>
        {renderGlobalControl()}
      </div>
    </>
  );
}

export default SalesControlRight
