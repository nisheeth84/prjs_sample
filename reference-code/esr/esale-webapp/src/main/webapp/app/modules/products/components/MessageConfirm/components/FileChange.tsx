import React, { memo, useState } from 'react';
import ArrowChange from './ArrowChange';
import { FileChangeWrapper, ShowImageWrap } from './styles';
import { iconTypes, ActionClickFile, blankText } from '../constants'
import * as R from 'ramda';
import { downloadFile } from 'app/shared/util/file-utils';
import CheckBlank from './CheckBlank';
import ATag from './ATag';

interface IProps {
  fieldLabel:any
  file_name:any
  file_path:any
  isModalConfirm?:boolean
}

const FileChange:React.FC<IProps> = ({ fieldLabel, file_name: fileName, file_path: filePath = {}, isModalConfirm }) => {

  if (R.equals(fileName, {}) && R.equals(filePath, {})) {
    return <></>
  }
  
  if(R.equals(fileName.new, fileName.old)){
    return <></>
  }

  const convertStringDataToArrayData = (dt: string | string[]): string[] => {
    try{

      if (typeof dt === 'string') {
        return [dt];
      }
      return dt
    } catch (err) {
      return []
    }
  }



  const [showImage, setShowImage] = useState<boolean>(false)
  const [imageUrl, setImageUrl] = useState<string>(null)


  const getFileType = (name: string) => {
    if (!name) return {};
    // return jpg || png || .....
    const getTypeOfLink = R.compose(
      R.last,
      R.split('.')
    )(name);

    const findIconType = R.find(R.where({ type: R.includes(getTypeOfLink) }), iconTypes);
    return findIconType;
  };

  const handleClick = (action, link: string, name?) => {
    if (action === ActionClickFile.show) {
      setImageUrl(link)
      setShowImage(true)
      return
    }
    downloadFile(name, link, () => { })
  }

  const renderOldData = () => {

    const oldFileName = convertStringDataToArrayData(fileName.old)
    if (!oldFileName || !oldFileName.length) return <>{blankText()}</>
    const len = oldFileName.length

    return oldFileName.map((_fileName, index) => (
      <React.Fragment key={index} >
        <CheckBlank value={_fileName}> <Icon isModalConfirm={isModalConfirm} icon={getFileType(_fileName)?.icon} />{_fileName}{index !== len - 1 && ", "}</CheckBlank>
      </React.Fragment>
    )
    )
  }

  const renderNewData = () => {
    const newFileName = convertStringDataToArrayData(fileName.new)
    const newFilePath = convertStringDataToArrayData(filePath?.new) || []
    if (!newFileName || !newFilePath || !newFileName.length) return <>{blankText()}</>

    const len = newFileName.length

    return newFileName.map((_fileName, index) => (
      <React.Fragment key={index}>
        <CheckBlank value={_fileName}>
          <>
            <Icon isModalConfirm={isModalConfirm} icon={getFileType(_fileName)?.icon} />
            <ATag
              isModalConfirm={isModalConfirm}
              className={"text-blue"}
              onClick={() => handleClick(getFileType(_fileName)?.action, newFilePath[index], newFileName[index])}
            >
              {_fileName}
            </ATag>
          </>
        </CheckBlank>
        {index !== len - 1 && ", "}
      </React.Fragment>
    )
    )
  }

  const handleCloseModalImage = () => {
    setShowImage(false)
    setImageUrl(null)
  }

  return (
    <FileChangeWrapper className="item">
      <div className="min-width-90">{fieldLabel}：</div>
      {renderOldData()}
      <ArrowChange />
      {renderNewData()}
      <ShowImage show={showImage} link={imageUrl} onClose={handleCloseModalImage} />
    </FileChangeWrapper>
  );
};

const Icon = ({ icon, isModalConfirm }) => {
  return icon && !isModalConfirm ? <img className="icon" src={`../../content/images/common/${icon}`} alt="" title="" /> : <></>;
};


const ShowImage = ({ show, link, onClose }) => {
  if (!show || !link) {
    return <></>
  }
  return <>
    <div className="popup-slider background-transparent" id="popup-esr2">
      <ShowImageWrap className="item no-padding text-center">
        <img className="slider" src={link} alt="" />
        <a title="" className="icon-small-primary icon-close-up-small close-slider-popup" onClick={onClose}></a>
      </ShowImageWrap>
    </div>
    <div className="modal-backdrop2 show"></div>
  </>
}

export default memo(FileChange);
