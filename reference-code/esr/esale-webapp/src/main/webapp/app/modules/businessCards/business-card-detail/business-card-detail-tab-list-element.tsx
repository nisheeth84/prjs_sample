import _ from 'lodash';
import React, { useState, useEffect, useRef } from 'react';
import { DragSource, DragSourceMonitor, DragSourceConnector, DropTargetMonitor, ConnectDropTarget, ConnectDragSource, useDrop, useDrag } from 'react-dnd'
import { DropTarget } from 'react-dnd'
import { ScreenMode } from 'app/config/constants';
import { Storage, translate } from 'react-jhipster';
import { BADGES, TAB_ID_LIST } from '../constants'
import { isJsonString } from '../util';

export interface IPopupTabListElementProps {
  tab: any,
  currentTab: string,
  onChangeTab?: (clickedIdTab) => void;
  connectDragSource?: ConnectDragSource;
  connectDropTarget?: ConnectDropTarget;
  onDragDropTabList: (dragSource, dropTarget) => void;
  deleteTab: (tabId) => void;
  screenMode: any;
  badges?: any;
}

const TabListElement = (props: IPopupTabListElementProps) => {
  const [, setFirst] = useState(false);
  const [, setShouldRender] = useState(false);
  const [hoverTab, setHoverTab] = useState();
  const [hovered, setHovered] = useState(false);
  const [badges, setBadges] = useState(null);

  useEffect(() => {
    setFirst(true);
    setShouldRender(true);
    return () => { setFirst(false); }
  }, []);

  useEffect(() => {
    if(props.badges) {
      setBadges(props.badges)
    }
  }, [props.badges])

  

  const lang = Storage.session.get('locale', "ja_jp");
  const getFieldLabel = (item, fieldLabel) => {
    const itemTmp = _.cloneDeep(item);
    if (!item) {
      return '';
    }

    itemTmp[fieldLabel] = isJsonString(itemTmp[fieldLabel]) ? JSON.parse(itemTmp[fieldLabel]) : {};
    // TODO waiting update API
    // if (Object.prototype.hasOwnProperty.call(item, fieldLabel)) {
    //   return item[fieldLabel];
    // }
    // return StringUtils.getValuePropStr(item, 'label_' + lang);

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
    if (props.tab.tabId === TAB_ID_LIST.calendar) {
      return (
        <li className="nav-item">
          <a onClick={onChangeTab} className={`nav-link${props.currentTab === props.tab.tabId ? ' active' : ''} `} data-toggle="tab">{getFieldLabel(props.tab, 'tabLabel')}
            {badges ?
              <span className="tooltip-red">
                {badges > BADGES.maxBadges ? ('+' + BADGES.maxBadges) : badges}</span>
              : <span className="tooltip-gray">{translate("businesscards.detail.label.badges.empty")}</span>
            }
          </a>
        </li>
      )
    } else {
      return (
        <li className="nav-item">
          <a onClick={onChangeTab} className={`nav-link${props.currentTab === props.tab.tabId ? ' active' : ''} `} data-toggle="tab">{getFieldLabel(props.tab, 'tabLabel')}
          </a>
        </li>
      )
    }
  } else if (props.screenMode === ScreenMode.EDIT) {
    if (props.tab.tabId === TAB_ID_LIST.summary) {
      return (
        <li className="nav-item">
          <a onClick={onChangeTab} className={`nav-link${props.currentTab === props.tab.tabId ? ' active' : ''} `} data-toggle="tab">{getFieldLabel(props.tab, 'tabLabel')}
          </a>
        </li>
      )
    } else {
      return props.connectDropTarget(props.connectDragSource(
        <li className="nav-item"
          onMouseEnter={() => { headerHoverOn(props.tab) }}
          onMouseLeave={() => { headerHoverOff(props.tab) }}>
            <a onClick={onChangeTab} className={`nav-link${props.currentTab === props.tab.tabId ? ' active' : ''} `} data-toggle="tab">{getFieldLabel(props.tab, 'tabLabel')}
              {badges && props.tab.tabId === TAB_ID_LIST.calendar ?
                <span className="tooltip-red">
                  {badges > BADGES.maxBadges ? ('+' + BADGES.maxBadges) : badges}</span>
                : props.tab.tabId === TAB_ID_LIST.calendar ? <span className="tooltip-gray">{translate("businesscards.detail.label.badges.empty")}</span> : <span></span>
              }
            </a>
          {hovered && <a onClick={deleteTab} className='icon-small-primary icon-erase-small'></a>}
        </li>
      ))
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

