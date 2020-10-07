import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import TabListElement from './business-card-detail-tab-list-element';

export interface IPopupTabListProps {
  onChangeTab?: (clickedIdTab) => void;
  tabListShow: any;
  tabList: any;
  onDragDropTabList?: (dragSource, dropTarget) => void;
  deleteAddTab: (tabListDelAddAfter, tabList) => void;
  currentTab?: any;
  screenMode: any;
  badges?: any;
}

const TabList = (props: IPopupTabListProps) => {
  const [tabListShow, setTabListShow] = useState([]);
  const [currentTab, setCurrentTab] = useState();
  const [, setFirst] = useState(false);
  const [, setShouldRender] = useState(false);
  const [tabList, setTabList] = useState(props.tabList);

  useEffect(() => {
    setFirst(true);
    setTabListShow(props.tabListShow);
    setShouldRender(true);
    if (props.currentTab) {
      setCurrentTab(props.currentTab)

    } else {
      setCurrentTab(props.tabListShow && props.tabListShow[0] ? props.tabListShow[0].tabId : 0)
    }
    return () => { setFirst(false); }
  }, []);

  useEffect(() => {
    if (props.currentTab !== currentTab) {
      setCurrentTab(props.currentTab);
    }
  }, [props.currentTab])

  useEffect(() => {
    setTabListShow(props.tabListShow);
  }, [props.tabListShow]);

  useEffect(() => {
    setTabList(props.tabList);
  }, [props.tabList]);

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
              badges={props.badges}
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