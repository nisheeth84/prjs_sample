import React, { useState, useEffect, useRef } from 'react';
import TabListElement from './detail-task-modal-tab-list-element';
import _ from 'lodash';

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
  const [isOpenMenuAdd, setIsOpenMenuAdd] = useState(false);
  const [tabList, setTabList] = useState(props.tabList);
  const wrapperRef = useRef(null);

  useEffect(() => {
    setFirst(true);
    setTabListShow(_.cloneDeep(props.tabListShow));
    setShouldRender(true);
    if (props.currentTab) {
      setCurrentTab(props.currentTab)

    } else {
      setCurrentTab(props.tabListShow[0].tabId)
    }
    return () => { setFirst(false); }
  }, []);

  useEffect(() => {
    if (props.currentTab !== currentTab) {
      setCurrentTab(props.currentTab);
    }
  }, [props.currentTab])

  useEffect(() => {
    setTabListShow(_.cloneDeep(props.tabListShow));
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