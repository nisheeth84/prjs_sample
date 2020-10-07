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
export interface ISuggestionList {
  selectedItem?: any,
  onSelect?: any,
  searchBusinessCard?: any,
  listSuggestions?: any
}

const SuggestionCard = (props: ISuggestionList) => {

  const [searchKeyword, setSearchKeyword] = useState(null);
  const [isHover, changeIsHover] = useState(false);
  const [visibleSelectList, setVisibleSelectList] = useState(false);
  const [, setSelectedItem] = useState(null);
  const refModal = useRef();

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
    if (!props.selectedItem) {
      setSearchKeyword(e.target.value);
      if (!e.target.value) setVisibleSelectList(false);
    }
    props.searchBusinessCard(e.target.value);
  }

  const onClearSelect = () => {
    setSearchKeyword("");
    setVisibleSelectList(false);
    setSelectedItem(null);
  }

  const onSelect = (target) => {
    setSelectedItem(target);
    onClearSelect();
    props.onSelect(target);
  }

  const optionCardList = useCallback((data) => {
    return data.map(item => {
      return <li
        onClick={() => onSelect(item)}
        className={item.businessCardId === props.selectedItem?.businessCardId
          ? "item font-size-14 smooth active w-100 wrap"
          : "item font-size-14 smooth w-100 wrap"}
        key={item.businessCardId}
        value={item.businessCardId}>
        <div className="text text1 font-size-12 height-24 line-height-24" >{item.customerName} {item.departmentName}</div>
        <div className="text text2 height-24 line-height-24">{item.businessCardName} {item.position}</div>
      </li>
    })
  }, [searchKeyword, props.selectedItem])

  useEffect(() => {
    if (props.listSuggestions && props.listSuggestions?.length > 0) setVisibleSelectList(true);
    else setVisibleSelectList(false);
  }, [props.listSuggestions])

  useEffect(() => {
    document.getElementById("suggestion-input-card-list").focus();
    setVisibleSelectList(false);
  }, []);

  return <div>
    <div
      className="break-line form-group common"
      onMouseEnter={() => changeIsHover(true)}
      onMouseLeave={() => changeIsHover(false)}
    >
      <input
        id="suggestion-input-card-list"
        className="input-normal input-common2 hover-white one-item"
        type="text"
        autoComplete="new-password"
        value={searchKeyword}
        placeholder={!props.selectedItem && translate('businesscards.merge-business-card.placeholder')}
        onChange={onSearch}
        onClick={() => props.searchBusinessCard(searchKeyword)}
        autoFocus={true}
      />
      {isHover && searchKeyword && <span className="icon-delete" onClick={() => setSearchKeyword('')}></span>}
      {props.listSuggestions && visibleSelectList && !props.selectedItem && <div className="drop-down w100">
        <ul className="dropdown-item style-3 overflow-scroll" ref={refModal}>
          {optionCardList(props.listSuggestions)}
        </ul>
      </div>}
    </div>
  </div>
}

export default SuggestionCard;
