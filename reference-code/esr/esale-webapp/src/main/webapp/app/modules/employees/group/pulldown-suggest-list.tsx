import React, { useState, useEffect, useRef } from 'react';
import _ from 'lodash';
import useEventListener from 'app/shared/util/use-event-listener';
import { translate } from 'react-jhipster';
import { GROUP_TYPE } from 'app/shared/layout/dynamic-form/group/constants';

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

  const renderResultSingle = () => {
    if (tags.length === 0) {
      return <></>;
    }
    return (
      <>
        {tags.map((e, idx) => (
          <div key={idx} className="wrap-tag w100">
            <div className="tag text-ellipsis w-auto mw-100">
              {e.groupName}
              <button className="close" onClick={() => onRemoveTag(idx)}>×</button>
            </div>
            {/* {renderTooltip(e)} */}
          </div>
        ))}
      </>
    )
  }

  const renderSuggest = () => {
    if (textValue.trim().length === 0 || props.list.length === 0) {
      return <></>;
    }
    const listMyGroupItem = props.list && props.list.filter(e => e.groupType === GROUP_TYPE.MY);
    const listSharedGroupItem = props.list && props.list.filter(e => e.groupType === GROUP_TYPE.SHARED);
    return (
      <ul className="drop-down drop-down2 drop-down300 w-100 style-3 max-height-300" ref={pulldownRef}>
        {listMyGroupItem && listMyGroupItem.length > 0 &&
          <li className="item group-item smooth">
            <div className="text text2">{translate('employees.group.group-modal-add-to-group.my-group')}</div>
            <ul className="drop-down301">
              {listMyGroupItem.map((e, idx) => {
                return (
                  <li key={idx} className="item sub-item font-size-14" onClick={() => onSelectTag(e)}>
                    <div className="text-ellipsis">{e.groupName}</div>
                  </li>
                )
              })}
            </ul>
          </li>
        }
        {listSharedGroupItem && listSharedGroupItem.length > 0 &&
          <li className="item group-item smooth">
            <div className="text text2">{translate('employees.group.group-modal-add-to-group.share-group')}</div>
            <ul className="drop-down301">
              {listSharedGroupItem.map((e, idx) => {
                return (
                  <li key={idx} className="item sub-item font-size-14" onClick={() => onSelectTag(e)}>
                    <div className="text-ellipsis">{e.groupName}</div>
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
      {isShowSuggest && renderSuggest()}
    </>
  )
}

export default PulldownSuggestList;