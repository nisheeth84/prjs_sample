import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-jhipster'
type ITimelineDropdowGroupProp = StateProps & DispatchProps & {
  isDisabled?: boolean,
  defaultValue?: any,
  listItems: any[],
  onSelectItem?: (item) => void
}

const TimelineDropdowGroup = (props: ITimelineDropdowGroupProp) => {
  const [labelChannelTimeline, setLabelChannelTimeline] = useState(null);
  const [toggleListChanenlTimeline, setToggleListChanenlTimeline] = useState(false);

  useEffect(() => {
    if (props.defaultValue) {
      setLabelChannelTimeline(props.defaultValue.groupName);
    } else {
      setLabelChannelTimeline(translate('timeline.no-data'));
    }
    // setValueSort(1)
  }, [props.defaultValue]);

  return (
    <div className="drop-select-down">
      <div className="timeline-select mt-1">
        <div onClick={() => {
          setToggleListChanenlTimeline(!toggleListChanenlTimeline);
        }} className="option font-size-12 color-666">{labelChannelTimeline} </div>
        <div className="group-change">
          <img className="icon-arrow-up" src={!props.isDisabled ? '../../../content/images/timeline/ic_arrow_drop_up.svg'
            : '../../../content/images/timeline/ic-arrow-up-gray.svg'} alt=' ' />
          <img className="icon-arrow-down" src={!props.isDisabled ? '../../../content/images/timeline/ic_arrow_drop_down.svg'
            : '../../../content/images/timeline/ic-arrow-down-gray.svg'} alt=' ' />
        </div>
      </div>
      {!props.isDisabled && toggleListChanenlTimeline &&
        <div className="box-select-option z-index-99">
          <ul>
            {props.listItems && props.listItems.length > 0 && props.listItems.map((item) => {
              return <li key={item.groupId}
                onClick={() => {
                  if (props.onSelectItem) {
                    props.onSelectItem(item)
                  }
                  setToggleListChanenlTimeline(false);
                  setLabelChannelTimeline(item.groupName);
                }}>
                <a>{item.groupName}</a>
              </li>
            })}
          </ul>
        </div>
      }
    </div>)
}

const mapStateToProps = () => ({
});

const mapDispatchToProps = {
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimelineDropdowGroup);
