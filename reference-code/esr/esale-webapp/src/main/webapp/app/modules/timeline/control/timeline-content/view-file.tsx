import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { AttachedFilesType } from '../../models/get-user-timelines-type'
import { CommonUtil } from '../../common/CommonUtil';
import TimelineShowImage from './timeline-show-image';
import { FILE_IMAGE } from '../../common/constants';
import { downloadFile } from 'app/shared/util/file-utils';

type IViewFileProp = StateProps & DispatchProps & {
    item: AttachedFilesType
}

const ViewFile = (props: IViewFileProp) => {

    const [isShowImage, setIsShowImage] = useState(null);
    const [imagePath, setImagePath] = useState(null);
    const [isImage, setIsImage] = useState(false);

    useEffect(()=>{
        if(props.item.fileName){
            FILE_IMAGE.forEach(element => {
                if(props.item.fileName.includes(element)){
                    setIsImage(true);
                }
            });
        }
    },[])

    return (
        <>
            <div className="file mr-5 d-flex my-2" >
                { isImage &&
                    <>
                        <div className="props.item smooth" onClick={() => { setIsShowImage(!isShowImage); setImagePath(props.item.fileUrl) }} >
                            <a className="icon mr-2"><img src={props.item.fileUrl} alt="" /></a>
                        </div>
                        <div className="file-content width-250" title={props.item?.fileName}>
                            <div className="name text-ellipsis">
                                <a className="text-blue no-underline" onClick={ () => downloadFile(props.item?.fileName, props.item?.fileUrl, ()=> {})} >{props.item?.fileName}</a>
                            </div>
                        </div>
                    </>
                }
                {!isImage &&
                    <>
                        <div className="props.item smooth" >
                            <span className="icon mr-2"><img src={CommonUtil.getUrlImageTypeFile(props.item.fileName)} alt="" /></span>
                        </div>
                        <div className="file-content width-250" title={props.item?.fileName}>
                            <div className="name text-ellipsis">
                                <a className=" text-blue no-underline" href={props.item?.fileUrl} download >{props.item?.fileName} </a> </div>
                        </div>
                    </>
                }
            </div>
            {isShowImage && <TimelineShowImage imageUrl={imagePath} onClose={() => { setIsShowImage(!isShowImage) }} />}
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
)(ViewFile);
