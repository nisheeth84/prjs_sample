import React, { useEffect, useState } from 'react';
import { useDrag, DragSourceMonitor } from 'react-dnd';
import { DnDItemTypes, DragItem, AvatarColor } from "app/shared/layout/common/suggestion/constants";

type ComponentProps = {
  idx?: number,
  tag: any,
  className?: string,
  tagNames: string[],
  listActionOption?: { id, name }[],
  isDisabled?: boolean,
  onActionOption?: (idx: number, ev) => void,
  onRemoveTag?: (idx: number) => void
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

  /**
   * Get random Avatar
   */
  const getAvatarName = (itemId) => {
    if (!itemId || itemId.length === 0) {
      return AvatarColor[0];
    }
    return itemId.length === 1 ? AvatarColor[itemId] : AvatarColor[itemId.toString().charAt(itemId.length - 1)];
  }

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
                : <div className={"name " + getAvatarName(props.idx)}>{getFirstCharacter(textFirst)}</div>}
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

  // const [openDropDown, setOpenDropDown] = useState(false);
  // const [text, setText] = useState(false);
  // const selectOption = (val, txt) => {
  //   setText(txt);
  //   setOpenDropDown(false);
  // }

  const renderItemListOption = () => {
    return (
      <div className="tag-result position-relative mt-1">
        <div
          className={`item item-big ${props.listActionOption ? "width-calc" : ""}`}
          onMouseOver={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {avatarImage ?
            <div className="name"><img src={avatarImage} alt="" title="" /></div>
            : <div className={"name " + getAvatarName(props.idx)}>{getFirstCharacter(textFirst)}</div>}
          <div className="content">
            <div className="text text1 font-size-12" title={textFirst}>{textFirst}</div>
            <div className="text text2">{textSecond}</div>
          </div>
          {props.listActionOption &&
            <div className="select-option show-wrap2-input-common position-absolute">
              <select className="select-text" onChange={(ev) => props.onActionOption(props.idx, ev)}>
                {props.listActionOption.map((o, i) =>
                  <option key={i} value={o.id} selected={props.tag.actionId === o.id}>{o.name}</option>
                )}
              </select>
            </div>
          }
          <button type="button" className="close"><a onClick={() => props.onRemoveTag(props.idx)}>×</a></button>
        </div>
        {isHovered &&
          <div className="drop-down child h-auto hover-tag" >
            <ul className="dropdown-item">
              <li className="item smooth">
                <div className="item2">
                  {avatarImage ?
                    <div className="name"><img src={avatarImage} alt="" title="" /></div>
                    : <div className={"name " + getAvatarName(props.idx)}>{getFirstCharacter(textFirst)}</div>}
                  <div className="content">
                    <div className="text text1 font-size-12 text-blue">{textFirst}</div>
                    <div className="text text2 text-blue">{textSecond}</div>
                  </div>
                </div>
                <button className="close">×</button>
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

export default TagAutoCompleteItem;
