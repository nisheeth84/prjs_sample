import React from 'react'
import { connect } from 'react-redux'
import TimelineCommonControl from './timeline-common-control'

type ITimelineMultiFunctionProp = StateProps & DispatchProps & {
  closeModal: () => void
}

const TimelineMultiFunction = (props: ITimelineMultiFunctionProp) => {
  return (
    <>
      {/* popup */}
      <div className="modal popup-esr popup-esr4  popup-modal-common  show" id="popup-esr" aria-hidden="true">
        <div className="modal-dialog form-popup">
          <div className="modal-content">
            <div className="modal-header">
              <div className="left">
                <div className="popup-button-back">
                  <a className="icon-small-primary icon-return-small" /><span className="text"><img className="icon-group-user" src="../../../content/images/ic-popup-title-card.svg" />名刺 一郎</span>
                </div>
              </div>
              <div className="right">
                <a className="icon-small-primary icon-share" />
                <a className="icon-small-primary icon-link-small" />
                <a className="icon-small-primary icon-close-up-small line" onClick={() => { props.closeModal() }} />
              </div>
            </div>
            <div className="modal-body style-3">
              <div className="popup-content v2 style-3">
                <div className="popup-tool popup-tool-v2">
                  <div className="left w30">
                    <span className="icon-tool mr-2">
                      <img src="../../../content/images/icon-calendar.svg" />
                    </span>
                    <span className="icon-tool mr-2">
                      <img src="../../../content/images/common/ic-bag.svg" />
                    </span>
                    <span className="icon-tool mr-2">
                      <img src="../../../content/images/icon-mail-white.svg" />
                    </span>
                  </div>
                  <div className="right">
                    <a className="icon-small-primary icon-integration-small" />
                    <a className="icon-small-primary icon-person-arrow-next-small" />
                    <a className="icon-small-primary icon-edit-small" />
                    <a className="icon-small-primary icon-erase-small" />
                    <div className="button-pull-down-parent">
                      <a className="button-pull-down-small">表示範囲</a>
                    </div>
                    <a className="button-primary button-add-new">画面編集</a>
                    <a className="icon-small-primary icon-prev" />
                    <a className="icon-small-primary icon-next" />
                  </div>
                </div>
                <div className="popup-content-common-wrap">
                  <div className="popup-content-common-left">
                    <div className="flag-wrap flag-wrap-common">
                      <div className="block-card">
                        <div className="img">
                          <img src="../../../content/images/img-card1.svg" />
                        </div>
                        <div className="content">
                          <a className="text-blue item">サンプル株式会社</a>
                          <span className="item">代表取締役</span>
                          <div className="name">
                            <a>名刺 一郎</a>
                            <span>面識有り</span>
                          </div>
                          <ul>
                            <li>最終接触日：<span className="text-blue">yyyy/mm/dd</span></li>
                            <li>最終接触者：<span className="text-blue">社員A</span></li>
                          </ul>
                        </div>
                      </div>
                      <div className="text-right">
                        <a className="button-primary button-activity-registration">フォローする</a>
                      </div>
                    </div>
                    <div className="popup-content-common-content">
                      <div className="tab-detault">
                        <ul className="nav nav-tabs p-0">
                          <li className="nav-item">
                            <a className="nav-link font-size-12 active" data-toggle="tab">基本情報</a>
                          </li>
                          <li className="nav-item">
                            <a className="nav-link font-size-12" data-toggle="tab">活動履歴</a>
                          </li>
                          <li className="nav-item">
                            <a className="nav-link font-size-12" data-toggle="tab">取引商品<span className="tooltip-red">1</span></a>
                          </li>
                          <li className="nav-item">
                            <a className="nav-link font-size-12" data-toggle="tab">
                              カレンダー
                          <span className="tooltip-gray">予定なし</span>
                            </a>
                          </li>
                          <li className="nav-item">
                            <a className="nav-link font-size-12" data-toggle="tab">
                              メール
                          <span className="tooltip-red">+99</span>
                            </a>
                          </li>
                          <li className="nav-item">
                            <a className="nav-link font-size-12" data-toggle="tab">
                              変更履歴
                        </a>
                          </li>
                        </ul>
                        <div className="tab-content">
                          <div className="tab-pane active scroll-table-v2 style-3">
                            <div className="list-table  style-3 right pr-2">
                              <table className="table-default vertical-align-middle">
                                <tbody>
                                  <tr>
                                    <td className="title-table">名刺コード</td>
                                    <td colSpan={3}>10001</td>
                                  </tr>
                                  <tr>
                                    <td className="title-table">名刺画像</td>
                                    <td><a>meishi.jpg</a></td>
                                    <td className="title-table">顧客名</td>
                                    <td><a>サンプル株式会社</a></td>
                                  </tr>
                                  <tr>
                                    <td className="title-table">名刺氏名</td>
                                    <td colSpan={3}>名刺 太郎</td>
                                  </tr>
                                  <tr>
                                    <td className="title-table">名刺氏名（かな）</td>
                                    <td colSpan={3}>めいし たろう</td>
                                  </tr>
                                  <tr>
                                    <td className="title-table">部署・役職</td>
                                    <td colSpan={3}>代表取締役</td>
                                  </tr>
                                  <tr>
                                    <td className="title-table">住所</td>
                                    <td colSpan={3}><a>〒000-0000東京都○○区・・・・・・○○ビル3F</a></td>
                                  </tr>
                                  <tr>
                                    <td className="title-table">メールアドレス</td>
                                    <td><a>mail@example.com</a></td>
                                    <td className="title-table">電話番号</td>
                                    <td>000-0000-0000</td>
                                  </tr>
                                  <tr>
                                    <td className="title-table">携帯番号</td>
                                    <td colSpan={3}>000-0000-0000</td>
                                  </tr>
                                  <tr>
                                    <td className="title-table">受取人</td>
                                    <td colSpan={3}>受取 太郎（受取日：yyyy/mm/dd 最終接触日：<a>yyyy/mm/dd</a></td>
                                  </tr>
                                  <tr>
                                    <td className="title-table">最終接触日</td>
                                    <td><a>yyyy/mm/dd</a></td>
                                    <td className="title-table">在職フラグ</td>
                                    <td>在職中</td>
                                  </tr>
                                  <tr>
                                    <td className="title-table">キャンペーン</td>
                                    <td>キャンペーンA</td>
                                    <td className="title-table">メモ</td>
                                    <td>ここにメモが入ります。</td>
                                  </tr>
                                  <tr>
                                    <td className="title-table">登録日</td>
                                    <td>yyyy/mm/dd</td>
                                    <td className="title-table">登録者</td>
                                    <td><a>社員A</a></td>
                                  </tr>
                                  <tr>
                                    <td className="title-table">最終更新日</td>
                                    <td>yyyy/mm/dd</td>
                                    <td className="title-table">最終更新者</td>
                                    <td><a>社員A</a></td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="popup-content-common-right background-col-F9 v2">
                    <TimelineCommonControl objectId={[1]} serviceType={1} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* popup */}
      <div className="modal-backdrop show" />
    </>
  )
}

const mapStateToProps = () => ({
});

const mapDispatchToProps = {
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimelineMultiFunction);
