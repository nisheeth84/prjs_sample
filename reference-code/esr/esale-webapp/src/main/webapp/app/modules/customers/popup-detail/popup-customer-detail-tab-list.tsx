import React, { useState, useEffect, useRef } from 'react';
import TabListElement from './popup-customer-detail-tab-list-element';
import _ from 'lodash';
import { ScreenMode } from 'app/config/constants';
import { getFieldLabel } from 'app/shared/util/string-utils';

export interface IPopupTabListProps {
  onChangeTab?: (clickedIdTab) => void;
  tabListShow: any;
  tabList: any;
  onDragDropTabList?: (dragSource, dropTarget) => void;
  deleteAddTab: (tabListDelAddAfter, tabList) => void;
  currentTab?: any;
  screenMode: any;
}

const TabList = (props: IPopupTabListProps) => {
  const [tabListShow, setTabListShow] = useState([]);
  const [currentTab, setCurrentTab] = useState();
  const [, setFirst] = useState(false);
  const [, setShouldRender] = useState(false);
  const [tabList] = useState(props.tabList);

  useEffect(() => {
    setFirst(true);
    setTabListShow(props.tabListShow);
    setShouldRender(true);
    return () => { setFirst(false); }
  }, []);

  useEffect(() => {
    if (props.currentTab) {
      setCurrentTab(props.currentTab)
    } else {
      setCurrentTab(props.tabListShow[0].tabId)
    }
  }, [props.currentTab])

  useEffect(() => {
    setTabListShow(props.tabListShow);
  }, [props.tabListShow]);

  const onChangeTab = (tabId) => {
    setCurrentTab(tabId);
    props.onChangeTab(tabId);
  }

  const deleteTab = (tab) => {
    tabListShow.forEach((item, idx) => {
      if (item.tabId === tab.tabId) {
        tabListShow.splice(idx, 1);
      }
    })
    tabList.forEach((item, idx) => {
      if (item.tabId === tab.tabId) {
        tabList[idx].isDisplay = false;
      }
    })
    setTabListShow(_.cloneDeep(tabListShow));
    props.deleteAddTab(tabListShow, tabList);
  }

  return (
    <>
      {tabListShow.map((tab, idx) => {
        return (
          <>
            <TabListElement
              key={idx}
              tab={tab}
              deleteTab={deleteTab}
              currentTab={currentTab}
              onChangeTab={onChangeTab}
              onDragDropTabList={props.onDragDropTabList}
              screenMode={props.screenMode}
            />
          </>
        )
      })
      }
    </>
  )
}

export default TabList;