import React from 'react'
import _ from 'lodash'

type IItemTableColorEmployee = {
    chosenColor: (item) => void
    selectedValue: string
}

const NUMBER_OF_COLOR = 28 // amount of color

/**
 * list data color 
 */
const ListColor = [
    {
        color: "color-0",
        key: '#fb7d7d',
    },
    {
        color: "color-1",
        key: '#ff9d9d'
    },
    {
        color: "color-2",
        key: '#ffb379'
    },
    {
        color: "color-3",
        key: '#88d9b0'
    },
    {
        color: "color-4",
        key: '#85acdc'
    },
    {
        color: "color-5",
        key: '#fc82fc'
    },
    {
        color: "color-6",
        key: '#ff9d9d'
    },
    {
        color: "color-7",
        key: '#ff92b9'
    },
    {
        color: "color-8",
        key: '#b4d887'
    },
    {
        color: "color-9",
        key: '#d8cc75'
    },
    {
        color: "color-10",
        key: '#6dcacc'
    },
    {
        color: "color-11",
        key: '#7171e2'
    },
    {
        color:"color-12",
        key: '#cc8bd1'
    },
    {
        color: "color-13",
        key: '#ceaa91'
    },
    {
        color: "color-14",
        key: '#fed3d3'
    },
    {
        color: "color-15",
        key: '#ffe7d2'
    },
    {
        color: "color-16",
        key: '#d8f2e5'
    },
    {
        color: "color-17",
        key: '#d6e3f3'
    },
    {
        color: "color-18",
        key: '#ffdede'
    },
    {
        color: "color-19",
        key: '#d6e3f3'
    },
    {
        color: "color-20",
        key: '#ffdede'
    },
    {
        color: "color-21",
        key: '#d6e3f3'
    },
    {
        color: "color-22",
        key: '#ffe0eb'
    },
    {
        color: "color-23",
        key: '#d7eabe'
    },
    {
        color: "color-24",
        key: '#ece5b9'
    },
    {
        color: "color-25",
        key: '#c8ebec'
    },
    {
        color: "color-26",
        key: '#dbdbf7'
    },
    {
        color: "color-27",
        key: '#e7d3ef'
    }]

/**
 * render table color for setting employee
 * @param props 
 */
const ItemTableColorEmployee = (props: IItemTableColorEmployee) => {

    return (
        <>
        <div className="box-select-option-bottom select-color">
            <ul className="color-table">
                {
                    ListColor.map((color, index) => {
                        return (
                            <li key={index} onClick={() => { props.chosenColor(color.color) }}>
                                <span className={`${props.selectedValue === color.key ? " active " : ""}${color.color}`}>
                                {props.selectedValue === color.key ? <i className="far fa-check"></i> : ""}
                                </span>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
        </>
    )
}

export default ItemTableColorEmployee;