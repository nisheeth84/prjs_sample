import React from 'react'
import { DataOfResource, CalenderViewCommon } from '../../../api/common'
import { RenderResource } from './render-resource';
import moment from 'moment';

interface IItemResourceInList {
    dataOfResource: DataOfResource
}

export const ItemResourceInList = React.memo((props: IItemResourceInList) => {
    
    let sFormatStart = props.dataOfResource.isOverDay ? 'YYYY/MM/DD HH:mm' : 'HH:mm';
    let sFormatEnd = props.dataOfResource.isOverDay ? 'YYYY/MM/DD HH:mm' : 'HH:mm';
    if (props.dataOfResource.isOverDay && CalenderViewCommon.compareDateByDay(moment(props.dataOfResource.startDateSortMoment), moment(props.dataOfResource.startDateMoment)) === 0) {
        sFormatStart = 'HH:mm';
    }
    if (props.dataOfResource.isOverDay && CalenderViewCommon.compareDateByDay(moment(props.dataOfResource.startDateSortMoment), moment(props.dataOfResource.finishDateMoment)) === 0) {
        sFormatEnd = 'HH:mm';
    }

    return (
        <RenderResource
            prefixKey={'_' + 'item-Resource-view-more'}
            key={'_' + props.dataOfResource.uniqueId}
            dataOfResource={props.dataOfResource}
            isShowStart={true}
            isShowEnd={true}
            formatStart={sFormatStart}
            formatEnd={sFormatEnd}
        />
    )
})