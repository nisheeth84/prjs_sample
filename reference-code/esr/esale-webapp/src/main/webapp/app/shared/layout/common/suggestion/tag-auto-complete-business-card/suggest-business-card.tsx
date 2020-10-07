import React from 'react';

export interface ISuggestBusinessCardProps {
  businessCardInfo: any;
  tags: any;
  selectElementSuggest: any;
}

const SuggestBusinessCard = (props: ISuggestBusinessCardProps) => {

  const businessCardInfo = props.businessCardInfo;
  const tags = props.tags;
  if (businessCardInfo.businessCardId) {
    const isActive = tags.filter(e => e.businessCardId === businessCardInfo.businessCardId).length > 0;
    return (
      <div className={`item ${isActive ? "active" : ""} smooth`} onClick={() => { if (!isActive) { props.selectElementSuggest(businessCardInfo) } }}>
        <div className="text text1 font-size-12 text-ellipsis">{businessCardInfo.customerName || businessCardInfo.alternativeCustomerName} {businessCardInfo.departmentName}</div>
        <div className="text text2 text-ellipsis">{businessCardInfo.businessCardName} {businessCardInfo.position}</div>
      </div>
    );
  }
  return (<></>);
}
export default SuggestBusinessCard;
