import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react'
import { IRootState } from 'app/shared/reducers'
import { connect, Options } from 'react-redux'
import { CommonUtil } from '../../common/CommonUtil'
type ITimelineTextarea = {
  className?: string
  onChange?: (text: string) => void
  value?: string
  placeholder?: string
  textFormat?: string[]
  isShowToolFormat?: boolean
  autoFocus?: boolean
  messRequire?: string
  onClearMess?: () => void
  classCheckFile?: string
  checkValueText?: (text) => void
  onFocus: () => void
  onBlur: () => void
}

const TimelineTextarea = forwardRef((props: ITimelineTextarea & StateProps & DispatchProps, ref) => {
  const timelineTextareaElement = useRef<HTMLDivElement>(null)
  const timelineTextareaInnerElement = useRef<HTMLDivElement>(null)
  const [isShowPlaceholder, setIsShowPlaceholder] = useState(true)
  const [range, setRange] = useState<Range>(null)
  /** check show place holder */
  useEffect(() => 
    {setIsShowPlaceholder(timelineTextareaInnerElement?.current?.innerHTML == null 
    || timelineTextareaInnerElement?.current?.innerHTML?.trim() === ''
    || timelineTextareaInnerElement?.current?.textContent.length === 0 )
    }
    , [timelineTextareaInnerElement?.current?.innerHTML])

  // default load component check is show placeholder
  useEffect(() => {
    setIsShowPlaceholder(!(props.value != null && props.value !== ''))
  }, [props.value])

    /**
   * handle create timeline post
   */
  useEffect(()=>{
    if(props.timelineIdPostCreated > 0 ) {
      timelineTextareaInnerElement.current.innerHTML = ""
      setIsShowPlaceholder(true);
    }
  },[props.timelineIdPostCreated])

  // check auto focus or not
  useEffect(() => {
    if(props.autoFocus) {
      timelineTextareaElement.current.focus()
      timelineTextareaInnerElement.current.focus()
    }
  }, [])


  /** emit change content by invoke onChange, check show placeholder */
  const emitChange = () => {

    if (props.onChange) {
      props.onChange(timelineTextareaInnerElement.current.innerHTML)
    }
  }
  /** before paste data/ remove html tag */
  const onPasteHtmlData = (evt) => {
    evt.preventDefault();
    let text = ''
    if (evt.clipboardData || evt.originalEvent.clipboardData) {
      text = (evt.originalEvent || evt).clipboardData.getData('text/plain')

    }
    if (document.queryCommandSupported('insertHTML')) {
      if (text) {
        text = CommonUtil.escapeHtml(text)
        text = text.replace(/\n/g, '<br/>')
      }
      document.execCommand('insertHTML', false, text)
    } else {
      document.execCommand('paste', false, text)
    }
    emitChange()
  }

  const createSelection = () => {
    if (range) {
      document.getSelection().removeAllRanges()
      document.getSelection().addRange(range)
    }
  }

  const tbclick = (action) => {
    createSelection()
    document.execCommand(action, false, null)
  }

  useEffect(() => {
    props?.textFormat?.forEach(action => tbclick(action))
  }, [props.textFormat])

  const saveRangeEvent = () => {
    const selection = window.getSelection()
    if (selection.rangeCount > 0) {
      setRange(selection.getRangeAt(0))
    } else {
      setRange(null)
    }
  }

  /**
   * reference function
  */
  useImperativeHandle(ref, () => ({
    isEmptyForm() {
      if(timelineTextareaInnerElement.current.textContent.trim().length === 0){
        return true;
      } else {
        return false;
      }
    }
  }));


  return (
    <>
      <div ref={timelineTextareaElement} className={`${props.className} timeline-textarea text-left ${props.classCheckFile}`} 
           onBlur={() => {if(props.checkValueText) props.checkValueText(timelineTextareaInnerElement.current.textContent) } }
           onClick={() => {timelineTextareaInnerElement.current.focus(); if(props.onClearMess) props.onClearMess()}}>
        <div className="timeline-textarea-inner"
          contentEditable={true}
          ref={timelineTextareaInnerElement}
          dangerouslySetInnerHTML={{ __html: props.value }}
          onPaste={() => onPasteHtmlData(event)}
          onInput={() => emitChange()}
          onSelect={() => saveRangeEvent()}
          onFocus={props.onFocus}
          onBlur={props.onBlur}
        ></div>
        {isShowPlaceholder && <span className="timeline-textarea-placeholder">{props.placeholder}</span>}
        { props.messRequire
          && <span className="messenger-error fs-12">{props.messRequire}</span>}
      </div>
    </>
  );
})
const mapStateToProps = ({ timelineReducerState }: IRootState) => ({
  localNavigation: timelineReducerState.localNavigation,
  formSearchTimeline: timelineReducerState.getTimelineFormSearch,
  timelineIdCreated: timelineReducerState.timelineIdCreated,
  timelineIdPostCreated: timelineReducerState.timelineIdPostCreated,
  timelineIdExtPostCreated: timelineReducerState.timelineIdExtPostCreated
});

const mapDispatchToProps = {
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

const options = { forwardRef: true };
export default connect<StateProps, DispatchProps, ITimelineTextarea>(
  mapStateToProps,
  mapDispatchToProps,
  null,
  options as Options
)(TimelineTextarea);
