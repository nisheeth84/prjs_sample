import React, { useEffect, useState, useRef } from 'react';
import { Input, Form, CustomInput } from 'reactstrap';
import { connect } from 'react-redux';
import TagAutoComplete from '../../../shared/layout/common/suggestion/tag-auto-complete';
import { TagAutoCompleteType, TagAutoCompleteMode } from 'app/shared/layout/common/suggestion/constants';
import { translate } from 'react-jhipster';
import _ from 'lodash';

export interface IUploadFileStep3Props {
  listType: number;
  changelistTypeValue: (type: number) => void;
  isAutoPostTimeline: boolean;
  setPostTimeLine: (type: boolean) => void;
  setListName: (type: any) => void;
  setListNotice: (type: any) => void;
  setInfoList: (type: any) => void;
  setListTypeImport: (type: any) => void;
  errorInfo;
  initListNotice;
  initListName;
  initInfoList;
}

const AfterImport = (props: IUploadFileStep3Props) => {
  const { listType, changelistTypeValue, isAutoPostTimeline, setPostTimeLine, setListName } = props;
  const ref = useRef(null);
  const refSendMail = useRef(null);
  const [tags, setTags] = useState(props.initInfoList ? props.initInfoList : []);
  const [tagsSendMail, setTagsSendMail] = useState(props.initListNotice ? props.initListNotice : []);
  const [listNameInput, setListNameInput] = useState(props.initListName ? props.initListName : '');

  const PULL_DOWN_MEMBER_GROUP_PERMISSION = [
    {
      itemId: 1,
      itemLabel: 'employees.sharegroup.permision.viewer'
    },
    {
      itemId: 2,
      itemLabel: 'employees.sharegroup.permision.owner'
    }
  ];

  const onActionSelectTagSendMail = (id: any, type: TagAutoCompleteType, mode: TagAutoCompleteMode, listTag: any[]) => {
    const tmpListTags = listTag.map(ele => {
      if (ele.participantType) {
        return ele;
      }
      return { ...ele, participantType: 2 };
    });
    refSendMail.current.setTags(tmpListTags);
    setTagsSendMail(tmpListTags);
    props.setListNotice(tmpListTags)
    // setIsDirtyCheck(true);
  };

  const onActionSelectTag = (id: any, type: TagAutoCompleteType, mode: TagAutoCompleteMode, listTag: any[]) => {
    const tmpListTags = listTag.map(el => {
      if (el.participantType) {
        return el;
      }
      return { ...el, participantType: 2 };
    });
    ref.current.setTags(tmpListTags);
    setTags(tmpListTags);
    props.setInfoList(tmpListTags);
    // setIsDirtyCheck(true);
  };

  const getListAction = () => {
    const tmpPullDownMemberGroupPermission = [];
    PULL_DOWN_MEMBER_GROUP_PERMISSION.forEach((e, idx) => {
      tmpPullDownMemberGroupPermission.push({ id: e.itemId, name: translate(e.itemLabel) });
    });
    return tmpPullDownMemberGroupPermission;
  };

  const setListParticipantsType = (tagSelected, type) => {
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
    props.setInfoList(tmpParticipantsType);
    // setIsDirtyCheck(true);
  };

  return (
    <div className='popup-tab-content'>
      <div className='tab-enter-setup'>
        <Form>
          <div className='row break-row'>
            <div className='col-lg-6 form-group break-line'>
              <label>
                {translate('setting.importCSV.afterImport.noticeLabel')}
              </label>
              <TagAutoComplete
                id="paticipant"
                type={TagAutoCompleteType.Employee}
                modeSelect={TagAutoCompleteMode.Multi}
                ref={refSendMail}
                onActionSelectTag={onActionSelectTagSendMail}
                placeholder={translate('setting.importCSV.afterImport.noticePlaceHoder')}
                inputClass={'input-normal'}
                elementTags={tagsSendMail}
              />
            </div>
          </div>
          <div className='max-width-882 form-group'>
            <label>
              {translate('setting.importCSV.afterImport.timelineLabel')}
            </label>
            <div className=' block-feedback block-feedback-blue'>
              {translate('setting.importCSV.afterImport.timelineInfo')}
            </div>
            <div className='wrap-check-radio '>
              <div className='radio-item mr-5'>
                <CustomInput
                  type='radio'
                  id='timelineOption1'
                  label={translate('setting.importCSV.afterImport.notice')}
                  checked={isAutoPostTimeline}
                  onChange={() => setPostTimeLine(true)}
                />
              </div>
              <div className='radio-item'>
                <CustomInput
                  type='radio'
                  id='timelineOption2'
                  label={translate('setting.importCSV.afterImport.doNotNotice')}
                  checked={!isAutoPostTimeline}
                  onChange={() => setPostTimeLine(false)}
                />
              </div>
            </div>
            <label>
              {translate('setting.importCSV.afterImport.typeListLabel')}
            </label>
            <div className=' block-feedback block-feedback-blue'>
              {translate('setting.importCSV.afterImport.typeListInfo')}
            </div>
            <div className='wrap-check-radio'>
              <div className='radio-item mr-5'>
                <CustomInput
                  type='radio'
                  id='radio3'
                  label={translate('setting.importCSV.afterImport.addToMyList')}
                  checked={listType === 1}
                  onChange={() => { changelistTypeValue(1); props.setListTypeImport(1) }}
                />
              </div>
              <div className='radio-item  mr-5'>
                <CustomInput
                  type='radio'
                  id='radio4'
                  label={translate('setting.importCSV.afterImport.addToShareList')}
                  checked={listType === 2}
                  onChange={() => { changelistTypeValue(2); props.setListTypeImport(2) }}
                />
              </div>
              <div className='radio-item'>
                <CustomInput
                  type='radio'
                  id='radio5'
                  label={translate('setting.importCSV.afterImport.doNotAddToList')}
                  checked={listType === 0}
                  onChange={() => { changelistTypeValue(0); props.setListTypeImport(0) }}
                />
              </div>
            </div>
          </div>
        </Form>
      </div>
      {listType === 1 && (
        <div className='row break-row'>
          <div className='col-lg-6 form-group break-line'>
            <label>
              {translate('setting.importCSV.afterImport.listName')}
              <span className="label-red">{translate('setting.importCSV.afterImport.require')}</span>
            </label>
            <Input type='text' className={`input-normal ${!_.isEmpty(props.errorInfo) && props.errorInfo.find(e => e.item === "inputList") ? "error" : ""}`}
              placeholder={translate('setting.importCSV.afterImport.listNamePlaceHolder')}
              value={listNameInput}
              onChange={e => { setListName(e.target.value ? e.target.value : ""); setListNameInput(e.target.value ? e.target.value : "") }}
            />
            {!_.isEmpty(props.errorInfo) && props.errorInfo.find(e => e.item === "inputList")
              && <p className="setting-input-valis-msg" >{props.errorInfo.find(e => e.item === "inputList").errMess}</p>}
          </div>
        </div>
      )}
      {listType === 2 && (
        <div className='row break-row'>
          <div className='col-lg-6 form-group break-line'>
            <label>
              {translate('setting.importCSV.afterImport.listName')}
              <span className="label-red">{translate('setting.importCSV.afterImport.require')}</span>
            </label>
            <Input type='text' className={`input-normal ${!_.isEmpty(props.errorInfo) && props.errorInfo.find(e => e.item === "inputList") ? "error" : ""}`}
              placeholder={translate('setting.importCSV.afterImport.listNamePlaceHolder')}
              onChange={e => { setListName(e.target.value ? e.target.value : ""); setListNameInput(e.target.value ? e.target.value : "") }}
              value={listNameInput}
            />
            {!_.isEmpty(props.errorInfo) && props.errorInfo.find(e => e.item === "inputList")
              && <p className="setting-input-valis-msg" >{props.errorInfo.find(e => e.item === "inputList").errMess}</p>}
            <label>
              {translate('setting.importCSV.afterImport.listParticipants')}
              <span className="label-red">{translate('employees.sharegroup.lbRequire')}</span>
            </label>
            <TagAutoComplete
              id="paticipant"
              type={TagAutoCompleteType.Employee}
              modeSelect={TagAutoCompleteMode.Multi}
              ref={ref}
              onActionSelectTag={onActionSelectTag}
              placeholder={translate('setting.importCSV.afterImport.listParticipantsHolder')}
              listActionOption={getListAction()}
              onActionOptionTag={setListParticipantsType}
              elementTags={tags}
              inputClass={`input-normal ${!_.isEmpty(props.errorInfo) && props.errorInfo.find(e => e.item === "infoList") ? "error" : ""}`}
            />
            {!_.isEmpty(props.errorInfo) && props.errorInfo.find(e => e.item === "infoList")
              && <p className="setting-input-valis-msg" >{props.errorInfo.find(e => e.item === "infoList").errMess}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default connect()(AfterImport);
