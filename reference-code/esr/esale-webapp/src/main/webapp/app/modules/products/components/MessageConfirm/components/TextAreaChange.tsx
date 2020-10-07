import React, { useRef, useState, useEffect } from 'react';
import ArrowChange from './ArrowChange';
import ShowMoreText from 'react-show-more-text';
import { blankText } from '../constants';
import { translate } from 'react-jhipster';
import { convertTextArea } from '../util';

const TextAreaChange = ({ fieldLabel, old, new: newValue }) => {
  const [widthNewData, setWidthNewData] = useState<number>(0)
  const [widthOldData, setWidthOldData] = useState<number>(0)

  const refWrap = useRef(null)
  const newContentRef = useRef(null)
  const oldContentRef = useRef(null)

  useEffect(() => {
    const content = newContentRef.current?.textContent
    if(content && content.includes(" ")){
      setWidthNewData(0)
    } else {
      const getWidth = refWrap.current?.clientWidth
      getWidth && setWidthNewData(getWidth * 4 -50)
    }
    
  },[newValue])

  useEffect(() => {
    const content = oldContentRef.current?.textContent
    if(content && content.includes(" ")){
      setWidthOldData(0)
    } else {
      const getWidth = refWrap.current?.clientWidth
      getWidth && setWidthOldData(getWidth * 4 -50)
    }
    
  },[old])


  return (
    <>
    <div>{fieldLabel}：</div>
    <div className="ml-3" ref={refWrap}>
      <ShowMoreText
        lines={4}
        more={
          <a title="" className="text-blue">
            {translate("history.read-more")}
          </a>
        }
        less={<a title="" className="text-blue">{translate("history.collapse")}</a>}
        anchorClass=""
        expanded={false}
        width={widthOldData}
      >
        <div ref={newContentRef}>

        <div   dangerouslySetInnerHTML={{__html: convertTextArea(old) || blankText()}}  />
        </div>

      </ShowMoreText>
      <ArrowChange />
      <ShowMoreText
        lines={4}
        more={
          <a title="" className="text-blue">
            {translate("history.read-more")}
          </a>
        }
        less={<a title="" className="text-blue">{translate("history.collapse")}</a>}
        anchorClass=""
        expanded={false}
        width={widthNewData}
      >
        <div ref={newContentRef}>
           <div  dangerouslySetInnerHTML={{__html: convertTextArea(newValue) || blankText()}}  />
        </div>
      </ShowMoreText>
    </div>
    </>
  );
};

export default TextAreaChange;
