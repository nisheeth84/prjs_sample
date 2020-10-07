import React, { useState, useEffect } from 'react'
import { TargetDeliversType } from '../../models/get-user-timelines-type'
import { handleShowDetail } from "app/modules/timeline/timeline-reducer";
import { connect } from 'react-redux';
import { TYPE_DETAIL_MODAL, TARGET_TYPE } from '../../common/constants';
import { translate } from 'react-jhipster';
import { CommonUtil } from '../../common/CommonUtil';
type ITimelineTagetDeliversShowProp = StateProps & DispatchProps & {
    dataTarget: TargetDeliversType[];
    createUser: number
}

const TimelineTagetDeliversShow = (props: ITimelineTagetDeliversShowProp) => {
  const [listDeliver, setListDeliver] = useState([]);
    const handleShowModal = (param: TargetDeliversType) => {
        props.handleShowDetail(param.targetId, TYPE_DETAIL_MODAL.EMPLOYEE);
    }
    // filter targetName !== createdUser
    useEffect(() => {
        const listTarget = [];
        const targetCompany: TargetDeliversType = {
            targetType: 2,
            targetId: -100,
            targetName: translate('timeline.common.target-all')
        }
        if (props.dataTarget?.length > 0) {
            props.dataTarget?.filter( (obj) => (  (obj.targetType === TARGET_TYPE.EMPLOYEE && obj.targetId !== props.createUser)  || obj.targetType === TARGET_TYPE.DEPARTMENT) && obj.targetName !== null ).forEach((item) => {
                    listTarget.push(item)
                })
        }
        if (props.dataTarget?.find((obj) => (obj.targetType === TARGET_TYPE.ALL))) {
            listTarget.unshift(targetCompany);
        }
        setListDeliver(CommonUtil.removeDuplicateTarget(listTarget));
    }, [props.dataTarget])

    return (
        <>
            { listDeliver && listDeliver.length > 0 &&
                <div className="address mb-1"> {translate('timeline.control.sidebar.taget')}：
                    <span className="text-blue" >
                        { listDeliver.map((item, index) => {
                            if(item.targetType === TARGET_TYPE.EMPLOYEE) {
                                return <a key={index} onClick={() => {handleShowModal(item)}}>{item?.targetName}{listDeliver.length-1 === index? '': ', '} </a>
                            } else {
                                return <span className="color-333" key={index}> {item?.targetName}{listDeliver.length-1 === index? '': ', '} </span>
                            }
                        })}
                    </span>
                </div>
            }
        </>
    );
}
const mapStateToProps = () => ({
});
const mapDispatchToProps = {
    handleShowDetail
};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TimelineTagetDeliversShow);
