import React, { useMemo, useEffect } from 'react'
import { useState, useCallback } from 'react'
import { useDrop } from 'react-dnd';
import { NativeTypes } from 'react-dnd-html5-backend';
import { translate } from 'react-jhipster';

const DropFileCustom = ({ infoFile, onFileChange, deleteFile, highlight }) => {
  const [droppedFiles, setDroppedFiles] = useState(null);
  const [checkFile, setCheckFile] = useState(true);
  const [displayFiles, setDisplayFiles] = useState(null);

  // default file
  useEffect(() => {
    if(infoFile){
      setDisplayFiles(new File([infoFile], infoFile, {type: "text/xml"}));
      setCheckFile(false)
    }
  }, [infoFile]);

  // Update file
  useEffect(() => {
    onFileChange(droppedFiles);
  }, [droppedFiles]);

  // upload file
  const handleFileDrop = useCallback((item, monitor) => {
    if (monitor) {
      const files = monitor.getItem().files[0];
      setCheckFile(false)
      setDroppedFiles(files);
    }
  }, [])

  const [{ canDrop, isOver }, drop] = useDrop({
    accept: [NativeTypes.FILE],
    drop(item, monitor) {
      handleFileDrop(item, monitor);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  })

  // show file
  // function list(files) {
  //   const label = (file) =>
  //     `'${file.name}' of size '${file.size}' and type '${file.type}'`
  //   return files.map((file) => <li key={file.name}>{label(file)}</li>)
  // }

  // Icon For file
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

  // Delete for file
  const handleRemoveFile = () => {
    setDisplayFiles(null);
    setDroppedFiles(null);
    deleteFile();
    setCheckFile(true)
  };

  const handleChageFile = (e) => {
    const files = e.target.files[0];
    setDroppedFiles(files);
    setCheckFile(false);
  };


  return (
    <>

      <div ref={drop} className={`upload-wrap input-file-choose ${checkFile && 'uploadBtn-magin-top'}`}>
        {displayFiles ? (
          <div className="input-common-wrap form-picture-drop file">
            <div className="icon-file fa-pull-left mr-2">
              <img style={{ width: 20 }} src={`../../content/images/common/ic-file-${getExtentionIcon(displayFiles)}.svg`} />
            </div>
            <span className="text-ellipsis">{displayFiles.name}</span>
            <button type="button" className="icon-delete" onClick={() => handleRemoveFile()} />
          </div>
        ) : (
          <div className={`fileUpload btn btn--browse ${highlight && 'highlight-input'}`}>
            <span><i className="far fa-plus mr-2" />
              {translate('setting.system.saml.btnUploadFile')}</span>
            <p className="file" />
            <input id="uploadBtn" type="file" className="upload" onChange={(event) => handleChageFile(event)} />
          </div>
        )}
      </div>
    </>
  )
}
export default DropFileCustom;