import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-jhipster';
import { IRootState } from 'app/shared/reducers';
import { Storage } from 'react-jhipster';

import { handleGetImportHistories, reset } from '../import-csv.reducer';

export interface IUploadHistories extends StateProps, DispatchProps {
  importBelong: number;
  closeHistoriesModalHandel: any;
}

const UploadHistories = (props: IUploadHistories) => {
  const [histories, setHistories] = useState(null);
  const { importBelong, closeHistoriesModalHandel } = props;
  const [sortValue, setSortValue] = useState(true);

  /**
   * If props.importDataHistories is exist, set state histories to render table data
   */
  useEffect(() => {
    setHistories(props.importDataHistories)
  }, [props.importDataHistories]);

  /**
   * When init component, call API get import histories
   * When distroy component, reset all state
   */
  useEffect(() => {
    props.handleGetImportHistories(importBelong, sortValue);
    return (() => {
      props.reset();
    })
  }, []);

  useEffect(() => {
    props.handleGetImportHistories(importBelong, sortValue);
  }, [sortValue]);

  /**
   * When click importFileName tag then download the corresponding file
   */
  const downloadImportFile = (url) => {
    window.open(url);
  }

  const headers = [
    { name: translate('setting.importCSV.historiesImport.headerTable.createdDate'), width: '10%', key: 'createdDate', onClick: true },
    { name: translate('setting.importCSV.historiesImport.headerTable.importFileName'), width: '20%', key: 'importFileName' },
    { name: translate('setting.importCSV.historiesImport.headerTable.isImportSucceed'), width: '5%', key: 'isImportSucceed' },
    { name: translate('setting.importCSV.historiesImport.headerTable.employeeName'), width: '10%', key: 'employeeName' },
    { name: translate('setting.importCSV.historiesImport.headerTable.insertedCount'), width: '10%', key: 'insertedCount' },
    { name: translate('setting.importCSV.historiesImport.headerTable.updatedCount'), width: '10%', key: 'updatedCount' },
    { name: translate('setting.importCSV.historiesImport.headerTable.errorCount'), width: '10%', key: 'errorCount' },
  ];

  return (
    <div className="modal popup-esr popup-esr4 popup-common-csv user-popup-page popup-align-right show" aria-hidden="true">
      <div className="modal-dialog form-popup">
        <div className="modal-content">
          <div className="modal-header">
            <div className="left">
              <div className="popup-button-back">
                <a title="" className="icon-small-primary icon-return-small" onClick={() => closeHistoriesModalHandel()}></a>
                <span className="text">
                  <img title="" src="../../content/images/common/ic-calculator.svg" alt="" />
                  {translate('setting.importCSV.historiesImport.title')}
                </span>
              </div>
            </div>
            <div className="right">
              <a title="" className="icon-small-primary icon-link-small"></a>
              <a title="" className="icon-small-primary icon-close-up-small line"></a>
            </div>
          </div>
          <div className="modal-body">
            <div className="popup-content  style-3 no-bottom">
              <div className="popup-tab-content">
                <div className=" block-feedback block-feedback-blue mb-2 mr-4">
                  {translate('setting.importCSV.historiesImport.inforMess')}
                </div>
                <div style={{ overflow: 'auto' }}>
                  <table className="table-default table-align-cente" style={{ minWidth: '1300px' }}>
                    <tbody>
                      <tr>
                        {headers.map(header => {
                          if (header.key === 'createdDate') {
                            return (
                              <td className="title-table" key={header.key}>
                                <div style={{ minWidth: header.width }}>
                                  {header.name}
                                  <a title="" className={`icon-small-primary ${sortValue ? "icon-descending" : "icon-ascending"}`} onClick={e => { setSortValue(!sortValue) }}></a>
                                </div>
                              </td>
                            );
                          }
                          return (
                            <td className="title-table" key={header.key}>
                              <div style={{ minWidth: header.width }}>{header.name}</div>
                            </td>
                          );
                        })}
                      </tr>
                      {histories && histories.map((record, indexRow) => (
                        <tr key={`${indexRow}_key`}>
                          {headers.map((field, col) => {
                            if (field.key === 'importFileName') {
                              return (
                                <td key={`${indexRow}_${col}_key`}>
                                  <a title="" className="color-blue" onClick={e => downloadImportFile(record['importFilePath'])}>
                                    {record[field.key]}
                                  </a>
                                </td>
                              );
                            }
                            if (field.key === 'employeeName') {
                              return (
                                <td key={`${indexRow}_${col}_key`}>
                                  <a title="" className="color-blue">
                                    {record[field.key]}
                                  </a>
                                </td>
                              );
                            }
                            if (field.key === 'isImportSucceed') {
                              return (
                                <td key={`${indexRow}_${col}_key`} style={{ color: record[field.key] ? '#2ecc71' : '#ff0000' }}>
                                  {record[field.key] ?
                                    translate('setting.importCSV.historiesImport.success') :
                                    translate('setting.importCSV.historiesImport.failure')}
                                </td>
                              );
                            }
                            if (field.key === 'errorCount') {
                              return (
                                <td key={`${indexRow}_${col}_key`} style={{ color: record[field.key] > 0 && '#ff0000' }}>
                                  {record[field.key]}
                                  {record[field.key] > 0 &&
                                    <a title="" className="icon-small-primary icon-download ml-1" onClick={e => downloadImportFile(record['importErrorFilePath'])} />
                                  }
                                </td>
                              );
                            }
                            return <td key={`${indexRow}_${col}_key`}>{record[field.key]}</td>;
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ uploadCSV }: IRootState) => ({
  importDataHistories: uploadCSV.importHistoriesData
});

const mapDispatchToProps = {
  handleGetImportHistories,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UploadHistories);

