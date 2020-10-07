import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import { translate } from 'react-jhipster';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import { AUTHORITIES } from 'app/config/constants';
import ConfirmDialog from 'app/shared/layout/dialog/confirm-dialog';
import { ScreenMode } from 'app/config/constants';
import {
  CUSTOMER_LIST_TYPE,
  CUSTOMER_ACTION_TYPES,
  CUSTOMER_LIST_ID,
  CUSTOMER_VIEW_MODES,
  SEARCH_MODE,
  CUSTOMER_MY_LIST_MODES,
  SHARE_LIST_MODES,
  PARTICIPANT_TYPE
} from '../constants';
import _ from 'lodash';
import CreateEditCustomerModal from '../create-edit-customer/create-edit-customer-modal';
import {
  changeShowMap,
} from '../list/customer-list.reducer';
import useEventListener from 'app/shared/util/use-event-listener';

interface IControlTopProps extends StateProps, DispatchProps {
  toggleOpenMapCustom?: any,
  isShowMap,
  toggleOpenModalNetworkCustomer?: any,
  toggleSwitchDisplay,
  toggleOpenPopupSearch,
  modeDisplay?: ScreenMode,
  textSearch?: string,
  activeCardList?: any,
  favouriteList?: any, // to check  Is current active list favouriteList
  enterSearchText?: (text) => void,
  toggleSwitchEditMode?: (isEdit: boolean) => void,
  toggleUpdateInEditMode?: () => void,
  toggleOpenAddToListPopup?: () => void,
  toggleOpenMoveToListPopup?: () => void,
  removeListInFavourite?: (listId) => void,
  deleteList?: (listId) => void,
  addListToAutoList?: (listId) => void,
  downloadCustomers: () => void,
  deleteOutOfList?: (listId) => void,
  addListToFavouriteList?: (cardList) => void,
  deleteCustomers?: () => void,
  searchMode: any,
  conDisplaySearchDetail: any,
  setConDisplaySearchDetail: (boolean) => void,
  handleOpenCustomerIntegration: () => void,
  toggleOpenCustomerMyListModal: (mode, listId, isAutoGroupParam, listMembers) => void,
  toggleOpenCustomerSharedListModal: (mode, listId, isOwner, isAutoList, listMember) => void,
  toggleOpenPopupSetting,
  toggleOpenModalCreateCustomer?: any,
  toggleOpenHelpPopup,
  isDisableEdit?: boolean;
}

interface IDynamicListStateProps {
  authorities,
}

type ICustomerControlTopProps = IControlTopProps & IDynamicListStateProps;

/**
 * Control Customer top header
 * @param props
 */
