import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { IRootState } from 'app/shared/reducers';
import { handleGetRecentlyListReaction, handleUpdateTimelinesReaction } from './timeline-reaction-reducer'
import { ReactionsType } from '../../models/get-user-timelines-type';
import { CommonUtil } from 'app/modules/activity/common/common-util';
import { translate } from 'react-jhipster';
import _ from 'lodash';
import { Storage } from 'react-jhipster';
import { PositionScreen } from '../../models/suggest-timeline-group-name-model';

type IReactionPopup = StateProps & DispatchProps & {
  reactionsSelecteds?: Map<string, ReactionsType[]>;
  objectId: number,
  rootId: number,
  callBackAffterChoose: () => void,
  position?: PositionScreen
  isCommonMode?: boolean
}

const ReactionPopup = (props: IReactionPopup) => {
  const [listReaction, setListReaction] = useState([]);
  const [listTabReaction, setListTabReaction] = useState([])
  const [tabActive, setTabActive] = useState(0);
  const scrollElement = useRef<HTMLDivElement>(null);
  const lang = Storage.session.get('locale', 'ja_jp');
  const arrayRefTab = [];

  // load mac dinh danh sach reaction
  useEffect(() => {
    props.handleGetRecentlyListReaction();
    setListTabReaction([{group: "face"},{group: "hand"},{group: "other"}])
    setListReaction(_.cloneDeep(props.listReactionStore))
    return () => {
      setListReaction([])
      setListTabReaction([])
    }
  }, [])

  useEffect(() => {
    setListReaction(_.cloneDeep(props.listReactionStore))
  }, [props.listReactionStore])

  const getIcon = (icon) => {
    for (let i = 0; i < props.listReactionStore.length; i++) {
      const lst = props.listReactionStore[i].listEmoji.filter(item => item.id === icon);
      if (lst && lst.length > 0) {
        return lst[0]
      }
    }
    return '';
  }

  const getListReactionRecent = (list) => {
    const lstResult = [];
    if (list) {
      list.forEach(element => {
        if (lstResult.findIndex(x=>x.id === element) === -1) {
          lstResult.push(getIcon(element))
        }
      });
    }
    return lstResult;
  }

  useEffect(() => {
    if (props.listRecentlyReactionStore?.recentReactions?.reactionType) {
      const lstDefault = _.cloneDeep(props.listReactionStore)
      const lst = getListReactionRecent(props.listRecentlyReactionStore?.recentReactions?.reactionType);
      if (props.listReactionStore.findIndex(x => x.group === 'recently') !== -1) {
        lstDefault.splice(0,1);
      }
      if (lst.length > 0) {
        lstDefault.unshift({ group: 'recently', listEmoji: lst});
      }
      setListReaction(lstDefault)
      setListTabReaction([{group: "recently"},{group: "face"},{group: "hand"},{group: "other"}])
      
    }
  }, [props.listRecentlyReactionStore])

  const actionChangeSearchValue = (event) => {
    const keyWord = (event.target.value.toLowerCase()).trim();
    let lstDefault = [];
    if (keyWord !== '') {
      let temp = [];
      props.listReactionStore.forEach(x => {
        temp = temp.concat(x.listEmoji.filter(item => (item['name_'+lang] || item.name_ja_jp).toLowerCase().includes(keyWord)));
      })
      lstDefault.push({ group: 'resultSearch', listEmoji: temp })
    } else {
      lstDefault = _.cloneDeep(props.listReactionStore)
      if (props.listRecentlyReactionStore && props.listRecentlyReactionStore.recentReactions?.reactionType.length > 0) {
        lstDefault.unshift({ group: 'recently', listEmoji: getListReactionRecent(props.listRecentlyReactionStore?.recentReactions?.reactionType)});
      }
    }
    setListReaction(lstDefault)
  }

  // validate user has choose reaction yet
  const validateUpdateReaction = (icon) => {
    const mapReaction = props.mapTimelineReaction.get(props.objectId);
    if (mapReaction && mapReaction.get(icon)) {
      return mapReaction.get(icon).findIndex(x => x.employeeId.toString() === CommonUtil.getUserLogin().employeeId.toString()) < 0;
    }
    return true;
  }

  // double click reaction 
  let timeout = null;
  const handleClickChooseReaction = (icon) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      if (validateUpdateReaction(icon)) {
        props.handleUpdateTimelinesReaction(props.objectId, props.rootId, icon);
      }
      props.callBackAffterChoose();
    }, 500);
  }

  const handleClickTab = (index) => {
    scrollElement.current.scrollTo({top: arrayRefTab[index].offsetTop - (scrollElement.current.offsetTop || 0)});
  }

  const handleScroll = () => {
    const posTab0 = 0;
    const posTab1 = arrayRefTab[1].offsetTop - (scrollElement.current.offsetTop || 0) - 100;
    const posTab2 = arrayRefTab[2].offsetTop - (scrollElement.current.offsetTop || 0) - 100;
    const posTab3 = arrayRefTab[3] ? ((arrayRefTab[3].offsetTop || 0) - (scrollElement.current.offsetTop || 0) -100) : 0;
    const scrollElementTop = scrollElement.current.scrollTop;
    if (scrollElementTop === 0 || scrollElementTop < posTab1) {
      setTabActive(0);
    } else if (scrollElementTop < posTab2) {
      setTabActive(1);
    } else if ((posTab3 === 0 && scrollElementTop > posTab2) || (posTab3 > 0 && scrollElementTop < posTab3)) {
      setTabActive(2)
    } else {
      setTabActive(3)
    }
  }

  const renderTabReaction = () => {
    return (
      listTabReaction.map((group, index) => {
        return (
          <div onClick={()=>handleClickTab(index)} key={`tab${group.group}`} 
            className={"category" + (group.group === 'recently' ? " time" : (group.group === 'other' ? " target" : " " + group.group)) + 
              (listTabReaction.length === 3 ? " reaction-timeline-tab-with-33" : "") + (tabActive === index ? " active" : "") }/>
        )
      })
    )
  }

  const renderListReaction = () => {
    return (
      listReaction.map((group) => {
        return (
          <div className="group-action" key={`group${group.group}`} ref={(el) => { arrayRefTab.push(el) }}>
            <label className="title mb-1 color-333">
              {group.group === 'resultSearch' ? translate('timeline.reaction.result-seach') : (group.group === 'recently' ? translate('timeline.reaction.recent') : (group.group === 'face' ? translate('timeline.reaction.face') : (group.group === 'hand' ? translate('timeline.reaction.hand') : translate('timeline.reaction.other'))))}
            </label>
            <div className="list-icons">
              {group.listEmoji.map((icon, index) => {
                return (
                  <div className="icon icon-primary" key={`icon${icon.id}${group.group}`} onClick={() => handleClickChooseReaction(icon.id)}>
                    <img className="face" src={`../../../content/images/timeline/reaction/${icon.type}/${icon.icon}.png`} />
                    <label className={"tooltip-common" + (index % 10 === 0 ? " pl-5" : ((index % 10 === 8 || index % 10 === 9) ? " pr-5" : "" ))}><span>{icon['name_'+lang] || icon.name_ja_jp}</span></label>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })
    )
  }

  return (
    <>
      <div className={`box-select-option box-select-option-custome popup-emotion ${props.isCommonMode? 'position-fixed': ''}`}
        style={props.position}
      >
        <div className="popup-emotion-top">
          <div className="list-category">
            {renderTabReaction()}
          </div>
        </div>
        <div className="popup-emotion-body">
          <div className="search-box-no-button-style mt-2 mb-2">
            <button className="icon-search">
              <i className="far fa-search" />
            </button>
            <input type="text" placeholder={translate('timeline.reaction.seach-placeholder')} onChange={(e) => actionChangeSearchValue(e)} />
          </div>
          <div className="group-action-area-scroll overflow-y-hover" ref={scrollElement} onScroll={handleScroll}>
            {renderListReaction()}
          </div>
        </div>
      </div>
    </>
  )
}

const mapStateToProps = ({ timelineReactionReducerState, authentication  }: IRootState) => ({
  listReactionStore: timelineReactionReducerState.listFullReaction,
  listRecentlyReactionStore: timelineReactionReducerState.listRecentlyReactionStore,
  mapTimelineReaction: timelineReactionReducerState.mapTimelineReaction,
  account: authentication.account
});

const mapDispatchToProps = {
  handleGetRecentlyListReaction,
  handleUpdateTimelinesReaction
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReactionPopup);
