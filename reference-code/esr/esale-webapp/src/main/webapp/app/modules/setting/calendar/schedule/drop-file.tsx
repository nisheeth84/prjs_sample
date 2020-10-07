import React, { useEffect, CSSProperties } from 'react'
import { useState, useCallback } from 'react'
import { useDrop } from 'react-dnd';
import { NativeTypes } from 'react-dnd-html5-backend';
import { translate } from 'react-jhipster';
import _ from 'lodash';

const DropFileCustom = ({
  onFileChange, deleteFile, isDisable, fileDefault, isFalse = false,
  iconImage = {
    iconName: '',
    iconPath: ''
  }
}) => {
  const [droppedFiles, setDroppedFiles] = useState(null);
  const [checkFile, setCheckFile] = useState(true);
  const [previewImg, setPreviewImg] = useState(null);
  const [checkPreviewg, setCheckPreviewg] = useState("");
  const [isDraging, setIsDraging] = useState(false)
  const [showRemove, setShowRemove] = useState(false)
  const [iconNameState, setIconNameState] = useState(null)

  // upload file
  const handleFileDrop = useCallback((item, monitor) => {
    if (monitor) {
      setCheckFile(false)
      setDroppedFiles(monitor.getItem().files[0]);
      setIsDraging(false)
    }
  }, [])

  const [{ canDrop, isOver }, drop] = useDrop({
    accept: [NativeTypes.FILE],
    drop(item, monitor) {
      handleFileDrop(item, monitor)
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    })
  })

  // Icon For file
  const FILE_FOMATS = {
    DOC: ['doc', 'docx'],
    IMG: ['jpg', 'png', 'gif', 'bmp', 'svg'],
    PDF: ['pdf'],
    PPT: ['ppt'],
    XLS: ['xls', 'xlsx']
  };

  const getIcon = (fileName: string) => {
    if (FILE_FOMATS.IMG.includes(fileName)) {
      return 'img';
    }
    if (FILE_FOMATS.DOC.includes(fileName)) {
      return 'doc';
    }
    if (FILE_FOMATS.PDF.includes(fileName)) {
      return 'pdf';
    }
    if (FILE_FOMATS.PPT.includes(fileName)) {
      return 'ppt';
    }
    if (FILE_FOMATS.XLS.includes(fileName)) {
      return 'xls';
    }
    return 'xxx';
  }

  const getExtentionIcon = (file, fileName?) => {
    if (file) {
      return getIcon(file.name ? file.name.split('.').pop() : file.split('.').pop())
    } else if (fileName) {
      return getIcon(fileName.split('.').pop())
    } else {
      return "xxx"
    }
  }

  // Delete for file
  const handleRemoveFile = () => {
    setPreviewImg(null)
    setCheckPreviewg("")
    setDroppedFiles(null);
    deleteFile();
    setCheckFile(true)
    setIconNameState({
      iconName: '',
      iconPath: ''
    })
  };

  const handleChageFile = (e) => {
    if (e.target && e.target.files[0]) {
      setDroppedFiles(e.target.files[0])
      setCheckFile(e.target.files[0])
    }
  };

  const cssIsDraging: CSSProperties = {
    borderColor: "#0f6db5",
    background: "#ededed",
    color: "#0f6db5"
  };

  useEffect(() => {
    if (fileDefault) {
      setDroppedFiles(fileDefault);
    }
  }, [fileDefault])

  useEffect(() => {
    if (droppedFiles?.size) {
      const typefile = getIcon(droppedFiles.name ? droppedFiles.name.split('.').pop() : droppedFiles.split('.').pop())
      setCheckPreviewg(typefile);
      const url = URL.createObjectURL(droppedFiles);
      setPreviewImg(url)
      onFileChange(droppedFiles);
    }
  }, [droppedFiles]);

  useEffect(() => {
    setIconNameState(iconImage)
    if (iconImage.iconPath){
      setPreviewImg(iconImage.iconPath)
      const typefile = getIcon(iconImage.iconName.split('.').pop())
      setCheckPreviewg(typefile);
    }
      
  }, [])

  return (
    <>
      <div ref={drop} className={`upload-wrap input-file-choose ${isDisable && "disable"} `}
        onDragOver={() => { setIsDraging(true) }} onDragLeave={() => setIsDraging(false)}
        onMouseOver={() => { setShowRemove(true) }} onMouseLeave={() => { setShowRemove(false) }}>
        {(!droppedFiles || (iconNameState && !iconNameState.iconPath)) && (
          <div className={`fileUpload btn btn--browse  ${isDisable && "disable"} ${isFalse && 'schedule-setting-error-upload-file'}`} style={isDraging ? cssIsDraging : {}}>
            <span style={{ fontSize: "x-small" }}><i style={{ fontSize: "medium" }} className="far fa-plus mr-2" />
              {translate('setting.system.saml.btnUploadFile')}</span>
            <p className="file" />
            {isDisable ? <input id="uploadBtn" type="file" className="upload" disabled /> :
              <input id="uploadBtn" type="file" className="upload" onChange={(event) => handleChageFile(event)} />}
          </div>
        )}
        {!isDisable && (droppedFiles || (iconNameState && iconNameState.iconPath)) && (
          <div className="input-common-wrap form-picture-drop" >
            <div className="icon-file fa-pull-left mr-2">
              <img style={{ width: 20 }} src={`../../content/images/common/ic-file-${getExtentionIcon(droppedFiles, iconNameState.iconName)}.svg`} />
            </div>
            <span className="text-ellipsis w80"
            >
              {iconNameState.iconName || droppedFiles.name}
            </span>
            {showRemove && <button style={{zIndex : 9999999999}} type="button" className="icon-delete" onClick={() => handleRemoveFile()} />}
            {showRemove && checkPreviewg === 'img'  && <div className="box-choose-file"><img src={previewImg} /></div>}
          </div>
        )}
      </div>
    </>
  )
}
export default DropFileCustom;
