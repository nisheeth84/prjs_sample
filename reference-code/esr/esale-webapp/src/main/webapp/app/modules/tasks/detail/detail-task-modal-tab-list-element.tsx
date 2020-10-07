import React, { useState, useEffect } from 'react';
import { DropTarget } from 'react-dnd'
import { Storage } from 'react-jhipster';
import { DragSource, DragSourceMonitor, DragSourceConnector, DropTargetMonitor, ConnectDropTarget, ConnectDragSource, useDrop, useDrag } from 'react-dnd'
import { BADGES } from '../constants';
import { ScreenMode } from 'app/config/constants';
import { TAB_ID_LIST } from 'app/modules/tasks/constants';
import _ from 'lodash';

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

  const lang = Storage.session.get('locale', "ja_jp");
  const getFieldLabel = (item, fieldLabel) => {
    const itemTmp = _.cloneDeep(item);
    if (!item) {
      return '';
    }
    itemTmp[fieldLabel] = JSON.parse(itemTmp[fieldLabel]);
    if (Object.prototype.hasOwnProperty.call(itemTmp, fieldLabel)) {
      if (Object.prototype.hasOwnProperty.call(itemTmp[fieldLabel], lang)) {
        return itemTmp[fieldLabel][lang];
      }
    }
    return '';
  }

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
        {props.currentTab === props.tab.tabId ? <a onClick={onChangeTab} className="nav-link active" data-toggle="tab">{getFieldLabel(props.tab, 'labelName')}</a>
          : <a onClick={onChangeTab} className="nav-link" data-toggle="tab">{getFieldLabel(props.tab, 'labelName')}
            {props.tab.badges ? <span className="tooltip-red">{props.tab.badges > BADGES.maxBadges ? ('+' + BADGES.maxBadges) : props.tab.badges}</span> : null}</a>}
      </li>
    )
  } else if (props.screenMode === ScreenMode.EDIT) {
    if (props.tab.tabId === TAB_ID_LIST.summary) {
      return (
        <li className="nav-item">
          {props.currentTab === props.tab.tabId ? <a onClick={onChangeTab} className="nav-link active" data-toggle="tab">{getFieldLabel(props.tab, 'labelName')}</a>
            : <a onClick={onChangeTab} className="nav-link" data-toggle="tab">{getFieldLabel(props.tab, 'labelName')}
              {props.tab.badges ? <span className="tooltip-red">{props.tab.badges > BADGES.maxBadges ? ('+' + BADGES.maxBadges) : props.tab.badges}</span> : null}</a>}
        </li>
      )
    } else {
      return props.connectDropTarget(props.connectDragSource(
        <li className="nav-item"
          onMouseEnter={() => { headerHoverOn(props.tab) }}
          onMouseLeave={() => { headerHoverOff(props.tab) }}>
          {props.currentTab === props.tab.tabId ? <a onClick={onChangeTab} className="nav-link active" data-toggle="tab">{getFieldLabel(props.tab, 'labelName')}</a>
            : <a onClick={onChangeTab} className="nav-link" data-toggle="tab">{getFieldLabel(props.tab, 'labelName')}
              {props.tab.badges ? <span className="tooltip-red">{props.tab.badges > BADGES.maxBadges ? ('+' + BADGES.maxBadges) : props.tab.badges}</span> : null}</a>}
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

