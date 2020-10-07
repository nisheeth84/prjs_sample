import React, { useState, useEffect } from 'react';
import GlobalControlTask from 'app/modules/global/task/global-control-task'
import GlobalControlList from 'app/modules/global/list/global-control-list'
import { TYPE_GLOBAL_CONTROL } from 'app/modules/global/constants'

/**
 * Component show global tool in right side of screen
 * @param props
 */
const GlobalControlRight = (props) => {
  const GLOBAL_STATE = {
    OPEN: 1,
    MINIMIZE: 2,
    CLOSE: 3
  }

  const [typeGlobal, setTypeGlobal] = useState(null)
  const [typeGlobalActive, setTypeGlobalActive] = useState(null)
  const [state, setState] = useState(GLOBAL_STATE.MINIMIZE);
  const [oldState, setOldState] = useState(null);
  const [havePopupConfirm, setHavePopupConfirm] = useState(false);


  /**
   * event button 5 click
   */
  const onCollapGlobalControll = () => {
    // Fix padding right when open/close global tool
    if (state === GLOBAL_STATE.CLOSE) {
      document.body.classList.remove('close-control-right');
    } else {
      document.body.classList.add('close-control-right');
    }

    if (state === GLOBAL_STATE.OPEN && havePopupConfirm) {
      setOldState(GLOBAL_STATE.OPEN);
      setState(GLOBAL_STATE.CLOSE);
    } else if (state === GLOBAL_STATE.MINIMIZE || state === GLOBAL_STATE.OPEN) {
      setOldState(GLOBAL_STATE.MINIMIZE);
      setState(GLOBAL_STATE.CLOSE);
    } else {
      setState(oldState ? oldState : GLOBAL_STATE.MINIMIZE)
    }
  }

  useEffect(() => {
    const idChatplus = document.getElementById("chatplusview");
    if (idChatplus && idChatplus.classList) {
      if (state === GLOBAL_STATE.OPEN) {
        idChatplus.style.right = '288px';
      } else {
        idChatplus.style.right = '48px';
      }
    }
  }, [state]);


  /**
   * render global tool for calendar or list
   */
  const renderGlobalControl = () => {
    switch (typeGlobal) {
      case TYPE_GLOBAL_CONTROL.LIST:
        return (
          <div className="wrap-calendar">
            <GlobalControlList onClose={() => { setState(GLOBAL_STATE.MINIMIZE); setTypeGlobalActive(null); }} />
          </div>
        )
      case TYPE_GLOBAL_CONTROL.TASK:
        return <GlobalControlTask
          onClose={() => { setState(GLOBAL_STATE.MINIMIZE); setTypeGlobalActive(null); }}
          onHavePopupConfirm={(hasPopupConfirm) => setHavePopupConfirm(hasPopupConfirm)}
        />
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
    setTypeGlobalActive(type);
    setState(GLOBAL_STATE.OPEN)
  }

  return <div className='wrap-task'>
    <div className={`control-right ${(state === GLOBAL_STATE.OPEN) ? "control-right-open" : ""} ${(state === GLOBAL_STATE.CLOSE) ? "close" : ""}`}>
      <ul>
        <li className={(typeGlobalActive === TYPE_GLOBAL_CONTROL.TASK) ? "active" : ""}><a onClick={() => onClickTool(TYPE_GLOBAL_CONTROL.TASK)} className="button-popup button-right-note"><img src="content/images/ic-right-list.svg" alt="" /></a></li>
        <li className={(typeGlobalActive === TYPE_GLOBAL_CONTROL.LIST) ? "active" : ""}><a onClick={() => onClickTool(TYPE_GLOBAL_CONTROL.LIST)} className="button-popup button-right-list"><img src="content/images/ic-sidebar-calendar.svg" alt="" /></a></li>
      </ul>
      <a className="expand-control-right" onClick={onCollapGlobalControll}><i className={(state === GLOBAL_STATE.CLOSE) ? "far fa-angle-left" : "far fa-angle-right"} /></a>
      {renderGlobalControl()}
    </div>
  </div>
}

export default GlobalControlRight
