import React, { useState, useEffect } from 'react'
import { IRootState } from 'app/shared/reducers'
import { connect } from 'react-redux'
import { AttachedFilesType } from '../models/get-attached-files-model'
import { TimelineFileItem } from './timeline-file-item'
import { handleToggleListAttachedFile, handleGetAttachedFilesScroll, handleClearCacheListAttachedFiles } from '../timeline-reducer'
import { translate } from 'react-jhipster';
import { LIMIT_ATTACHED_FILE } from '../common/constants'

export interface ITimelineListAttachedFileProp extends StateProps, DispatchProps {
}

export const TimelineListAttachedFile = (props: ITimelineListAttachedFileProp) => {
    const [currentPage, setCurrentPage] = useState(0);
    /**
     * clear cache when destroy component
     */
    useEffect(() => {
        return () => {
            props.handleClearCacheListAttachedFiles();
            props.handleToggleListAttachedFile(false);
        } 
    }, [])

    /**
     * handle scroll
     */
    const handleScroll = (e) => {
        const element = e.target;
            if (props.listAttachedFiles && element.scrollTop > 0 && (element.scrollTop + element.offsetHeight) >= element.scrollHeight) {
                const nextPage = currentPage + 1;
                setCurrentPage(nextPage);
                props.handleGetAttachedFilesScroll({ ...props.timelineFormSearch, limit: LIMIT_ATTACHED_FILE, offset: nextPage * LIMIT_ATTACHED_FILE });
        }
    }

    /**
    * reset page number when search again
    */
    useEffect(() => {
        setCurrentPage(0)
    }, [props.resetPageNumberAttached])

    return (
        <div className="wrap-timeline-sidebar">
            <div className="wrap-timeline-scroll style-3" onScroll={handleScroll}>
                <button onClick={() => { props.handleToggleListAttachedFile(false); }}
                    className="close">×</button>
                <div className="timeline-sidebar-content">
                    <div className="title color-000">{translate('timeline.sidebar-list-attached-file.title')}</div>
                    <div className="list-files">
                        {props.listAttachedFiles && props.listAttachedFiles.map((item: AttachedFilesType, index: number) => {
                            return (
                                <TimelineFileItem data={item} key={index} />
                            )
                        })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = ({ timelineReducerState }: IRootState) => ({
    listAttachedFiles: timelineReducerState.listAttachedFiles,
    timelineFormSearch: timelineReducerState.getTimelineFormSearch,
    canScrollAttachedTimeline: timelineReducerState.canScrollAttachedTimeline,
    resetPageNumberAttached: timelineReducerState.resetPageNumberAttached
});

const mapDispatchToProps = {
    handleToggleListAttachedFile,
    handleGetAttachedFilesScroll,
    handleClearCacheListAttachedFiles
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TimelineListAttachedFile);
