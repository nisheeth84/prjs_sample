import React from 'react';

export interface IResultMultiBusinessCardProps {
    tags: any;
    onRemoveTag: any;
}

const ResultMultiBusinessCard = (props: IResultMultiBusinessCardProps) => {
    return (
        <div className="chose-many">
            {props.tags && props.tags.map((businessCard, idx) =>
                <div key={idx} className="w48 position-relative">
                    <div className="drop-down w100 h-auto">
                        <ul className="dropdown-item">
                            <li className="item smooth">
                                <div className="text text1 font-size-12 text-ellipsis">{businessCard.customerName} {businessCard.departmentName}</div>
                                <div className="text text2 text-ellipsis">{businessCard.businessCardName} {businessCard.position}</div>                               
                                <button className="close" onClick={() => props.onRemoveTag(idx)}>×</button>
                            </li>
                        </ul>
                    </div>
                    <div className="drop-down child">
                        <ul className="dropdown-item">
                            <li className="item smooth">
                                <div className="text text1 font-size-12">{businessCard.customerName} {businessCard.departmentName}</div>
                                <div className="text text2">{businessCard.businessCardName} {businessCard.position}</div>
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ResultMultiBusinessCard;