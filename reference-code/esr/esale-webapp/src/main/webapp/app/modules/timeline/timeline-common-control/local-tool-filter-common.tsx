import React, { useState, useEffect } from 'react'
import { IRootState } from 'app/shared/reducers'
import { connect } from 'react-redux'
import { translate } from 'react-jhipster';
import {
  handleUpdateExtTimelineFormSearch
  , handleInitExtTimelines
  , handleUpdateExtTimelineFilters
} from '../timeline-common-reducer'
import { CommonUtil } from '../common/CommonUtil';
type ILocalToolFilterCommonProp = StateProps & DispatchProps & {
  activePos: number;
  setToggle2?: (boolean) => void
}

/**

show popup local filter
@param props
*/
const LocalToolFilterCommon = (props: ILocalToolFilterCommonProp) => {

  const [listFilterOptions, setListFilterOptions] = useState([
    { value: 1, isCheck: false },
    { value: 2, isCheck: false },
    { value: 3, isCheck: false },
    { value: 4, isCheck: false },
    { value: 5, isCheck: false },
    { value: 6, isCheck: false },
    { value: 7, isCheck: false },
    { value: 8, isCheck: false },
    { value: 9, isCheck: false },
    { value: 10, isCheck: false },
  ]);

  const [isUnreadTimeline, setIsOnlyUnreadTimeline] = useState(null);

  useEffect(() => {
    const timelineFormSearch = props.mapExtTimelineFormSearch.get(props.activePos);
    if (timelineFormSearch?.filters?.filterOptions && timelineFormSearch?.filters?.filterOptions?.length > 0) {
      timelineFormSearch.filters?.filterOptions?.forEach((e) => {
        listFilterOptions.forEach(element => {
          if (element.value === e) {
            element.isCheck = true
          }
        });
      })
      setListFilterOptions([...listFilterOptions])
    }
    // set value only read when start
    if(timelineFormSearch.filters.isOnlyUnreadTimeline){
      setIsOnlyUnreadTimeline(true)
    } else {
      setIsOnlyUnreadTimeline(false)
    }
  }, [props.mapExtTimelineFormSearch]);

  const clickSetIsOnlyUnreadTimeline = (isOnlyRead: boolean) => {
    setIsOnlyUnreadTimeline(isOnlyRead);
    const arrValueFilter = [];
    listFilterOptions.forEach(item => {
      if (item.isCheck) {
        if (item.value === 7) {
          arrValueFilter.push(7);
          arrValueFilter.push(8);
        }
        else if (item.value === 8) {
          // do nothing
        }
        else {
          arrValueFilter.push(item.value);
        }
      }
    });
    const timelineFormSearch = props.mapExtTimelineFormSearch.get(props.activePos);
    props.handleUpdateExtTimelineFormSearch({ ...timelineFormSearch, offset: 0 ,filters: { filterOptions: arrValueFilter, isOnlyUnreadTimeline: isOnlyRead } })
  }

  const searchWithFilterCheckBox = () => {
    const arrValueFilter = [];
    listFilterOptions.forEach(element => {
      if (element.isCheck) {
        if (element.value === 7) {
          arrValueFilter.push(7);
          arrValueFilter.push(8);
        }
        else if (element.value === 8) {
          // do nothing
        }
        else {
          arrValueFilter.push(element.value);
        }
      }
    });
    const timelineFormSearch = props.mapExtTimelineFormSearch.get(props.activePos);
    props.handleUpdateExtTimelineFormSearch({...timelineFormSearch, offset: 0, filters: { isOnlyUnreadTimeline: isUnreadTimeline, filterOptions: arrValueFilter } });
  }

  const checkAll = (isCheck: boolean) => {
    const lstFilter = [];
    listFilterOptions.forEach(element => {
      element.isCheck = isCheck;
      lstFilter.push(element);
    });
    setListFilterOptions(lstFilter);
    searchWithFilterCheckBox();
  }

  const clickCheckBox = (valueCheck) => {
    const lstFilter = [];
    listFilterOptions.forEach(element => {
      if (element.value === valueCheck) {
        element.isCheck = !element.isCheck;
      }
      lstFilter.push(element);
    });
    setListFilterOptions(lstFilter);
    searchWithFilterCheckBox();
  }

  const handleSaveFilter = () => {
    let res = []
    if (listFilterOptions && listFilterOptions.length > 0) {
      res = listFilterOptions.filter(e => e.isCheck);
    }
    const timelineTypes = CommonUtil.GET_ARRAY_VALUE_PROPERTIES(res, 'value');
    props.setToggle2(false)
    props.handleUpdateExtTimelineFilters(timelineTypes);
  }

  return (


    <div className="box-select-option ml-2 px-2 location-r-repons">
      <div className="text-right mb-2">
        <button className="button-blue px-4 py-1" onClick={() => handleSaveFilter()} >{translate('timeline.control.local-tool.btn-save-filter')}</button>
      </div>
      <div className="box-select-top">
        <div className="wrap-check-radio d-block">
          <p className="radio-item mb-3">
            <input onClick={() => { clickSetIsOnlyUnreadTimeline(false) }} type="radio" id="radio2" name="radio2" checked={isUnreadTimeline === false}/>
            <label htmlFor="radio2">{translate('timeline.control.local-tool.filter-all')}</label>
          </p>
          <p className="radio-item mb-3">
            <input onClick={() => { clickSetIsOnlyUnreadTimeline(true) }} type="radio" id="radio3" name="radio2" checked={isUnreadTimeline === true}/>
            <label htmlFor="radio3">{translate('timeline.control.local-tool.filter-not-seen')}</label>
          </p>
        </div>
      </div>
      <hr />
      <div className="box-select-bottom">
        <div className=" group-button d-flex ustify-content-between mb-3">
          <button onClick={() => { checkAll(true) }} className="button-primary  button-simple-edit py-1">{translate('timeline.control.local-tool.btn-all')}</button>
          <button onClick={() => { checkAll(false) }} className="button-primary  button-simple-edit py-1  ml-2">{translate('timeline.control.local-tool.btn-not-all')}</button>
        </div>
        <label className="icon-check mt-3  d-block">
          <input type="checkbox" value="3" onClick={() => { clickCheckBox(3) }} checked={listFilterOptions[2].isCheck} /><i /> {translate('timeline.control.local-tool.filter-3')}
        </label>
        <label className="icon-check mt-3  d-block">
          <input type="checkbox" value="1 " onClick={() => { clickCheckBox(1) }} checked={listFilterOptions[0].isCheck} /><i /> {translate('timeline.control.local-tool.filter-1')}
        </label>
        <label className="icon-check mt-3  d-block">
          <input type="checkbox" value="2" onClick={() => { clickCheckBox(2) }} checked={listFilterOptions[1].isCheck} /><i /> {translate('timeline.control.local-tool.filter-2')}
        </label>
        <label className="icon-check mt-3  d-block">
          <input type="checkbox" value="4" onClick={() => { clickCheckBox(4) }} checked={listFilterOptions[3].isCheck} /><i /> {translate('timeline.control.local-tool.filter-4')}
        </label>
        <label className="icon-check mt-3  d-block">
          <input type="checkbox" value="5" onClick={() => { clickCheckBox(5) }} checked={listFilterOptions[4].isCheck} /><i /> {translate('timeline.control.local-tool.filter-5')}
        </label>
        <label className="icon-check mt-3  d-block">
          <input type="checkbox" value="6" onClick={() => { clickCheckBox(6) }} checked={listFilterOptions[5].isCheck} /><i /> {translate('timeline.control.local-tool.filter-6')}
        </label>
        <label className="icon-check mt-3  d-block">
          <input type="checkbox" value="7" onClick={() => { clickCheckBox(7) }} checked={listFilterOptions[6].isCheck} /><i /> {translate('timeline.control.local-tool.filter-78')}
        </label>
        <label className="icon-check mt-3  d-block">
          <input type="checkbox" value="9" onClick={() => { clickCheckBox(9) }} checked={listFilterOptions[8].isCheck} /><i /> {translate('timeline.control.local-tool.filter-9')}
        </label>
        <label className="icon-check mt-3 mb-2  d-block">
          <input type="checkbox" value="10" onClick={() => { clickCheckBox(10) }} checked={listFilterOptions[9].isCheck} /><i /> {translate('timeline.control.local-tool.filter-10')}
        </label>
      </div>
    </div>
  );
}
const mapStateToProps = ({ timelineCommonReducerState }: IRootState) => ({
  mapExtTimelineFormSearch: timelineCommonReducerState.mapExtTimelineFormSearch
});
const mapDispatchToProps = {
  handleUpdateExtTimelineFormSearch,
  handleInitExtTimelines,
  handleUpdateExtTimelineFilters
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LocalToolFilterCommon);