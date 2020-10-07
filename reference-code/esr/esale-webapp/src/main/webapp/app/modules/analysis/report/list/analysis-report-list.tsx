import React, { useEffect, useState, useRef } from 'react'
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import AnalysisControlTop from '../../control/analysis-control-top';
import { controlTopConfig, CONTROL_TOP_ACTIONS } from '../../control/control-top-config';
import AnalysisControlSidebar from '../../control/analysis-control-sidebar';
import DynamicList from 'app/shared/layout/dynamic-form/list/dynamic-list';
import { FIELD_BELONG } from 'app/config/constants';
import { ScreenMode } from 'app/config/constants';
import HelpPopup from 'app/modules/help/help';
import {CATEGORIES_ID} from 'app/modules/help/constant';

interface IAnalysisReportListProps {
  screenMode: any;
  fieldInfos: any;
  customFieldInfos: any;
  datasets: any;
  actionType: any;
  errorMessage: any;
  errorItems: any;
  checkboxFirstColumn: any;
  authorities;
}

const AnalysisReportList = (props: IAnalysisReportListProps) => {
  const [onOpenPopupHelp, setOnOpenPopupHelp] = useState(false);

  const { datasets } = props;

  const openModalCreateDataSet = () => {
    // TODO: ChungVQ code
    alert('this is create dataset!');
  }

  /**
* handle close popup Help
*/
  const dismissDialogHelp = () => {
    setOnOpenPopupHelp(false);
  }

  /**
     * handle action open popup help
     */
  const handleOpenPopupHelp = () => {
    setOnOpenPopupHelp(!onOpenPopupHelp);
  }

  const onExecuteAction = (type) => {
    switch (type) {
      case CONTROL_TOP_ACTIONS.CREATE_REPORT:
      case CONTROL_TOP_ACTIONS.CREATE_DATA_SET:
        openModalCreateDataSet();
        break;
      default:
        return;
    }
  }

  return (
    <>
      <div className="control-esr">
        <AnalysisControlTop
          config={controlTopConfig.report}
          executeAction={onExecuteAction}
          toggleSwitchDisplay={() => { }}
          toggleOpenPopupSearch={() => { }}
          toggleOpenInviteEmployees={() => { }}
          toggleOpenAddToGroupModal={() => { }}
          toggleOpenAddEditMyGroupModal={() => { }}
          toggleOpenCreateMyGroup={() => { }}
          searchMode={null}
          conDisplaySearchDetail={null}
          setConDisplaySearchDetail={() => { }}
          orderBy={null}
          toggleOpenMoveToGroupModal={() => { }}
          toggleOpenDepartmentPopup={() => { }}
          toggleOpenManagerSettingPopup={() => { }}
          reloadScreen={null}
          toggleOpenPopupSetting={() => { }}
          selectedTargetType={null}
          selectedTargetId={null}
          recordCheckList={null}
          listMenuType={ScreenMode.DISPLAY}
          modeDisplay={ScreenMode.DISPLAY}
          textSearch=""
          toggleOpenHelpPopup={handleOpenPopupHelp}
        />
        <div className="wrap-control-esr style-3">
          <div className="esr-content">
            <AnalysisControlSidebar
              toggleOpenModalCreateGroup={() => { }}
              toggleOpenModalChangeGroupType={() => { }}
              sidebarCurrentId={null}
              selectedTargetType={null}
              setTypeGroup={null}
            />
            <div className="esr-content-body">
              <div className="esr-content-body-main">
                <div className="pagination-top">
                  <div className="esr-pagination">
                    {/* VÙNG PHÂN TRANG */}
                    {/* <EmployeeDisplayCondition
                    conditions={conditionSearch}
                    filters={filterConditions}
                    searchMode={searchMode}
                    listMenuType={listMenuType}
                    sidebarCurrentId={sidebarCurrentId}
                    infoSearchConditionGroup={infoSearchConditionGroup}
                    dataConvertSpecialField={dataConvertSpecialField}
                  />
                  {fieldInfos && employees && employees.totalRecords > 0 &&
                    <PaginationList offset={offset} limit={limit} totalRecords={employees.totalRecords} onPageChange={onPageChange} />
                  } */}
                  </div>
                </div>
                {/* {renderMessage()} */}
                {/* {msgErrorBox && renderErrorBox()} */}
                {datasets &&
                  <DynamicList
                    id={'ANALYSIS_LIST_ID'}
                    records={[]}
                    keyRecordId={"analysisId"}
                    belong={FIELD_BELONG.ANALYSIS}
                  />}
              </div>
            </div>
          </div>
        </div>
      </div>
      {onOpenPopupHelp && <HelpPopup currentCategoryId={CATEGORIES_ID.analysis} dismissDialog={dismissDialogHelp} />}
    </>
  )
}

const mapStateToProps = ({ employeeList }: IRootState) => ({
});

const mapDispatchToProps = {

};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AnalysisReportList);