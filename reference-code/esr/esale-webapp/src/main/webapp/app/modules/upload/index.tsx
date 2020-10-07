import React, { useEffect, useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import _ from 'lodash';
import UploadFileStep from './step-content/upload-file';
import MappingFileStep from './step-content/mapping-file';
import {
  handleGetImportMatchingKeys,
  handleGetFieldRelationItems,
  handleGetImportMappingItems,
  handleProcessImport,
  reset
} from './import-csv.reducer';
import AfterImport from './step-content/after-import';
import SimulationImport from './step-content/simulation-import';
import ImportData from './step-content/import-data';
import socketIOClient from 'socket.io-client';
import { IMPORT_TYPE, IMPORT_STEP } from './upload.constant';
import { CsvFile } from './dtos/upload_file_dto';
import StringUtils, { getFieldLabel } from '../../shared/util/string-utils';
import DialogDirtyCheck from 'app/shared/layout/common/dialog-dirty-check';
const ENDPOINT_SOCKET = 'http://127.0.0.1:6969';

export interface IUploadProps extends StateProps, DispatchProps {
  serviceId: number;
  toggleCloseImportScreen: () => void;
}

export enum ModeImport {
  RunSimulation,
  ExecuteImport,
}

export enum CloseBack {
  Close,
  Back,
}

const noticeListData = {
  employeeIds: [],
  groupIds: [],
  departmentIds: []
};

const listInfoData = {
  listType: 0,
  listName: '',
  ownerList: noticeListData,
  viewerList: noticeListData,
};

const UploadProcessing = (props: IUploadProps) => {
  // common fields
  const [currentStep, setCurrentStep] = useState(IMPORT_STEP.UPLOAD_FILE);
  const [blockedStep, setBlockedStep] = useState(IMPORT_STEP.NONE);
  const [errorCode, setErrorCode] = useState(null);

  // step 1: upload file
  const [csvFile, setCsvFile] = useState(new CsvFile());
  const [importAction, setImportAction] = useState(IMPORT_TYPE.NONE);
  const [isDuplicateAllow, setDuplicateAllow] = useState(false);

  // step 2: mapping file
  const [matchingKeys, setMatchingKeys] = useState([]);
  const [mappingItems, setMappingItems] = useState([]);
  const [fieldRelationItems, setFieldRelationItems] = useState([]);

  const [indexKey, setIndexKey] = useState(null);
  const [relationName, setRelationName] = useState();
  const [relationMapping, setRelationMapping] = useState();
  const [isAutoPostTimeline, setIsAutoPostTimeline] = useState(false);
  const [importConfirmPopup, setImportConfirmPopup] = useState(false);
  const [relationMatching, setRelationMatching] = useState([]);
  const [noticeList, setNoticeList] = useState(noticeListData);
  const [listInfo, setListInfo] = useState(listInfoData);

  // Action Import
  const [textInputNameImport, setTextInputnameImport] = useState('');
  const [noticeListSendImport, setNoticeListSendImport] = useState([]);
  const [listInfoDataImport, setListInfoDataImport] = useState([]);
  const [listTypeImport, setListTypeImport] = useState(0);
  const [errObjAfterImport, setErrObjAfterImport] = useState([]);

  const { serviceId } = props;


  const selectIndexCompare = (key) => {
    setIndexKey(key === 0 ? null : key);
    if (key !== 0) {
      const labelMatchingKeys = props.importMatchingKeys && props.importMatchingKeys.find(e => e.value === key)
      props.handleGetImportMappingItems(props.serviceId, getFieldLabel(labelMatchingKeys, 'label'), csvFile.headers)
    }
  };

  const selectRelatioName = name => {
    setRelationName(name);
    const relattionField = fieldRelationItems.find(relate => relate.fieldName === name);
    setRelationMatching(relattionField ? relattionField.relationalMatching : []);
  };

  const selectRelationMapping = id => {
    setRelationMapping(id);
  };

  // handle step 1: upload file > go to step 2: mapping
  const validateStepUploadFile = () => {
    // error 1: not choose import action
    const err1 = importAction === IMPORT_TYPE.NONE;
    console.log('error 1: not choose import action', err1);

    // error 2: not upload file or file has no data
    const err2 = !csvFile.file || !csvFile.rows || csvFile.rows.length === 0;
    console.log('error 2: not upload file', err2);

    return !err1 && !err2;
  }

  /**
   * handle upload file for step 1
   */
  const handleStepUploadFile = () => {
    // step 2.1: get import mapping items from csv
    props.handleGetImportMappingItems(serviceId, null, csvFile.headers);

    // step 2.2: get import matching key from backend
    props.handleGetImportMatchingKeys(serviceId);

    // step 2.3: get field relation items from backend
    if (serviceId !== 1401 && serviceId !== 801) {
      props.handleGetFieldRelationItems(serviceId);
    }
  }

  /**
   * parse for suggest auto tag
   * @param data 
   */
  const parseSuggestInput = (data) => {
    const lstEmployee = [];
    const lstGroup = [];
    const lstDepartment = [];
    const lstOwnerEmployee = [];
    const lstOwnerGroup = [];
    const lstOwnerDepartment = [];
    const lstViewerEmployee = [];
    const lstViewerGroup = [];
    const lstViewerDepartment = [];
    if (!_.isEmpty(data)) {
      data.forEach(element => {
        if ('employeeId' in element) {
          lstEmployee.push(element['employeeId'])
          if (element.participantType === 2) {
            lstOwnerEmployee.push(element['employeeId'])
          } else {
            lstViewerEmployee.push(element['employeeId'])
          }
        }
        if ('groupId' in element) {
          lstGroup.push(element['groupId'])
          if (element.participantType === 2) {
            lstOwnerGroup.push(element['groupId'])
          } else {
            lstViewerGroup.push(element['groupId'])
          }
        }
        if ('departmentId' in element) {
          lstDepartment.push(element['departmentId'])
          if (element.participantType === 2) {
            lstOwnerDepartment.push(element['departmentId'])
          } else {
            lstViewerDepartment.push(element['departmentId'])
          }
        }
      });
    }
    return {
      lstEmployee,
      lstGroup,
      lstDepartment,
      lstOwnerEmployee,
      lstOwnerGroup,
      lstOwnerDepartment,
      lstViewerEmployee,
      lstViewerGroup,
      lstViewerDepartment
    }
  }

  /**
   * Check change input for dirty check
   */
  const checkChangeInputEdit = (mode) => {
    let isChangeInput = false;
    switch (mode) {
      case CloseBack.Close: {
        if (currentStep !== IMPORT_STEP.UPLOAD_FILE) {
          isChangeInput = true;
        } else {

          if (!_.isEmpty(csvFile) || (importAction !== IMPORT_TYPE.NONE)) {
            isChangeInput = true;
          }
        }
        break;
      }
      case CloseBack.Back: {
        switch (currentStep) {
          case IMPORT_STEP.MAPPING: {
            isChangeInput = (indexKey || indexKey === 0);
          }
            break;
          case IMPORT_STEP.AFTER_IMPORT: {
            isChangeInput = isAutoPostTimeline || !_.isEmpty(noticeListSendImport) || listTypeImport !== 0;
          }
            break;
          default:
            break;
        }
      }
        break;
      default:
        break;
    }

    return isChangeInput;
  }

  /**
   * Dirty check
   * @param action 
   * @param cancel 
   */
  const executeDirtyCheck = async (action: () => void, cancel?: () => void) => {
    const isChange = checkChangeInputEdit(CloseBack.Close);
    // const isChange = true;

    if (isChange) {
      await DialogDirtyCheck({ onLeave: action, onStay: cancel });
    } else {
      action();
    }
  }

  /**
   * Dirty check back
   * @param action 
   * @param cancel 
   */
  const executeDirtyCheckBack = async (action: () => void, cancel?: () => void) => {
    const isChange = checkChangeInputEdit(CloseBack.Back);
    // const isChange = true;

    if (isChange) {
      await DialogDirtyCheck({ onLeave: action, onStay: cancel });
    } else {
      action();
    }
  }

  /**
   * Close screen
   */
  const handleClosePopup = () => {
    executeDirtyCheck(() => {
      // if (!props.popout) {
      props.toggleCloseImportScreen();
      // } else {
      //   window.close();
      // }
    });
  };

  /**
   * Handle call API process import
   */
  const handleImport = (mode) => {
    const paramReq = {};
    const noticeListInput = {};
    const listInfoInput = {};
    const ownerList = {};
    const viewerList = {}
    paramReq['serviceId'] = serviceId;
    paramReq['importAction'] = importAction;
    paramReq['isDuplicateAllowed'] = importAction !== IMPORT_TYPE.NEW_ONLY ? null : isDuplicateAllow;
    paramReq['isSimulationMode'] = (mode === ModeImport.RunSimulation);
    paramReq['mappingItem'] = _.toString(JSON.stringify(props.importMappingItems));
    paramReq['matchingKey'] = _.toString(JSON.stringify({
      fieldName: indexKey,
      isDefault: props.importMappingItems.find(e => e.fieldName === indexKey).isDefault
    }))
    paramReq['matchingRelation'] = null;
    noticeListInput['employeeIds'] = parseSuggestInput(noticeListSendImport).lstEmployee;
    noticeListInput['groupIds'] = parseSuggestInput(noticeListSendImport).lstGroup;
    noticeListInput['departmentIds'] = parseSuggestInput(noticeListSendImport).lstDepartment;
    paramReq['noticeList'] = noticeListInput;
    paramReq['isAutoPostTimeline'] = isAutoPostTimeline;
    listInfoInput['listType'] = listTypeImport;
    listInfoInput['listName'] = textInputNameImport.trim();
    ownerList['employeeIds'] = parseSuggestInput(listInfoDataImport).lstOwnerEmployee;
    ownerList['groupIds'] = parseSuggestInput(listInfoDataImport).lstOwnerGroup;
    ownerList['departmentIds'] = parseSuggestInput(listInfoDataImport).lstOwnerDepartment;
    viewerList['employeeIds'] = parseSuggestInput(listInfoDataImport).lstViewerEmployee;
    viewerList['groupIds'] = parseSuggestInput(listInfoDataImport).lstViewerGroup;
    viewerList['departmentIds'] = parseSuggestInput(listInfoDataImport).lstViewerDepartment;
    listInfoInput['ownerList'] = ownerList;
    listInfoInput['viewerList'] = viewerList;
    paramReq['listInfo'] = listInfoInput;
    props.handleProcessImport(paramReq, [{ "0.import_file.file0": csvFile.file }])
  }

  const importExecutionHandler = (isSimulationMode = false) => {
    const mappingItem = mappingItems.map(item => _.pick(item, [
      'fieldName',
      'columnCsv',
      'isDefault',
      'fieldType'
    ]));
    const matchingRelation = fieldRelationItems.map(relationItem => ({
      fieldName: relationItem.fieldName,
      matchingFieldId: relationItem.fieldId
    }));
    const itemMatchingKey = mappingItems.find(dataMappingItem => dataMappingItem.fieldName
      === indexKey) || {};
    const matchingKey = _.pick(itemMatchingKey, ['fieldName', 'isDefault']);
    const rawFile = null;
    const payload = {
      serviceId,
      importFile: rawFile,
      importAction,
      isDuplicateAllow,
      isSimulationMode,
      matchingKey,
      matchingRelation,
      mappingItem,
      isAutoPostTimeline,
      noticeList
    };
    if (!isSimulationMode) {
      _.merge(payload, { listInfo });
    }

    setImportConfirmPopup(false);
    setCurrentStep(IMPORT_STEP.UPLOAD_FILE);
  }

  const changelistTypeValue = value => {
    const listType = listInfo.listType;
    if (value === listType) return;
    setListInfo({
      ...listInfo,
      listType: value
    });
  };

  const setPostTimeLine = (value = false) => {
    if (value === isAutoPostTimeline) return;
    setIsAutoPostTimeline(value);
  };

  const cancellationSocket = () => {
    const socket = socketIOClient(ENDPOINT_SOCKET);
    socket.disconnect();
  }

  /**
   * Validate after import
   */
  const validateAfterImport = () => {
    const errorObj = [];
    const maxLength = 255;
    if (listTypeImport === 0) {
      return true;
    }
    if (_.isEmpty(textInputNameImport.trim())) {
      errorObj.push({ item: "inputList", errMess: translate('messages.ERR_COM_0013') })
    }
    if (_.isEmpty(listInfoDataImport)) {
      errorObj.push({ item: "infoList", errMess: translate('messages.ERR_COM_0013') })
    }
    if (textInputNameImport.trim().length > 255) {
      errorObj.push({ item: "inputList", errMess: translate("messages.ERR_COM_0025", { 0: maxLength }) })
    }
    setErrObjAfterImport(_.cloneDeep(errorObj))
    return _.isEmpty(errorObj);
  }

  /**
   * handle move or back step
   * @param requestStep 
   * @param mode 
   */
  const moveNextStep = (requestStep, mode?) => {
    if (blockedStep !== IMPORT_STEP.NONE) {
      return;
    }

    switch (requestStep) {
      case IMPORT_STEP.MAPPING:
        if (!validateStepUploadFile()) {
          return;
        }
        handleStepUploadFile();
        break;
      case IMPORT_STEP.AFTER_IMPORT:
        if (errorCode) {
          return;
        }
        break;
      case IMPORT_STEP.SIMULATION:
        if (!validateAfterImport()) {
          return;
        }
        handleImport(mode);
        break;
      default:
        break;
    }
    setCurrentStep(requestStep);
  }

  /**
   * Back handle
   */
  const handleBack = () => {
    executeDirtyCheckBack(() => {
      // if (!props.popout) {
      switch (currentStep) {
        case IMPORT_STEP.MAPPING:
          moveNextStep(IMPORT_STEP.UPLOAD_FILE);
          break;
        case IMPORT_STEP.AFTER_IMPORT:
          moveNextStep(IMPORT_STEP.MAPPING);
          break;
        case IMPORT_STEP.SIMULATION:
          moveNextStep(IMPORT_STEP.AFTER_IMPORT);
          break;
        default:
          break;
      }
      // } else {
      //   window.close();
      // }
    });
  }

  useEffect(() => {
    setErrorCode(props.errorMessage);
  }, [props.errorMessage]);

  useEffect(() => {
    const keyData = props.importMatchingKeys;
    setMatchingKeys(keyData ? keyData : []);
  }, [props.importMatchingKeys]);

  useEffect(() => {
    setMappingItems(props.importMappingItems);
  }, [props.importMappingItems]);

  useEffect(() => {
    setFieldRelationItems(props.fieldRelationItems);
  }, [props.fieldRelationItems]);

  const stepList = [
    {
      index: IMPORT_STEP.UPLOAD_FILE,
      name: 'setting.importCSV.followHeader.stepUploadFile',
      layout: () => (
        <UploadFileStep
          serviceId={serviceId}
          csvFile={csvFile}
          importAction={importAction}
          isDuplicateAllow={isDuplicateAllow}
          setCsvFile={setCsvFile}
          setDuplicateAllow={setDuplicateAllow}
          setImportAction={setImportAction}
          setBlockedStep={setBlockedStep}
          closeUploadModal={() => setImportConfirmPopup(false)}
        />
      )
    },
    {
      index: IMPORT_STEP.MAPPING,
      name: 'setting.importCSV.followHeader.stepMapping',
      layout: () => (
        <MappingFileStep
          serviceId={props.serviceId}
          fieldRelationItems={fieldRelationItems ? fieldRelationItems : []}
          csvFile={csvFile}
          setIndexKey={selectIndexCompare}
          indexKey={indexKey}
          setRelationName={selectRelatioName}
          relationName={relationName}
          setRelationMapping={selectRelationMapping}
          relationMatching={relationMatching}
          errorCode={errorCode}
        />
      )
    },
    {
      index: IMPORT_STEP.AFTER_IMPORT,
      name: 'setting.importCSV.followHeader.stepAfterImport',
      layout: () => (
        <AfterImport
          listType={listInfo.listType}
          changelistTypeValue={changelistTypeValue}
          isAutoPostTimeline={isAutoPostTimeline}
          setPostTimeLine={setPostTimeLine}
          setListName={setTextInputnameImport}
          setInfoList={setListInfoDataImport}
          setListNotice={setNoticeListSendImport}
          setListTypeImport={setListTypeImport}
          errorInfo={errObjAfterImport}
          initListNotice={noticeListSendImport}
          initListName={textInputNameImport}
          initInfoList={listInfoDataImport}
        />
      )
    },
    {
      index: IMPORT_STEP.SIMULATION,
      name: 'setting.importCSV.followHeader.stepSimulation',
      layout: () => <SimulationImport importId={-1} serviceId={-1} />
    },
    {
      index: IMPORT_STEP.EXECUTION,
      name: 'setting.importCSV.followHeader.stepExecution',
      layout: () => (
        <ImportData />
      )
    }
  ];

  const render = () => {
    const currentStepInfo = stepList.find(stepInfo => stepInfo.index === currentStep) || {};
    const layout = _.get(currentStepInfo, 'layout', () => undefined);
    return (
      <div className='modal popup-esr popup-esr4 popup-common-csv user-popup-page popup-align-right show' id='popup-esr' aria-hidden='true'>
        <div className='modal-dialog form-popup'>
          <div className='modal-content'>
            <div className='modal-header modal-header-upload'>
              <div className='left'>
                <div className="popup-button-back">
                  <button className={`icon-small-primary icon-return-small ${currentStep === IMPORT_STEP.UPLOAD_FILE ? 'disable' : ''}`}
                    onClick={handleBack} />
                  <span className='text'>
                    <img src='/content/images/common/ic-calculator.svg' />
                    {translate('setting.importCSV.title')}
                  </span>
                </div>
              </div>
              <div className='right'>
                <button className='icon-small-primary icon-link-small' />
                <button className='icon-small-primary icon-close-up-small line' onClick={handleClosePopup} />
              </div>
            </div>
            <div className='modal-body'>
              <div className='popup-content  style-3'>
                <div className='w88 mt-3 margin-0-auto'>
                  <div className='popup-tab font-size-12 v2'>
                    <ul>
                      {stepList.map(step => (
                        <li className={step.index === currentStep ? 'active' : (step.index < currentStep ? 'pre' : '')} key={step.name}>
                          <a>{translate(step.name)}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className='popup-tab-content'>{layout()}</div>
                </div>
              </div>
            </div>
            {currentStep === IMPORT_STEP.UPLOAD_FILE && (
              <div className='user-popup-form-bottom'>
                <button className='button-blue' onClick={() => moveNextStep(IMPORT_STEP.MAPPING)}>
                  {translate('setting.importCSV.botton.next')}
                </button>
              </div>
            )}
            {currentStep === IMPORT_STEP.MAPPING && (
              <div className='user-popup-form-bottom '>
                <button className='button-cancel button-cancel-csv'
                  onClick={() => handleBack()}
                >
                  {translate('setting.importCSV.botton.previous')}
                </button>
                <button className={`button-blue ${indexKey ? "" : "disable"}`}
                  onClick={() => { indexKey && indexKey !== 0 && moveNextStep(IMPORT_STEP.AFTER_IMPORT) }}
                >
                  {translate('setting.importCSV.botton.next')}
                </button>
              </div>
            )}
            {currentStep === IMPORT_STEP.AFTER_IMPORT && (
              <div className="user-popup-form-bottom user-popup-tab3-form-bottom">
                <button title="" className="button-cancel button-cancel-csv"
                  onClick={() => handleBack()}
                >
                  {translate('setting.importCSV.botton.previous')}
                </button>
                <button title="" className="button-primary button-simple-edit"
                  onClick={() => setImportConfirmPopup(true)}
                >
                  {translate('setting.importCSV.botton.executeImport')}
                </button>
                <button title="" className="button-blue "
                  onClick={() => moveNextStep(IMPORT_STEP.SIMULATION, ModeImport.RunSimulation)}
                >
                  {translate('setting.importCSV.botton.runSimulation')}
                </button>
              </div>
            )
            }
            {currentStep === IMPORT_STEP.SIMULATION && (
              <div className='user-popup-form-bottom '>
                <button className='button-primary button-simple-edit px-5' onClick={() => cancellationSocket()}>
                  {translate('setting.importCSV.botton.suspendSimulation')}
                </button>
              </div>
            )}
            {currentStep === IMPORT_STEP.EXECUTION && (
              <div className='user-popup-form-bottom user-popup-tab3-form-bottom'>
                <button title='' className='button-cancel button-cancel-csv'
                  onClick={() => moveNextStep(IMPORT_STEP.AFTER_IMPORT)}
                >
                  {translate('setting.importCSV.botton.previous')}
                </button>
                <button title='' className='button-blue'>
                  {translate('setting.importCSV.botton.executeImport')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Modal isOpen fade toggle={() => { }} backdrop id='upload-step-modal' autoFocus>
        {render()}
      </Modal>
      <Modal
        isOpen={importConfirmPopup}
        onClosed={() => setImportConfirmPopup(false)}
        fade
        toggle={() => { }}
        backdrop
        autoFocus
        id='import-confirm-modal'
        style={{ width: '50%' }}
      >
        <ModalHeader>マイリストに追加する</ModalHeader>
        <ModalBody style={{ border: '0px' }}>
          <div style={{ textAlign: 'center' }}>
            <p>共有リストに追加する</p>
            <p>共有リストに追加する共有リス トに追加する共有リストに追加する?</p>
          </div>
        </ModalBody>
        <ModalFooter>
          <button className='button-primary button-simple-edit' onClick={() => setImportConfirmPopup(false)}>
            キャンセル
          </button>{' '}
          <button className='button-blue ' onClick={() => importExecutionHandler()}>
            実行
          </button>
        </ModalFooter>
      </Modal>
    </>
  );
};

const mapStateToProps = ({ uploadCSV }: IRootState) => ({
  importMatchingKeys: uploadCSV.importMatchingKeys,
  fieldRelationItems: uploadCSV.fieldRelationItems,
  importMappingItems: uploadCSV.importMappingItems,
  errorMessage: uploadCSV.errorMessage
});

const mapDispatchToProps = {
  handleGetFieldRelationItems,
  handleGetImportMatchingKeys,
  handleGetImportMappingItems,
  handleProcessImport,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UploadProcessing);

