import React from 'react'

export interface IFieldSettingTextBoxProps {
    fieldInfo: any
    onCancelEdit?: () => void
    onUpdateInputInfo?: () => void
}

const FieldSettingTextBox = (props: IFieldSettingTextBoxProps) => {

    const { fieldInfo } = props;

    return (
        <>
            <span>Fields setting</span>
            <br></br><br></br>
            <span>{fieldInfo.fieldLabel || "Field label"}</span>
            <input className="form-control input-common" type="text" placeholder={fieldInfo.fieldLabel || "field placeholder"} />
            <a className="color-blue">Show</a>
            <br></br><br></br>
            <span>Required</span>
            <div className="wrap-check">
                <div className="wrap-check-radio">
                    {fieldInfo.fieldItems.map((e, idx) =>
                        <p className="radio-item" key={e.itemId}>
                            <input name="require" type="radio" id={"rad_" + idx} />
                            <label htmlFor={"rad_" + idx}>{e.itemLabel}</label>
                        </p>
                    )}
                </div>
            </div>
            <br></br>
            <span>Textbox</span>
            <div className="wrap-check">
                <input className="form-control input-common" type="text" placeholder={"text placeholder"} />
                <a className="button-blue button-form-register" >button</a>
            </div>
            <a className="color-blue">Required</a>
            <br></br><br></br>
            <span>check box</span>
            <div className="wrap-check">
                <input id="checkbox" type="checkbox" placeholder={"text placeholder"} />
                <label htmlFor={"checkbox"}>check box</label>
            </div>
            <br></br>
            <span>Checkbox2</span>
            <div className="wrap-check">
                <div className="wrap-check-radio">
                    <p className="radio-item">
                        <input name="checkbox" id="checkbox_1" type="checkbox" />
                        <label htmlFor={"checkbox_1"}>check box 1</label>
                        <input name="checkbox" id="checkbox_2" type="checkbox" />
                        <label htmlFor={"checkbox_2"}>check box 2</label>
                    </p>
                </div>
            </div>
        </>
    );
}
export default FieldSettingTextBox;