import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import {
  handleGetImportProgressBar,
  handleGetImportHistories,
} from '../import-csv.reducer';
import { GET_PROGRESS_BAR_INTERVAL } from '../upload.constant';
import { translate } from 'react-jhipster';
import '../style.css'

export interface IUploadSimulator extends StateProps, DispatchProps {
  importId: number;
  serviceId: number;
}

const SimulationImport = (props: IUploadSimulator) => {

  const { importId = -1, serviceId, importHistoriesData } = props;

  // progress bar
  const [isStartedProgress, setIsStartedProgress] = useState(false);
  const [isDoneProgress, setIsDoneProgress] = useState(false);
  const [longPolling, setLongPolling] = useState(null);

  // simulate results
  const [simulatedRecord, setSimulatedRecord] = useState(null);
  const [completedRecords, setCompletedRecords] = useState(0);
  const [importableRecords, setImportableRecords] = useState(0);
  const [unimportableRecords, setUnimportableRecords] = useState(0);

  const [progressPercentage, setProgressPercentage] = useState(0);

  useEffect(() => {
    if (isDoneProgress) {
      return;
    }

    if (!isStartedProgress) {
      setIsStartedProgress(isStartedProgress);
    }

    if (isStartedProgress && props.importRowFinish === props.importRowTotal) {
      setIsDoneProgress(true);
    }

    const percentage = (props.importRowFinish / props.importRowTotal) * 100;
    setProgressPercentage(percentage);

  }, [props.importRowFinish, props.importRowTotal]);

  useEffect(() => {
    if (!importHistoriesData || importHistoriesData.length === 0) {
      return;
    }

    setSimulatedRecord(importHistoriesData[0]);
    const { insertedCount, updatedCount, errorCount } = importHistoriesData[0];

    setCompletedRecords(insertedCount + updatedCount + errorCount);
    setImportableRecords(insertedCount + updatedCount);
    setUnimportableRecords(errorCount);

  }, [importHistoriesData]);

  useEffect(() => {
    if (isDoneProgress) {
      // stop polling for progress
      clearInterval(longPolling);

      // get import history
      props.handleGetImportHistories(serviceId, true);
    }
  }, [isDoneProgress]);

  useEffect(() => {
    console.log(simulatedRecord);
  }, [simulatedRecord]);

  useEffect(() => {
    if (isDoneProgress) {
      return;
    }

    props.handleGetImportProgressBar(importId);
    const interval = setInterval(() => {
      props.handleGetImportProgressBar(importId);
    }, GET_PROGRESS_BAR_INTERVAL);

    setLongPolling(interval);
    return () => {
      clearInterval(interval);
    }
  });

  return (
    <>
      {
        !isDoneProgress && (
          <div className='popup-tab-content'>
            <div className='align-center mt-5 pt-5 mb-3'>
              <img title='' src='../../content/images/common/ic-csv-search.svg' alt='' />
            </div>
            <div className='mb-3'>
              {translate('setting.importCSV.simulation.infoProgressing')}
            </div>
            <div className='process-data'>
              <span style={{ position: 'absolute', zIndex: 1000, right: '50%' }}>{`${translate('setting.importCSV.simulationImport.infoCompletedRecords')}}${props.importRowFinish}${translate('setting.importCSV.simulationImport.rowOne')}${props.importRowTotal}${translate('setting.importCSV.simulationImport.rowTwo')}`}</span>
              <span className='pl-4' style={{ position: 'absolute', zIndex: 1000, right: '40%' }}>
                {translate('setting.importCSV.simulation.remainingProgressMinute', { '0': 0 })}
              </span>
              <div className='process-data-bar' style={{ width: `${progressPercentage}%` }}></div>
            </div>
          </div>
        )
      }
      {
        isDoneProgress && (
          <div className='popup-tab-content align-center font-weight-500'>
            <div className='align-center mt-5 pt-5 pb-4 '>
              <div className='mb-4'>
                <strong>{translate('setting.importCSV.simulation.infoSimulateCompleted')}</strong>
              </div>
              {(simulatedRecord && simulatedRecord.errorCount > 0) && <img title='' src='../../content/images/common/ic-csv-delete.svg' alt='' />}
              {(simulatedRecord && simulatedRecord.errorCount <= 0) && <img title='' src='../../content/images/common/ic-csv-search.svg' alt='' />}
            </div>

            <div className={'import-results'}>
              {
                (simulatedRecord && simulatedRecord.errorCount > 0) && <div className='color-red mb-2 text-center'>
                  {translate('setting.importCSV.simulation.infoError')}
                </div>
              }
              <div className={'d-flex justify-content-between'}>
                {translate('setting.importCSV.simulation.infoCompletedRecords')}
                <span>
                  {translate('setting.importCSV.simulation.infoRecords', { '0': completedRecords })}
                </span>
              </div>
              <div className={'d-flex justify-content-between'}>
                {translate('setting.importCSV.simulation.infoCompletedRecords')}
                <span>
                  {translate('setting.importCSV.simulation.infoRecords', { '0': <span className='color-blue pl-4'>{importableRecords}</span> })}
                </span>
              </div>
              <div className={'d-flex justify-content-between'}>
                {translate('setting.importCSV.simulation.infoUnimportableRecords')}
                <span>
                  {translate('setting.importCSV.simulation.infoRecords', { '0': <span className='color-red pl-4'>{unimportableRecords}</span> })}
                </span>
              </div>
            </div>
          </div>
        )
      }
    </>
  );
};

const mapStateToProps = ({ uploadCSV }: IRootState) => ({
  importRowTotal: uploadCSV.importRowTotal,
  importRowFinish: uploadCSV.importRowFinish,
  importHistoriesData: uploadCSV.importHistoriesData,
  errorMessage: uploadCSV.errorMessage
});

const mapDispatchToProps = {
  handleGetImportProgressBar,
  handleGetImportHistories,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SimulationImport);