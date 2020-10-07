import React, { useState, useEffect } from 'react';
import 'app/modules/tasks/control/field-input-files.scss';
import { useDrop, DropTargetMonitor } from 'react-dnd';
import { NativeTypes } from 'react-dnd-html5-backend';
import { translate } from 'react-jhipster';
import { FILE_EXTENSION_IMAGE } from '../constants';

export interface IFieldInputMultiFile {
  placeHolder: string;
  label: string;
  onFileChange: (file) => void;
  onFileDefaultChange?: (listFile) => void;
  isRequired: boolean;
  listFileDefault?: any;
}

const FieldInputFiles = (props: IFieldInputMultiFile) => {
  const [files, setFiles] = useState([]);
  const [filesDefault, setFilesDefault] = useState([]);
  const [callRender, setCallRender] = useState(false);

  useEffect(() => {
    if (props.listFileDefault) {
      setFilesDefault(props.listFileDefault);
    }
  }, [props.listFileDefault])


  const mergeFiles = (newFileAdded) => {
    for (let i = 0; i < newFileAdded.length; i++) {
      const a = newFileAdded[i];
      let exist = false;
      for (let j = 0; j < files.length; j++) {
        const b = files[j];
        if (b.name === a.name && b.lastModified === a.lastModified) {
          exist = true;
          break;
        }
      }
      if (!exist) {
        files.push(a);
      }
    }
    setCallRender(!callRender);
    setFiles(files);
    props.onFileChange(files);
  };


  const handleFileChange = (event) => {
    const file = event.target.files;
    if (file.length > 0) {
      const array = Array.from(file);
      mergeFiles(array);
    }
  };

  const handleDrop = (item: any, monitor: DropTargetMonitor) => {
    if (monitor) {
      const file = monitor.getItem().files;
      if (file.length > 0) {
        mergeFiles(file);
      }
    }
  };

  const [, drop] = useDrop({
    accept: [NativeTypes.FILE],
    drop(item, monitor) {
      if (handleDrop) {
        handleDrop(props, monitor);
      }
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  });

  const handleRemoveFile = (index) => {
    files.splice(index, 1);
    setFiles(files);
    setCallRender(!callRender);
    props.onFileChange(files);
  };

  const handleRemoveFileDefault = (index) => {
    filesDefault.splice(index,1);
    setFilesDefault(filesDefault);
    setCallRender(!callRender);
    props.onFileDefaultChange(filesDefault);
  }


  return <div className="upload-wrap input-file-choose" ref={drop}>
    {props.isRequired && <label htmlFor="uploadFile">{props.label}
      <label className="label-red">{translate('tasks.required')}</label></label>}
    {!props.isRequired && <label htmlFor="uploadFile">{props.label}</label>}
    <input id="uploadFile" type="hidden" className="f-input" />
    <div className="fileUpload btn btn--browse">
      <span><i className="far fa-plus mr-2" />{props.placeHolder}</span>
      <p className="file" />
      <button type="button" className="remove hidden"><img src="/content/images/ic-control.svg"
        alt="" /></button>
      <input id="uploadBtn" type="file" className="upload" multiple onChange={handleFileChange} />
    </div>
    <div className="files-panel">
      <div className="row mx-n1">
        {files.map((item, index) => {
          const fileExtension = item.name.split('.').pop();
          return <div key={`file-${index}`} className="col-lg-6 p-1">
            <div className="file-item">
              <div><img src={`/content/images/file-icon-pack/svg/${fileExtension}.svg`} width="20px" height="20px"
                alt="" />
              </div>
              <div><span>{item.name}</span></div>
              <div>
                <button type="button" className="close" onClick={() => handleRemoveFile(index)}>
                  <i className="fas fa-times"></i></button>
              </div>
            </div>
            {item.type.split('/')[0] === 'image' && <div className="preview position-absolute">
              <img src={URL.createObjectURL(item)} width="100%" alt="" />
            </div>}
          </div>;
        })}
        {filesDefault && filesDefault.map((item, index) => {
          // const fileExtension = item.name.split('.').pop();
          return <div key={`file-${index}`} className="col-lg-6 p-1">
            <div className="file-item">
              <div>
                <img src="/content/images/file-icon-pack/svg/PNG.svg" width="20px" height="20px"
                alt="" />
              </div>
              <div><span>{item.fileName}</span></div>
              <div>
                <button type="button" className="close" onClick={() => handleRemoveFileDefault(index)}>
                  <i className="fas fa-times"></i></button>
              </div>
            </div>
            { <div className="preview position-absolute">
              <img src={item.filePath} width="100%" alt="" />
            </div>}
          </div>;
        })}
      </div>
    </div>
  </div>
    ;
};

export default FieldInputFiles;
