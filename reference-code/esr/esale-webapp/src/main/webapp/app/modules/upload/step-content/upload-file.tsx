import React, { useEffect, useState } from 'react';
import { translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import CSVReader from 'react-csv-reader';
import _ from 'lodash';
import UploadHistories from '../upload-histories';
import {
  getDownloadTemplateUrl,
  reset
} from 'app/modules/upload/import-csv.reducer';
import BoxMessage, { MessageType } from 'app/shared/layout/common/box-message';
import { IMPORT_TYPE, IMPORT_STEP } from '../upload.constant';
import { CsvFile } from '../dtos/upload_file_dto';

const OPEN_FILE_MESSAGE = translate('setting.importCSV.screenOne.openFileMess');
const PRIMARY_COLOR = '#0f6db5';

const ACTIVE_STYLE = {
  borderColor: PRIMARY_COLOR,
  color: PRIMARY_COLOR
}

export interface IUploadFileStepProps extends StateProps, DispatchProps {

  serviceId: number;
  csvFile: any;
  importAction: IMPORT_TYPE;
  isDuplicateAllow: any;

  // file values
  setCsvFile: any;

  // config values
  setImportAction: (action: any) => void;
  setDuplicateAllow: (type: boolean) => void;

  // common methods
  closeUploadModal: () => void;
  setBlockedStep: any;
}

const UploadFileStep = (props: IUploadFileStepProps) => {

  const [openHistoriesModal, setOpenHistoriesModal] = useState(false);
  const [errorMessages, setErrorMessages] = useState(null);

  const papaparseOptions = {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    encoding: 'Shift-JIS',
    complete: (results, file) => console.log('Upload completed', file, results)
  };

  const isInvalidUploadedFile = (rawFile) => {
    const messages = [];
    if (!rawFile) {
      messages.push(translate("messages.ERR_COM_0013"));
      setErrorMessages(messages);
      return true;
    }

    const ext = rawFile.name.split('.').pop().toLowerCase();

    const isInvalidExt = !["csv", "xls", "xlsx"].includes(ext);
    const isFileTooLarge = rawFile.size > 100 * 1024 * 1024;
    const isTooManyRows = rawFile.data && Array.isArray(rawFile.data) && rawFile.data.length > 50000;

    if (isInvalidExt) {
      messages.push(translate("messages.ERR_COM_0043"));
    }

    if (isFileTooLarge) {
      messages.push(translate("messages.ERR_COM_0033"));
    }

    if (isTooManyRows) {
      messages.push(translate("messages.ERR_COM_0066"));
    }

    setErrorMessages(messages.length > 0 ? messages : null);
    return messages.length > 0;
  }

  const handleUploadFile = (data, fileInfo) => {
    const inputFile = document.getElementById('csv-reader-input') as HTMLInputElement;
    const rawFile = inputFile && inputFile.files && inputFile.files[0];
    const fileData = { ...fileInfo, data, file: rawFile };

    if (isInvalidUploadedFile(rawFile)) {
      return;
    }

    const _csvFile  = new CsvFile(fileData);
    props.setCsvFile(_csvFile);
  };

  const setDuplicateAllowHandler = (type = null) => {
    if (props.importAction !== IMPORT_TYPE.NEW_ONLY) {
      return;
    }
    if (!type || type === props.isDuplicateAllow) {
      props.setDuplicateAllow(null);
      return;
    }
    props.setDuplicateAllow(type);
  };

  const selectImport = (type) => {
    if (type === IMPORT_TYPE.OVERWRITE_ONLY || type === IMPORT_TYPE.NEW_AND_OVERWRITE) {
      setDuplicateAllowHandler();
    }

    if (type === props.importAction) {
      props.setImportAction(IMPORT_TYPE.NONE);
      props.setDuplicateAllow(null);
      return;
    } else {
      if (type !== IMPORT_TYPE.NEW_ONLY) {
        props.setDuplicateAllow(null);
      }
      props.setImportAction(type);
    }
  };

  const toggleHistoryModal = isOpen => {
    props.closeUploadModal();
    setOpenHistoriesModal(isOpen);
  };

  const downloadTemplateCSV = async () => {
    const downloadUrl = await getDownloadTemplateUrl(props.serviceId);
    window.open(downloadUrl);
  }

  const getButtonStyleHandleDuplicates = isAllowed => {
    return {
      borderColor: isAllowed && PRIMARY_COLOR,
      color: isAllowed && PRIMARY_COLOR
    }
  }

  useEffect(() => {
    // if there is error, then blocked the step
    const isBlocked = errorMessages && errorMessages.length > 0 ?
      IMPORT_STEP.UPLOAD_FILE : IMPORT_STEP.NONE;
    props.setBlockedStep(isBlocked);
  }, [errorMessages]);

  const renderMainComponent = () => {
    return (
      <>
        <div id="upload-file-step" className="bg-F9F9F9 py-3">
          <div className="align-center">
            <div style={{ display: "inline-block", width: "720px" }}>
              <BoxMessage messageType={MessageType.Error} messages={errorMessages} />
            </div>
            <div>{translate('setting.importCSV.screenOne.header')}</div>
            <div className="common-csv-box-dash file-upload-wrapper" id="uploadBtn">
              <img src="/content/images/common/ic-csv.svg" />
              <CSVReader
                cssClass="react-csv-input button-blue button-green mb-1"
                onFileLoaded={handleUploadFile}
                parserOptions={papaparseOptions}
                label={translate('setting.importCSV.screenOne.buttonImportCSV')}
                inputId="csv-reader-input"
                inputStyle={{"display": "none"}}
              />
              <div>{!props.csvFile || !props.csvFile.name ? OPEN_FILE_MESSAGE : props.csvFile.name}</div>
              <div>{translate('setting.importCSV.screenOne.infoLineOne')}</div>
              <div>{translate('setting.importCSV.screenOne.infoLineTwo')}</div>
              <div>{translate('setting.importCSV.screenOne.infoLineThree')}</div>
            </div>
            <div>
              {translate('setting.importCSV.screenOne.infoDownloadTemplate')}
              <span style={{ color: "#0056b3", cursor: "pointer" }} onClick={e => downloadTemplateCSV()}>
                {translate('setting.importCSV.screenOne.btnDownloadTemplate')}
              </span>
              {translate('setting.importCSV.screenOne.infoPlease')}
            </div>
            <div className="mb-3">
              {translate('setting.importCSV.screenOne.infoUseSimulation')}
              <a onClick={() => toggleHistoryModal(true)} className="color-blue">
                {translate('setting.importCSV.screenOne.openHistories')}
              </a>
              {translate('setting.importCSV.screenOne.infoPleaseClick')}
            </div>
            <div className="common-csv-button">
              <div className="mb-3">
                <button
                  className="button-primary no-focus button-simple-edit mr-5"
                  style={props.importAction === IMPORT_TYPE.NEW_ONLY ? ACTIVE_STYLE : {}}
                  onClick={() => selectImport(IMPORT_TYPE.NEW_ONLY)}
                >
                  {translate('setting.importCSV.screenOne.btnNewOnly')}
                </button>
                <button
                  className="button-primary no-focus button-simple-edit mr-5"
                  style={props.importAction === IMPORT_TYPE.OVERWRITE_ONLY ? ACTIVE_STYLE : {}}
                  onClick={() => { selectImport(IMPORT_TYPE.OVERWRITE_ONLY); }}
                >
                  {translate('setting.importCSV.screenOne.btnOverwriteOnly')}
                </button>
                <button
                  className="button-primary no-focus button-simple-edit"
                  style={props.importAction === IMPORT_TYPE.NEW_AND_OVERWRITE ? ACTIVE_STYLE : {}}
                  onClick={() => { selectImport(IMPORT_TYPE.NEW_AND_OVERWRITE); }}
                >
                  {translate('setting.importCSV.screenOne.btnNewAndOverwrite')}
                </button>
              </div>
              {props.importAction === IMPORT_TYPE.NEW_ONLY &&
                <>
                  <div className="mb-2">{translate('setting.importCSV.screenOne.infoChooseHandleDuplicate')}</div>
                  <button
                    className="button-primary button-simple-edit mr-5"
                    style={getButtonStyleHandleDuplicates(props.isDuplicateAllow)}
                    onClick={() => setDuplicateAllowHandler(true)}
                    disabled={props.importAction !== IMPORT_TYPE.NEW_ONLY}
                  >
                    {translate('setting.importCSV.screenOne.btnAllowHandleDuplicates')}
                  </button>
                  <button
                    className="button-primary button-simple-edit"
                    style={getButtonStyleHandleDuplicates(!props.isDuplicateAllow)}
                    onClick={() => setDuplicateAllowHandler(false)}
                    disabled={props.importAction !== IMPORT_TYPE.NEW_ONLY}
                  >
                    {translate('setting.importCSV.screenOne.btnNotAllowHandleDuplicates')}
                  </button>
                </>
              }
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      {
        !openHistoriesModal && renderMainComponent()
      }
      {openHistoriesModal &&
        <UploadHistories
          importBelong={props.serviceId}
          closeHistoriesModalHandel={e => toggleHistoryModal(false)}
        />
      }
    </>
  )
};

const mapStateToProps = ({ uploadCSV }: IRootState) => ({
});

const mapDispatchToProps = {
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UploadFileStep);
