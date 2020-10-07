import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { AttachedFilesType } from '../models/get-attached-files-model'
import { CommonUtil } from '../common/CommonUtil'
import TimelineShowImage from '../control/timeline-content/timeline-show-image'
import { FILE_IMAGE } from '../common/constants'
import { downloadFile } from 'app/shared/util/file-utils'

type ITimelineFileItemProp = StateProps & DispatchProps & {
    data: AttachedFilesType;
}

export const TimelineFileItem = (props: ITimelineFileItemProp) => {
    const [isShowImage, setIsShowImage] = useState(null);
    const [isImage, setIsImage] = useState(false);

  /**
   * render icon for file or image
   */

  useEffect(()=>{
      if(props.data?.attachedFile?.fileName){
          FILE_IMAGE.forEach(element => {
              if(props.data?.attachedFile?.fileName.includes(element)){
                  setIsImage(true);
              }
          });
      }
  },[])

  const renderIconFile = () => {
    return (
      <>
        { isImage && 
          <>
          <a><img onClick={() => { setIsShowImage(!isShowImage) }} src={props.data.attachedFile.fileUrl} /></a>
          </>
          }
        {!isImage &&
          <img src={CommonUtil.getUrlImageTypeFile(props.data.attachedFile.fileName)} />}
      </>
    )
  }

  /**
   * render link for file or image
   */
  const renderLinkFile = () => {
    return (
      <>
        { isImage &&
           <div title={props.data.attachedFile.fileName}><a className="text-ellipsis" onClick={ () => downloadFile(props.data.attachedFile.fileName, props.data.attachedFile.fileUrl, ()=> {})} >{props.data.attachedFile.fileName}</a></div>
        }
        {!isImage &&
          <div className="name text-over text-ellipsis text-blue" title={props.data.attachedFile.fileName}><a title={props.data.attachedFile.fileName} href={props.data.attachedFile.fileUrl} download >{props.data.attachedFile.fileName}</a></div>}
      </>
    )
  }

  return (
    <>
      <div className="file">
        <div className="file-image">
          {renderIconFile()}
        </div>

        <div className="file-content text-blue">
          {renderLinkFile()}
          <div className="info">
            <div className="author pr-1">{props.data.createdUserName}</div>
            <div className="date">{CommonUtil.getJustDateTimeZone(props.data?.createdDate)} {CommonUtil.getTimeZoneFromDate(props.data.createdDate)}</div>
          </div>
        </div>
      </div>
      {isShowImage && <TimelineShowImage imageUrl={props.data.attachedFile.fileUrl} onClose={() => { setIsShowImage(!isShowImage) }} />}
    </>
  )
}

const mapStateToProps = () => ({
});

const mapDispatchToProps = {
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TimelineFileItem);
