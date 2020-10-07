import React, { useState, useEffect, useRef } from 'react';
import { translate, Storage } from 'react-jhipster';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { startExecuting } from 'app/shared/reducers/action-executing';
import { REQUEST } from 'app/shared/reducers/action-type.util';
import {
  handleCreateShareList,
  ACTION_TYPES,
  resetError,
} from './../business-card-list.reducer';
import { Modal } from 'reactstrap';
import { TagAutoCompleteMode, TagAutoCompleteType } from 'app/shared/layout/common/suggestion/constants';
import TagAutoComplete from 'app/shared/layout/common/suggestion/tag-auto-complete';
import _ from 'lodash';
import DialogDirtyCheck from '../../../../shared/layout/common/dialog-dirty-check';
import { decodeUserLogin } from 'app/shared/util/string-utils';
import styled from 'styled-components';
import { USER_ICON_PATH } from 'app/config/constants';

const WrapButtonBack = styled.a`
  pointer-events: none;
  cursor: default;
  color: none;
  &:hover, &:focus{
    pointer-events: none;
    cursor: default;
    color: none;
  }
`;
/**
 * pulldown option for set permission
 */
const PULL_DOWN_MEMBER_GROUP_PERMISSION = [
  {
    itemId: 1,
    itemLabel: 'businesscards.sharelist.permision.viewer'
  },
  {
    itemId: 2,
    itemLabel: 'businesscards.sharelist.permision.owner'
  }
];

export enum FSActionTypeScreen {
  None,
  RemoveSession,
  SetSession,
  GetSession,
  CloseWindow,
  CreatSuccess
}

export interface IPopupCreateShareList extends StateProps, DispatchProps {
  // list id business card selected from list
  listIdChecked,
  // handle open or close popup
  setOpenPopupCreateShareList,
  // check screen mode is popout or popup
  popout?
  // param to open popout
  listId
}

/**
 * Component for popup create share list
 * @param props 
 */
