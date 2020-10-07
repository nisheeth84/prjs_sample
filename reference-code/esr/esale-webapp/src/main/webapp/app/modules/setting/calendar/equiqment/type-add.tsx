
import React, { useState, useEffect } from 'react';
import { translate } from 'react-jhipster';
import _ from 'lodash';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { getJsonBName } from "app/modules/setting/utils";

interface ITypeAddProps {
    dataTypeChange
}

export const TypeAdd = (props:ITypeAddProps) => {

    const [langsMore, setLangsMore] = useState(false);
    const [langs, setLangs] = useState({
        "ja_jp": "",
        "en_us": "",
        "zh_cn": ""
    });

    const handleChangeLangs = keyMap => event => {
        setLangs({ ...langs, [keyMap]: event.target.value });
    }

    const save = () => {
        const type = {
            equipmentId:null,
            equipmentName:JSON.stringify(langs),
            isAvailable:null,
            equipmentTypeId:null,
            displayOrder:null
        }
        props.dataTypeChange(type);
    }


    return (
        <>
            <div className="table-tooltip-box w30 tl-75__left border-707">
                <div className="table-tooltip-box-body">
                    <div>
                        <label className="title font-weight-bold">種別追加</label>
                    </div>
                    <div>
                        <label className="title mt-4 font-weight-bold">
                            種別名
                            {/* <span className="label-red ml-2">必須</span> */}
                        </label>
                    </div>
                    <div className="d-flex font-size-12">
                        {
                            langsMore ? (
                                <>
                                    <input type="text" className="input-normal mt-2 w70" value={langs.ja_jp} onChange={handleChangeLangs('ja_jp')} placeholder="種別名を入力" />
                                    <label className="text-input">日本語</label>
                                </>
                            ) : (
                                    <input type="text" className="input-normal mt-2" value={langs.ja_jp} onChange={handleChangeLangs('ja_jp')} placeholder="種別名を入力" />
                                )
                        }
                    </div>
                    {
                        langsMore &&
                        (
                            <div>
                                <div className="d-flex font-size-12">
                                    <input type="text" className="input-normal mt-2 w70" value={langs.en_us} onChange={handleChangeLangs('en_us')} placeholder="種別名を入力" />
                                    <label className="text-input">English(US)</label>
                                </div>
                                <div className="d-flex font-size-12">
                                    <input type="text" className="input-normal mt-2 w70" value={langs.zh_cn} onChange={handleChangeLangs('zh_cn')} placeholder="種別名を入力" />
                                    <label className="text-input">中文（商体）</label>
                                </div>
                            </div>
                        )
                    }
                    <div>
                        <a className="button-primary btn-padding w100 mt-2 text-center" onClick={() => setLangsMore(!langsMore)}>他言語を表示</a>
                    </div>
                </div>
                <div className="table-tooltip-box-footer box-footer_custom p-0 pb-5">
                    <a className="button-cancel border-color">キャンセル</a>
                    <a className="button-blue" onClick={save}>追加</a>
                </div>
            </div>
        </>
    )
}
export default TypeAdd;