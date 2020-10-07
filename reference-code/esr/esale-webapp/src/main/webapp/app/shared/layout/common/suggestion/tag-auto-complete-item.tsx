import React, { useEffect, useState, useRef } from 'react';
import { useDrag, DragSourceMonitor } from 'react-dnd';
import { DnDItemTypes, DragItem, AvatarColor } from "app/shared/layout/common/suggestion/constants";
import useEventListener from 'app/shared/util/use-event-listener';

type ComponentProps = {
  idx?: number,
  tag: any,
  className?: string,
  tagNames: string[],
  listActionOption?: { id, name }[],
  isDisabled?: boolean,
  onActionOption?: (idx: number, ev) => void,
  onRemoveTag?: (idx: number) => void,
  isShowOnList?: any;
  classNameIcon?: string,
}

const TagAutoCompleteItem = (props: ComponentProps) => {
  const item: DragItem = {
    data: props.tag,
    name: props.tagNames[0],
    type: DnDItemTypes.EMPLOYEE
  };
  const [textFirst, setTextFirst] = useState(null);
  const [textSecond, setTextSecond] = useState(null);
  const [avatarImage, setAvatarImage] = useState(null);
  const [isHovered, setHover] = useState(null);
  const tagResultRef = useRef(null);
  const tagInfoRef = useRef(null);
  const [isShowSelectParticipant, setIsShowSelectParticipant] = useState(false);
  const participantRef = null;
  const [selectedItem, setSelectedItem] = useState({
    id: props.tag.actionId,
    name: props.listActionOption ? props.listActionOption.find(e => e.id === props.tag.actionId).name : ''
  });

  const [{ opacity }, drag] = useDrag({
    item,
    end(dragItem: DragItem, monitor: DragSourceMonitor) {
      const result = monitor.getDropResult();
      if (result && result.added) {
        props.onRemoveTag(props.idx);
      }
    },
    collect: (monitor: DragSourceMonitor) => ({
      opacity: monitor.isDragging() ? 0.4 : 1
    })
  })

  useEffect(() => {
    if (props.tagNames.length < 1) {
      return;
    }

    setAvatarImage(props.tagNames[0]);
    setTextFirst(props.tagNames[1]);
    setTextSecond(props.tagNames.splice(2, props.tagNames.length).join(' '));
  }, [props.tagNames]);

  const getFirstCharacter = (name) => {
    return name ? name.charAt(0) : "";
  }

  const renderItem = (isChild) => {
    const styleText1 = isChild ? "text text1 font-size-12 text-blue text-ellipsis" : "text text1 font-size-12 text-ellipsis";
    const styleText2 = isChild ? "text text2 text-blue text-ellipsis" : "text text2 text-ellipsis";

    return (
      <>
        <ul className="dropdown-item">
          <li className="item smooth">
            <div className="item2">
              {avatarImage ?
                <div className="name"><img src={avatarImage} alt="" title="" /></div>
                : <div className={"name " + props.classNameIcon}>{getFirstCharacter(textFirst)}</div>}
              <div className="content">
                <div className={styleText1}>{textFirst}</div>
                <div className={styleText2}>{textSecond}</div>
              </div>
            </div>
            <button type="button" className="close"><a onClick={() => props.onRemoveTag(props.idx)}>×</a></button>
          </li>
        </ul>
      </>
    );
  }

  const onMouseLeaveTagRef = (e) => {
    if (tagResultRef && tagResultRef.current && tagResultRef.current.contains(e.target)
      || tagInfoRef && tagInfoRef.current && tagInfoRef.current.contains(e.target)) {
      setHover(true);
      return;
    }
    setHover(false);
  }
  useEventListener('mouseout', onMouseLeaveTagRef);

  const handleClickOutside = (event) => {
    if (tagResultRef && tagResultRef.current && !tagResultRef.current.contains(event.target)) {
      setIsShowSelectParticipant(false);
    }
  }
  useEventListener('mousedown', handleClickOutside);

  const onSelectParticipantType = (o) => {
    setIsShowSelectParticipant(false);
    props.onActionOption(props.idx, o.id);
    setSelectedItem(o);
  }

  const renderItemListOption = () => {
    return (
      <div className="tag-result position-relative mt-1">
        <div className={`item item-big ${props.listActionOption ? "width-calc" : ""}`} ref={tagResultRef}>
          {avatarImage ?
            <div className="name"><img src={avatarImage} alt="" title="" /></div>
            : <div className={"name " + props.classNameIcon}>{textFirst ? getFirstCharacter(textFirst) : getFirstCharacter(textSecond)}</div>}
          <div className="content">
            <div className="text text1 font-size-12" title={textFirst}>{textFirst}</div>
            <div className="text text2">{textSecond}</div>
          </div>
          {props.listActionOption && <div className="drop-select-down" ref={participantRef}>
            <a title="" className={(isShowSelectParticipant ? "active" : "") + " button-pull-down-small"}
              onClick={() => setIsShowSelectParticipant(true)}>{selectedItem.name}</a>
            {isShowSelectParticipant && <div className="box-select-option" style={{ minHeight: 'auto', minWidth: '100%' }}>
              <ul>
                {props.listActionOption.map((o, i) =>
                  <li key={i} onClick={() => { onSelectParticipantType(o) }}>
                    <a className="ml-0" title="">{o.name}</a>
                  </li>
                )}
              </ul>
            </div>}
          </div>}
          <button type="button" className="close"><a onClick={() => props.onRemoveTag(props.idx)}>×</a></button>
        </div>
        {isHovered &&
          <div className="drop-down child h-auto hover-tag" style={{ top: 52 }}>
            <ul className="dropdown-item" ref={tagInfoRef}>
              <li className="item smooth">
                <div className="item2">
                  {avatarImage ?
                    <div className="name"><img src={avatarImage} alt="" title="" /></div>
                    : <div className={"name " + props.classNameIcon}>{getFirstCharacter(textFirst)}</div>}
                  <div className="content">
                    <div className="text text1 font-size-12 text-blue">{textFirst}</div>
                    <div className="text text2 text-blue">{textSecond}</div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        }
      </div>
    );
  }

  if (props.listActionOption) {
    return renderItemListOption();
  } else {
    if (props.isShowOnList) {
      return (
        <div className="show-wrap2 d-inline-block w32 pt-2" style={{ minWidth: '135px' }} >
          <div className="item">
            {avatarImage ?
              <div className="name"><img src={avatarImage} alt="" title="" /></div>
              : <div className={"name " + props.classNameIcon}>{getFirstCharacter(textSecond)}</div>}
            <div className="content">
              <div className="text text1">{textFirst}</div>
              <div className="text text2">{textSecond}</div>
            </div>
            <button type="button" className="close"><a onClick={() => props.onRemoveTag(props.idx)}>×</a></button>
          </div>
        </div>
      )
    } else {
      return (
        <div className="w32 position-relative" style={{ opacity }} ref={drag}>
          <div className="drop-down w100 h-auto background-color-86">
            {renderItem(false)}
          </div>
          <div className="drop-down child h-auto">
            {renderItem(true)}
          </div>
        </div>
      )
    }
  }
}

export default TagAutoCompleteItem;
