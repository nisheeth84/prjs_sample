import React, { useState, useEffect, useRef } from 'react';
import _ from 'lodash';
import useEventListener from 'app/shared/util/use-event-listener';
import { translate } from 'react-jhipster';

export interface IPulldownSuggestList {
  list: any[];
  errorMessage?: any;
  placeholder?: any;
  onSelectedSuggest: any;
  autoFocus?: boolean;
  onChangeSearchValue: (text: string) => void;
}

/**
 * Show pulldown suggest list
 * @param props
 */
const PulldownSuggestList = (props: IPulldownSuggestList) => {
  const [tags, setTags] = useState([]);
  const [textValue, setTextValue] = useState('');
  const [isShowSuggest, setShowSuggest] = useState(false);
  const [hover, setHover] = useState(false)
  const inputRef = useRef(null);
  const pulldownRef = useRef(null);

  useEffect(() => {
    if (props.autoFocus) {
      inputRef && inputRef.current && inputRef.current.focus();
    }
  }, [])

  /**
   * Push selected group to the parent components
   */
  useEffect(() => {
    props.onSelectedSuggest(tags[0]);
  }, [tags])

  const onTextChange = (e) => {
    setTextValue(e.target.value);
    props.onChangeSearchValue(e.target.value);
  }

  const onRemoveTag = (index: number) => {
    tags.splice(index, 1);
    setTags(_.cloneDeep(tags));
  }

  const onSelectTag = (tag) => {
    setTags([tag]);
    setTextValue('');
    setShowSuggest(false);
  }

  let classNameAutoComplete = 'input-common-wrap';
  if (tags && tags.length > 0) {
    classNameAutoComplete += ' tag';
  }
  if (textValue && textValue.length > 0) {
    classNameAutoComplete += ' delete';
  }
  if (props.errorMessage) {
    classNameAutoComplete += ' error';
  }
  const renderTooltip = (e) => {

    if (hover) {
      return (
        <div className="tool-tip-tag">
          <div className="w-auto mw-100">
            {e.listName}
          </div>
        </div>
      )
    } else {
      return <></>
    }
  }
  const renderResultSingle = () => {
    if (tags.length === 0) {
      return <></>;
    }
    return (
      <>
        {tags.map((e, idx) => (
          <div key={idx} className="wrap-tag w100" onMouseLeave={() => setHover(false)} onMouseOver={() => setHover(true)}>
            <div className="tag text-ellipsis w-auto mw-100">
              {e.listName}
              <button className="close" onClick={() => onRemoveTag(idx)}>×</button>
            </div>
          </div>
        ))}
      </>
    )
  }

  const renderSuggest = () => {
    if (textValue.trim().length === 0 || props.list.length === 0) {
      return <></>;
    }
    return (
      <ul className="drop-down drop-down2 drop-down300 w-100 style-3 " ref={pulldownRef}>
        {props.list && props.list.filter(e => e.displayOrderOfFavoriteList !== null).length > 0 && <li className="item group-item smooth">
          <div className="text text2">{translate('businesscards.popup.move-list.favorite-list')}</div>
          <ul className="drop-down301">
            {props.list && props.list.filter(e => e.displayOrderOfFavoriteList !== null).map((e, idx) => {
              return (
                <li key={idx} className="item sub-item font-size-14" onClick={() => onSelectTag(e)}>
                  <div className="white-space-three-dot">{e.listName}</div>
                  <div className="font-size-10">{e.employeeSurname}{e.employeeName}</div>
                </li>
              )
            })}
          </ul>
        </li>
        }
        {props.list && props.list.filter(e => e.listType === 1).length > 0 &&
          <li className="item group-item smooth">
            <div className="text text2">{translate('businesscards.popup.move-list.my-list')}</div>
            <ul className="drop-down301">
              {props.list && props.list.filter(e => e.listType === 1).map((ele, idx) => {
                return (
                  <li key={idx} className="item sub-item font-size-14" onClick={() => onSelectTag(ele)}>
                    <div className="white-space-three-dot">{ele.listName}</div>
                  </li>
                )
              })}
            </ul>
          </li>}
        {
          props.list && props.list.filter(e => e.listType === 2).length > 0 &&
          <li className="item group-item smooth">
            <div className="text text2">{translate('businesscards.popup.move-list.share-list')}</div>
            <ul className="drop-down301">
              {props.list && props.list.filter(e => e.listType === 2).map((ele, idx) => {
                return (
                  <li key={idx} className="item sub-item font-size-14" onClick={() => onSelectTag(ele)}>
                    <div className="white-space-three-dot">{ele.listName}</div>
                    <div className="font-size-10">{ele.employeeSurname}{ele.employeeName}</div>
                  </li>
                )
              })}
            </ul>
          </li>
        }

      </ul>
    )
  }

  const handleUserMouseDown = (event) => {
    if (inputRef.current && !inputRef.current.contains(event.target) && pulldownRef.current && !pulldownRef.current.contains(event.target)) {
      setShowSuggest(false);
    }
  };
  useEventListener('mousedown', handleUserMouseDown);

  const singleTypeDisableInput = tags.length > 0;

  return (
    <>
      <div className={`${classNameAutoComplete} position-relative`}>
        {renderResultSingle()}
        {tags.length > 0 && renderTooltip(tags[0])}

        <input type="text" className="input-normal" ref={inputRef}
          placeholder={singleTypeDisableInput ? '' : props.placeholder}
          value={singleTypeDisableInput ? '' : textValue}
          onChange={onTextChange}
          onFocus={() => setShowSuggest(true)}
          disabled={singleTypeDisableInput}
        />

        {textValue.length > 0 && <span className="icon-delete" onClick={() => setTextValue('')}></span>}

      </div>
      {props.errorMessage && <span className="messenger text-red mt-1">{props.errorMessage}</span>}
      {isShowSuggest && renderSuggest()}
    </>
  )
}

export default PulldownSuggestList;