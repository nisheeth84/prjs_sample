import React, { useState, useEffect, CSSProperties } from 'react';
import _ from 'lodash';

interface IProps {
  text?: string;
  x?: number;
  y?: number;
  className?: string;
  renderProps?: ({ onMouseEnter, onMouseLeave, style, renderPopover }) => any;
  isGetOffsetOfChild?: boolean;
  canShow?: boolean;
  whiteSpaceNormal?: boolean;
  getPopover?: (popover: any) => any
}
const Popover: React.FC<IProps> = ({ children, text, x = 0, y = 0, className, renderProps, isGetOffsetOfChild, whiteSpaceNormal, canShow = true, getPopover }) => {
  const [innerText, setInnerText] = useState("");
  const [showPopover, setShowPopover] = useState<boolean>(false);
  const [{ X, Y }, setXY] = useState({ X: 0, Y: 0 });
  const [offset, setOffset] = useState<any>({});

  const getTextOfChild = (chil: any) => {
    if (chil?.props) {
      return chil.props.text || getTextOfChild(chil.props.children);
    }
    return chil;
  };

  // get tooltip FileName

  const getTextFile = (chil) => {
    const arrChil = []
    chil.forEach((item) => {
      if (item?.props) {
        arrChil.push(getTextOfChild(item.props.children[0]));
      }
    })
    return arrChil
  }

  const isOverTextHeight = () => {
    const textY = getTextOfChild(children);
    try {
      if (!_.isEmpty(textY) && textY.split(/[\n\r]/g).length > 5) {
        return true;
      }
    } catch (e) {     
      return false; 
    }
    return false;
  }

  const getOffsetOfChild = event => {
    const { scrollWidth, offsetWidth } = event.target;
    setOffset({ scrollWidth, offsetWidth });
  };

  const isEllipsisActive= (e) => {
    if (_.lowerCase(e.tagName) === "a" && _.lowerCase(_.get(e, 'parentElement.tagName')) === "div") {
      return _.get(e, 'parentElement.offsetWidth') < _.get(e, 'parentElement.scrollWidth');
    }
    return false;
  }

  const handleShowPopover = event => {
    if (event.target.parentElement && event.target.parentElement.innerText && !_.isEqual(innerText, event.target.parentElement.innerText)) {
      setInnerText(event.target.parentElement.innerText);
    }
    const { scrollWidth: scrollWidthEvent, offsetWidth: offsetWidthEvent } = event.target;
    const { scrollWidth: scrollWidthSpan, offsetWidth: offsetWidthSpan } = offset;
    // const { scrollWidth, offsetWidth } = isGetOffsetOfChild ? offset : event.target;
    const scrollWidth = (isGetOffsetOfChild ? scrollWidthSpan : scrollWidthEvent) || scrollWidthEvent;
    const offsetWidth = (isGetOffsetOfChild ? offsetWidthSpan : offsetWidthEvent) || offsetWidthEvent;
    if (scrollWidth > offsetWidth || isOverTextHeight() || isEllipsisActive(event.target)) {
      setShowPopover(true);
      setXY({ X: event.target.getBoundingClientRect().x, Y: event.target.getBoundingClientRect().y });
    }
  };

  const handleHidePopOver = () => {
    setShowPopover(false);
  };

  const renderPopover = () => {
    // store array of content containing break line items
    const arrContent = [];
    const positionY = Y + y < window.innerHeight - y - 20 ? Y + y : Y - y - 20;
    const positionX = X + x < window.innerWidth - 200 ? X + x : X - 100;
    let tooltipContent = text || innerText || getTextOfChild(children);
    if (_.isArray(tooltipContent) && _.isObject(tooltipContent[0])) { // show tooltip FileName
      tooltipContent = getTextFile(tooltipContent);
    }
    // split content and push <p> tag to display
    const tmp = tooltipContent ? tooltipContent.toString().split(/[\n\r]/g) : '';
    if (tmp.length > 0) {
      tmp.map(e => {
        arrContent.push(<p>{e}</p>);
      })
    }
    const style: CSSProperties = showPopover && canShow && (arrContent.length > 0 || tooltipContent)
      ? {
        position: 'fixed',
        top: positionY,
        left: positionX,
        backgroundColor: '#fff',
        zIndex: 100000,
        boxShadow: '0 5px 15px 0 #b0afaf',
        borderRadius: 10,
        padding: 10,
        width: "auto",
        // flexWrap:'wrap',
        // maxWidth:500,
        height: "auto"
      }
      : { display: 'none' };
    return <div className={className} style={style}><div style={{ maxWidth: 300, whiteSpace: 'normal' }}>{arrContent || tooltipContent}</div></div>;
  };
  useEffect(() => {
    getPopover && getPopover(showPopover ? renderPopover() : null)
  }, [showPopover])


  const wrapperStyle: CSSProperties = { overflow: 'hidden', whiteSpace: whiteSpaceNormal ? 'normal' : 'nowrap', textOverflow: 'ellipsis',  wordBreak: 'break-all' };
  const wrapperProps = {
    onMouseLeave: handleHidePopOver,
    onMouseEnter: handleShowPopover,
    style: wrapperStyle
  };

  return renderProps ? (
    renderProps({ ...wrapperProps, renderPopover })
  ) : (
      <div {...wrapperProps}>
        {isGetOffsetOfChild ? <span onMouseEnter={getOffsetOfChild}>{children}</span> : children}
        {/* <span onMouseEnter={getOffsetOfChild}>{children}</span> */}
        {renderPopover()}
      </div>
    );
};

export default Popover;
