import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import { translate } from 'react-jhipster';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { useDrop, DropTargetMonitor } from 'react-dnd';
import { NativeTypes } from 'react-dnd-html5-backend';
import _ from 'lodash';
import { getErrorMessage, forceArray } from 'app/shared/util/string-utils';
import { ControlType } from 'app/config/constants';
import { useId } from 'react-id-generator';
import Popover from 'app/shared/layout/common/Popover';

type IFieldEditFileProps = IDynamicFieldProps;

export const FILE_FOMATS = {
  DOC: ['doc', 'docx'],
  IMG: ['jpg', 'png', 'gif', 'bmp', 'svg'],
  PDF: ['pdf'],
  PPT: ['ppt'],
  XLS: ['xls', 'xlsx']
};

/**
 * file in mode edit
 * @param props
 */
const FieldEditFile = forwardRef((props: IFieldEditFileProps, ref) => {

  const { fieldInfo } = props;
  const [files, setFiles] = useState([]);
  const [fileDTOs, setFileDTOs] = useState([]);
  const [intiFiles, setIntiFiles] = useState([]);
  const [previewImg, setPreviewImg] = useState(null);
  const [hoverIdx, setHoverIdx] = useState(null);
  const [isFocused, setIsFocused] = useState(null);
  const [showDiablogConfirm, setShowDiablogConfirm] = useState(false);
  const [tmpZero, setTmpZero] = useState(0);
  const fileRef = useRef(null);
  const idControl = useId(2, "fieldEditFile_");
  const previewImgRef = useRef(null);
  let type = ControlType.EDIT;
  // For hover IU when drap drop file from windows explore
  const [hoverFileInput, setHoverFileInput] = useState(false);
  const holder = document.getElementById(idControl[1]);
  const styleHover = {};
  if (props.controlType) {
    type = props.controlType;
  }

  const initFieldValue = (fieldValue) => {
    const fValue = forceArray(fieldValue);
    let filtered = [];
    if (fValue) {
      fValue.forEach(file => {
        if (file) {
          file['status'] = 0;
          if (file['fileName'] !== undefined) {
            file['file_name'] = file['fileName'];
          }
          if (file['filePath'] !== undefined) {
            file['file_path'] = file['filePath'];
          }
          if (file['fileUrl'] !== undefined) {
            file['file_url'] = file['fileUrl'];
          }
          filtered.push(file);
        }
      })
      filtered = filtered.filter(fVal => !_.isNil(fVal['file_path']) && fVal['file_path'].length > 0);
    }
    setFiles(filtered);
    setIntiFiles(filtered);
  }

  useImperativeHandle(ref, () => ({
    resetValue() {
      setFiles([]);
    },
    setValueEdit(val) {
      if (!_.isEqual(files, val)) {
        initFieldValue(val);
      }
    }
  }));

  const initialize = () => {
    if (props.updateStateElement && props.elementStatus && props.elementStatus.fieldValue) {
      initFieldValue(props.elementStatus.fieldValue);
    }
  }

  useEffect(() => {
    initialize();
  }, []);

  /**
   * creat data with fomat to put in API
   * @param uploads
   */
  const makeUploadData = (uploads) => {
    const fileUploads = {};
    const newFiles = [];
    const id = props.idUpdate ? props.idUpdate : '0';
    uploads.forEach((file, index) => {
      const obj = {};
      obj[`${id}.${fieldInfo.fieldName}.file${index}`] = file;
      newFiles.push(obj);
    });
    fileUploads[`${id}.${fieldInfo.fieldName}`] = newFiles;
    return fileUploads;
  }

  useEffect(() => {
    const keyObject = { itemId: null, fieldId: fieldInfo.fieldId };
    if (props.elementStatus) {
      keyObject.itemId = props.elementStatus.key;
    }
    const data = [];
    files.forEach(e => {
      if (_.isNil(e.status)) {
        // object file when upload new
        const obj = {
          "file_name": e['name'],
          "file_path": null,
          "size": e['size'],
          "status": 2
        }
        data.push(obj);
      } else {
        data.push(e);
      }
    });
    props.updateStateElement(keyObject, fieldInfo.fieldType, data);
    const uploads = _.cloneDeep(files);
    uploads.splice(0, intiFiles.length);
    if (props.updateFiles) {
      props.updateFiles(makeUploadData(uploads));
    }
    //
    const tmpDTOs = [];
    files.forEach(e => {
      const name = e.name ? e.name : e['file_name'] ? e['file_name'] : '';
      const path = e.path ? e.path : e['file_path'] ? e['file_path'] : '';
      const dto = { name, path };
      if (e.status !== undefined) {
        dto['status'] = e.status;
      }
      tmpDTOs.push(dto);
    });
    setFileDTOs(_.cloneDeep(tmpDTOs));
  }, [files]);

  /**
   * merge Files upload
   * @param newFileAdded
   */
  const mergeFiles = (newFileAdded) => {
    const fileTmp = _.cloneDeep(files);
    for (let i = 0; i < newFileAdded.length; i++) {
      const a = newFileAdded[i];
      let exist = false;
      for (let j = 0; j < fileTmp.length; j++) {
        const b = fileTmp[j];
        if ((b.name === a.name && b.lastModified === a.lastModified) ||
          (intiFiles.length > 0 && intiFiles.filter(f => f['file_name'] === a.name && f['status'] === 0).length > 0)) {
          exist = true;
          break;
        }
      }
      let isRightExtension = false;
      if (props.acceptFileExtension && props.acceptFileExtension.length > 0) {
        if (props.acceptFileExtension.includes(a.name.split('.').pop().toLowerCase())) {
          isRightExtension = true;
        }
      } else {
        isRightExtension = true;
      }
      const isFolder = !a.type && a.size % 4096 === 0;
      if (!exist && isRightExtension && !isFolder) {
        fileTmp.push(a);
      }
    }
    // setCallRender(!callRender);
    setFiles(_.cloneDeep(fileTmp));
  };

  const handleDrop = (item: any, monitor: DropTargetMonitor) => {
    if (monitor) {
      const file = monitor.getItem().files;
      if (file.length > 0) {
        mergeFiles(props.isSingleFile ? [file[0]] : file);
      }
    }
  };

  /**
   * count file not deleted
   */
  const countFiles = () => {
    return fileDTOs.length - fileDTOs.filter(file => file.status === 1).length;
  }

  const [, drop] = useDrop({
    accept: [NativeTypes.FILE],
    drop(item, monitor) {
      if (handleDrop && !(props.isSingleFile && countFiles() > 0)) {
        handleDrop(props, monitor);
      }
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  });

  const handleRemoveFile = (index, confirm?: boolean) => {
    setTmpZero(index)
    if(props.confirmDeleteLogo && !confirm){
      setShowDiablogConfirm(true);
      return
    }
    if(confirm){
      setShowDiablogConfirm(false);
    }
    if (props.isDisabled) {
      return;
    }
    if (intiFiles[index]) {
      intiFiles[index].status = 1;
      files[index].status = 1;
      setIntiFiles(_.cloneDeep(intiFiles));
      setFiles(_.cloneDeep(files));
    } else {
      files.splice(index, 1);
      setFiles(_.cloneDeep(files));
    }
    if (fileRef.current) {
      fileRef.current.value = null;
    }
    setPreviewImg(null);
    setHoverIdx(null);
  };

  const handleFileChange = (event) => {
    const file = event.target.files;
    if (file.length > 0) {
      const array = Array.from(file);
      mergeFiles(array);
    }
  };

  const getExtentionIcon = (file) => {
    const ext = file.name.split('.').pop().toLowerCase();
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

  const getStyle = () => {
    const style = {};
    if (!previewImgRef || !previewImgRef.current) {
      return style;
    }
    const marginTopImage = type === ControlType.EDIT ? 400 : 300;
    if (previewImgRef.current.getBoundingClientRect().top > window.innerHeight - marginTopImage) {
      style['top'] = '-205px';
    }
    if (previewImgRef.current.getBoundingClientRect().left > window.innerWidth - 200) {
      style['left'] = '-200px';
    }
    return style;
  }

  const headerHoverOn = (file, index) => {
    setHoverIdx(index);
    let url = null;
    let fileUrl = null;
    if (!_.isNil(intiFiles[index])) {
      // fileUrl = intiFiles[index]['file_url'] ? intiFiles[index]['file_url'] : intiFiles[index]['fileUrl'];
      fileUrl = intiFiles[index]['file_url'] ? intiFiles[index]['file_url'] : intiFiles[index]['file_path'];
    }
    if (!_.isNil(fileUrl)) {
      url = fileUrl;
    } else {
      url = URL.createObjectURL(files[index]);
    }
    setPreviewImg(url);
    getStyle();
  }

  const headerHoverOff = () => {
    setHoverIdx(null);
  }

  /**
   * find the index of single file upload by user
   */
  const zeroIndex = () => {
    let retIndex = 0;
    for (let i = 0; i < fileDTOs.length; i++) {
      if (fileDTOs[i].status === 0 || fileDTOs[i].status === undefined) {
        retIndex = i;
        break;
      }
    }
    return retIndex;
  }

  const renderFileList = () => {  
    return <>
      {fileDTOs.map((item, index) => {
        if (item.status && item.status === 1) {
          // file was deleted
          return <></>;
        } else {
          const ext = getExtentionIcon(item);
          return (
            <div className="item" key={index} onMouseEnter={() => { headerHoverOn(item, index) }} onMouseLeave={() => { headerHoverOff() }}>
              <img className="icon fa-pull-left" src={`../../content/images/common/ic-file-${ext}.svg`} />
              <span className="text-ellipsis">{item.name}</span>
              <button type="button" className="close" onClick={() => handleRemoveFile(index)}>×</button>
              <div className={index === hoverIdx && ext === 'img' ? "box-choose-file" : ""} ref={previewImgRef} style={getStyle()}>
                {index === hoverIdx && ext === 'img' &&
                  <img src={previewImg} />
                }
              </div>
            </div>
          )
        }
      })}
    </>
  }

  if (props.isFocus && fileRef && fileRef.current) {
    fileRef.current.focus();
  }

  const buildAcceptFilter = () => {
    if (!props.acceptFileExtension || props.acceptFileExtension.length === 0) {
      return "";
    }
    let filter = "";
    props.acceptFileExtension.forEach((ext, idx) => {
      if (idx > 0) {
        filter = filter + ", ";
      }
      filter = filter + `.${ext}`;
    })
    return filter;
  }

  const msg = getErrorMessage(props.errorInfo);
  const renderBottom = () => {
    if (type === ControlType.EDIT_LIST) {
      return (
        <div ref={drop} className={`form-group input-common-wrap mt-2 ${msg ? 'error' : ''}`}>
          <div className="list-files mt-3 clearfix">
            {renderFileList()}
          </div>
        </div>
      )
    } else {
      return (
        <div className="list-files mt-3">
          {renderFileList()}
        </div>
      )
    }
  }

  // If hover, set style
  if (hoverFileInput) {
    styleHover['color'] = '#0f6db5';
    styleHover['border-color'] = '#0f6db5';
  }

  /**
   * When hover set flag hoverFileInput is true
   */
  const handlerFunction = () => {
    setHoverFileInput(true);
  }

  /**
   * When leave hover set flag hoverFileInput is false
   */
  const handlerFunctionLeave = () => {
    setHoverFileInput(false);
  }

  // event hover
  if (holder) {
    holder.ondragover = function (e) {
      handlerFunction()
    }
    holder.ondragleave = function (e) {
      handlerFunctionLeave()
    }
  }

  const DialogConfirmClose = () => {
    return (
      <>
        <div className="popup-esr2" id="popup-esr2">
          <div className="popup-esr2-content">
            <div className="popup-esr2-body">
              <form>
                <div className="popup-esr2-title">{translate('customers.dialog-delete-logo.title')}</div>
                <p className="text-center mt-4">{translate('customers.dialog-delete-logo.content')}</p>
              </form>
            </div>
            <div className="popup-esr2-footer">
                <a className="button-cancel" onClick={() => setShowDiablogConfirm(false)}>{translate('customers.dialog-delete-logo.cancel')}</a>
                <a className="button-red" onClick={() => handleRemoveFile(tmpZero, true)}>{translate('customers.dialog-delete-logo.submit')}</a>
            </div>
          </div>
        </div>
        <div className="modal-backdrop2 show"></div>
      </>
    );
  };

  const renderComponentEdit = () => {
    const zero = zeroIndex();
    const isList = type === ControlType.EDIT_LIST;
    return (
      <>
        <div ref={drop} className={`input-common-wrap ${isList && 'w100'} ${msg ? 'error' : ''}`}>
          {!(countFiles() > 0 && props.isSingleFile) &&
            <div className="upload-wrap upload-wrap-custom">
              <input id={idControl[0]} tabIndex={-1} className="f-input" />
              <div style={hoverFileInput ? styleHover : {}} className={`fileUpload btn btn--browse ${isFocused ? "file-input-focused" : ""} ${isList && 'top-0'} ${props.isDisabled ? 'disable' : ''}`}>
                <span className="wrap text-ellipsis"><i className="far fa-plus mr-2" />{translate(`dynamic-control.fieldTypePlaceholder.${fieldInfo.fieldType}`)}</span>
                <p className="file" />
                <button type="button" className="remove hidden" tabIndex={-1}><img src="../../content/images/ic-control.svg" /></button>
                <input id={idControl[1]} type="file" ref={fileRef} className="upload" multiple={!props.isSingleFile}
                  onChange={handleFileChange} disabled={props.isDisabled} accept={buildAcceptFilter()}
                  onFocus={() => { setIsFocused(true) }} onBlur={() => { setIsFocused(false) }} />
              </div>
            </div>
          }
          {countFiles() > 0 && props.isSingleFile &&
            <div className="fileUpload-complete file-inline" onMouseEnter={() => { headerHoverOn(fileDTOs[zero], zero) }} onMouseLeave={() => { headerHoverOff() }}>
              <div className="icon-file fa-pull-left">
                <img style={{ width: 20 }} src={`../../content/images/common/ic-file-${getExtentionIcon(fileDTOs[zero])}.svg`} />
              </div>
              <span className="text-ellipsis">{fileDTOs[zero].name}</span>
              {hoverIdx === zero &&
                <button type="button" className="icon-delete" onClick={() => handleRemoveFile(zero)} />
              }
              <div className={hoverIdx === zero && getExtentionIcon(fileDTOs[zero]) === 'img' ? "box-choose-file" : ""} ref={previewImgRef} style={getStyle()}>
                {hoverIdx === zero && getExtentionIcon(fileDTOs[zero]) === 'img' &&
                  <img src={previewImg} />
                }
              </div>
            </div>
          }
          {msg && <span className="messenger">{msg}</span>}
          {countFiles() > 0 && !props.isSingleFile && renderBottom()}
        </div>
        {showDiablogConfirm && <><DialogConfirmClose /><div className="modal-backdrop2 show"></div></>}
      </>
    );
  }

  // const renderComponentEditList = () => {
  //   const zero = zeroIndex();
  //   return (
  //     <>
  //       <div ref={drop} className={`input-common-wrap w100 ${msg ? 'error' : ''}`}>
  //         {!(countFiles() > 0 && props.isSingleFile) &&
  //           <div className="upload-wrap">
  //             <input id={idControl[0]} tabIndex={-1} className="f-input" />
  //             <div className={`fileUpload btn btn--browse top-0 ${props.isDisabled ? 'disable' : ''}`}>
  //               <span><i className="far fa-plus mr-2" />{translate(`dynamic-control.fieldTypePlaceholder.${fieldInfo.fieldType}`)}</span>
  //               <p className="file" />
  //               <button type="button" className="remove hidden"><img src="../../content/images/ic-control.svg" /></button>
  //               <input id={idControl[1]} type="file" ref={fileRef}  className="upload" multiple={!props.isSingleFile} onChange={handleFileChange} disabled={props.isDisabled} />
  //             </div>
  //           </div>
  //         }
  //         {countFiles() > 0 && props.isSingleFile &&
  //           <div className="fileUpload-complete file-inline" onMouseEnter={() => { headerHoverOn(fileDTOs[zero], zero) }} onMouseLeave={() => { headerHoverOff() }}>
  //             <div className="icon-file fa-pull-left">
  //               <img style={{ width: 20 }} src={`../../content/images/common/ic-file-${getExtentionIcon(fileDTOs[zero])}.svg`} />
  //             </div>
  //             <span className="text-ellipsis">{fileDTOs[zero].name}</span>
  //             {hoverIdx === zero &&
  //               <button type="button" className="icon-delete" onClick={() => handleRemoveFile(zero)} />
  //             }
  //             <div className={hoverIdx === zero && getExtentionIcon(fileDTOs[zero]) === 'img' ? "box-choose-file" : ""} ref={previewImgRef} style={getStyle()}>
  //               {hoverIdx === zero && getExtentionIcon(fileDTOs[zero]) === 'img' &&
  //                 <img src={previewImg} />
  //               }
  //             </div>
  //           </div>
  //         }
  //         {msg && <span className="messenger">{msg}</span>}
  //         {countFiles() > 0 && !props.isSingleFile &&
  //           <div ref={drop} className={`form-group input-common-wrap mt-2 ${msg ? 'error' : ''}`}>
  //             <div className="list-files mt-3 clearfix">
  //               {renderFileList()}
  //             </div>
  //           </div>
  //         }
  //       </div>
  //     </>
  //   );
  // }

  const renderComponent = () => {
    // if (type === ControlType.EDIT || type === ControlType.ADD) {
    //   return renderComponentEdit();
    // } else if (type === ControlType.EDIT_LIST) {
    //   return renderComponentEditList();
    // }
    return renderComponentEdit();
  }

  return renderComponent();
});

export default FieldEditFile
