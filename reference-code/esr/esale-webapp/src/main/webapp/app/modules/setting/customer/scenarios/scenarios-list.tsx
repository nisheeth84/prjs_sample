import React, { useState, useEffect, useRef } from 'react';
import { translate } from 'react-jhipster';
import { getJsonBName, convertHTMLEncString } from "app/modules/setting/utils";
import ConfirmDialog from 'app/shared/layout/dialog/confirm-dialog';
import _ from "lodash";
import styled from 'styled-components';
import { revertHTMLString } from 'app/modules/products/utils';

const CustomTd = styled.td`
  width : 15%;
  max-width: 200px;
  text-overflow: ellipsis;
  overflow: hidden;
  height: 1.2em;
  white-space: nowrap;
`;

const CustomTd2 = styled.td`
  width : 65%;
  max-width: 200px;
  text-overflow: ellipsis;
  overflow: hidden;
  height: 1.2em;
  white-space: nowrap;
`;

export interface IScenarios {
  scenariosList,
  scenariosRemove,
  scenariosAdd,
  scenariosEdit,
  screenName,
}

export const ScenariosList = (props: IScenarios) => {

  const [listScenarios, setListScenarios] = useState([]);
  
  const buttonEdit= useRef(null);
  const buttonDelete= useRef(null);

  useEffect(() => {
    if (props.scenariosList) {
      setListScenarios(props.scenariosList);
    }
  }, [props.scenariosList]);

  const handleDelete = async (item) => {
    const itemName = convertHTMLEncString(getJsonBName(item.scenarioName));
    const result = await ConfirmDialog({
      title: (<>{translate('employees.top.dialog.title-delete-group')}</>),
      message: revertHTMLString(translate('messages.WAR_COM_0001', { itemName })),
      confirmText: translate('employees.top.dialog.confirm-delete-group'),
      confirmClass: "button-red",
      cancelText: translate('employees.top.dialog.cancel-text'),
      cancelClass: "button-cancel"
    });
    if (result) {
      props.scenariosRemove(item.scenarioId)
    }
  }

  return (
    <>
      <div className="block-feedback background-feedback magin-top-5 border-radius-12">
        {translate('setting.customer.scenarios.warning')}
      </div>
      <div className="mt-2 mb-2">
        <button className="button-primary button-today pl-4 pr-4 font-weight-500" onClick={props.scenariosAdd}>
          {translate('setting.customer.scenarios.btn')}
        </button>
      </div>

      {listScenarios && listScenarios.length > 0 ?
        <table className="table-default">
          <thead>
            <tr>
              <td className="text-center">No</td>
              <td>{translate('setting.customer.scenarios.tblCol2')}</td>
              <td>{translate('setting.customer.scenarios.tblCol3')}</td>
              <td className="text-center">{translate('setting.customer.scenarios.tblCol4')}</td>
            </tr>
          </thead>
          <tbody>
            {listScenarios.map((item, index) => (
              <tr key={index}>
                <td className="text-center">{index + 1}</td>
                <CustomTd>
                  <button className="color-active" onClick={() => props.scenariosEdit(item)}>
                    {getJsonBName(item.scenarioName)}
                  </button>
                </CustomTd>
                <CustomTd2>
                  {
                    _.sortBy(item.milestones, ['displayOrder']).map((mile, mileIndex) => (
                      <span key={mileIndex}>
                        {mile.milestoneName}
                        {mileIndex < item.milestones.length - 1 && ","}
                      </span>
                    ))
                  }
                </CustomTd2>
                <td className=" text-center color-999">
                  <button ref={buttonEdit} className="icon-primary icon-edit icon-edit-t icon-custom" onClick={() => { buttonEdit.current.blur(); props.scenariosEdit(item)}}/>
                  <button ref={buttonDelete} className="icon-primary icon-erase icon-edit-t icon-custom" onClick={() => {buttonDelete.current.blur(); handleDelete(item)}}/>
                </td>
              </tr>
            ))
            }
          </tbody>
        </table> : (
        <div className="absolute-center">
          {translate("messages.INF_COM_0020", {0 : ' ' + props.screenName})}
        </div>
        )
      }

    </>
  )

}

export default ScenariosList