import React, { useState, useEffect } from 'react'
import { IRootState } from 'app/shared/reducers'
import { connect } from 'react-redux'
import { translate } from 'react-jhipster';
import {
  handleGetAttachedFiles
  , handleToggleListAttachedFile
  , handleUpdateTimelineFormSearch
  , handleInitTimelines
  , handleUpdateTimelineFilters
} from '../timeline-reducer'
import { handleSaveTimelineValueFilter } from '../timeline-common-reducer'
import { CommonUtil } from '../common/CommonUtil';
type ILocalToolFilterProp = StateProps & DispatchProps & {
  isChecked: boolean
}

/**
show popup local filter
@param props
*/
const LocalToolFilter = (props: ILocalToolFilterProp) => {

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

  const [isUnreadTimeline, setIsOnlyUnreadTimeline] = useState(props.timelineValueFilter);
  useEffect(() => {
    if (props.timelineFormSearch?.filters?.filterOptions?.length > 0) {
        props.timelineFormSearch.filters.filterOptions.forEach((e) => {
          listFilterOptions.forEach(element => {
            if (element.value === e) {
              element.isCheck = true
            }
          });
        })
      setListFilterOptions([...listFilterOptions])
    }
  }, [props.timelineFormSearch]);

  const getArrValueFilter = () => {
    const arrValueFilter = [];
    listFilterOptions.forEach(item => {
      if (item.isCheck) {
        if (item.value === 7) {
          arrValueFilter.push(7);
          arrValueFilter.push(8);
        } else if (item.value !== 8) {
          arrValueFilter.push(item.value);
        }
      }
    });
    return arrValueFilter;
  }

  const clickSetIsOnlyUnreadTimeline = (isOnlyRead: boolean) => {
    setIsOnlyUnreadTimeline(isOnlyRead);
    const arrValueFilter = getArrValueFilter();
    props.handleUpdateTimelineFormSearch({ ...props.timelineFormSearch, filters: { filterOptions: arrValueFilter, isOnlyUnreadTimeline: isOnlyRead } })
  }

  const searchWithFilterCheckBox = () => {
    const arrValueFilter1 = getArrValueFilter();
    if(arrValueFilter1 && arrValueFilter1.length > 0 ){
      props.handleUpdateTimelineFormSearch({ ...props.timelineFormSearch, filters: { isOnlyUnreadTimeline: isUnreadTimeline, filterOptions: arrValueFilter1 } });
    }else{
      props.handleUpdateTimelineFormSearch({ ...props.timelineFormSearch, filters: { isOnlyUnreadTimeline: isUnreadTimeline, filterOptions: [-1] } });
    }

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
    props.handleUpdateTimelineFilters(timelineTypes);
  }

  return (
    <div className="box-select-option box-select-option-custome ml-2">
      <div className="text-right pr-2">
        <button className="button-blue" onClick={() => handleSaveFilter()} >{translate('timeline.control.local-tool.btn-save-filter')}</button>
      </div>
      <div className="box-select-top">
        <div className="wrap-check-radio">
          <p className="radio-item mb-3">
            <input onClick={() => { clickSetIsOnlyUnreadTimeline(false); props.handleSaveTimelineValueFilter(false); }} type="radio" id="radio2" name="radio2" checked={!props.timelineValueFilter}/>
            <label htmlFor="radio2">{translate('timeline.control.local-tool.filter-all')}</label>
          </p>
          <p className="radio-item mb-3">
            <input onClick={() => { clickSetIsOnlyUnreadTimeline(true); props.handleSaveTimelineValueFilter(true);}} type="radio" id="radio3" name="radio2" checked={props.timelineValueFilter}/>
            <label htmlFor="radio3">{translate('timeline.control.local-tool.filter-not-seen')}</label>
          </p>
        </div>
      </div>
      <hr />
      <div className="box-select-bottom">
        <div className=" group-button d-flex ustify-content-between mb-3">
          <button onClick={() => { checkAll(true) }} className="button-primary button-activity-registration mr-2">{translate('timeline.control.local-tool.btn-all')}</button>
          <button onClick={() => { checkAll(false) }} className="button-primary button-activity-registration">{translate('timeline.control.local-tool.btn-not-all')}</button>
        </div>
        <label className="icon-check mt-3">
          <input type="checkbox" value="3" onClick={() => { clickCheckBox(3) }} checked={listFilterOptions[2].isCheck} /><i />{translate('timeline.control.local-tool.filter-3')}
        </label>
        <label className="icon-check mt-3">
          <input type="checkbox" value="1" onClick={() => { clickCheckBox(1) }} checked={listFilterOptions[0].isCheck} /><i /> {translate('timeline.control.local-tool.filter-1')}
        </label>
        <label className="icon-check mt-3">
          <input type="checkbox" value="2" onClick={() => { clickCheckBox(2) }} checked={listFilterOptions[1].isCheck} /><i /> {translate('timeline.control.local-tool.filter-2')}
        </label>
        <label className="icon-check mt-3">
          <input type="checkbox" value="4" onClick={() => { clickCheckBox(4) }} checked={listFilterOptions[3].isCheck} /><i />{translate('timeline.control.local-tool.filter-4')}
        </label>
        <label className="icon-check mt-3">
          <input type="checkbox" value="5" onClick={() => { clickCheckBox(5) }} checked={listFilterOptions[4].isCheck} /><i /> {translate('timeline.control.local-tool.filter-5')}
        </label>
        <label className="icon-check mt-3">
          <input type="checkbox" value="6" onClick={() => { clickCheckBox(6) }} checked={listFilterOptions[5].isCheck} /><i /> {translate('timeline.control.local-tool.filter-6')}
        </label>
        <label className="icon-check mt-3">
          <input type="checkbox" value="7" onClick={() => { clickCheckBox(7) }} checked={listFilterOptions[6].isCheck} /><i /> {translate('timeline.control.local-tool.filter-78')}
        </label>
        <label className="icon-check mt-3">
          <input type="checkbox" value="9" onClick={() => { clickCheckBox(9) }} checked={listFilterOptions[8].isCheck} /><i /> {translate('timeline.control.local-tool.filter-9')}
        </label>
        <label className="icon-check mt-3 mb-2">
          <input type="checkbox" value="10" onClick={() => { clickCheckBox(10) }} checked={listFilterOptions[9].isCheck} /><i /> {translate('timeline.control.local-tool.filter-10')}
        </label>
      </div>
    </div>
  );
}
const mapStateToProps = ({ timelineReducerState, timelineCommonReducerState }: IRootState) => ({
  timelineFormSearch: timelineReducerState.getTimelineFormSearch,
  timelineValueFilter: timelineCommonReducerState.timelineValueFilter
});
const mapDispatchToProps = {
  handleGetAttachedFiles,
  handleToggleListAttachedFile,
  handleUpdateTimelineFormSearch,
  handleInitTimelines,
  handleUpdateTimelineFilters,
  handleSaveTimelineValueFilter
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LocalToolFilter);
