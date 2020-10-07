import React, { useState, useEffect, useRef } from 'react';
import { translate } from 'react-jhipster';
import _ from 'lodash';
import { DEFAULT_LANG_STATE } from '../../constant';
import DialogDirtyCheck from 'app/shared/layout/common/dialog-dirty-check';

interface IMasterMotivationsProps {
  dismissDialogMasterMotivations,
  masterMotivationsItem,
  masterMotivationsChange,
  changeFileData
}

export const MasterMotivations = (props: IMasterMotivationsProps) => {

  const MAX_LENGTH = 100;
  const [isDirty, setIsDirty] = useState(null);
  const [langsMore, setLangsMore] = useState(false);
  const [masterMotivationsItem, setMasterMotivationsItem] = useState(null);
  const [hoverIdx, setHoverIdx] = useState(null);
  const [files, setFiles] = useState(null);
  const [fileDTOs, setFileDTOs] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const previewImgRef = useRef(null);

  const buttonToogle = useRef(null);


  const [icons,] = useState([
    { iconType: 1, iconPath: "setting/ic-setting-ask-gray.svg", isCheck: true, iconName: "unknown" },
    { iconType: 2, iconPath: "setting/ic-setting-up-arrow.svg", isCheck: false, iconName: "positive" },
    { iconType: 3, iconPath: "setting/ic-setting-horizontal-arrow.svg", isCheck: false, iconName: "neutral" },
    { iconType: 4, iconPath: "setting/ic-setting-down-arrow.svg", isCheck: false, iconName: "negative" },
    { iconType: 0, iconPath: "", isCheck: false }
  ]);
  const backgrounds = [
    { id: "1", background: "background-color-89", isCheck: true },
    { id: "2", background: "background-color-24", isCheck: false },
    { id: "3", background: "background-color-104", isCheck: false },
    { id: "4", background: "background-color-106", isCheck: false },
    { id: "5", background: "background-color-93", isCheck: false },
    { id: "6", background: "background-color-101", isCheck: false },
    { id: "7", background: "background-color-102", isCheck: false },
    { id: "8", background: "background-color-103", isCheck: false }
  ];
  const [langs, setLangs] = useState(DEFAULT_LANG_STATE);
  const [isUpload, setIsUpload] = useState(1);
  const [isError, setIsError] = useState(false);
  const [errorCode, setErrorCode] = useState(null);
  const [errorCodeFile, setErrorCodeFile] = useState(null);
  const [errorlang, setErrorLang] = useState([]);
  const [errorFile, setErrorFile] = useState(false);
  const [holder, setHolder] = useState(null);
  useEffect(() => {
    if (props.masterMotivationsItem) {
      setMasterMotivationsItem(props.masterMotivationsItem);
      const langObj = JSON.parse(props.masterMotivationsItem.masterMotivationName);
      setLangs({ ...langObj });
      setIsUpload(props.masterMotivationsItem.iconType);
    } else {
      const items = {
        iconType: 1,
        isAvailable: true,
        backgroundColor: "1",
        iconName: "unknown",
        masterMotivationId: (0 - Math.floor(Math.random() * Math.floor(1000000)))
      }
      setMasterMotivationsItem(items);
    }
  }, [props.masterMotivationsItem]);

  const initFieldValue = (fieldValue) => {
    let filtered = [];
    if (fieldValue) {
      [fieldValue].forEach(file => {
        if (file) {
          file['status'] = 0;
          if (file['iconName'] !== undefined) {
            file['name'] = file['iconName'];
          }
          if (file['iconPath'] !== undefined) {
            file['file_path'] = file['iconPath'];
            file['file_url'] = file['iconPath'];
          }
          filtered.push(file);
        }
      })
      filtered = filtered.filter(fVal => !_.isNil(fVal['file_path']) && fVal['file_path'].length > 0);
    }
    if (fieldValue.iconType === 0) {
      setFileDTOs(filtered[0]);
      setFiles(filtered[0]);
    }
  }

  const initialize = () => {
    if (props.masterMotivationsItem) {
      initFieldValue(_.cloneDeep(props.masterMotivationsItem));
    }
  }

  useEffect(() => {
    const p1 = _.cloneDeep(props.masterMotivationsItem);
    const p2 = _.cloneDeep(masterMotivationsItem);

    let checkIsDirty = false;
    if (p1 !== null && p2 !== null) {
      const isAvailableDiff = p1.isAvailable !== p2.isAvailable;
      const typeIconDefferent = p1.iconType !== p2.iconType;
      const backgroudColor = p1.backgroundColor !== p2.backgroundColor;
      const name = !_.isEqual(JSON.parse(p1.masterMotivationName), langs);
      checkIsDirty = isAvailableDiff || typeIconDefferent || backgroudColor || name;
    } else {
      if (masterMotivationsItem) {
        checkIsDirty = !(isUpload === 1 && langs === DEFAULT_LANG_STATE && p2.isAvailable && p2.backgroundColor === "1");
      }
    }
    setIsDirty(checkIsDirty);
  }, [masterMotivationsItem, langs, isUpload]);

  useEffect(() => {
    initialize();
  }, []);

  const handleChangeLangs = keyMap => event => {
    setLangs({ ...langs, [keyMap]: event.target.value });
  }

  const handleChangeInput = keyMap => e => {
    switch (keyMap) {
      case "isAvailable":
        setMasterMotivationsItem({ ...masterMotivationsItem, ['isAvailable']: true });
        break;
      case "noAvailable":
        setMasterMotivationsItem({ ...masterMotivationsItem, ['isAvailable']: false });
        break;
      default:
        break;
    }
  }

  const changeIcons = (item) => {
    let iconNameOfIcon = null;
    switch (item.iconType) {
      case 1:
        setIsUpload(1);
        iconNameOfIcon = "unknown";
        break;
      case 2:
        setIsUpload(2);
        iconNameOfIcon = "positive";
        break;
      case 3:
        setIsUpload(3);
        iconNameOfIcon = "neutral";
        break;
      case 4:
        setIsUpload(4);
        iconNameOfIcon = "negative";
        break;
      default:
        setIsUpload(0);
        break;
    }
    if (item.iconType !== 0) {
      setMasterMotivationsItem({ ...masterMotivationsItem, ['iconType']: item.iconType, ['iconPath']: item.iconPath, ['iconName']: iconNameOfIcon });
      setFiles(null);
      setFileDTOs(null);
    } else {
      setMasterMotivationsItem({ ...masterMotivationsItem, ['iconType']: item.iconType });
    }
  }

  const changeBackground = (item) => {
    const tmpMasterMotivationsItem = _.cloneDeep(masterMotivationsItem);
    tmpMasterMotivationsItem['backgroundColor'] = item.id
    setMasterMotivationsItem(tmpMasterMotivationsItem);
  }

  const cancel = async () => {
    if (isDirty) {
      await DialogDirtyCheck({ onLeave: props.dismissDialogMasterMotivations, partternType: 2 });
      return;
    }
    props.dismissDialogMasterMotivations();
  }

  const getStyle = () => {
    if (!previewImgRef || !previewImgRef.current) {
      return {};
    }
    if (previewImgRef.current.getBoundingClientRect().top > window.innerHeight - 300) {
      return { top: -205 };
    }
    return {};
  }

  const headerHoverOn = (file, index, hover = true) => {
    setHoverIdx(index);
    let url = null;
    let fileUrl = null;
    if (!_.isNil(fileDTOs)) {
      fileUrl = fileDTOs['file_url'] ? fileDTOs['file_url'] : null;
    }
    if (!_.isNil(fileUrl)) {
      url = fileUrl;
    } else {
      url = files ? URL.createObjectURL(files) : null;
    }
    if (hover) {
      setPreviewImg(url);
      getStyle();
    }
    return url;
  }

  const checkMaxLength = () => {
    const langErr = [];
    if (langs["ja_jp"].trim().length > MAX_LENGTH) {
      langErr.push("ja_jp");
    }
    if (langs["en_us"].trim().length > MAX_LENGTH) {
      langErr.push("en_us");
    }
    if (langs["zh_cn"].trim().length > MAX_LENGTH) {
      langErr.push("zh_cn");
    }
    setErrorLang(langErr);
    return langErr;
  }

  const checkError = () => {
    let error = false;
    let errorFileInput = false;
    if (_.isEmpty(langs["ja_jp"].trim()) && _.isEmpty(langs["en_us"].trim()) && _.isEmpty(langs["zh_cn"].trim())) {
      error = true;
      setErrorCode("ERR_COM_0013");
    }
    if ((isUpload === 0 && (!files || !fileDTOs))) {
      errorFileInput = true;
      setErrorFile(true);
      setErrorCodeFile("ERR_COM_0014");
    }
    const langErr = checkMaxLength();
    if (langErr.length > 0) {
      error = true;
      setErrorCode("ERR_COM_0025");
    }
    setIsError(error);
    return { error, errorFileInput };
  }
  const save = () => {
    const sendData = _.cloneDeep(masterMotivationsItem);

    if ("file_path" in sendData) {
      delete sendData['file_path']
    }
    if ("file_url" in sendData) {
      delete sendData['file_url']
    }
    if ("iconPath" in sendData) {
      delete sendData['iconPath']
    }
    if ("status" in sendData) {
      delete sendData['status']
    }
    if ("name" in sendData) {
      delete sendData['name']
    }
    if ("createdDate" in sendData) {
      delete sendData['createdDate']
    }
    if ("createdUser" in sendData) {
      delete sendData['createdUser']
    }
    if ("updatedUser" in sendData) {
      delete sendData['updatedUser']
    }
    if (!checkError().error && !checkError().errorFileInput) {
      if (isUpload === 0) {
        sendData['iconPath'] = fileDTOs['file_url'] ? fileDTOs['file_url'] : (URL.createObjectURL(files) ? URL.createObjectURL(files) : null);
      }
      const tmpLangs = _.cloneDeep(langs);
      tmpLangs['ja_jp'] = langs['ja_jp'].trim();
      tmpLangs['en_us'] = langs['en_us'].trim();
      tmpLangs['zh_cn'] = langs['zh_cn'].trim();
      sendData["masterMotivationName"] = JSON.stringify(tmpLangs);
      props.masterMotivationsChange(sendData);
    }
  }

  const onFileChange = event => {
      setMasterMotivationsItem({ ...masterMotivationsItem, ['iconName']: event.target.files[0].name });
      setFileDTOs(event.target.files[0]);
      setFiles(event.target.files[0]);
      props.changeFileData(event.target.files[0], masterMotivationsItem.masterMotivationId);
  }

  const headerHoverOff = () => {
    setHoverIdx(null);
  }

  const FILE_FOMATS = {
    DOC: ['doc', 'docx'],
    IMG: ['jpg', 'png', 'gif', 'bmp', 'svg'],
    PDF: ['pdf'],
    PPT: ['ppt'],
    XLS: ['xls', 'xlsx']
  };

  const getExtentionIcon = (file) => {
    const ext = file.name.split('.').pop();
    if (FILE_FOMATS.IMG.includes(ext)) {
      return 'img';
    }
    if (FILE_FOMATS.DOC.includes(ext)) {
      return 'doc';
    }
    if (FILE_FOMATS.PDF.includes(ext)) {
      return 'pdf';
    }
    if (FILE_FOMATS.PPT.includes(ext)) {
      return 'ppt';
    }
    if (FILE_FOMATS.XLS.includes(ext)) {
      return 'xls';
    }
    return 'xxx';
  }
  const [hoverFileInput, setHoverFileInput] = useState(false);
  const handleRemoveFile = () => {
    setFiles(null);
    setFileDTOs(null);
    props.changeFileData(null, masterMotivationsItem.masterMotivationId);
  };

  const handlerFunction = () => {
    setHoverFileInput(true);
  }

  const handlerFunctionLeave = () => {
    setHoverFileInput(false);
  }

  if (holder && isUpload === 0) {
    holder.ondrop = function (e) {
      handlerFunctionLeave()
      if (e.currentTarget.type === "file") {
        setFileDTOs(e.dataTransfer.files[0]);
        setFiles(e.dataTransfer.files[0]);
        setMasterMotivationsItem({ ...masterMotivationsItem, ['iconName']: e.dataTransfer.files[0].name });
        props.changeFileData(e.dataTransfer.files[0], masterMotivationsItem.masterMotivationId);
      }
    }
    holder.ondragover = function (e) {
      if (e.currentTarget.type === "file") {
        handlerFunction()
      }
    }
    holder.ondragleave = function (e) {
      handlerFunctionLeave()
    }
  }

  useEffect(() => {
    if (isUpload === 0) {
      setHolder(document.getElementById('uploadBtn'));
    } else {
      setHolder(null);
    }
  }, [fileDTOs, isUpload]);


  const styleHover = {};
  if (hoverFileInput) {
    styleHover['color'] = '#0f6db5';
    styleHover['border-color'] = '#0f6db5';
  }

  const renderFileUpload = () => {
    let showInputFile = true;
    if (isUpload !== 0) {
      showInputFile = true;
    } else {
      if (fileDTOs) {
        showInputFile = false;
      }
    }
    return (
      <div>
        <label className="title mt-4 font-weight-bold">
          <p className="radio-item normal d-inline mr-4">
            <input type="radio" id={'icons-' + 0} name="icons" onClick={() => changeIcons({ iconType: 0, iconPath: "", isCheck: false })} checked={0 === isUpload} />
            <label htmlFor={'icons-' + 0} className="color-999">
              {translate('setting.customer.masterPosition.upload')}
            </label>
          </p>
        </label>
        <div className="input-common-wrap mt-4">
          {
            showInputFile &&
            <>
              <div className="upload-wrap">
                <div className={"fileUpload btn btn--browse setting-pos-relative " + `${errorFile ? "file-upload-error" : ""}` + `${isUpload !== 0 ? "disable" : ""}`}
                  style={hoverFileInput ? styleHover : {}}>
                  <i className="far fa-plus mr-2" /><span>{translate('setting.system.saml.btnUploadFile')}</span>
                  <input id="uploadBtn" type={isUpload === 0 ? "file" : "text"} className="upload" onChange={(event) => { isUpload === 0 && onFileChange(event) }} disabled={isUpload !== 0} />
                </div>
              </div>
              {errorFile && <p className="setting-input-valis-msg">{translate('messages.' + errorCodeFile)}</p>}
            </>
          }
          {
            !showInputFile &&
            <div className="fileUpload-complete file-inline" onMouseEnter={() => { headerHoverOn(fileDTOs, 0) }} onMouseLeave={() => { headerHoverOff() }}>
              <div className="icon-file fa-pull-left">
                <img style={{ width: 20 }} src={`../../content/images/common/ic-file-${getExtentionIcon(fileDTOs)}.svg`} />
              </div>
              <span className="text-ellipsis">{fileDTOs.name}</span>
              {hoverIdx === 0 &&
                <button type="button" className="icon-delete" onClick={() => handleRemoveFile()} />
              }
              <div className={hoverIdx === 0 && getExtentionIcon(fileDTOs) === 'img' ? "box-choose-file" : ""} ref={previewImgRef} style={getStyle()}>
                {hoverIdx === 0 && getExtentionIcon(fileDTOs) === 'img' &&
                  <img src={previewImg} />
                }
              </div>
            </div>
          }
        </div>
      </div>
    )
  }
  return (
    <>
      <div className="table-tooltip-box w30 max-height-none">
        <div className="table-tooltip-box-body">
          <div>
            <label className="title font-weight-bold">{!props.masterMotivationsItem ? translate('setting.sales.productTrade.add.title') : translate('setting.sales.productTrade.add.titleEdit')}</label>
          </div>
          <div>
            <label className="title mt-4 font-weight-bold">{translate('setting.sales.productTrade.add.langs')}</label>
          </div>

          <div className="d-flex font-size-14">
            {
              langsMore ? (
                <>
                  <input type="text" className={"input-normal mt-2 w70 " + `${(isError ? (errorlang.length > 0 ? (errorlang.includes("ja_jp") ? "error" : null) : "error") : null)}`} value={langs.ja_jp} onChange={handleChangeLangs('ja_jp')} placeholder={translate('setting.sales.productTrade.add.placeholderNew')} />
                  <label className="text-input">{translate('setting.lang.jaJp')}</label>
                </>
              ) : (
                  <>
                    <input type="text" className={"input-normal mt-2 w100 " + `${(isError ? (errorlang.length > 0 ? (errorlang.includes("ja_jp") ? "error" : null) : "error") : null)}`} value={langs.ja_jp} onChange={handleChangeLangs('ja_jp')} placeholder={translate('setting.sales.productTrade.add.placeholderNew')} />
                  </>
                )
            }
          </div>
          {isError && !(errorlang.length > 0) && !langsMore && <p className="setting-input-valis-msg">{translate('messages.' + errorCode)}</p>}
          {isError && errorlang.includes("ja_jp") && <p className="setting-input-valis-msg">{translate('messages.' + errorCode, [MAX_LENGTH])}</p>}
          {
            langsMore &&
            (
              <div>
                <div className="d-flex font-size-14">
                  <input type="text" className={"input-normal mt-2 w70 " + `${(isError ? (errorlang.length > 0 ? (errorlang.includes("en_us") ? "error" : null) : "error") : null)}`} value={langs.en_us} onChange={handleChangeLangs('en_us')} placeholder={translate('setting.sales.productTrade.add.placeholderNew')} />
                  <label className="text-input">{translate('setting.lang.enUs')}</label>
                </div>
                {isError && errorlang.includes("en_us") && <p className="setting-input-valis-msg">{translate('messages.' + errorCode, [MAX_LENGTH])}</p>}
                <div className="d-flex font-size-14">
                  <input type="text" className={"input-normal mt-2 w70 " + `${(isError ? (errorlang.length > 0 ? (errorlang.includes("zh_cn") ? "error" : null) : "error") : null)}`} value={langs.zh_cn} onChange={handleChangeLangs('zh_cn')} placeholder={translate('setting.sales.productTrade.add.placeholderNew')} />
                  <label className="text-input">{translate('setting.lang.zhCn')}</label>
                </div>
                {isError && errorlang.includes("zh_cn") && <p className="setting-input-valis-msg">{translate('messages.' + errorCode, [MAX_LENGTH])}</p>}
              </div>
            )
          }
          {isError && langsMore && !(errorlang.length > 0) && <p className="setting-input-valis-msg">{translate('messages.' + errorCode, [MAX_LENGTH])}</p>}

          <div>
            <button ref={buttonToogle} className={langsMore ? "button-primary btn-padding w70 mt-2 text-center" : "button-primary btn-padding w100 mt-2 text-center"} onClick={() => {buttonToogle.current.blur(); setLangsMore(!langsMore)}}>{!langsMore ? translate('setting.sales.productTrade.add.langMore') : translate('setting.sales.productTrade.add.langLess')}</button>
          </div>

          <div className="mt-3 font-size-14">
            <label className="title font-weight-bold">
              {translate('setting.customer.scenarios.iconType')}
            </label>
            <div className="wrap-check-edit-t w100 mt-2">
              {icons && icons.length > 0 && icons.map((item, index) => (

                item.iconPath ? (
                  <p key={item.iconType} className="radio-item normal d-inline mr-4">
                    <input type="radio" id={'icons-' + item.iconType} name="icons" onClick={() => changeIcons(item)} checked={1 + index === isUpload} />
                    <label htmlFor={'icons-' + item.iconType}>
                      <img src={'../../../content/images/' + item.iconPath} />
                    </label>
                  </p>
                ) : (
                    <></>
                  )
              ))}
            </div>
          </div>
          {renderFileUpload()}

          <div className="mt-3 font-size-14">
            <label className="title font-weight-bold">
              {translate('setting.customer.masterPosition.BackgroundColor')}
            </label>
            <div className="wrap-check-edit-t w70 mt-2">
              {backgrounds && backgrounds.length > 0 && backgrounds.map((item, index) => (
                <p key={item.id} className="radio-item normal d-inline mr-4">
                  <input type="radio" id={'background-' + item.id} name="background" onClick={() => changeBackground(item)} checked={masterMotivationsItem && masterMotivationsItem.backgroundColor.toString() === item.id} />
                  <label htmlFor={'background-' + item.id}>
                    <span className={'box-color-radio ' + item.background} />
                  </label>
                </p>
              ))}
            </div>
          </div>

          <div className="mt-3">
            <label className="title font-weight-bold">{translate('setting.sales.productTrade.add.available.title')}</label>
            <div className="wrap-check w100 mt-2">
              <div className="mt-0">
                <p className="radio-item normal d-inline mr-3">
                  <input type="radio" id="isAvailable" name="isAvailable" onChange={handleChangeInput('isAvailable')} checked={masterMotivationsItem && masterMotivationsItem.isAvailable} />
                  <label htmlFor="isAvailable">{translate('setting.sales.productTrade.add.available.active')}</label>
                </p>
                <p className="radio-item normal d-inline">
                  <input type="radio" id="noAvailable" name="isAvailable" onChange={handleChangeInput('noAvailable')} checked={masterMotivationsItem && !masterMotivationsItem.isAvailable} />
                  <label htmlFor="noAvailable">{translate('setting.sales.productTrade.add.available.noActive')}</label>
                </p>
              </div>
            </div>
          </div>

        </div>
        <div className="table-tooltip-box-footer">
          <a className="button-cancel button-small mr-1" onClick={cancel}>{translate('setting.task.activityFormat.add.cancel')}</a>
          <a className="button-blue button-small" onClick={save}>{!props.masterMotivationsItem ? translate('setting.task.activityFormat.add.save') : translate('setting.customer.btnEdit')}</a>
        </div>
      </div>
    </>
  )

}
export default MasterMotivations;