const CustomerControlTop = (props: ICustomerControlTopProps) => {

  const [valueTextSearch, setValueTextSearch] = useState(props.textSearch);
  const [valueTextSearchOld, setValueTextSearchOld] = useState(props.textSearch);
  const [showRegistrationOption, setShowRegistrationOption] = useState(false);
  const [showActionCustomer, setShowActionCustomer] = useState(false);
  const registerRef = useRef(null);
  const refActionCustomer = useRef(null);

  const [lstListMember, setLstListMember] = useState([]);
  const isAdmin = hasAnyAuthority(props.authorities, [AUTHORITIES.ADMIN]);
  const [activeCardList, setActiveCardList] = useState(props.activeCardList);

  /**
   * Onclick to switch display (view <=> edit)
   */
  const onClickSwitchDisplay = (event) => {
    props.toggleSwitchDisplay();
    event.preventDefault();
  };

  useEffect(() => {
    setActiveCardList(props.activeCardList);
  }, [props.activeCardList])

  useEffect(() => {
    if (props.localMenuData) {
      const listShareUpdate = props.localMenuData.sharedList.find(e => e.listId === props.activeCardList.listId)
      const listMyUpdate = props.localMenuData.myList.find(e => e.listId === props.activeCardList.listId)
      listShareUpdate && setActiveCardList(listShareUpdate)
      listMyUpdate && setActiveCardList(listMyUpdate)
    }
  }, [props.localMenuData])

  /**
   * on blur text search
   */
  const onBlurTextSearch = (event) => {
    if (props.enterSearchText && valueTextSearchOld !== valueTextSearch.trim()) {
      setValueTextSearchOld(valueTextSearch.trim());
      props.enterSearchText(valueTextSearch.trim());
    }
  }

  useEffect(() => {
    if (props.urlCustomersDownload) {
      // download file csv when api response an url
      window.open(props.urlCustomersDownload);
    }
  }, [props.urlCustomersDownload]);

  useEffect(() => {
    if (_.isEmpty(props.textSearch)) {
      setValueTextSearch(props.textSearch);
    }
  }, [props.textSearch])

  /**
   * On click icon search in local
   */
  const onClickIConSearch = () => {
    if (props.enterSearchText) {
      setValueTextSearchOld(valueTextSearch.trim());
      props.enterSearchText(valueTextSearch.trim());
    }
  }

  /**
   * On click to open popup search field
   * @param event
   */
  const onClickOpenPopupSearch = (event) => {
    props.toggleOpenPopupSearch();
    event.preventDefault();
  };

  /**
   * Enter affter input text seach
   * @param event
   */
  const handleKeyPress = (event) => {
    if (event.charCode === 13) {
      onClickIConSearch();
    }
  }

  const onClickOpenModalTestCustomer = (event) => {
    props.toggleOpenMapCustom(event);
  }

  const modalNetworkCustomer = (event) => {
    // props.toggleOpenModalNetworkCustomer(CUSTOMER_ACTION_TYPES.VIEW_POPUP_DEMO, CUSTOMER_ACTION_TYPES.UPDATE);
  }

  const onClickOpenModalCreateCustomer = (event) => {
    setShowRegistrationOption(false);
    props.toggleOpenModalCreateCustomer(CUSTOMER_ACTION_TYPES.CREATE, CUSTOMER_VIEW_MODES.EDITABLE);
    event.preventDefault();
  }

  /**
 * Handle for clicking the outside of dropdown
 * @param e
 */
  const handleClickOutsideRegistration = (e) => {
    if (registerRef.current && !registerRef.current.contains(e.target)) {
      setShowRegistrationOption(false);
    }
    if (refActionCustomer.current && !refActionCustomer.current.contains(e.target)) {
      setShowActionCustomer(false);
    }
  }

  useEventListener('click', handleClickOutsideRegistration);

  /**
   * Check list favourite
   */
  const checkFavouriteList = () => {
    return props.favouriteList && props.favouriteList.some(item => item.listId === activeCardList.listId);
  }
  /**
 * Handle for rendering registration option
 */
  const renderRegistrationOption = () => {
    return (
      <div className="box-select-option">
        <ul>
          <li><a onClick={onClickOpenModalCreateCustomer}>{translate('customers.top.button.btn-registration')}</a></li>
          <li><a>{translate('customers.top.button.btn-import')}</a></li>
          <li><a>{translate('customers.top.button.btn-buy-outside')}</a></li>
        </ul>
      </div>
    )
  }

  /**
   * Check having any record was checked or not
   */
  const hasRecordCheck = () => {
    return props.recordCheckList && props.recordCheckList.length > 0 && props.recordCheckList.filter(e => e.isChecked).length > 0;
  }

  const setListOfListMember = () => {
    const lstMember = [];
    if (props.recordCheckList) {
      for (let i = 0; i < props.recordCheckList.length; i++) {
        lstMember.push(props.recordCheckList[i].customerId)
      }
    }
    setLstListMember(lstMember);
  }

  const getLengthOfCheckList = () => {
    if (props.recordCheckList) {
      return props.recordCheckList.length;
    }
    return 0;
  }

  const renderOnClickSidebarElement = () => {
    const isMyList = activeCardList.typeList === CUSTOMER_LIST_TYPE.MY_LIST || activeCardList.customerListType === CUSTOMER_LIST_TYPE.MY_LIST;
    const isSharedList = activeCardList.typeList === CUSTOMER_LIST_TYPE.SHARED_LIST || activeCardList.customerListType === CUSTOMER_LIST_TYPE.SHARED_LIST;
    return (
      <>
        {activeCardList.typeList !== CUSTOMER_LIST_TYPE.ALL_LIST && activeCardList.typeList !== CUSTOMER_LIST_TYPE.CUSTOMER_IN_CHARGE &&
          <>
            {_.get(activeCardList, 'isAutoList') && activeCardList.participantType === PARTICIPANT_TYPE.OWNER &&
              <a className="icon-primary icon-update" onClick={() => props.addListToAutoList(activeCardList)} >
                <label className="tooltip-common">
                  <span>{translate('customers.sidebar.option.update-list')}</span>
                </label>
              </a>
            }
            {activeCardList.typeList !== CUSTOMER_LIST_TYPE.FAVORITE_LIST && !checkFavouriteList()
              ? <a className="icon-primary icon-add-favorites" onClick={() => props.addListToFavouriteList(activeCardList)} >
                <label className="tooltip-common">
                  <span>{translate('customers.sidebar.option.add-to-favorites-list')}</span>
                </label>
              </a>
              : <a className="icon-primary icon-add-favorites active" onClick={() => props.removeListInFavourite(activeCardList)}>
                <label className="tooltip-common">
                  <span>{translate('customers.sidebar.option.remove-from-favorites-list')}</span>
                </label>
              </a>
            }
            {activeCardList && activeCardList.participantType === PARTICIPANT_TYPE.OWNER &&
              <>
                <a
                  className="icon-primary icon-page-edit"
                  onClick={() => {
                    isMyList
                      && props.toggleOpenCustomerMyListModal(
                        CUSTOMER_MY_LIST_MODES.MODE_EDIT_LIST,
                        activeCardList.listId,
                        activeCardList.isAutoList,
                        null
                      );
                    isSharedList
                      && props.toggleOpenCustomerSharedListModal(
                        SHARE_LIST_MODES.MODE_EDIT_LIST,
                        activeCardList.listId,
                        false, // isOwner
                        activeCardList.isAutoList,
                        null // listMember
                      );
                  }} >
                  <label className="tooltip-common">
                    <span>{translate('customers.sidebar.option.edit-list')}</span>
                  </label>
                </a>
                <a className="icon-primary icon-page-delete" onClick={() => props.deleteList(activeCardList)} >
                  <label className="tooltip-common">
                    <span>{translate('customers.sidebar.option.delete-list')}</span>
                  </label>
                </a>
              </>
            }
            <a
              className="icon-primary icon-page"
              onClick={() => {
                isMyList
                  && props.toggleOpenCustomerMyListModal(
                    CUSTOMER_MY_LIST_MODES.MODE_COPY_LIST,
                    activeCardList.listId,
                    activeCardList.isAutoList,
                    null // listMember
                  );
                isSharedList
                  && props.toggleOpenCustomerSharedListModal(
                    SHARE_LIST_MODES.MODE_COPY_LIST,
                    activeCardList.listId,
                    false, // isOwner
                    activeCardList.isAutoList,
                    null // listMember
                  );
              }}
            >
              <label className="tooltip-common">
                <span>{translate('customers.sidebar.option.duplicate-list')}</span>
              </label>
            </a>
            {isMyList &&
              <a className="icon-primary ic-convert-shared-list"
                onClick={() => {
                  props.toggleOpenCustomerSharedListModal(
                    SHARE_LIST_MODES.MODE_SWICH_LIST_TYPE,
                    activeCardList.listId,
                    false, // isOwner
                    activeCardList.isAutoList,
                    null // listMember
                  );
                }}
              >
                <label className="tooltip-common">
                  <span>{translate('customers.sidebar.option.change-to-shared-list')}</span>
                </label>
              </a>
            }
          </>}
      </>
    )
  }

  const renderOnCheckRecord = () => {
    return (
      <>
        <div className="button-pull-down-parent" ref={refActionCustomer}>
          <a title="" className={showActionCustomer ? 'button-pull-down active' : 'button-pull-down'}
            onClick={() => {
              setListOfListMember();
              setShowActionCustomer(!showActionCustomer)
            }} >
            {translate('customers.top.button.btn-list-operator')}
          </a>
          {showActionCustomer &&
            <div className="box-select-option">
              <ul>
                {/* if group is not auto group => display 1 more option: move to group */}
                {activeCardList.participantType === PARTICIPANT_TYPE.OWNER &&
                  <li>
                    <a title=""
                      onClick={() => {
                        setShowActionCustomer(false);
                        props.toggleOpenMoveToListPopup();
                      }}
                    >
                      {translate('customers.top.button.btn-move-list')}
                    </a>
                  </li>
                }
                {/* end [moveToGroup] option */}
                <li>
                  <a title=""
                    onClick={() => {
                      setShowActionCustomer(false);
                      props.toggleOpenAddToListPopup();
                    }}
                  >
                    {translate('customers.top.button.btn-add-to-list')}
                  </a>
                </li>
                <li>
                  <a title=""
                    onClick={() => {
                      setShowActionCustomer(false);
                      props.toggleOpenCustomerMyListModal(
                        CUSTOMER_MY_LIST_MODES.MODE_CREATE_LIST_LOCAL,
                        null, // listId
                        activeCardList.isAutoList,
                        lstListMember // listMember
                      );
                    }}
                  >
                    {translate('customers.top.button.btn-create-my-list')}
                  </a>
                </li>
                <li>
                  <a title=""
                    onClick={() => {
                      setShowActionCustomer(false);
                      props.toggleOpenCustomerSharedListModal(
                        SHARE_LIST_MODES.MODE_CREATE_LIST_LOCAL,
                        null,
                        false,
                        false,
                        lstListMember);
                    }}
                  >
                    {translate('customers.top.button.btn-create-share-list')}
                  </a>
                </li>
                {/* if group is not auto group => display 1 more option: leave group */}
                {
                  activeCardList.participantType === PARTICIPANT_TYPE.OWNER &&
                  <li>
                    <a title=""
                      onClick={() => {
                        setShowActionCustomer(false);
                        props.deleteOutOfList(_.get(activeCardList, 'listId'))
                      }}
                    >
                      {translate('customers.top.button.btn-remove-from-list')}
                    </a>
                  </li>
                }
                {/* end [leaveGroup] option */}
              </ul>
            </div>
          }
        </div>
        <a
          title=""
          className={`icon-primary icon-integration ${getLengthOfCheckList() < 2 ? 'disable' : ''}`}
          onClick={() => getLengthOfCheckList() >= 2 && props.handleOpenCustomerIntegration()}
        >
          <label className="tooltip-common">
            <span>{translate('customers.top.label-tooltip.customer-integration')}</span>
          </label>
        </a>
        <a title="" className="icon-primary icon-erase" onClick={() => props.deleteCustomers()}>
          <label className="tooltip-common">
            <span>{translate('customers.top.label-tooltip.delete')}</span>
          </label>
        </a>
        <a title=""
          className="icon-primary icon-import"
          onClick={() => {
            hasRecordCheck && props.downloadCustomers()
          }}
        >
          <label className="tooltip-common">
            <span>{translate('customers.top.label-tooltip.download')}</span>
          </label>
        </a>
      </>
    )
  }

  return (
    <>
      <div className="control-top">
        <div className="left">
          <div className="button-shadow-add-select-wrap custom" ref={registerRef}>
            <a className="button-shadow-add-select" onClick={onClickOpenModalCreateCustomer}>{translate('customers.top.button.btn-registration')}</a>
            <span className="button-arrow" onClick={() => setShowRegistrationOption(!showRegistrationOption)} />
            {showRegistrationOption && renderRegistrationOption()}
          </div>
          {!hasRecordCheck() && activeCardList && renderOnClickSidebarElement()}
          {hasRecordCheck() && activeCardList && renderOnCheckRecord()}
        </div>
        <div className="right">
          { // Click card isn't List (total, paticipant)
            !activeCardList.listId &&
            <a onClick={onClickSwitchDisplay} className="icon-primary icon-switch-display" >
              <label className="tooltip-common">
                <span>{translate('customers.top.label-tooltip.switch-display')}</span>
              </label>
            </a>
          }
          { // Click card is List and list owner
            activeCardList.listId !== 0 && activeCardList.participantType === PARTICIPANT_TYPE.OWNER &&
            <a onClick={onClickSwitchDisplay} className="icon-primary icon-switch-display" >
              <label className="tooltip-common">
                <span>{translate('customers.top.label-tooltip.switch-display')}</span>
              </label>
            </a>
          }
          {/* <a className={"icon-primary icon-map ml-2 " + (props.isShowMap ? "active" : "")} onClick={(e) => onClickOpenModalTestCustomer(true)} /> */}
          <div className="search-box-button-style">
            <button className="icon-search"><i className="far fa-search" /></button>
            {(props.searchMode === SEARCH_MODE.CONDITION && props.conDisplaySearchDetail) ?
              <input type="text" placeholder={translate('customers.top.place-holder.search')} defaultValue={props.textSearch} value={valueTextSearch}
                onChange={(e) => setValueTextSearch(e.target.value)} onBlur={onBlurTextSearch} onKeyPress={handleKeyPress} className="search-box-button-style" disabled />
              :
              <input type="text" placeholder={translate('customers.top.place-holder.search')} defaultValue={props.textSearch} value={valueTextSearch}
                onChange={(e) => setValueTextSearch(e.target.value)} onBlur={onBlurTextSearch} onKeyPress={handleKeyPress} />
            }
            <button className="icon-fil" onClick={onClickOpenPopupSearch} />
            {(props.searchMode === SEARCH_MODE.CONDITION && props.conDisplaySearchDetail) &&
              <div className="tag">
                {translate('customers.top.place-holder.searching')}
                <button className="close" onClick={() => { setValueTextSearch(''); props.setConDisplaySearchDetail(false) }}>×</button>
              </div>}
          </div>
          {props.modeDisplay === ScreenMode.DISPLAY && (
            props.isDisableEdit
              ? <a className="button-primary button-simple-edit ml-2 disable">{translate('customers.top.title.btn-edit')}</a>
              : <a className="button-primary button-simple-edit ml-2" onClick={(e) => props.toggleSwitchEditMode(true)}>{translate('customers.top.title.btn-edit')}</a>
          )}
          {props.modeDisplay === ScreenMode.EDIT &&
            <button className="button-cancel" type="button" onClick={(e) => props.toggleSwitchEditMode(false)}>{translate('customers.top.title.btn-cancel')}</button>}
          {props.modeDisplay === ScreenMode.EDIT &&
            <button className="button-save" type="button" onClick={(e) => props.toggleUpdateInEditMode()}>{translate('customers.top.title.btn-save')}</button>}
          <a onClick={props.toggleOpenHelpPopup} className="icon-small-primary icon-help-small" />
          {isAdmin && <a onClick={props.toggleOpenPopupSetting} className="icon-small-primary icon-setting-small" />}
        </div>
      </div>
      {/* {showCreateEditCustomerModal &&
        <CreateEditCustomerModal toggleCloseModalCustomer={onCloseModal}
          customerActionType={customerActionType}
          customerViewMode={customerViewMode}
          customerId={customerId} />} */}
    </>
  )
}

const mapStateToProps = ({ customerList, customerControlSidebar, groupModal, authentication, dynamicList }: IRootState) => ({
  localMenuData: customerControlSidebar.localMenuData,
  authorities: authentication.account.authorities,
  recordCheckList: dynamicList.data.has(CUSTOMER_LIST_ID) ? dynamicList.data.get(CUSTOMER_LIST_ID).recordCheckList : [],
  urlCustomersDownload: customerList.customersDownload,
});

const mapDispatchToProps = {

};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomerControlTop);
