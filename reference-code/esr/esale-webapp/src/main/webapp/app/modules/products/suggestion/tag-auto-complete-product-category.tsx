import React, { useState, forwardRef, useEffect, useRef, useImperativeHandle } from 'react';
import { IRootState } from 'app/shared/reducers';
import { connect, Options } from 'react-redux';
import _ from 'lodash';
import { useId } from 'react-id-generator';
import {
  reset,
  getProductCategorySuggestions,
  saveSuggestionsChoice
} from './tag-auto-complete-product-category.reducer';
import useEventListener from 'app/shared/util/use-event-listener';
// import useDebounce from '../../../util/useDebounce';
// import ResultSingleProduct from './tag-auto-complete-product/result-multi-product';
import SuggestProductCategory from './tag-auto-complete-product-category/suggest-product-category';
import useDebounce from 'app/shared/util/useDebounce';
import { getFieldLabel } from 'app/shared/util/string-utils';
// import { getJsonBName } from '../utils';

export enum TagAutoCompleteType {
  None,
  ProductCategories,
}

export enum TagAutoCompleteMode {
  None,
  Single,
  Multi,
}

export enum SearchType {
  Department = 1,
  Employee = 2,
  Group = 3,
}

export enum IndexSaveSuggestionChoice {
  Employee = "employee",
  Department = "employee_department",
  Group = "employee_group",
}

interface ITagAutoCompleteDispatchProps {
  reset,
  getProductCategorySuggestions,
  saveSuggestionsChoice
}

interface ITagAutoCompleteStateProps {
  action,
  products,
  tradingProducts,
  employees,
  milestones,
  errorMessage,
  errorItems,
  suggestionsChoiceId,
  newCategory
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
  searchType?: SearchType,
  onActionOptionTag?: (tag, actionId) => void,
  onActionSelectTag?: (id: any, type: TagAutoCompleteType, mode: TagAutoCompleteMode, listTag: any[]) => void,
  onActionSuggestLeft?: (id: any, type: TagAutoCompleteType, mode: TagAutoCompleteMode, param?: any) => void
  onActionSuggestRight?: (id: any, type: TagAutoCompleteType, mode: TagAutoCompleteMode, param?: any) => void,
  isFocusInput?: boolean;
  editCategory?: number;
  onAddNewCategory?: any
  isPopup1?: boolean,
  hideSuggest?: boolean
}

type ITagAutoCompleteProps = ITagAutoCompleteDispatchProps & ITagAutoCompleteStateProps & ITagAutoCompleteOwnProps;

