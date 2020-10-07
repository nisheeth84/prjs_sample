import React, { useState, useEffect } from 'react';

export interface IRadioBoxSwichModeProps {
    items: { value, text }[],
    selectedValue?: any,
    handleChooseComponent?: (val) => void,
    disableChange?: boolean
}

/**
* Select Button Box
*/
const SelectButtonBox = (props: IRadioBoxSwichModeProps) => {
    const [openDropDown, setOpenDropDown] = useState(false);
    const [text, setText] = useState(() => {
        let txt = "";
        const search = props.items.filter(obj => {
            return obj.value === props.selectedValue;
        })[0]
        if (search) {
            txt = search.text;
        }
        return txt;
    });

    useEffect(() => {
        if (props.selectedValue) {
            setText(() => {
                let txtText = "";
                const search = props.items.filter(obj => {
                    return obj.value === props.selectedValue;
                })[0]
                if (search) {
                  txtText = search.text;
                }
                return txtText;
            }
            )
        }
    }, [props.selectedValue])

    /**
    * Select Option
    */
    const selectOption = (val, txt) => {
        setText(txt);
        setOpenDropDown(false);
        if (props.handleChooseComponent) {
            props.handleChooseComponent(val);
        }
    }

    return (
        <>
            <div className="position-relative">
                <a title="" className={!props.disableChange ? "button-pull-down-small" : "button-pull-down-small disable"} onClick={!props.disableChange ? () => setOpenDropDown(!openDropDown) : null}>{text}</a>
                {openDropDown &&
                    <div className="box-select-option ">
                        <ul>
                            {props.items && props.items.map((e, idx) => {
                                return <li key={idx} onClick={() => selectOption(e.value, e.text)}><a>{e.text}</a></li>
                            }
                            )}
                        </ul>
                    </div>}
            </div>
        </>
    );
}

export default SelectButtonBox
