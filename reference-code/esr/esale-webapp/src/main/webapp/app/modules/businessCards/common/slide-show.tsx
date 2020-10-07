import React, { useState, useEffect } from 'react';
import { TAB_ID_LIST } from 'app/modules/businessCards/constants';

export interface ISlideShow {
  lstImage?
  currentId?: number
  setCurrentBusinessCardId?
  setShowSlideImage?
}

const SlideShow = (props: ISlideShow) => {
  const getCurrentImage = () => {
    if (props.currentId) {
      return props.lstImage.find(item => item.imageId === props.currentId);
    } else {
      return props.lstImage[0];
    }
  }

  const [currentImage, setCurrentImage] = useState(getCurrentImage());
  const [isShowNext, setIsShowNext] = useState(false);
  const [isShowPrev, setIsShowPrev] = useState(false);

  const getCurrentIndex = () => {
    let index = null;
    props.lstImage.forEach((img, i) => {
      if (currentImage.imageId === img.imageId) {
        index = i;
      }
    });
    return index
  }

  useEffect(() => {
    const currentIndex = getCurrentIndex();

    if (props.lstImage[currentIndex + 1]) {
      setIsShowNext(true);
    } else {
      setIsShowNext(false);
    }

    if (props.lstImage[currentIndex - 1]) {
      setIsShowPrev(true);
    } else {
      setIsShowPrev(false);
    }
  }, [currentImage])

  const onNextImage = () => {
    const currentIndex = getCurrentIndex();
    const img = props.lstImage[currentIndex + 1];
    if (img) {
      setCurrentImage(img)
      if (props.setCurrentBusinessCardId) {
        props.setCurrentBusinessCardId(img.imageId)
      }
    }
  }

  const onPrevImage = () => {
    const currentIndex = getCurrentIndex();
    const img = props.lstImage[currentIndex - 1];
    if (img) {
      setCurrentImage(img)
      if (props.setCurrentBusinessCardId) {
        props.setCurrentBusinessCardId(img.imageId)
      }
    }
  }

  return (
    // popup card
    <>
      <div className="popup-card-slider background-transparent" id="popup-esr2">
        <div className="item no-padding text-center">
          <img src={currentImage.imagePath} alt="" />
        </div>
        <div className="control">
          {isShowNext && <a title="" className="button next" onClick={onNextImage}></a>}
          {isShowPrev && <a title="" className="button prev" onClick={onPrevImage}></a>}
        </div>
      </div>
      <div className="modal-backdrop show"><button className="close" onClick={() => { props.setShowSlideImage(false) }}>×</button></div>
    </>
    // end popup
  )
}

export default SlideShow;