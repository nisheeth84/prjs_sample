import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import useDebounce from 'app/shared/util/useDebounce';
import { translate } from 'react-jhipster';
import { Link } from 'react-router-dom'
import { IRootState } from 'app/shared/reducers';

type ILocalNavigationListProp = StateProps & DispatchProps & {
  classActiveId?: any
  listType?: any
  title: any,
  listItems: [],
  optionLabel: string,
  optionId: string,
  extraValueNumber?: any,
  searchLocal?: boolean,
  placeholderSearchBox?: boolean,
  link?: string,
  haveParam?: boolean,
  onSelectOption?: (objectValue) => void,
  onSearchList?: (listObject) => void
}

const LocalNavigationList = (props: ILocalNavigationListProp) => {
  const [toggleList, setToggleList] = useState(true);
  const [textValue, setTextValue] = useState('');
  const [list, setList] = useState([]);
  const debouncedTextValue = useDebounce(textValue, 500);

  const onTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setTextValue(value);
  }

  useEffect(() => {
    let lst
    if (textValue.trim()) {
      lst = props.listItems.filter(obj => { const text = obj[props.optionLabel] as string; return text?.toLowerCase().includes(textValue.trim().toLowerCase()) });

    } else {
      lst = props.listItems;
    }
    setList(lst);
    if (props.onSearchList) {
      props.onSearchList(lst);
    }
  }, [debouncedTextValue])

  useEffect(() => {
    setList(props.listItems);

  }, [props.listItems])


  return (
    <>
      <div className="list-group">
        {props?.listItems?.length >= 5 &&
          <>
            <a role="button" tabIndex={0} className="link-expand text-ellipsis" onClick={() => { setToggleList(!toggleList) }} >
              <span className={toggleList ? "icon-expand up" : "icon-expand down"} />{props.title}
            </a>
            <ul>
              {toggleList && props.searchLocal && props?.listItems?.length >= 5 &&
                <div className="search-box-no-button-style">
                  <button className="icon-search">
                    <i className="far fa-search"></i>
                  </button>
                  <input type="text" placeholder={`${props.placeholderSearchBox || translate('timeline.control.sidebar.search-box')}`} onChange={onTextChange} />
                </div>
              }
              {/* expand > 5  */}
              {toggleList && props?.listItems?.length > 0 && list &&
                list.map((elememt, index) => {
                  return <li className={`menu-parent ${props.classActiveId === (props.listType + "_" + elememt[props.optionId]) ? 'active' : ''}`} key={index + "_" + props.listType + "_" + elememt.groupId}
                    onClick={() => { if (props.onSelectOption) { props.onSelectOption(elememt); } elememt[props.extraValueNumber] = 0; }}>
                    <a role="button" tabIndex={0} className="text-ellipsis" >  {elememt[props.optionLabel]}
                      {elememt[props.extraValueNumber] > 0 && (props.classActiveId !== (props.listType + "_" + elememt[props.optionId])) &&
                        <span className="number">{elememt[props.extraValueNumber]}</span>
                      }
                    </a>
                  </li>
                })
              }
            </ul>
          </>
        }

        {props?.listItems?.length < 5 &&
          <>
            <a role="button" tabIndex={0} className="link-expand text-ellipsis pl-2"> <span className="" /> {props.title}</a>
            <ul>
              {props?.listItems?.length > 0 && list &&
                list.map((item, index) => {
                  return <li className={`menu-parent ${props.classActiveId === (props.listType + "_" + item[props.optionId]) ? 'active' : ''}`} key={index + "_" + props.listType + "_" + item.groupId}
                    onClick={() => { if (props.onSelectOption) { props.onSelectOption(item); } item[props.extraValueNumber] = 0; }}>
                    <a role="button" tabIndex={0} className="text-ellipsis" >  {item[props.optionLabel]}
                      {item[props.extraValueNumber] > 0 && (props.classActiveId !== (props.listType + "_" + item[props.optionId])) && 
                        <span className="number">{ item[props.extraValueNumber] }</span>
                      }
                    </a>
                  </li>
                })
              }
            </ul>
          </>
        }
      </div>
    </>
  )


}

const mapStateToProps = ({ timelineReducerState }: IRootState) => ({
  listCountNew: timelineReducerState.listCountNew,
});

const mapDispatchToProps = {
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LocalNavigationList);
