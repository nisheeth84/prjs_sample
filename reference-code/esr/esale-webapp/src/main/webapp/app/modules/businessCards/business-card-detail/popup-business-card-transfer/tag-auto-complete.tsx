import { DnDItemTypes, DragItem } from "app/shared/layout/common/suggestion/constants";
import { getCustomerSuggestions, reset } from 'app/shared/layout/common/suggestion/tag-auto-complete.reducer';
import { IRootState } from 'app/shared/reducers';
import useEventListener from 'app/shared/util/use-event-listener';
import _ from 'lodash';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { DropTargetMonitor, useDrop } from 'react-dnd';
import { useId } from 'react-id-generator';
import { translate } from 'react-jhipster';
import { connect, Options } from 'react-redux';
import TagAutoCompleteItem from './tag-auto-complete-item';


export enum TagAutoCompleteType {
  None,
  customer
}

export enum TagAutoCompleteMode {
  None,
  Single,
  Multi,
}

interface ITagAutoCompleteDispatchProps {
  reset,
  getCustomerSuggestions
}

interface ITagAutoCompleteStateProps {
  action,
  errorMessage,
  customers
}

interface ITagAutoCompleteOwnProps {
  id: any,
  className?: string,
  inputClass?: string,
  validMsg?: string,
  title?: string,
  placeholder?: string,
  type: TagAutoCompleteType,
  mode: TagAutoCompleteMode,
  isHideResult?: boolean,
  isRequired?: boolean,
  elementTags?: any[],
  listActionOption?: { id, name }[],
  isDisabled?: boolean,
  tagSearch?: boolean,
  setTextValue?
  onActionOptionTag?: (tag, actionId) => void,
  onActionSelectTag?: (id: any, type: TagAutoCompleteType, mode: TagAutoCompleteMode, listTag: any[]) => void,
  onActionSuggestLeft?: (id: any, type: TagAutoCompleteType, mode: TagAutoCompleteMode, param?: any) => void,
  onActionSuggestRight?: (id: any, type: TagAutoCompleteType, mode: TagAutoCompleteMode, param?: any) => void,
  setValidateData?: boolean
}

type ITagAutoCompleteProps = ITagAutoCompleteDispatchProps & ITagAutoCompleteStateProps & ITagAutoCompleteOwnProps;