const PopupCreateShareList = (props: IPopupCreateShareList) => {
  const ref = useRef(null);
  const [showModal, setShowModal] = useState(true);
  const [, setIsSubmitted] = useState(false);
  const [validateName, setValidateName] = useState("");
  const [validateItem, setValidateItem] = useState("");
  const [businessCardListName, setBusinessCardListName] = useState('');
  const [, setListName] = useState('');
  const [tags, setTags] = useState([]);
  const [forceCloseWindow, setForceCloseWindow] = useState(false);
  const [groupParticipants, setGroupParticipants] = useState([]);
  const [listIdChecked, setListIdChecked] = useState(props.listIdChecked ? props.listIdChecked : []);
  const inputRef = useRef(null);
  const [isHover, changeIsHover] = useState(false);
  const [isChange, setIsChange] = useState(false);

  useEffect(() => {
    inputRef.current.focus();
  }, [])
  /**
   * close popup
   */
  const closeModal = () => {
    props.resetError();
    props.setOpenPopupCreateShareList(false);
  }

  /**
   * update session when open popout
   * @param mode 
   */
  const updateStateSession = (mode: FSActionTypeScreen) => {
    if (mode === FSActionTypeScreen.SetSession) {
      const saveObj = {
        businessCardListName,
        listIdChecked,
        groupParticipants,
        tags
      };
      Storage.local.set(PopupCreateShareList.name, _.cloneDeep(saveObj));
    } else if (mode === FSActionTypeScreen.GetSession) {
      const saveObj = _.cloneDeep(Storage.local.get(PopupCreateShareList.name));

      if (saveObj) {
        setListIdChecked(saveObj.listIdChecked);
        setBusinessCardListName(saveObj.businessCardListName)
        setGroupParticipants(saveObj.groupParticipants);
        setTags(saveObj.tags);
      }
    } else if (mode === FSActionTypeScreen.RemoveSession) {
      Storage.local.remove(PopupCreateShareList.name);
    }
  }

  useEffect(() => {
    if (props.popout) {
      updateStateSession(FSActionTypeScreen.GetSession);
      setShowModal(false);
      setForceCloseWindow(false);
      updateStateSession(FSActionTypeScreen.RemoveSession);
    } else {
      const infoUserLogin = decodeUserLogin();
      const photoFileUrl = Storage.session.get(USER_ICON_PATH, 'default icon');
      const ownerUser = {
        employeeId: infoUserLogin['custom:employee_id'],
        employeeName: infoUserLogin['custom:employee_surname'],
        employeeSurname: infoUserLogin['custom:employee_surname'],
        participantType: 2,
        employeeIcon: { fileUrl: photoFileUrl }
      }
      setShowModal(true);
      setTags([...tags, ownerUser]);
      ref.current.setTags([...tags, ownerUser])
    }
  }, []);

  useEffect(() => {
    if (forceCloseWindow) {
      if (props.popout) {
        window.opener.postMessage({ type: FSActionTypeScreen.CloseWindow, 'forceCloseWindow': true }, window.location.origin);
        Storage.session.set('forceCloseWindow', true);
        window.close();
      } else {
        closeModal();
      }
    }
  }, [forceCloseWindow]);

  /**
   * handle close popup or window
   */
  const handleCloseModal = () => {
    if (props.popout) {
      window.opener.postMessage({ type: FSActionTypeScreen.CreatSuccess, forceCloseWindow: true }, window.location.origin);
      Storage.session.set('forceCloseWindow', true);
      window.close();
    } else {
      updateStateSession(FSActionTypeScreen.RemoveSession);
      closeModal();
    }
  }

  /**
   * 
   * @param id handle action select tag auto complete
   * @param type 
   * @param mode 
   * @param listTag 
   */
  const onActionSelectTag = (id: any, type: TagAutoCompleteType, mode: TagAutoCompleteMode, listTag: any[]) => {
    setIsChange(true);
    const tmpListTags = listTag.map(el => {
      if (el.participantType) {
        return el;
      }
      return ({ ...el, participantType: 2 })
    });
    ref.current.setTags(tmpListTags);
    setTags(tmpListTags);
    setValidateItem("");
  }

  useEffect(() => {
    if (props.popout) {
      ref.current.setTags(tags);
    }
  }, [tags])

  /**
   * get list action (permission, ...)
   */
  const getListAction = () => {
    const tmpPullDownMemberGroupPermission = [];
    PULL_DOWN_MEMBER_GROUP_PERMISSION.forEach((e, idx) => {
      tmpPullDownMemberGroupPermission.push({ id: e.itemId, name: translate(e.itemLabel) });
    });
    return tmpPullDownMemberGroupPermission;
  }

  /**
   * set list participants type
   * @param tagSelected 
   * @param type 
   */
  const setListParticipantsType = (tagSelected, type) => {
    setIsChange(true)
    const tmpParticipantsType = _.cloneDeep(tags);
    tmpParticipantsType.forEach(tag => {
      if (tag.employeeId && tagSelected.employeeId && tag.employeeId === tagSelected.employeeId) {
        tag.participantType = type;
      } else if (tag.groupId && tagSelected.groupId && tag.groupId === tagSelected.groupId) {
        tag.participantType = type;
      } else if (tag.departmentId && tagSelected.departmentId && tag.departmentId === tagSelected.departmentId) {
        tag.participantType = type;
      }
    });
    setTags(tmpParticipantsType);
    ref.current.setTags(tmpParticipantsType);
  }

  /**
   * handle open popout
   */
  const openNewWindow = () => {
    updateStateSession(FSActionTypeScreen.SetSession);
    setShowModal(false);
    const height = screen.height * 0.8;
    const width = screen.width * 0.8;
    const left = screen.width * 0.3;
    const top = screen.height * 0.3;
    const style = `width=${width},height=${height},left=${left},top=${top}`;
    const newWindow = window.open(`${props.tenant}/create-shared-list`, '', style.toString());
    newWindow.addEventListener('beforeunload', closeModal);
    closeModal();
  }

  /**
 * Execute Dirty Check
 */
  const executeDirtyCheck = async (action: () => void, cancel?: () => void) => {
    // if (businessCardListName || businessCardListName !== '' || tags.length > 0) {
    if (isChange) {
      await DialogDirtyCheck({ onLeave: action, onStay: cancel, partternType: 2 });
    } else {
      action();
    }
  }

  // Get List Owner
  const getOwnerList = (paticipant) => {
    let result = [];
    const ownerPaticipant = paticipant.filter(y => y.participantType === 2)
    if (ownerPaticipant.length > 0) {
      ownerPaticipant.map(op => {
        if (op.departmentId && op.employeesDepartments.length > 0) {
          op.employeesDepartments.map(ed => {
            if (ed.employeeId) {
              result = result.concat(ed.employeeId.toString());
            }
          })
        } else if (op.employeeId) {
          result = result.concat(op.employeeId.toString())
        }
      })
    }
    result = result.filter((item, index) => result.indexOf(item) === index);
    return result;
  }

  // Get List Viewer
  const getViewerList = (paticipant) => {
    let result = [];
    const ownerPaticipant = paticipant.filter(y => y.participantType === 1)
    if (ownerPaticipant.length > 0) {
      ownerPaticipant.map(op => {
        if (op.employeeId) {
          result = result.concat(op.employeeId.toString());
        }
        if (op.departmentId && op.employeesDepartments?.length > 0) {
          op.employeesDepartments.map(empDer => {
            if (empDer.employeeId) {
              result = result.concat(empDer.employeeId.toString());
            }
          })
        } else if (op.employeeDepartments?.length > 0 && op.employeeDepartments[0].employeeId) {
          result = result.concat(op.employeeDepartments[0].employeeId.toString())
        }
      })
    }
    result = result.filter((item, index) => result.indexOf(item) === index);
    return result;
  }

  /**
   * handle validate and call API create share list
   */
  const handleSubmit = () => {
    setIsSubmitted(true);
    const ownerList = getOwnerList(tags);
    const viewerList = getViewerList(tags);
    if (!businessCardListName) {
      setValidateName(translate("messages.ERR_COM_0013"));
    }
    if (ownerList.length <= 0 && viewerList.length <= 0) {
      setValidateItem(translate("messages.ERR_COM_0013"));
    } else if (ownerList.length <= 0 && viewerList.length >= 1) {
      setValidateItem(translate("messages.ERR_COM_0061"))
    } else {
      setValidateItem('');
    }

    if (ownerList.length > 0 && businessCardListName) {
      const listNameBusiness = businessCardListName;
      setListName(listNameBusiness);
      startExecuting(REQUEST(ACTION_TYPES.CREATE_MY_LIST));
      props.handleCreateShareList(
        listNameBusiness,
        2,
        1,
        ownerList,
        viewerList,
        null,
        [],
        // props.listIdChecked
        listIdChecked
      );
    }
  }

  useEffect(() => {
    if (props.createBusinessCardsList) {
      handleCloseModal();
    }
  }, [props.createBusinessCardsList])

  /**
   * render component
   */
  const renderComponent = () => {
    return (
      <div className="modal popup-esr popup-esr4 user-popup-page popup-align-right show" id="popup-esr" aria-hidden="true">
        <div className={showModal ? "modal-dialog form-popup" : "form-popup"}>
          <div className="modal-content">
            <div className="modal-header">
              <div className="left">
                <div className="popup-button-back">
                  <WrapButtonBack title="" className="icon-small-primary icon-return-small"></WrapButtonBack>
                  <span className="text"><img className="icon-group-user" title="" src="../../../content/images/ic-sidebar-business-card.svg" alt="" />{translate('businesscards.sharelist.lbCreateShare')}</span>
                </div>
              </div>
              <div className="right">
                {showModal && <a className="icon-small-primary icon-link-small" onClick={() => openNewWindow()}></a>}
                {showModal && <a onClick={() => executeDirtyCheck(() => closeModal())} className="icon-small-primary icon-close-up-small line"></a>}
              </div>
            </div>
            <div className="modal-body style-3">
              <div className="popup-content max-height-auto style-3">
                <div className="user-popup-form">
                  <form>
                    <div className="block-feedback block-feedback-blue">
                      {translate("messages.WAR_COM_0003", { n: listIdChecked.length })}
                    </div>
                    <div className="row break-row mt-3 d-block" >
                      <div className="col-lg-6 form-group" onMouseEnter={() => changeIsHover(true)} onMouseLeave={() => changeIsHover(false)}>
                        <label>{translate('businesscards.sharelist.lbShareName')}
                          <span className="label-red ml-2">{translate('businesscards.sharelist.lbRequire')}</span>
                        </label>
                        <div className="input-common-wrap">
                          <input
                            ref={inputRef}
                            className={"input-normal" + (validateName ? " error" : "")}
                            type="text"
                            value={businessCardListName}
                            maxLength={255}
                            placeholder={translate('businesscards.sharelist.list-name-place-holder')}
                            onChange={(e) => { setBusinessCardListName(e.target.value); setValidateName(""); setIsChange(true) }}
                            autoFocus
                          />
                        </div>
                        {validateName && (
                          <div className="input-common-wrap normal-error">
                            <span className="messenger">{validateName}</span>
                          </div>
                        )}
                      </div>
                      <div className="col-lg-6 break-line form-group">
                        <div className="form-group">
                          <label>{translate('businesscards.sharelist.list-participants')}
                            <span className="label-red ml-2">{translate('businesscards.sharelist.lbRequire')}</span>
                          </label>

                          <TagAutoComplete
                            id="paticipant"
                            type={TagAutoCompleteType.Employee}
                            modeSelect={TagAutoCompleteMode.Multi}
                            ref={ref}
                            onActionSelectTag={onActionSelectTag}
                            placeholder={translate('businesscards.sharelist.hintListParticipants')}
                            listActionOption={getListAction()}
                            onActionOptionTag={setListParticipantsType}
                            elementTags={groupParticipants}
                            validMsg={validateItem}
                            onlyShowEmployees={true}
                            inputClass={validateItem ? "input-normal input-common2 error" : "input-normal input-common2"}
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="user-popup-form-bottom">
              <button title="" className="button-blue button-form-register" onClick={handleSubmit}>{translate('businesscards.mylist.button-create')}</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (showModal) {
    return (
      <>
        <Modal isOpen fade toggle={() => { }} backdrop id="popup-create-share-list" autoFocus zIndex="auto">
          {renderComponent()}
        </Modal>
      </>
    );
  } else {
    if (props.popout) {
      return (
        <>
          {renderComponent()}
        </>
      )
    } else {
      return <></>;
    }
  }
}

const mapStateToProps = ({ applicationProfile, businessCardList }: IRootState) => ({
  tenant: applicationProfile.tenant,
  createBusinessCardsList: businessCardList.createBusinessCardsList
});

const mapDispatchToProps = {
  handleCreateShareList,
  resetError
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps)
  (PopupCreateShareList);