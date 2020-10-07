import React, { useState, useEffect } from 'react';
import { CATEGORIES, LIMIT_CURRENT_CATEGORY_ITEM, SUGGEST_ITEM_LIMIT } from './constant';
import './help.scss';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { translate } from 'react-jhipster';
import {
  getWordPressServiceDataBySearchQuery,
  getWordPressServiceDataByCategory,
  getWordPressServiceDataBySearchQueryLazyLoad,
  setCurrentCategory
} from './help.reducer';
import { v4 as uuidv4 } from 'uuid';
import Draggable from 'react-draggable';

export interface IHelpPopupProps extends StateProps, DispatchProps {
  dismissDialog: () => void;
  currentCategoryId: any;
}

export const HelpPopup = (props: IHelpPopupProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  // const [offset, setOffset] = useState(0);
  const [oldSearchValue, setOldSearchValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [enableIframe, setEnableIframe] = useState(false);
  const [enableSuggest, setEnableSuggest] = useState(false);
  const [currentDetailContent, setCurrentDetailContent] = useState(<div></div>);
  const [isScrollToBottom, setIsScrollToBottom] = useState(false);
  const [, setBlankUrl] = useState('');


  const searchPost = (type = false, setOldValueAfterSubmit = false) => {
    const search = searchValue.trim();
    if (!!search && oldSearchValue !== search) {
      props.getWordPressServiceDataBySearchQuery(type, {
        search: search.trim(),
        offset: currentPage * 10
      })
      if (setOldValueAfterSubmit) setOldSearchValue(search);
    }
  }

  useEffect(() => {
    const currentCategory = props.currentCategoryId || 1;
    props.setCurrentCategory(currentCategory);
    props.getWordPressServiceDataByCategory({ categories: currentCategory });
  }, []);

  useEffect(() => {
    if (typeof currentDetailContent === 'string') {
      setEnableIframe(true);
    }
  }, [currentDetailContent])

  // useEffect(() => {
  // setEnableSuggest(!!searchValue);
  // searchPost(true);
  // }, [searchValue])

  useEffect(() => {
    if (isScrollToBottom && !props.disableLazyLoad) {

      props.getWordPressServiceDataBySearchQueryLazyLoad(
        {
          search: searchValue.trim(),
          offset: (currentPage + 1) * 10,
          perPage: currentPage + 1
        })
      setCurrentPage(currentPage + 1);
      setOldSearchValue('');
    }
  }, [isScrollToBottom])

  const handleBlur = () => {
    setEnableSuggest(false);
  }

  const handleSearchClick = (e) => {
    e.preventDefault();
    setEnableSuggest(false)
    searchPost(false, true);
  }

  const backToPostList = () => {
    setEnableIframe(false);
  }

  const getIcon = (postItem) => {
    const index = parseInt(postItem.categories && postItem.categories[0] || 2, 10)
    return (CATEGORIES[index] && CATEGORIES[index]['icon']) || 'ic-sidebar-calendar.svg';
  }

  const getPostDetail = (postItem) => {
    setSearchValue(postItem.title.rendered);
    setBlankUrl(postItem.link);
    setEnableIframe(true);
    setEnableSuggest(false);
    setCurrentDetailContent(postItem.content.rendered);
  }

  const renderEmptyPost = (type?) => {
    return (
      <li className="item smooth">
        <a title="" className={`link-item ${type && 'text-blue'}`}>
          <span className="icon mr-3">
            {translate('messages.INF_COM_0013')}
          </span>
        </a>
      </li>
    );
  }

  const renderPostList = (withCurrentCategory = false) => {
    if (props.helpPosts) {
      return props.helpPosts.map((item, index) => {
        const condition = withCurrentCategory ?
          item.categories && item.categories.indexOf(props.currentCategory) !== -1 && index < LIMIT_CURRENT_CATEGORY_ITEM
          : item.categories && item.categories.indexOf(props.currentCategory) === -1

        if (condition) {
          const key = uuidv4();
          const title = (item.title && item.title.rendered) || '';
          const categories = `/content/images/${getIcon(item)}`;

          return (
            <li key={key} className="item smooth" onClick={() => getPostDetail(item)}>
              <a title="" className="link-item text-blue">
                <span className="icon mr-3">
                  <img
                    src={categories}
                    alt={title}
                    title={title} /></span>{title}
              </a>
            </li>
          );
        }
      })
    } else {
      return false;
    }
  }

  const setHTMLCurrentDetailContent = (): any => {
    return { __html: currentDetailContent }
  }

  const handleOnScroll = (e) => {
    setIsScrollToBottom(e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight);
  }

  const handleChange = (e) => {
    setSearchValue(e.target.value);
    setEnableSuggest(!!searchValue);
    searchPost(true);
  }

  const renderSuggest = (withCurrentCategory = false) => {
    if (props.suggestPosts) {
      return props.suggestPosts.map((item, index) => {
        const condition = withCurrentCategory ?
          item.categories && item.categories.indexOf(props.currentCategory) !== -1
          : item.categories && item.categories.indexOf(props.currentCategory) === -1

        if (condition && index < SUGGEST_ITEM_LIMIT) {
          const key = uuidv4();
          const title = (item.title && item.title.rendered) || '';
          const categories = `/content/images/${getIcon(item)}`;

          return (
            <li key={key} className="item smooth" onMouseDown={() => getPostDetail(item)}>
              <a title="" className="link-item">
                <span className="icon mr-3">
                  <img src={categories} alt={title} title={title} />
                </span>{title}
              </a>
            </li>
          );
        }
      })
    } else {
      return false;
    }
  }

  const renderCompactedPost = () => {
    if (!props.helpPosts || props.helpPosts.length === 0) {
      return renderEmptyPost(true);
    }

    return (
      <>
        {renderPostList(true)}
        {renderPostList()}
      </>
    )
  }

  const renderCompactedSuggest = () => {
    console.log(renderSuggest());

    if (!props.suggestPosts || props.suggestPosts.length === 0) {
      return renderEmptyPost(false);
    }

    return (
      <>
        {renderSuggest(true)}
        {renderSuggest()}
      </>
    )
  }

  return (
    <>
      <Draggable handle="header">
        <div className="wrap-help help-zIndex">
          <div className="popup-esr3 popup-help" id="popup-esr2">
            <div className="popup-esr2-content">
              <div className="modal-header">
                <div className="left w100">
                  <header>
                    <a
                      title=""
                      className="icon-small-primary icon-help-small ml-0 mr-1"
                      onClick={backToPostList}
                    >
                    </a>
                    <span className="text">{translate('helps.title')} </span>
                  </header>
                </div>
                <div className="right">
                  <a
                    title=""
                    className="icon-small-primary icon-close-up-small" onClick={props.dismissDialog}
                  ></a>
                </div>
              </div>
              <div className="popup-esr2-body p-0 style-3">
                <form data-active="">
                  <div className="form-group help-search mb-0">
                    <div className="search-box-no-button-style">
                      <button onClick={handleSearchClick} className="icon-search">
                        <i className="far fa-search"></i>
                      </button>
                      <input autoFocus value={searchValue} onChange={handleChange} onBlur={handleBlur} type="text" placeholder={translate('helps.placeholder')} />
                    </div>
                    {enableSuggest && <ul className="drop-down">{renderCompactedSuggest()}</ul>}
                  </div>
                  {
                    !enableIframe
                      ? <ul onScroll={handleOnScroll} className="suggest-item style-3">{renderCompactedPost()}</ul>
                      : <ul className="suggest-item detail-post style-3"
                        dangerouslySetInnerHTML={setHTMLCurrentDetailContent()}></ul>
                  }
                </form>
              </div>
              <div className="popup-esr2-footer">
                <div className="left">{translate('helps.tittle-footer')}</div>
                <div className="right">
                  <a title="" target="_blank" rel="noopener noreferrer" href="https://sb-dev-helpsite.ms2-dev.com" className="icon-small-primary icon-link-small"></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Draggable>
    </>
  )
}

const mapStateToProps = ({ helpModal }: IRootState) => ({
  helpPosts: helpModal.helpPosts,
  suggestPosts: helpModal.suggestPosts,
  currentCategory: helpModal.currentCategory,
  disableLazyLoad: helpModal.disableLazyLoad,
});

const mapDispatchToProps = {
  getWordPressServiceDataBySearchQuery,
  getWordPressServiceDataByCategory,
  getWordPressServiceDataBySearchQueryLazyLoad,
  setCurrentCategory
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HelpPopup)