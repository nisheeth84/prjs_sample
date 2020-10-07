import React, { useEffect, useState } from 'react'
import {TimelinesType} from '../../models/get-user-timelines-type'
import { CommonUtil } from '../../common/CommonUtil';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { Storage, translate } from 'react-jhipster';
import { handleShowDetail } from "app/modules/timeline/timeline-reducer";
import { ObjectDetail } from '../../models/get-followeds-model';
import { TYPE_DETAIL_MODAL_HEADER } from '../../common/constants';

type ITimelineHeaderProp = StateProps & DispatchProps & {
  data: TimelinesType;
  callBackShowDetail?: (object: ObjectDetail) => void
}

const TimelineHeader = (props: ITimelineHeaderProp) => {

  const [language, setLanguage] = useState("")
  const [messageHeader,setMessageHeader] = useState('')
  useEffect(() =>{
    const lang: string = Storage.session.get('locale', 'ja_jp');
    if(lang.includes("ja_jp")){
      setLanguage("jaJp")
    }else if(lang.includes("en_us")){
      setLanguage("enUs")
    }else if(lang.includes("zh_cn")){
      setLanguage("zhCn")
    }
  },[])

  useEffect(() =>{
    if ( props.data?.header?.headerType === TYPE_DETAIL_MODAL_HEADER.CUSTOMER || props.data?.header?.headerType === TYPE_DETAIL_MODAL_HEADER.CARD
      || props.data?.header?.headerType === TYPE_DETAIL_MODAL_HEADER.SCHEDULE || props.data?.header?.headerType === TYPE_DETAIL_MODAL_HEADER.MILESTONE) {
        if (props.data?.comment?.mode === 0) {
          setMessageHeader('messages.INF_TIM_0013')
        } else if (props.data?.comment?.mode === 1) {
          setMessageHeader('messages.INF_TIM_0014')
        }

    }
    if (props.data?.header?.headerType === TYPE_DETAIL_MODAL_HEADER.ACTIVITY) {
      if (props.data?.comment?.mode === 0 || props.data?.comment?.mode === 1 ) {
        setMessageHeader('messages.INF_TIM_0015')
      }
    }
    if (props.data?.header?.headerType === TYPE_DETAIL_MODAL_HEADER.TASK) {
      if (props.data?.comment?.mode === 0 ) {
        setMessageHeader('messages.INF_TIM_0016')
      } else if (props.data?.comment?.mode === 1) {
        setMessageHeader('messages.INF_TIM_0017')
      }
    }
  },[])

  return (
    <div className="mission-wrap" >
      <div className="icon">

        <img className="user header-boder-timneline-common" src={CommonUtil.getIconHeaderType(props.data?.header?.headerType)} alt=' ' />

        <a onClick={() => { if(props.callBackShowDetail) props.callBackShowDetail({objectId: props.data?.header?.headerId, objectType: props.data?.header?.headerType})}}>
          <span className="font-size-14 text-blue word-break-all">
            {
              props.data?.header?.headerType ===  TYPE_DETAIL_MODAL_HEADER.ACTIVITY && <>&nbsp;{CommonUtil.getJustDateTimeZone(props.data?.header?.startTime)} {CommonUtil.convertToTime(props.data?.header?.startTime)} ~ {CommonUtil.convertToTime(props.data?.header?.endTime)}&nbsp;</>
            }
            {props.data?.header?.headerContent[language]}

          </span>
        </a>
        &nbsp;<span className="font-size-14 word-break-all">{messageHeader && translate(messageHeader)}</span>

      </div>
    </div>
  );
}
const mapStateToProps = ({ employeeDetailAction }: IRootState) => ({
  dataGetLang: employeeDetailAction.dataGetLang,
});

const mapDispatchToProps = {
  handleShowDetail
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimelineHeader);