const TagAutoComplete: React.FC<ITagAutoCompleteProps> = forwardRef((props, ref) => {
  const idInputList = useId(1, "Tag_AutoComplete_");
  const [tags, setTags] = useState([]);
  const [textValue, setTextValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [listSuggest, setListSuggest] = useState([]);
  const [validMsgNull, setValidMsgNull] = useState(true);
  const bodyRef = useRef(null);
  const [validMsgNullSubmit, setValidMsgNullSubmit] = useState(props.setValidateData);


  useEffect(() => {
    return () => {
      props.reset(props.id);
    }
  }, []);

  useEffect(() => {
    if (props.elementTags) {
      setTags(props.elementTags);
    }
  }, [props.elementTags])

  useEffect(() => {
    if (textValue.trim().length === 0) {
      setListSuggest([]);
    } else {
      props.getCustomerSuggestions(props.id, textValue.trim());
    }
  }, [textValue])

  useEffect(() => {
    setListSuggest(props.customers);
  }, [props.customers])

  useImperativeHandle(ref, () => ({
    getTags() {
      return tags;
    },
    setTags(tagsToSet) {
      setTags(tagsToSet);
    },
    deleteTag(index: number) {
      tags.splice(index, 1);
      setTags(_.cloneDeep(tags));
      if (props.onActionSelectTag) {
        props.onActionSelectTag(props.id, props.type, props.mode, tags);
      }
      if (props.type === TagAutoCompleteType.customer) {
        setTextValue('');
        setValidMsgNull(true);
      }
    }
  }));

  /**
   * on Text Change
   * @param e 
   */
  const onTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setTextValue(value);
    props.setTextValue(value);
    if (value.length > 0) {
      setValidMsgNull(false);
    }
    if (value.length === 0) {
      setValidMsgNull(true);
    }
  }
  /**
   * on Remove Tag
   * @param index 
   */
  const onRemoveTag = (index: number) => {
    tags.splice(index, 1);
    setTags(_.cloneDeep(tags));
    if (typeof props.onActionSelectTag === "function") {
      props.onActionSelectTag(props.id, props.type, props.mode, tags);
    }
  }

  const onUnFocusTextBox = (e) => {
    // setListSuggest([]);
  }

  /**
   * on Key Down Text Box
   * @param e 
   */
  const onKeyDownTextBox = (e) => {
    if (e.key === "Tab") {
      setListSuggest([]);
      e.target.blur();
    }
  }

  /**
   * on Action Left
   * @param e 
   */
  const onActionLeft = (e) => {
    if (props.onActionSuggestLeft) {
      props.onActionSuggestLeft(props.id, props.type, props.mode, searchValue);
    }
    setListSuggest([]);
    e.preventDefault ? e.preventDefault() : e.returnValue = false;
  }

  /**
   * on Action Right
   * @param e 
   */
  const onActionRight = (e) => {
    if (props.onActionSuggestRight) {
      props.onActionSuggestRight(props.id, props.type, props.mode);
    }
    setListSuggest([]);
    e.preventDefault ? e.preventDefault() : e.returnValue = false;
  }

  /**
   * on Action Option
   * @param tagIdx 
   * @param ev 
   */
  const onActionOption = (tagIdx: number, ev) => {
    if (tagIdx < 0 || tagIdx > tags.length) {
      return;
    }
    tags[tagIdx].actionId = +ev.target.value;
    if (props.onActionOptionTag) {
      props.onActionOptionTag(tags[tagIdx], +ev.target.value);
    }
    setTags(_.cloneDeep(tags));
  }

  /**
   * select Element Suggest
   * @param elem 
   */
  const selectElementSuggest = (elem: any) => {
    if (props.mode === TagAutoCompleteMode.Single) {
      setTags([elem]);
      if (props.onActionSelectTag) {
        props.onActionSelectTag(props.id, props.type, props.mode, [elem]);
      }
      setListSuggest([]);
    } else if (props.mode === TagAutoCompleteMode.Multi) {
      const obj = _.cloneDeep(elem);
      obj['actionId'] = 0;
      tags.push(obj);
      setTags(_.cloneDeep(tags));
      setListSuggest([]);
      if (props.onActionSelectTag) {
        props.onActionSelectTag(props.id, props.type, props.mode, tags);
      }
    }
  }

  /**
   * handle User Mouse Down
   * @param event 
   */
  const handleUserMouseDown = (event) => {
    if (bodyRef.current && !bodyRef.current.contains(event.target)) {
      setListSuggest([]);
    }
  };

  useEventListener('mousedown', handleUserMouseDown);

  const getSelfIdForTag = (tag: any) => {
    return tag.employeeId ?? tag.departmentId ?? tag.groupId;
  }

  const [{ canDrop, isOver }, drop] = useDrop({
    accept: DnDItemTypes.EMPLOYEE,
    drop(item: DragItem, monitor: DropTargetMonitor) {
      const isAvailable = tags.filter((v) => getSelfIdForTag(v) === getSelfIdForTag(item.data)).length === 0;
      let added = false;
      if (isAvailable) {
        selectElementSuggest(item.data);
        added = true;
      }
      return { added };
    },
    canDrop(item: DragItem, monitor) {
      return tags.filter((v) => getSelfIdForTag(v) === getSelfIdForTag(item.data)).length === 0;
    },
    collect: (monitor: any) => ({
      isOver: monitor.isOver() && monitor.canDrop(),
      canDrop: monitor.canDrop(),
    })
  });

  /**
   * render Element Suggest Customer
   * @param customerInfo 
   */
  const renderElementSuggestCustomer = (customerInfo) => {
    const isActive = tags.filter(e => e.productId === customerInfo.customerId).length > 0;
    return (
      <div className={`item ${isActive ? "active" : ""} smooth`} onClick={(e) => { if (!isActive) { selectElementSuggest(customerInfo) } }}>
        <div className="item2">
          <li className="item smooth">
            {customerInfo.departmentName && <div className="text text1">{customerInfo.departmentName}</div>}
            <div className="text text2">{customerInfo.customerName}</div>
            <div className="text text3">{customerInfo.address}</div>
          </li>
        </div>
      </div>
    );
  }

  /**
   * render Suggest
   */
  const renderSuggest = () => {
    if (!listSuggest || listSuggest.length === 0) {
      return <></>
    }

    return (
      <ul className="drop-down" ref={bodyRef}>
        <ul className="dropdown-item style-3">
          {listSuggest.map((e, idx) => {
            if (props.type === TagAutoCompleteType.customer) {
              return <div key={idx}>{renderElementSuggestCustomer(e)}</div>;
            } else {
              return <></>
            }
          })}
        </ul>
        <div className="form-group search">
          <form>
            <button className="submit" type="button" onClick={onActionLeft} />
            <input type="text" placeholder={translate("businesscards.auto.placeholder")} value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
            <a className="button-primary button-add-new add" onClick={onActionRight}>{translate("businesscards.auto.right")}</a>
          </form>
        </div>
      </ul>
    );
  }

  /**
   * render Result Single
   */
  const renderResultSingle = () => {
    if (props.isHideResult || props.mode !== TagAutoCompleteMode.Single || tags.length < 1) {
      return <></>;
    }
    let tagName1 = "";
    let tagName2 = "";
    if (props.type === TagAutoCompleteType.customer) {
      return (
        <>
          {tags.map((e, idx) => {
            if (e.customerId) {
              tagName1 = e["customerName"];
              if (e["parentCustomerName"] && Array.isArray(e["parentCustomerName"])) {
                tagName2 = e["parentCustomerName"].join(" ");
              }
            } else if (e.parentCustomerName) {
              tagName1 = e.parentCustomerName
            } else if (e.address) {
              tagName1 = e.address
            } else if (e.updatedDate) {
              tagName1 = e.updatedDate
            }
            return <div key={idx} className="wrap-tag">
              <div className="tag">
                {`${tagName1}${tagName2}`}
                <button className="close" onClick={() => onRemoveTag(idx)}>×</button>
              </div>
            </div>
          })}
        </>
      )
    }
  }

  /**
   * render Result Multi Customer
   */
  const renderResultMultiCustomer = () => {
    if (props.isHideResult || tags.length === 0 || props.mode !== TagAutoCompleteMode.Multi || listSuggest.length > 0) {
      return <></>
    }

    return (
      <div className={`show-wrap2 ${props.listActionOption ? 'width-1100' : ''} ${isOver ? 'is-over' : ''} ${canDrop ? 'dropzone-active' : ''}`} ref={drop}>
        {tags.map((e, idx) => {
          let tagName1 = "";
          let tagName2 = "";
          let tagName3 = "";
          if (e.parentCustomerName) {
            tagName1 = e["parentCustomerName"];
          } else if (e.customerName) {
            tagName2 = e["customerName"];
          } else if (e.address) {
            tagName3 = e["address"];
          }
          let styleItem = 'item'
          if (props.listActionOption && props.listActionOption.length > 0) {
            styleItem = 'item item-big'
          }
          return (
            <TagAutoCompleteItem
              key={idx}
              idx={idx}
              tag={e}
              tagNames={[tagName1, tagName2, tagName3]}
              className={styleItem}
              onActionOption={onActionOption}
              onRemoveTag={onRemoveTag} />
          )
        })}
      </div>
    );
  }

  /**
   * render  Result Multi
   */
  const renderResultMulti = () => {
    if (props.isHideResult || tags.length === 0 || props.mode !== TagAutoCompleteMode.Multi || listSuggest.length > 0) {
      return <></>
    }
    if (props.type === TagAutoCompleteType.customer) {
      return renderResultMultiCustomer();
    }
  }

  let styleInput = '';
  if (props.validMsg) {
    styleInput = 'input-common-wrap error';
  }

  let classNameAutoComplete = '';
  if (props.tagSearch) {
    classNameAutoComplete += 'search-box-button-style'
  }

  return (
    <>
      <div className={props.className}>
        <div className={classNameAutoComplete}>
          {renderResultSingle()}
          {(props.tagSearch && tags.length === 0) && <button className="icon-search"><i className="far fa-search"></i></button>}
          <div className={styleInput}>
            {(props.mode !== TagAutoCompleteMode.Single || tags.length === 0) &&
              <input type="text"
                className={props.inputClass + (props.setValidateData && validMsgNull ? " error" : "")}
                placeholder={props.placeholder}
                id={idInputList[0]}
                value={textValue}
                onChange={onTextChange}
                onBlur={onUnFocusTextBox}
                onKeyDown={onKeyDownTextBox}
                disabled={props.isDisabled}
              />}
            {textValue && textValue.length > 0 && <span className="icon-delete" onClick={() => setTextValue('')} />}
          </div>
          <div className={styleInput}>
            {(props.setValidateData && validMsgNull) ? <div className="messenger-err">{translate("messages.ERR_COM_0013")}</div> : <></>}
          </div>
        </div>
        {renderSuggest()}
      </div>
      <div className={props.className}>
        {renderResultMulti()}
      </div>
    </>
  );
});

TagAutoComplete.defaultProps = {
  className: "form-group-common",
  inputClass: "input-normal input-common2 one-item",
  placeholder: "テキスト",
};

/**
 * map State To Props
 * @param param0 
 * @param ownProps 
 */
const mapStateToProps = ({ tagAutoCompleteState }: IRootState, ownProps: ITagAutoCompleteOwnProps) => {
  if (!tagAutoCompleteState || !tagAutoCompleteState.data.has(ownProps.id)) {
    return { action: null, customers: [], errorMessage: null };
  }
  return {
    action: tagAutoCompleteState.data.get(ownProps.id).action,
    customers: tagAutoCompleteState.data.get(ownProps.id).customerName,
    errorMessage: tagAutoCompleteState.data.get(ownProps.id).errorMessage,
  }
}

const mapDispatchToProps = {
  reset,
  getCustomerSuggestions
};

const options = { forwardRef: true };

export default connect<ITagAutoCompleteStateProps, ITagAutoCompleteDispatchProps, ITagAutoCompleteOwnProps>(
  mapStateToProps,
  mapDispatchToProps,
  null,
  options as Options
)(TagAutoComplete);
