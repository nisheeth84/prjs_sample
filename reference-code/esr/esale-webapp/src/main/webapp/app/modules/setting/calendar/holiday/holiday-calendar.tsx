import React from 'react';
import _ from 'lodash';

export interface IHolidayCalendarProps {
    calendarYear,
    calendarMonth
}

export const HolidayCalendar = (props: IHolidayCalendarProps) => {

    
    function century(yearInput) {
        return Math.floor(yearInput / 100);
    }

    
    function month(monthInput) {
        return monthInput < 3 ? monthInput + 10 : monthInput - 2;
    }

    
    function year(yearInput) {
        return yearInput % 100;
    }

    
    function _zeller(dayInput, monthInput, yearInput, centuryInput) {

        const a = (13 * monthInput - 1) / 5;
        const b = yearInput / 4;
        const c = centuryInput / 4;
        const d = dayInput;
        const e = yearInput;
        const f = (2 * centuryInput);
        const tt = a + b + c + d + e - f;
        const ttt = tt % 7;

        return ttt;
    }

    
    function zeller(dayInput, monthInput, yearInput) {
        return _zeller(dayInput, month(monthInput), year(yearInput), century(yearInput));
    }


    function isLeap(yearInput) {
        if ((yearInput % 4) || ((yearInput % 100 === 0) && (yearInput % 400))) return 0;
        else return 1;
    }
    function daysIn(monthInput, yearInput) {
        return monthInput === 2 ? (28 + isLeap(yearInput)) : 31 - (monthInput - 1) % 7 % 2;
    }


    const calendar = (monthInput, yearInput) => {

        const startIndex = new Date(yearInput, monthInput - 1, 1).getDay();


        // const startIndex = Math.trunc(zeller(1, monthInput, yearInput));
        const endIndex = daysIn(monthInput, yearInput);

        // console.log("START_DAY", startIndex);
        // console.log("END_DAY", endIndex);



        const result = Array.apply({ day: null, value: 0 }, Array(42)).map(function (i) { return 0; });
        for (let i = startIndex; i < endIndex + startIndex; i++) {

            // result[i - 1] = (i - startIndex) + 1;

            const item = {
                day: i - 1,
                value: (i - startIndex) + 1
            }

            result[i - 1] = item;

            // const itemDay = {
            //     day: null,
            //     value: null
            // }

            // if(i>0){
            //     itemDay.day = (i-1);
            //     itemDay.value = (i - startIndex) + 1;
            // }else{
            //     itemDay.day = i;
            //     itemDay.value = i + 1;
            // }


            // result[i>0?(i-1):i] = itemDay;
        }

        // console.log("CALENDAR", result);


        let row = [];
        const rs = [];

        
        // const startCN = _.fill(result, (obj) => {
        //     return obj.day === -1;
        // });

        // if (startCN.length > 0) {
        //     for (let i = 0; i < 5; i++) {
        //         row.push(0);
        //     }
        //     row.push(1);
        //     rs.push(row);
        //     row = [];
        // }


        result.forEach(obj => {
            row.push(obj);
            if (row.length === 7) {
                rs.push(row);
                row = [];
            }
        });

        // console.log("RS", rs);


        return rs;
    }

    const genCalendarView = () => {
        const calenderView = calendar(props.calendarMonth, props.calendarYear);

        return (
            <>
                {
                    calenderView.map((item, index) => (
                        <tr key={index}>
                            {
                                item.map((obj, objIndex) => (
                                    <td key={objIndex}>
                                        <div className="date">{obj.value > 0 ? obj.value : ""}</div>
                                    </td>
                                ))
                            }
                        </tr>
                    ))
                }
            </>
        )

    }

    return (
        <>
            {genCalendarView()}
        </>
    )

}
export default HolidayCalendar;
