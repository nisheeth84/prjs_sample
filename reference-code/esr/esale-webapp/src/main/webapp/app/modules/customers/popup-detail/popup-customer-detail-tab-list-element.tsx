import React, { useState, useEffect } from 'react';
import { DropTarget } from 'react-dnd'
import { DragSource, DragSourceMonitor, DragSourceConnector, DropTargetMonitor, ConnectDropTarget, ConnectDragSource } from 'react-dnd'
import { BADGES } from '../constants'
import { TAB_ID_LIST } from 'app/modules/customers/constants';
import { ScreenMode } from 'app/config/constants';
import _ from 'lodash';
import { getFieldLabel } from 'app/shared/util/string-utils';
import { translate } from 'react-jhipster';

export interface IPopupTabListElementProps {
  tab: any,
  currentTab: string,
  onChangeTab?: (clickedIdTab) => void;
  connectDragSource?: ConnectDragSource;
  connectDropTarget?: ConnectDropTarget;
  onDragDropTabList: (dragSource, dropTarget) => void;
  deleteTab: (tabId) => void;
  screenMode: any;
}

const TabListElement = (props: IPopupTabListElementProps) => {
  const [, setFirst] = useState(false);
  const [, setShouldRender] = useState(false);
  const [hoverTab, setHoverTab] = useState();
  const [hovered, setHovered] = useState(false);
  useEffect(() => {
    setFirst(true);
    setShouldRender(true);
    return () => { setFirst(false); }
  }, []);

  const headerHoverOn = (item) => {
    setHoverTab(item)
    setHovered(true);
  }

  const headerHoverOff = (item) => {
    setHovered(false);
  }

  const onChangeTab = () => {
    props.onChangeTab(props.tab.tabId);
  }

  const deleteTab = () => {
    props.deleteTab(hoverTab);
  }

  if (props.screenMode === ScreenMode.DISPLAY) {
    return (
      <li className="nav-item">
        <a onClick={onChangeTab} className={`nav-link ${props.currentTab === props.tab.tabId ? 'active' : ''}`} data-toggle="tab">{getFieldLabel(props.tab, 'tabLabel')}
          {props.tab.badges ?
            <span className="tooltip-red">
              {props.tab.badges > BADGES.maxBadges ? ('+' + BADGES.maxBadges) : props.tab.badges}</span>
            : props.tab.tabId === TAB_ID_LIST.calendar ? <span className="tooltip-gray">{translate('customers.detail.label.tab.calendarNoPlan')}</span> : <span></span>
          }
        </a>
      </li>
    )
  } else if (props.screenMode === ScreenMode.EDIT) {
    if (props.tab.tabId === TAB_ID_LIST.summary) {
      return (
        <li className="nav-item">
          <a onClick={onChangeTab} className={`nav-link ${props.currentTab === props.tab.tabId ? 'active' : ''} delete`} data-toggle="tab">{getFieldLabel(props.tab, 'tabLabel')}
            {props.tab.badges ?
              <span className="tooltip-red">
                {props.tab.badges > BADGES.maxBadges ? ('+' + BADGES.maxBadges) : props.tab.badges}</span>
              : props.tab.tabId === TAB_ID_LIST.calendar ? <span className="tooltip-gray">{translate('customers.detail.label.tab.calendarNoPlan')}</span> : <span></span>
            }
          </a>
        </li>
      )
    } else {
      return props.connectDropTarget(props.connectDragSource(
        <li className="nav-item"
          onMouseEnter={() => { headerHoverOn(props.tab) }}
          onMouseLeave={() => { headerHoverOff(props.tab) }}>
          {props.currentTab === props.tab.tabId ?
            <a onClick={onChangeTab} className="nav-link active delete" data-toggle="tab">{getFieldLabel(props.tab, 'tabLabel')}</a>
            : <a onClick={onChangeTab} className="nav-link delete" data-toggle="tab">{getFieldLabel(props.tab, 'tabLabel')}
              {props.tab.badges ?
                <span className="tooltip-red">
                  {props.tab.badges > BADGES.maxBadges ? ('+' + BADGES.maxBadges) : props.tab.badges}</span>
                : props.tab.tabId === 3 ? <span className="tooltip-gray">{translate('customers.detail.label.tab.calendarNoPlan')}</span> : <span></span>
              }
            </a>
          }
          {hovered && <a onClick={deleteTab} className='icon-small-primary icon-erase-small'></a>}
        </li>
      )
      )
    }
  }
}

const dragSourceHOC = DragSource(
  "TabList",
  {
    beginDrag: (props: IPopupTabListElementProps) => ({ type: "TabList", sourceField: props.tab }),
    endDrag(props: IPopupTabListElementProps, monitor: DragSourceMonitor) {
      const dropResult = monitor.getDropResult()
      if (dropResult) {
        props.onDragDropTabList(props.tab.tabId, dropResult.target.tabId);
      }
    },
  },
  (connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  }),
);

const dropTargetHOC = DropTarget(
  ["TabList"],
  {
    drop: ({ tab }: IPopupTabListElementProps) => ({
      target: tab,
    }),
    hover(props: IPopupTabListElementProps, monitor: DropTargetMonitor, component: any) {
    },
  },
  (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
  }),
);

export default dropTargetHOC(dragSourceHOC(TabListElement));

