import React from 'react'

type ITimelineShowImageProp = {
  onClose: () => void
  // 
  imageUrl: string
}

const TimelineShowImage = (props: ITimelineShowImageProp) => {
  return (
    <>
      {/* popup */}
  <div className="popup-esr2 min-height-auto no-border w-auto overflow-normal" id="popup-esr2">
    <div className="img-file timeline-image-file-small">
      <img src={props.imageUrl}  />
    </div>
    <div className="ic-close-img">
      <img src="../../../content/images/timeline/ic-close-img.svg" onClick ={props.onClose} />
    </div>
  </div>
  <div className="modal-backdrop show" />
    </>
  );
}

export default TimelineShowImage;
