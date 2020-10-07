import React, { useState, useEffect, useRef, useCallback } from 'react';
import { translate } from 'react-jhipster';
import { isEmpty, groupBy } from 'lodash';
import { group } from 'console';
import styled from 'styled-components';

const WrapperLi = styled.li`
  div {
    white-space: nowrap;      /*keep text on one line */
    overflow: hidden;         /*prevent text from being shown outside the border */
    text-overflow: ellipsis;
  }
`;

const WrapperSelectedList = styled.div`
  .selected-list {
    top: 4px ;
    left: 12px ;
    border-radius: 8px;
  }
`;
export interface ISuggestionList {
  selectedList: any,
  onSelect: any,
  searchBusinessCard: any,
  listSuggestions: any
}

const SuggestionList = (props: ISuggestionList) => {

  const [searchKeyword, setSearchKeyword] = useState(null);
  const [isHover, changeIsHover] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [visibleSelectList, setVisibleSelectList] = useState(false);
  const [, setIdOfList] = useState(null);
  const [, setSelectedList] = useState(null);
  const refModal = useRef();
  const inputRef = useRef(null);

  const baseUrl = window.location.origin.toString();

  function useOnClickOutside(ref, handler) {
    useEffect(
      () => {
        const listener = event => {
          if (!ref.current || ref.current.contains(event.target)) {
            return;
          }
          handler(event);
        };

        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);

        return () => {
          document.removeEventListener('mousedown', listener);
          document.removeEventListener('touchstart', listener);
        };
      },
      [ref, handler]
    );
  }

  useOnClickOutside(refModal, () => setVisibleSelectList(false));

  const onSearch = (e) => {
    if (!props.selectedList) {
      setSearchKeyword(e.target.value);
      if (e.target.value)
        setVisibleSelectList(true);
      else setVisibleSelectList(false);
    }
    props.searchBusinessCard(e.target.value);
  }

  const listTitles = {
    0: translate('businesscards.sidebar.title.favorite-list'),
    1: translate('businesscards.sidebar.title.my-list'),
    2: translate('businesscards.sidebar.title.shared-list'),
  }

  const onSelect = (target) => {
    setIdOfList(target?.listId ?? null)
    setSearchKeyword("");
    setSelectedList(target);
    props.onSelect(target);
  }

  const onClearSelect = () => {
    setSearchKeyword("");
    setSelectedList(null);
    props.onSelect(null);
  }

  useEffect(() => {
    if (isFocus) {
      inputRef.current.style.border = '1px solid #0f6eb5';
    } else {
      inputRef.current.style.border = '1px solid #e5e5e5';
    }
  }, [isFocus])

  const optionCardList = useCallback((data) => {
    const filteredList = data;
    const grouped = groupBy(filteredList, "listType");
    grouped[0] = filteredList.filter(e => e.displayOrderOfFavoriteList);
    return Object.keys(grouped)?.map((key) => {
      return grouped[key].length > 0 && <WrapperLi className="item smooth">
        <div className="text text2">{listTitles[key]}</div>
        <ul className="drop-down301">
          {grouped[key].map(item => {
            return <li
              onClick={() => onSelect(item)}
              className={item.listId === props.selectedList?.listId ? "item font-size-14 smooth active" : "item font-size-14 smooth"}
              key={item.listId}
              value={item.listId}
            >
              <div>
                {item.listName}
              </div>
              {item.listType === 2 && <div className="font-size-10">{item.employeeSurname}{item.employeeName}</div>}
            </li>
          })}
        </ul>
      </WrapperLi>
    })
  }, [searchKeyword, props.selectedList])

  useEffect(() => {
    if (props.listSuggestions['listInfo']?.length > 0) setVisibleSelectList(true);
    else setVisibleSelectList(false);
  }, [props.listSuggestions])

  useEffect(() => {
    document.getElementById("suggestion-input-card-list").focus();
    setVisibleSelectList(false);
    props.searchBusinessCard();
  }, []);

  return <div>
    <div
      className="select-option language-option remove-after input-common-wrap delete"
      onMouseEnter={() => changeIsHover(true)}
      onMouseLeave={() => changeIsHover(false)}
      onClick={() => setVisibleSelectList(true)}
    >
      <input
        id="suggestion-input-card-list"
        ref={inputRef}
        className="input-normal input-common2 hover-white one-item"
        type="text"
        autoComplete="off"
        value={searchKeyword}
        placeholder={!props.selectedList && translate('businesscards.popup.add-card-to-list.placeholder')}
        onChange={onSearch}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        // onClick={props.searchBusinessCard("")}
        autoFocus={true}
      />
      {isHover && searchKeyword && <span className="icon-delete" onClick={() => setSearchKeyword('')}></span>}
      {!isEmpty(props.listSuggestions['listInfo']) && visibleSelectList && !props.selectedList && searchKeyword && searchKeyword.length > 0 && <div>
        <ul className="drop-down drop-down2 drop-down300 overflow-hidden" ref={refModal}
          onMouseOver={(e) => { e.currentTarget.style.overflow = "auto" }}
          onMouseOut={(e) => { e.currentTarget.style.overflow = "hidden" }}>
          {optionCardList(props.listSuggestions['listInfo'])}
        </ul>
      </div>}
      {props.selectedList &&
        <WrapperSelectedList>
          <div className="selected-list" >
            {props.selectedList.listName}
            <span className={"close"}>
              <img src={baseUrl + `/content/images/ic-close.svg`} alt="" title="" onClick={onClearSelect} />
            </span>
          </div>
        </WrapperSelectedList>
      }
    </div>
  </div>
}

export default SuggestionList;
