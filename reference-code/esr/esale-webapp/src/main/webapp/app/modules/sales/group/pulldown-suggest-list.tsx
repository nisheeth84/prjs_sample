// import React, { useState, useEffect, useRef, useCallback } from 'react';
import React, { useState, useEffect, useRef } from 'react';
import _ from 'lodash';
import useEventListener from 'app/shared/util/use-event-listener';
import { translate, Storage } from 'react-jhipster';
import { SEARCH_LOCAL_SUGGEST } from '../constants';
import { trimString } from '../utils'
import { toKatakana } from 'app/shared/util/string-utils'

export interface IPulldownSuggestList {
  list: any[];
  errorMessage?: any;
  placeholder?: any;
  onSelectedSuggest: any;
  autoFocus?: boolean;
  listInfo?: any[],
  errorEmptyinput: any,
  isSubmitted?: boolean,
  checkSubmit?: boolean,
  setTextLocal: any,
  textLocal: any,
  setSubmit: any,
  onlyShowShare?: boolean;
  sideBarCurrentId?: any;
}

const MAX_LENGTH = 100;
/**
 * Show pulldown suggest list
 * @param props
 */
const PulldownSuggestList = (props: IPulldownSuggestList) => {
  const [tags, setTags] = useState([]);
  const [textValue, setTextValue] = useState('');
  const [isShowSuggest, setShowSuggest] = useState(false);
  const [filteredList, setFilteredList] = useState([]);
  const [focus, setFocus] = useState(props.autoFocus)
  const inputRef = useRef(null);
  const pulldownRef = useRef(null);
  const { textLocal, setTextLocal } = props;
  const [onlyShowShare, setOnlyShowShare] = useState(false);
  const [notShowFavourite, setNotShowFavourite] = useState(false);
  // console.log("PulldownSuggestList -> onlyShowShare", onlyShowShare)
  
  /**
   * Filter list belong to the text search
   */
  useEffect(() => {
    let list = _.cloneDeep(props.list);
    console.log("PulldownSuggestList -> props.list", props.list);
    console.log("PulldownSuggestList -> props.sideBarCurrentId", props.sideBarCurrentId);
    // console.log("position: ", props.list[0].listId === props.sideBarCurrentId)
    let i; 
    let favouriteItem = 0;
    if(props.list.length > 0){
      for(i = 0; i<props.list.length; i++){
        if(props.list[i].listId === props.sideBarCurrentId){
          // console.log("list mode is: ", props.list[i].listMode);
          if(props.list[i].listMode === 2){
            setOnlyShowShare(true);
          }
          break;
        }
      }
      for(i = 0; i<props.list.length; i++){
        if(props.list[i].displayOrderOfFavoriteList !== null){
          favouriteItem++;
        }
      }
      console.log("PulldownSuggestList -> favouriteItem", favouriteItem)
      if(favouriteItem === 0){
        setNotShowFavourite(true);
      }
    }

    const valueLocal = Storage.session.get(SEARCH_LOCAL_SUGGEST);
    if (valueLocal && valueLocal.length > 0) {
      list = _.cloneDeep(props.listInfo);
    }
    if (list && valueLocal && valueLocal.length > 0) {
      setFilteredList(list.filter(e => e.listName.includes(valueLocal.trim())))
    }
    else {
      setFilteredList(list.filter(e => e.listName.includes(textValue.trim())))
    }
  }, [textValue, textLocal])

  /**
   * Push selected group to the parent components
   */
  useEffect(() => {
    props.onSelectedSuggest(tags[0]);
  }, [tags])

  const onTextChange = (e) => {
    props.setSubmit(false);
    const { value } = e.target;
    setTextValue(value);
    setTextLocal(value);
    Storage.session.set(SEARCH_LOCAL_SUGGEST, value);
  }

  const convertToKatakana = (e) => {
    const { value } = e.target;
    setTextValue(toKatakana(value));
    setTextLocal(toKatakana(value));
  }

  const handleFocusSuggets = () => {
    setFocus(true);
    const valueLocal = Storage.session.get(SEARCH_LOCAL_SUGGEST);
    if (valueLocal && valueLocal.length) {
      setTextValue(valueLocal);
    }
    setShowSuggest(true)
  }

  const onRemoveTag = (index: number) => {
    props.setSubmit(false);
    tags.splice(index, 1);
    setTextValue('');
    setTextLocal('');
    setTags(_.cloneDeep(tags));
  }

  const onSelectTag = (tag) => {
    setTags([tag]);
    setFilteredList([]);
    setTextValue('');
    setTextLocal('value');
    setShowSuggest(false);
  }

  let classNameAutoComplete = 'input-common-wrap';
  if (tags && tags.length > 0) {
    classNameAutoComplete += ' tag';
  }
  if (textValue && textValue.length > 0) {
    classNameAutoComplete += ' delete';
  }

  if (props.errorMessage || (props.errorEmptyinput && props.checkSubmit && tags && tags.length === 0) || (props.isSubmitted === true && props.errorEmptyinput && textLocal && textLocal.length === 0)) {
    classNameAutoComplete += ' error';
  }
  


  const renderResultSingle = () => {
    if (tags.length === 0) {
      return <></>;
    }
    return (
      <>
        {tags.map((e, idx) => (
          <div key={idx} className="wrap-tag w100">
            <div className="tag text-ellipsis w-auto mw-100">
              {e.listName}
              <button className="close" onClick={() => onRemoveTag(idx)}>×</button>
            </div>
            {/* {renderTooltip(e)} */}
          </div>
        ))}
      </>
    )
  }

  const renderSuggestFilteredList = (e, idx) => {
    return (
      <li key={idx} className="item sub-item font-size-14" onClick={() => onSelectTag(e)}>
        <div className="white-space-three-dot">{trimString(e.listName, MAX_LENGTH)}</div>
      </li>
    )
  }

  const renderSuggestGroup = (listTypeParam) => {
    return (
      <ul className="drop-down301">
        {filteredList && filteredList.filter(e => e.listType === listTypeParam).map((e, idx) => {
          return renderSuggestFilteredList(e, idx)
        })}
      </ul>
    )
  }

  const renderSuggest = () => {
    // if (textValue.trim().length === 0) {
    //   return <></>;
    // }
    return (
      <ul className="drop-down drop-down2 drop-down300 w-100 style-3 height-300" ref={pulldownRef}>
        {!onlyShowShare && !notShowFavourite &&(
        <li className="item group-item smooth">
          <div className="text text2">{translate('sales.group.group-modal-add-to-group.list-group')}</div>
          <ul className="drop-down301">
            {filteredList && filteredList.filter(e => ((e.listType === 1 || e.listType === 2) && e.displayOrderOfFavoriteList !== null)).map((el, index) => {
              return (
                <li key={index} className="item sub-item font-size-14" onClick={() => onSelectTag(el)}>
                  <div className="white-space-three-dot">{trimString(el.listName, MAX_LENGTH)}</div>
                </li>
              )
            })}
          </ul>
        </li>
        )}
        {!onlyShowShare && (
        <li className="item group-item smooth">
          <div className="text text2">{translate('sales.group.group-modal-add-to-group.my-group')}</div>
          {renderSuggestGroup(1)}
        </li>
        )}
        <li className="item group-item smooth">
          <div className="text text2">{translate('sales.group.group-modal-add-to-group.share-group')}</div>
          {renderSuggestGroup(2)}
        </li>
      </ul>
    )
  }

  const handleUserMouseDown = (event) => {
    if (inputRef.current && !inputRef.current.contains(event.target) && pulldownRef.current && !pulldownRef.current.contains(event.target)) {
      setShowSuggest(false);
    }
  };
  // console.log('props.errorMessage', props.errorMessage)
  useEventListener('mousedown', handleUserMouseDown);
  const singleTypeDisableInput = tags.length > 0;
  return (
    <>
      <div className={classNameAutoComplete}>
        {renderResultSingle()}
        <input type="text" className="input-normal" ref={inputRef}
          placeholder={singleTypeDisableInput ? '' : props.placeholder}
          value={singleTypeDisableInput ? '' : textLocal}
          onChange={onTextChange}
          onBlur={convertToKatakana}
          onFocus={handleFocusSuggets}
          disabled={singleTypeDisableInput}
          autoFocus={props.autoFocus ? props.autoFocus : false}
          maxLength={MAX_LENGTH}
        />
        {textLocal && textLocal.length > 0 && <span className="icon-delete" onClick={() => { setTextValue(''); setTextLocal(''); setFocus(false); props.setSubmit(false); }}></span>}
        {(textLocal && textLocal.length === 0 || textValue.length === 0) && !singleTypeDisableInput && props.checkSubmit && props.errorEmptyinput && <span className="messenger">{props.errorEmptyinput}</span>}
      </div>
      {textLocal && textLocal.length > 0 && props.checkSubmit && props.errorMessage && <span className="messenger color-error">{props.errorMessage}</span>}
      {isShowSuggest && renderSuggest()}
    </>
  )
}

export default PulldownSuggestList;