const TagAutoCompleteProductCategory: React.FC<ITagAutoCompleteProps> = forwardRef((props, ref) => {
  const idInputList = useId(1, "Tag_AutoComplete_");
  const [tags, setTags] = useState([]);
  const [textValue, setTextValue] = useState(null);
  const [listSuggest, setListSuggest] = useState([]);
  const bodyRef = useRef(null);
  const inputRef = useRef(null);
  const [offset, setOffset] = useState(0);
  // const [isScroll, setIsScroll] = useState(false);
  const debouncedTextValue = useDebounce(textValue, 500);
  const [showSuggest, setShowSuggest] = useState(false);

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

  const getSuggestions = (isGetMoreData) => {
    const offSet = isGetMoreData ? offset + 10 : 0;
    // setIsScroll(isGetMoreData);
    setOffset(offSet);
    props.getProductCategorySuggestions(props.id, (textValue ? textValue.trim() : null), offSet);
  }

  useEffect(() => {
    if (textValue || textValue === "") {
      getSuggestions(false);
    }
  }, [debouncedTextValue])

  if (props.isFocusInput && inputRef && inputRef.current) {
    inputRef.current.focus();
  }

  useEffect(() => {
    if (!props.hideSuggest && props.isPopup1 && props.newCategory?.productCategoryId && props.newCategory?.productCategoryName) {
      setTags([props.newCategory])
    }
  }, [JSON.stringify(props.newCategory), props.hideSuggest])

  useEffect(() => {
    if (props.type === TagAutoCompleteType.ProductCategories) {
      if (props.products && props.products.length > 0) {
        const lst = props.products.filter(e => e.productCategoryId !== props.editCategory)
        if (offset !== 0) {
          setListSuggest([...listSuggest, ...lst]);
        } else {
          setListSuggest(lst);
        }
      } else {
        if (offset === 0) {
          setListSuggest([]);
        }
      }
    }
  }, [props.products])

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
    }
  }));

  const onTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setTextValue(value);
    if (value) {
      setShowSuggest(true);
    }
  }

  // const onCategoryChange = (e, idx) => {
  //   const { value } = e.target;
  //   const amountRegExp = new RegExp('^[0-9]*$');
  //   if (value === '' || amountRegExp.test(value)) {
  //     // const obj = _.cloneDeep(tags[idx]);
  //     // obj.amount = value === '' ? 0 : +value;
  //     tags[idx].amount = value === '' ? 0 : +value;
  //     setTags(_.cloneDeep(tags));
  //     if (props.onActionSelectTag) {
  //       props.onActionSelectTag(props.id, props.type, props.mode, tags);
  //     }
  //     e.preventDefault ? e.preventDefault() : e.returnValue = false;
  //   } else {
  //     return;
  //   }
  // }

  const onRemoveTag = (index: number) => {
    tags.splice(index, 1);
    setTags(_.cloneDeep(tags));
    if (typeof props.onActionSelectTag === "function") {
      props.onActionSelectTag(props.id, props.type, props.mode, tags);
    }
  }

  const onFocusTextBox = (e) => {
    // if (textValue.trim().length > 0) {

    getSuggestions(false);
    setShowSuggest(true);
    // }
  }

  const onUnFocusTextBox = (e) => {
    // setListSuggest([]);
  }

  const onKeyDownTextBox = (e) => {
    if (e.key === "Tab") {
      setListSuggest([]);
      e.target.blur();
    }
  }

  // const onActionLeft = (e) => {
  //   if (props.onActionSuggestLeft) {
  //     props.onActionSuggestLeft(props.id, props.type, props.mode, searchValue);
  //   }
  //   setListSuggest([]);
  //   e.preventDefault ? e.preventDefault() : e.returnValue = false;
  // }

  const onActionRight = (e) => {
    if (props.onActionSuggestRight) {
      props.onActionSuggestRight(props.id, props.type, props.mode);
    }

    setListSuggest([]);
    e.preventDefault ? e.preventDefault() : e.returnValue = false;
    props.onAddNewCategory()
  }

  const saveSuggestionChoice = (id) => {
    props.saveSuggestionsChoice(props.id, "product_category", id);
  }

  const selectElementSuggest = (elem: any) => {
    setTags([elem]);
    if (props.onActionSelectTag) {
      props.onActionSelectTag(props.id, props.type, props.mode, [elem]);
      saveSuggestionChoice(elem.productCategoryId)
    }
    setListSuggest([]);

    // if (props.mode === TagAutoCompleteMode.Single) {
    //   setTags([elem]);
    //   if (props.onActionSelectTag) {
    //     props.onActionSelectTag(props.id, props.type, props.mode, [elem]);
    //   }
    //   setListSuggest([]);
    // } else if (props.mode === TagAutoCompleteMode.Multi) {
    //   const obj = _.cloneDeep(elem);
    //   if (props.type === TagAutoCompleteType.ProductCategories) {
    //     obj['amount'] = 1;
    //   }
    //   obj['actionId'] = 0;
    //   tags.push(obj);
    //   setTags(_.cloneDeep(tags));
    //   setListSuggest([]);
    //   if (props.onActionSelectTag) {
    //     props.onActionSelectTag(props.id, props.type, props.mode, tags);
    //   }
    // }
    // // saveSuggestionChoice(elem);
  }

  const handleUserMouseDown = (event) => {
    if (bodyRef.current && !bodyRef.current.contains(event.target) && inputRef.current && !inputRef.current.contains(event.target)) {
      setListSuggest([]);
      setShowSuggest(false);
    }
  };

  useEventListener('mousedown', handleUserMouseDown);

  // const [{ canDrop, isOver }, drop] = useDrop({
  //   accept: DnDItemTypes.EMPLOYEE,
  //   drop(item: DragItem, monitor: DropTargetMonitor) {
  //     const isAvailable = tags.filter((v) => getSelfIdForTag(v) === getSelfIdForTag(item.data)).length === 0;
  //     let added = false;
  //     if (isAvailable) {
  //       selectElementSuggest(item.data);
  //       added = true;
  //     }
  //     return { added };
  //   },
  //   canDrop(item: DragItem, monitor) {
  //     return tags.filter((v) => getSelfIdForTag(v) === getSelfIdForTag(item.data)).length === 0;
  //   },
  //   collect: (monitor: any) => ({
  //     isOver: monitor.isOver() && monitor.canDrop(),
  //     canDrop: monitor.canDrop(),
  //   })
  // });

  const renderElementSuggestProduct = (productInfo) => {
    return (
      <SuggestProductCategory
        productInfo={productInfo}
        tags={tags}
        selectElementSuggest={selectElementSuggest}
      />
    )
  }

  /**
   * handle calling api when scroll to bottom
   * @param e event
   */
  const handleScroll = (e) => {
    const element = e.target;
    if (listSuggest && element.scrollHeight - element.scrollTop === element.clientHeight && textValue) {
      getSuggestions(true);
    }
  }
  const renderSuggest = () => {
    // if (textValue.length === 0) {
    //   return <></>
    // }

    return (
      <div className="drop-down tag-auto-complete-product-category" ref={bodyRef}>
        <ul className="dropdown-item style-3" onScroll={handleScroll}>
          {listSuggest && listSuggest.map((e) => {
            if (props.type === TagAutoCompleteType.ProductCategories) {
              return renderElementSuggestProduct(e);
            } else {
              return <></>
            }
          })}
        </ul>
        <div className="form-group search height-40">
          <form>
            {props.onAddNewCategory && <a className="button-primary button-add-new add" onClick={onActionRight}>新規追加</a>}
          </form>
        </div>
      </div>
    );
  }

  const renderResultSingle = () => {
    if (props.isHideResult || props.mode !== TagAutoCompleteMode.Single || tags.length < 1) {
      return <></>;
    }
    if (props.type === TagAutoCompleteType.ProductCategories) {
      const tagName1 = "productCategoryName";
      return (
        <div className={"wrap-tag "}>
          {/* getJsonBName(productInfo.productCategoryName) */}
          {tags.map((e, idx) =>
            <div key={idx} className="tag tag-ellipsis " >{getFieldLabel(e, tagName1)}<button className="close close-category" onClick={() => onRemoveTag(idx)}>×</button></div>
          )}
        </div>
      )
    }
  }




  /**
 * Get error infor by field name
 * @param fieldName
 */
  const getErrorInfo = fieldName => {
    if (!props.errorItems) return null;
    let errorInfo = null;
    for (const elem of props.errorItems) {
      if (elem.item === fieldName) {
        // const errorTmp = {};
        // errorTmp['rowId'] = elem.rowId;
        // errorTmp['item'] = elem.item;
        // errorTmp['errorCode'] = elem.errorCode;
        // errorTmp['errorParams'] = elem.errorParams ? elem.errorParams : null;
        // errorInfo = errorTmp;
        errorInfo = elem;
        break;
      }
    }
    return errorInfo;
  };
  const [styleInput, setStyleInput] = useState('input-common-wrap');
  useEffect(() => {
    if (props.validMsg || props.errorMessage) {
      setStyleInput('input-common-wrap normal-error');
    } else if (textValue && textValue.length > 0) {
      setStyleInput('input-common-wrap delete');
    } else {
      setStyleInput('');
    }
  }, [props.validMsg, textValue])

  useEffect(() => {
    if (tags.length > 0) {
      setTextValue('');
      setShowSuggest(false);
    }
  }, [tags])

  // let classNameAutoComplete = '';
  // if (props.tagSearch) {
  //   classNameAutoComplete += 'search-box-button-style'
  // }

  const singleTypeDisableInput = props.mode === TagAutoCompleteMode.Single && tags.length > 0;
  return (
    <>
      <label htmlFor={idInputList[0]}>{props.title} {props.isRequired && <label className="label-red">必須</label>}</label>
      <div className={`search-box-button-style-category padding-right-unset ${styleInput}`}>
        {renderResultSingle()}
        {/* {(props.tagSearch && tags.length === 0) && <button className="icon-search"><i className="far fa-search"></i></button>} */}
        {tags.length < 1 &&
          <input type="text"
            ref={inputRef}
            className={props.inputClass}
            placeholder={singleTypeDisableInput ? '' : props.placeholder}
            id={idInputList[0]}
            value={singleTypeDisableInput ? '' : textValue}
            onChange={onTextChange}
            onFocus={onFocusTextBox}
            onBlur={onUnFocusTextBox}
            onKeyDown={onKeyDownTextBox}
            disabled={props.isDisabled || singleTypeDisableInput}
            autoComplete="off"
          />}
        {props.errorItems && <div className="messenger">{getErrorInfo('milestoneId')}</div>}
        {textValue && textValue.length > 0 && <span className="icon-delete" onClick={() => setTextValue('')} />}
      </div>
      {(props.validMsg || props.errorMessage) &&
        <div className={styleInput}>
          <div className="messenger">{props.validMsg}</div>
        </div>
      }
      {(!props.hideSuggest && showSuggest && listSuggest && listSuggest.length > 0) && renderSuggest()}

      {/* {openPopupSearch &&
        <PopupFieldsSearch
          iconFunction="ic-sidebar-employee.svg"
          fieldBelong={FIELD_BELONG.EMPLOYEE}
          conditionSearch={conditionSearch}
          onCloseFieldsSearch={onClosePopupSearch}
          onActionSearch={handleSearchPopup}
          conDisplaySearchDetail={conDisplaySearchDetail}
          setConDisplaySearchDetail={setConDisplaySearchDetail}
          fieldNameExtension="employee_data"
        />
      } */}
    </>
  );
});

