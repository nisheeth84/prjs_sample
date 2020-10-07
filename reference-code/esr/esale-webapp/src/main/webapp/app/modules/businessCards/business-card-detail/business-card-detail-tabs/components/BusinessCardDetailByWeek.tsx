import React from 'react';

export interface IBusinessCardDetailByWeek {
  listDay?: Array<any>,
  dateViewWeek?: Date,
}

const mapDate = {
  0: { topText: '月', bottomText: '赤口' },
  1: { topText: '火', bottomText: '赤口' },
  2: { topText: '水', bottomText: '先勝' },
  3: { topText: '木', bottomText: '友引' },
  4: { topText: '金', bottomText: '先負' },
  5: { topText: '土', bottomText: '赤口' },
  6: { topText: '日', bottomText: '大安' },
}
const BusinessCardDetailByWeek = (props: IBusinessCardDetailByWeek) => {
  return (
    <div className="list-table list-table-week">
      <div className="table-list-wrap style-3">
        <div className="table-calendar-wrap">
          <table className="table-default table-out-no-border">
            <tbody>
              <tr>
                <td className="uset-border w9">
                </td>
                {
                  props.listDay.map((day, index) => (
                    <td className="uset-border w13" key={day.index + Math.random()}>
                      <div className="day-width text-top">{mapDate[index].topText}</div>
                      <div className="text-mid">{day.date}</div>
                      <div className="color-red text-bottom">{mapDate[index].bottomText}</div>
                    </td>
                  ))
                }
              </tr>
              <tr>
                <td className="uset-border tf-title">
                  <div className="time-wrap"><div className="time">1 時</div></div>
                </td>
                <td className="uset-border-top">
                  <div className="calendar-all-day-schedule1">終日予定</div>
                </td>
                <td className="vertical-align-bottom uset-border-top">

                </td>
                <td className="uset-border-top">

                </td>
                <td className="uset-border-top">

                </td>
                <td className="uset-border-top">
                  <div className="calendar-all-day-schedule1 schedule-three-column">終日予定</div>
                  <div className="calendar-style4 no-icon schedule-three-column">終日予定</div>
                </td>
                <td className="uset-border-top">

                </td>
                <td className="uset-border-top">

                </td>
              </tr>
              <tr>
                <td className="uset-border tf-title">
                  <div className="time-wrap"><div className="time">2 時</div></div>
                </td>
                <td>


                </td>
                <td>

                </td>
                <td>

                </td>
                <td>

                </td>
                <td>

                </td>
                <td>

                </td>
                <td>

                </td>
              </tr>
              <tr>
                <td className="uset-border tf-title">
                  <div className="time-wrap"><div className="time">3 時</div></div>
                </td>
                <td>

                </td>
                <td>

                </td>
                <td>
                </td>
                <td>

                </td>
                <td>

                </td>
                <td>

                </td>
                <td>

                </td>
              </tr>
              <tr>
                <td className="uset-border tf-title">
                  <div className="time-wrap"><div className="time">4 時</div></div>
                </td>
                <td>

                </td>
                <td>

                </td>
                <td>

                </td>
                <td>

                </td>
                <td>

                </td>
                <td>

                </td>
                <td>

                </td>
              </tr>
              <tr>
                <td className="uset-border tf-title">
                  <div className="time-wrap"><div className="time">5 時</div></div>
                </td>
                <td>

                </td>
                <td>

                </td>
                <td>

                </td>
                <td>

                </td>
                <td>

                </td>
                <td>

                </td>

                <td>

                </td>
              </tr>
              <tr>
                <td className="uset-border tf-title">
                  <div className="time-wrap"><div className="time">6 時</div></div>
                </td>
                <td>

                </td>
                <td className="day-select">
                  <div className="calendar-all-day-schedule1 ">予定
                                                                            <div>5:00〜 6:00</div>
                  </div>
                </td>
                <td>

                </td>
                <td>

                </td>
                <td>

                </td>
                <td>

                </td>

                <td>

                </td>
              </tr>
              <tr>
                <td className="uset-border tf-title">
                  <div className="time-wrap"><div className="time">7 時</div></div>
                </td>
                <td>

                </td>
                <td>

                </td>
                <td>

                </td>
                <td>

                </td>
                <td>

                </td>
                <td>

                </td>

                <td>

                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default BusinessCardDetailByWeek;
