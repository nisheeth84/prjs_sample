import React from 'react';

const BusinessCardDetailByList = () => {

  return (
    <div className="list-table">
      <div className="table-list-wrap style-3">
        <table className="table-list">
          <tbody>
            <tr>
              <td className="list-calendar-item " >
                <div className="current-date"><span className="day-number">5</span></div>
              </td>
              <td className="width-100-px " >
                <div>6月,木</div>
                <div className="color-999">友引</div>
              </td>
              <td className="fonr-weight-bold">
                <div className="calendar-style1"><span className="time">11:00〜12:00 予定</span></div>
                <div className="calendar-line"></div>
                <div className="calendar-style1"><span className="time">12:00〜13:00 予定</span></div>
                <div className="calendar-style1"><span className="time">13:00〜14:00 予定</span></div>
              </td>
            </tr>
            <tr>
              <td className="list-calendar-item " >
                <span className="day-number">5</span>
              </td>
              <td className="tf-text-content width-100-px " >
                <div>6月,木</div>
                <div className="color-999">友引</div>
              </td>
              <td><div className="calendar-style1"><span className="time pr-4">終日</span>予定</div></td>
            </tr>
            <tr>
              <td align="center">
                <span className="day-number">7</span>
              </td>
              <td className="tf-text-content width-100-px " >
                <div>6月,  金</div>
                <div className="color-999">先負</div>
              </td>
              <td><div className="calendar-style1"><span className="time pr-4">終日</span>予定</div></td>
            </tr>
            <tr>
              <td align="center">
                <span className="day-number">9</span>
              </td>
              <td className="tf-text-content width-100-px " >
                <div>6月,<span className="color-red">日</span></div>
                <div className="color-red">大安</div>
              </td>
              <td className="fonr-weight-bold">
                <div className="calendar-style1 font-weight-bold orange"><span className="time mr-3">12:00〜13:00</span>重複する予定A</div>
                <div className="calendar-style1 font-weight-bold orange"><span className="time mr-3">12:00〜13:00</span>重複する予定A</div>
              </td>
            </tr>
            <tr>
              <td align="center" className="color-red">
                <span className="day-number">10</span>
              </td>
              <td className="tf-text-content width-100-px " >
                <div>6月,  月</div>
                <div><span className="color-red">祝日</span>,赤口</div>
              </td>
              <td><div className="calendar-style1 icon-yellow">終日</div></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BusinessCardDetailByList;
