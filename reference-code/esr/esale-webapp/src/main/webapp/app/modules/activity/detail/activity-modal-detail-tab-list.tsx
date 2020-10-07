import React, { useState, useEffect } from 'react'
import TabListElement from './activity-modal-detail-tab-list-element';
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

/**
 * component for show tab list activity
 * @param props 
 */
const TabList = (props: IPopupTabListProps) => {
  const [tabListShow, setTabListShow] = useState([]);
  const [currentTab, setCurrentTab] = useState(null);
  const [, setFirst] = useState(false);
  const [, setShouldRender] = useState(false);
  // const [isOpenMenuAdd, setIsOpenMenuAdd] = useState(false);
  const [tabList, setTabList] = useState([]);
  // const wrapperRef = useRef(null);

  useEffect(() => {

    setFirst(true);
    setTabListShow(props.tabListShow);
    setTabList(props.tabList);
    setShouldRender(true);
    if (props.currentTab) {
      setCurrentTab(props.currentTab)
    } else {
      if(props.tabListShow && props.tabListShow.length > 0) {
        setCurrentTab(props.tabListShow[0].tabId)
      } else {
        setCurrentTab(0);
      }
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
    props.deleteAddTab(_.cloneDeep(tabListShow), _.cloneDeep(tabList));
  }

  return (
    <>
      {tabListShow.map((tab, idx) => {
        return (
          <TabListElement
            key={`tab_list_el_${idx}`}
            tab={tab}
            deleteTab={deleteTab}
            currentTab={currentTab}
            onChangeTab={onChangeTab}
            onDragDropTabList={props.onDragDropTabList}
            screenMode={props.screenMode}
          />
        )
      })
      }
    </>
  )
}

export default TabList;