import React, { useEffect, useRef, useState } from 'react'
import { translate } from 'react-jhipster'
import { TimelinesType } from '../../models/get-user-timelines-type';
import TimelineContentCommentAuto from './timeline-content-comment-auto';
import { ObjectDetail } from '../../models/get-followeds-model';

type ITimelineContentCommentProp = {
  // data
  data?: string
  // create quote when hightlight
  onCreateQuote?: (text) => void
  // check
  isHighlight: boolean,
  textLabel?: string,
  isPermission?: boolean,
  // param for timeline auto
  isTimelineAuto?: boolean,
  timelinePostData?: TimelinesType
  getAllDataQuote?: (content: string) => void
  openObjectDetail?: (objectValue: ObjectDetail) => void
}


const TimelineContentComment = (props: ITimelineContentCommentProp) => {

  const textRef = useRef<HTMLSpanElement>(null);
  const divElement = useRef<HTMLDivElement>(null);
  const btnQuote = useRef<HTMLButtonElement>(null);
  const [isShowButtonDefault, setIsShowButtonDefault] = useState(false);
  const [isFullText, setIsFullText] = useState(false);
  const [isShowContext, setIsShowContext] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });


  const showLink = (text: string) => {
      if (text) {
      const regex1  = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gim;
      const regex2  = /[\w.+]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,9})+/gim;
      text = text.replace(regex1, (match :string) => {
        return `<a target="_blank" href="${match}">${match}</a>`;
      });
      text = text.replace(regex2, (match :string) => {
        return `<a  href="mailto:${match}">${match}</a>`;
      });
    }
    return text;
  }
  useEffect(() => {
    // on change text => effect display
    if (textRef.current && !props.isTimelineAuto) {
      textRef.current.innerHTML = showLink(props.data)
    }
    if (!isShowButtonDefault && textRef?.current?.clientHeight > divElement?.current?.clientHeight && props.data) {
      setIsShowButtonDefault(true)
    } else {
      setIsShowButtonDefault(false)
    }
    // for data auto
    if(props.getAllDataQuote){
      props.getAllDataQuote(textRef.current.innerHTML);
    }
    // 
  }, [props.data]);
  // check if is show full data
  const onFullTextChange = (newState) => {
    setIsFullText(newState)
  }
  // get value selected text
  const getSelectedText = () => {
    const selObj = window.getSelection()
    return selObj?.toString()
  }
  let timeoutOnMouseUp = null;

  // event onMountUp
  const onMouseUp = (event) => {
    if (!props.isPermission) {
      const dimensions = divElement.current.getBoundingClientRect();
      const positions = { left: event.clientX - dimensions.x, top: event.clientY - dimensions.y };
      if (timeoutOnMouseUp) clearTimeout(timeoutOnMouseUp);
      timeoutOnMouseUp = setTimeout(() => {
        setIsShowContext(false)
        const selectedText = getSelectedText()
        if (selectedText == null || selectedText.trim() === '') {
          return;
        }
        setIsShowContext(true)
        setTimeout(() => {
          btnQuote.current.focus();
        }, 100);

        setPosition(positions)
      }, 200)
    }

  }
  // click create quote
  const onClickCreateQuote = () => {
    const selectedText = getSelectedText()
    if (selectedText == null || selectedText.trim() === '') {
      return;
    }
    props.onCreateQuote(selectedText);
    setIsShowContext(false)
  }

  return (
    <div className={`content-context-menu-wrap text-left ${isShowContext ? "show-context" : ""}`}>
      <div ref={divElement} className={`content-wrap-parent ${isFullText ? "full-text" : "has-more"}`}  onMouseUp={onMouseUp}>
        <span className="timeline-content work-break" ref={textRef}>
          {props.isTimelineAuto && <TimelineContentCommentAuto openDetail={props.openObjectDetail} timelinePost={props.timelinePostData} contentAuto={props.data}/>}
        </span>
      </div>
      {isShowContext && props.isHighlight &&
        <ul className="context-menu-list" style={{ top: position.top, left: position.left }} >
          <li>
            <button onClick={onClickCreateQuote}  ref={btnQuote} onBlur={()=> {setIsShowContext(false)}} type="button"
            className="button-shadow-add button-shadow-timeline check-forcus">
              {translate('timeline.control.local-tool.part-of-quote')}
            </button>
            </li>
        </ul>
      }
      {/* show button read more content */}
      {isShowButtonDefault &&
        <div className="more-info pt-2 pb-2">
          <button type="button" className="button-primary button-border button-more-info" onClick={() => { onFullTextChange(!isFullText) }}>
            {props.textLabel || translate('timeline.list.btn-show-comment')}
          </button>
        </div>
      }
    </div>
  );
}

export default TimelineContentComment
