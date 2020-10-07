import React from 'react';

export interface IResultSingleBusinessCardProps {
    tags: any;
    onRemoveTag: any;
    isShowOnList
}

const ResultSingleBusinessCard = (props: IResultSingleBusinessCardProps) => {
    return (
        <>
            {props.tags && props.tags.length > 0 &&
                <div className={`wrap-tag ${props.isShowOnList ? "" : "text-ellipsis"} `}>
                    <div className="tag">{props.tags[0].businessCardName} {props.tags[0].position}<button className="close" onClick={() => props.onRemoveTag(0)}>×</button></div>
                    <div className="drop-down h-auto w100">
                        <ul className="dropdown-item">
                            <li className="item smooth">
                                <div className="text text1 font-size-12">{props.tags[0].customerName} {props.tags[0].departmentName}</div>
                                <div className="text text2">{props.tags[0].businessCardName} {props.tags[0].position}</div>
                            </li>
                        </ul>
                    </div>
                </div>
            }
        </>
    )
}

export default ResultSingleBusinessCard;