import React, { useEffect, useRef, useState } from 'react'
import { handleSuggestTimelineGroupName, handleClearSuggestTimelineGroupName, handleSetGroupTimelineDetailId } from '../../timeline-reducer';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { DataType } from '../../models/suggest-timeline-group-name-model';
import { translate } from 'react-jhipster';
import { Link } from 'react-router-dom';
import { CommonUtil } from '../../common/CommonUtil';
import useEventListener from 'app/shared/util/use-event-listener';

type ISearchGroupControlProp = StateProps & DispatchProps

const SearchGroupControl = (props: ISearchGroupControlProp) => {
  const refSearchGroup = useRef(null);
  const [forceUpdate, setForceUpdate] = useState(0);
    
  /**
   * listen change settting
   */
  useEffect(() => {
    if(props.isChangeId) {
      setForceUpdate(forceUpdate+1);
    }
  }, [props.isChangeId])

  /**
   * clear list timeline group when innit component
   */
  useEffect(() => {
    props.handleClearSuggestTimelineGroupName();
  }, [])

  let timeout = null;
  const actionSearchSuggestGroupName = (keyWord) => {
    if (keyWord) {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        props.handleSuggestTimelineGroupName(keyWord, 1);
      }, 500);
    } else {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        props.handleClearSuggestTimelineGroupName();
      }, 500);
    }
  }

  const actionUpdateFormSearch = () => {
    props.handleClearSuggestTimelineGroupName();
  }

  const getFirstCharacter = (keyWord) => {
    return keyWord ? keyWord.charAt(0) : "";
  }

  // click outside for turn off list
  const handleClickOutside = (e) => {
    if (refSearchGroup.current && !refSearchGroup.current.contains(e.target)) {
      props.handleClearSuggestTimelineGroupName();
    }
  }
  useEventListener('click', handleClickOutside);

  return (
    <div className="search-box-no-button-style active">
      <button className="icon-search"><i className="far fa-search" /></button>
      <input type="text" placeholder={translate('timeline.local-tool.search-group.placeholder')} onChange={(e) => actionSearchSuggestGroupName(e.target.value.trim())} />
      {props.listSuggestTimeGroupName && props.listSuggestTimeGroupName?.data?.length > 0 &&
        <div className={`drop-down d-block bg-white pb-0 ${(props.listSuggestTimeGroupName?.data?.length > 5) ? '' : 'drop-down2'}`} ref={refSearchGroup}>
          <ul>
            {props.listSuggestTimeGroupName.data.map((item: DataType, index) => {
              return (
                <li key={index} className="p-2 pl-3 item-select item p-0">
                  <div className="text text2 icon ">
                    <Link to={`/timeline/channel/detail/${item.timelineGroupId}`} onClick={() => actionUpdateFormSearch()} className="text-ellipsis">
                      {item.imagePath ? <img className="user mr-2" src={item.imagePath} alt="" title="" />
                                     : <span className= {`more-user mr-2 ${CommonUtil.getColorIndex(item.color)}`} >{getFirstCharacter(item.timelineGroupName)}</span>}
                      {item.timelineGroupName}
                    </Link>
                  </div>
                </li>
              )
            })
            }
          </ul>
        </div>
      }
    </div>
  );
}

const mapStateToProps = ({ timelineReducerState, employeeDetailAction }: IRootState) => ({
  listSuggestTimeGroupName: timelineReducerState.listSuggestTimeGroupName,
  timelineFormSearch: timelineReducerState.getTimelineFormSearch,
  isChangeId: employeeDetailAction.idUpdate
});

const mapDispatchToProps = {
  handleSuggestTimelineGroupName,
  handleClearSuggestTimelineGroupName,
  handleSetGroupTimelineDetailId
}

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchGroupControl);
