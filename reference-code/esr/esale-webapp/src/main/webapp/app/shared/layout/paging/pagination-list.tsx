import React, { useState, useRef } from 'react';
import { translate } from 'react-jhipster';
import { RECORD_PER_PAGE_OPTIONS } from 'app/shared/util/pagination.constants';
import useEventListener from 'app/shared/util/use-event-listener';
import Tooltip from '../common/Tooltip';

export interface IPaginationListProps {
  offset: number,
  limit: number,
  totalRecords: number,
  onPageChange,
}

const PaginationList = (props: IPaginationListProps) => {
  // const [limit, setLimit] = useState( /* RECORD_PER_PAGE_OPTIONS[1] */ props.limit);

  const offsetDown = props.offset + 1;
  const [isShowPaging, setIsShowPaging] = useState(false);
  const [tooltipStyle, setTooltipStyle] = useState({});
  const pagingRef = useRef(null);
  const nextPageRef = useRef(null);

  let offsetUp = parseInt(props.offset.toString(), 0) + parseInt(props.limit.toString(), 0);
  if (offsetUp > props.totalRecords) {
    offsetUp = props.totalRecords;
  }

  const gotoPrevPage = () => {
    let prevOffset = parseInt(props.offset.toString(), 0) - parseInt(props.limit.toString(), 0);
    if (prevOffset < 0) {
      prevOffset = 0;
    }
    props.onPageChange(prevOffset, props.limit);
  };

  const gotoNextPage = () => {
    props.onPageChange(parseInt(props.offset.toString(), 0) + parseInt(props.limit.toString(), 0), props.limit);
  };

  const changeRecordPerPage = (item) => {
    setIsShowPaging(!isShowPaging);
    props.onPageChange(0, parseInt(item, 0));
  }

  /**
   * Get style of nextPageIcon
   */
  const getStyle = () => {
    const style = {};
    if (!nextPageRef.current) {
      return;
    }
    const itemPosition = nextPageRef.current.getBoundingClientRect();
    if (itemPosition) {
      style['position'] = 'fixed';
      style['top'] = itemPosition.y + itemPosition.height + 4;
      style['left'] = itemPosition.x + (itemPosition.width / 2);
    }
    setTooltipStyle(style);
  }

  const handleClickOutsideTooltip = (event) => {
    if (pagingRef && pagingRef.current && !pagingRef.current.contains(event.target)) {
      setIsShowPaging(false);
    }
  }

  useEventListener('mousedown', handleClickOutsideTooltip);

  return (
    <>
      <div className="esr-pagination" style={{ zIndex: 99 }}>
        <div className="drop-select-down" ref={pagingRef}>
          <a title="" className={(isShowPaging ? "active" : "") + " button-pull-down-small m-auto"}
            onClick={() => setIsShowPaging(!isShowPaging)}>{props.limit} {translate("global.label.record-on-page")}</a>
          {isShowPaging &&
            <div className="box-select-option">
              <ul>
                {RECORD_PER_PAGE_OPTIONS.map((item, index) =>
                  <li key={index} onClick={e => changeRecordPerPage(item)}><a className="ml-0" title="">{item} {translate("global.label.record-on-page")}</a></li>
                )}
              </ul>
            </div>
          }
        </div>
        <span className="text">{translate("global.label.record-currentpage", { offsetDown, offsetUp, totalRecords: props.totalRecords })}</span>
        {((props.totalRecords > props.limit) || (props.totalRecords <= props.limit && props.offset > 1)) &&
          <>
            {props.offset === 0 && <a className="icon-small-primary icon-prev disable">
              <Tooltip text={translate('global.button.prev-page')} />
            </a>
            }
            {props.offset > 0 && <a className="icon-small-primary icon-prev" onClick={gotoPrevPage}><Tooltip text={translate('global.button.prev-page')} /></a>}
            {offsetUp >= props.totalRecords &&
              <a ref={nextPageRef} onMouseOver={() => getStyle()} className="icon-small-primary icon-next disable">
                <Tooltip style={tooltipStyle} text={translate('global.button.next-page')} />
              </a>}
            {offsetUp < props.totalRecords &&
              <a ref={nextPageRef} onMouseOver={() => getStyle()} className="icon-small-primary icon-next" onClick={gotoNextPage}>
                <Tooltip style={tooltipStyle} text={translate('global.button.next-page')} />
              </a>}
          </>
        }
      </div>
    </>
  );
};

export default PaginationList;
