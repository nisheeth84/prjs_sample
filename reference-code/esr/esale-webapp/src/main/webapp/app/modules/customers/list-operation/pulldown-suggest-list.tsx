import React, { useState, useEffect, useRef } from 'react';
import _ from 'lodash';
import useEventListener from 'app/shared/util/use-event-listener';
import { translate } from 'react-jhipster';
import { CUSTOMER_LIST_TYPE } from '../constants';
import Popover from 'app/shared/layout/common/Popover';

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
  const inputRef = useRef(null);
  const pulldownRef = useRef(null);

  /**
   * Push selected group to the parent components
   */
  useEffect(() => {
    props.onSelectedSuggest(tags[0]);
  }, [tags])

  const debounceSearch = useRef(
    _.debounce((value: any) => {
      props.onChangeSearchValue(value)
    }, 500)
  );

  const onTextChange = (e) => {
    setTextValue(e.target.value);
  }

  useEffect(() => {
    debounceSearch.current(textValue);
  }, [textValue])

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

  const renderResultSingle = () => {
    if (tags.length === 0) {
      return <></>;
    }
    return (
      <>
        {tags.map((e, idx) => (
          <div key={idx} className="wrap-tag w100">
            <div className="tag text-ellipsis w-auto mw-100">
              {e.customerListName}
              <button className="close" onClick={() => onRemoveTag(idx)}>×</button>
            </div>
            {/* {renderTooltip(e)} */}
          </div>
        ))}
      </>
    )
  }

  const renderSuggest = () => {
    if (props.list && props.list.length === 0) {
      return <></>;
    }
    const listFavoriteListItem = props.list && props.list.filter(e => e.isFavoriteList);
    const listMyListItem = props.list && props.list.filter(e => e.customerListType === CUSTOMER_LIST_TYPE.MY_LIST);
    const listSharedListItem = props.list && props.list.filter(e => e.customerListType === CUSTOMER_LIST_TYPE.SHARED_LIST);
    return (
      <ul className="drop-down drop-down2 drop-down300 w-100 style-3 max-height-300" ref={pulldownRef}>
        {listFavoriteListItem && listFavoriteListItem.length > 0 &&
          <li className="item group-item smooth">
            <div className="text text2">{translate('customers.option-group.favorites-list')}</div>
            <ul className="drop-down301">
              {listFavoriteListItem.map((favoriteItem, idx) => {
                return (
                  <li key={idx} className="item sub-item font-size-14" onClick={() => onSelectTag(favoriteItem)}>
                    <div className="text-ellipsis">{favoriteItem.customerListName}</div>
                    {favoriteItem.customerListType === CUSTOMER_LIST_TYPE.SHARED_LIST &&
                      <div className="font-size-10 text-ellipsis">{favoriteItem.employeeName}</div>
                    }
                  </li>
                )
              })}
            </ul>
          </li>
        }
        {listMyListItem && listMyListItem.length > 0 &&
          <li className="item group-item smooth">
            <div className="text text2">{translate('customers.option-group.my-list')}</div>
            <ul className="drop-down301">
              {listMyListItem.map((e, idx) => {
                return (
                  <li key={idx} className="item sub-item font-size-14" onClick={() => onSelectTag(e)}>
                    <div className="text-ellipsis">{e.customerListName}</div>
                  </li>
                )
              })}
            </ul>
          </li>
        }
        {listSharedListItem && listSharedListItem.length > 0 &&
          <li className="item group-item smooth">
            <div className="text text2">{translate('customers.option-group.shared-list')}</div>
            <ul className="drop-down301">
              {listSharedListItem.map((e, idx) => {
                return (
                  <li key={idx} className="item sub-item font-size-14" onClick={() => onSelectTag(e)}>
                    <div className="text-ellipsis">{e.customerListName}</div>
                    <div className="font-size-10 text-ellipsis">{e.employeeName}</div>
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
      <div className={classNameAutoComplete}>
        {renderResultSingle()}
        <input type="text" className="input-normal" ref={inputRef}
          placeholder={singleTypeDisableInput ? '' : props.placeholder}
          value={singleTypeDisableInput ? '' : textValue}
          onChange={onTextChange}
          onFocus={() => setShowSuggest(true)}
          disabled={singleTypeDisableInput}
          autoFocus={props.autoFocus ? props.autoFocus : false}
        />
        {textValue.length > 0 && <span className="icon-delete" onClick={() => setTextValue('')}></span>}
        {props.errorMessage && <span className="messenger">{props.errorMessage}</span>}
      </div>
      {isShowSuggest && textValue.length > 0 && renderSuggest()}
    </>
  )
}

export default PulldownSuggestList;