TagAutoCompleteProductCategory.defaultProps = {
  className: "form-group-common",
  inputClass: "input-normal",
  placeholder: "テキスト",
};

const mapStateToProps = ({ tagSuggestProductCategoriesState, authentication, categoryRegistEdit }: IRootState, ownProps: ITagAutoCompleteOwnProps) => {
  if (!tagSuggestProductCategoriesState || !tagSuggestProductCategoriesState.data.has(ownProps.id)) {
    return { action: null, products: [], tradingProducts: [], employees: {}, milestones: [], errorMessage: null, errorItems: null, suggestionsChoiceId: null, newCategory: {} };
  }
  return {
    action: tagSuggestProductCategoriesState.data.get(ownProps.id).action,
    products: tagSuggestProductCategoriesState.data.get(ownProps.id).products,
    tradingProducts: tagSuggestProductCategoriesState.data.get(ownProps.id).tradingProducts,
    employees: tagSuggestProductCategoriesState.data.get(ownProps.id).employees,
    milestones: tagSuggestProductCategoriesState.data.get(ownProps.id).milestones,
    errorMessage: tagSuggestProductCategoriesState.data.get(ownProps.id).errorMessage,
    errorItems: tagSuggestProductCategoriesState.data.get(ownProps.id).errorItems,
    suggestionsChoiceId: tagSuggestProductCategoriesState.data.get(ownProps.id).suggestionsChoiceId,
    newCategory: categoryRegistEdit.newCategory
  }
}

const mapDispatchToProps = {
  reset,
  getProductCategorySuggestions,
  saveSuggestionsChoice
};

const options = { forwardRef: true };

export default connect<ITagAutoCompleteStateProps, ITagAutoCompleteDispatchProps, ITagAutoCompleteOwnProps>(
  mapStateToProps,
  mapDispatchToProps,
  null,
  options as Options
)(TagAutoCompleteProductCategory);
