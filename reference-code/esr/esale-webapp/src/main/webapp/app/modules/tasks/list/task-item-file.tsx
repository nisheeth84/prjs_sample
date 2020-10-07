import React, { useState, useRef } from 'react';
import { FILE_EXTENSION_IMAGE } from 'app/modules/tasks/constants'
import { FILE_FOMATS } from 'app/shared/layout/dynamic-form/control-field/edit/field-edit-file';
import { downloadFile } from 'app/shared/util/file-utils';

export interface ITaskItemFileProps {
    task: any,
    index: number
}

export const TaskItemFile = (props: ITaskItemFileProps) => {
  const [styleBox, setStyleBox] = useState({});
  const fileTaskRef = useRef(null);

    /**
     * check image
     * @param fileName fileName check image
     */
    const checkImage = (fileName) => {
        let flagCheckImage = false;
        FILE_EXTENSION_IMAGE.forEach(fileExtension => {
            if (fileName && fileName.toLowerCase().includes(fileExtension)) {
                flagCheckImage = true;
            }
        });
        return flagCheckImage;
    }

    /**
     * Get extention of file
     */
    const getExtentionIcon = file => {
        const ext = file.fileName ? file.fileName.split('.').pop() : '';
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

    const handleClickFile = (fileName, link) => {
        downloadFile(fileName, link, () => {
            // TODO: action when dowwnload failed
        });
    }

    /**
     * handle img src not found
     * @param event
     */
    const onImgError = (event) => {
        event.target.onerror = null;
        event.target.src = '/content/images/task/ic-clip-red.svg'
    }

  /**
   * set position of box list file
   */
  const setPosition = () => {
    const top = fileTaskRef.current.getBoundingClientRect().bottom;
    const left = fileTaskRef.current.getBoundingClientRect().left;
    const space = window.innerHeight - fileTaskRef.current.getBoundingClientRect().top;
    const style = {}
    if (space > 250) {
      style['left'] = `${left}px`;
      style['top'] = `${top}px`;
    } else {
      style['left'] = `${left}px`;
      style['bottom'] = `${space}px`;
      style['top'] = 'auto';
    }
    setStyleBox(style);
  }

  return (
    <li className="icon-link-file" ref={fileTaskRef} onMouseEnter={() => setPosition()}>
      <a className="icon-small-primary icon-link-file" />
      <span className="number"> {props.task.files.length < 100 ? props.task.files.length : '99+'}</span>
      <div className="box-list-file position-fixed hidden" style={styleBox}>
        <ul>
          {props.task.files.map((file, idx) => {
            const ext = getExtentionIcon(file);
            return (
              <li key={file.fileId + idx} className="file-hover">
                <a className="file" onClick={() => handleClickFile(file.fileName, file.filePath)}>
                  <img
                    className="icon"
                    src={`/content/images/common/ic-file-${ext}.svg`}
                    onError={onImgError}
                    alt=""
                  />
                  {file.fileName}
                </a>
                {checkImage(file.fileName) && (
                  <div className={`img-preview` + (props.index === 0 ? "-column2" : "")}>
                    <img src={`${file.fileUrl}`} alt="" />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </li>
  )
};

export default TaskItemFile;
