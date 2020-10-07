import React, { useState, useEffect } from 'react';
import { Input } from 'reactstrap';
import { CsvFile } from '../dtos/upload_file_dto';
import { translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import {
  handleGetImportMatchingKeys,
  handleGetFieldRelationItems,
  handleGetImportMappingItems,
  reset
} from '../import-csv.reducer';
import _ from 'lodash';
import StringUtils, { getFieldLabel } from '../../../shared/util/string-utils';

export interface IUploadFileStepProps extends StateProps, DispatchProps {
  serviceId: any,
  // table values
  fieldRelationItems: any;
  csvFile: CsvFile;

  // config values
  indexKey: string;
  relationName: string;
  relationMatching: any;

  // config methods
  setIndexKey: (key: string) => void;
  setRelationName: (key: string) => void;
  setRelationMapping: (key: any) => void;
  errorCode;
}

const MappingFileStep = (props: IUploadFileStepProps) => {
  const {
    setIndexKey,
    indexKey,
    relationName,
    setRelationMapping,
    relationMatching
  } = props;
  const [headers, setHeaders] = useState([]);
  const [headersCSV, setHeadersCSV] = useState([]);

  const [tableRows, setTableRows] = useState([]);

  const [matchingKeys, setMatchingKeys] = useState(indexKey ? indexKey : null);
  const [matchingItemsData, setMatchingItemsData] = useState(null);

  useEffect(() => {
    if (!_.isEmpty(props.importMappingItemsData)) {
      const importMappingItemTmp = _.cloneDeep(props.importMappingItemsData);
      const importMappingItemSortByHeaderCSV = importMappingItemTmp.sort(StringUtils.compareValues('columnCsv'));
      setMatchingItemsData(importMappingItemSortByHeaderCSV);
    }
  }, [props.importMappingItemsData]);

  useEffect(() => {
    const _tableRows = props.csvFile.rows.filter((value, index) => index < 5);
    setTableRows(_tableRows);
    setHeadersCSV(props.csvFile.headers);
    console.log(_tableRows);
  }, [props.csvFile]);

  useEffect(() => {
    const mapHeader = item => {
      const label = getFieldLabel(item, 'fieldLabel');
      return { label, ...item };
    }
    const mappingHeaders = !_.isEmpty(matchingItemsData) ? matchingItemsData.map(mapHeader) : [];
    setHeaders(mappingHeaders.filter(item => item));
  }, [matchingItemsData, props.importMatchingKeysData]);

  return (
    <div className='popup-tab-content'>
      <div className='width-420 foint-weight-500'>
        <div className='mb-2'>
          {translate('setting.importCSV.screenTwo.header')}
        </div>
        <div className='mb-2'>
          {translate('setting.importCSV.screenTwo.buttonSetMappingRelations')}
          <a title=''>
            <img className='ml-5' src='../../content/images/common/ic-faq.svg' alt='' />
          </a>
        </div>
        <div className='form-group'>

          <div className='form-group d-flex'>
            <div className='mapping-key-item w45 mr-1'>
              {translate('setting.importCSV.screenTwo.mappingKeyRelation')}
              <div>
                {translate('setting.importCSV.screenTwo.mappingKeyRelationSame')}
              </div>
            </div>
            <div className=' w55 mt-1'>
              <div className='select-option select-option mt-2'>
                <Input
                  type='select'
                  style={{ borderRadius: 12 }}
                  onChange={e => { setIndexKey(e.target.value); setMatchingKeys(e.target.value) }}
                  value={props.indexKey}
                >
                  <option key={0} value={0}>
                    {translate('setting.importCSV.screenTwo.placeHolderMatchingKey')}
                  </option>
                  {props.importMatchingKeysData && props.importMatchingKeysData.map(item => (
                    <option key={item.value} value={item.value}
                    >
                      {item.label && getFieldLabel(item, 'label')}
                    </option>
                  ))}
                </Input>
              </div>
            </div>
          </div>

          {props.fieldRelationItems && props.fieldRelationItems.length > 0 && (
            <>
              <div className='mb-2'>
                {translate('setting.importCSV.screenTwo.targetRelation')}{' '}
                <a title=''>
                  <img className='ml-5' title='' src='../../content/images/common/ic-faq.svg' alt='' />
                </a>
              </div>
              <div className='d-flex mb-4 align-items-center'>
                <div className='mapping-key-item w45 mr-1'>紐付型項目A</div>
                <div className=' w55'>
                  <div className='select-option select-option mt-2'>
                    <Input
                      type='select'
                      name='select'
                      id='select-field-recation-id'
                      style={{ borderRadius: 12 }}
                      placeholder='Select'
                      onChange={e => props.setRelationName(e.target.value)}
                    >
                      {props.fieldRelationItems.map(item => (
                        <option key={item.fieldName} value={item.fieldName}>
                          {item.fieldLabel && JSON.parse(item.fieldLabel)['ja_jp']}
                        </option>
                      ))}
                    </Input>
                  </div>
                </div>
              </div>

              <div className='d-flex align-items-center'>
                <div className='mapping-key-item w45'>紐付型項目B</div>
                <div className=' w55'>
                  <div className='select-option select-option mt-2'>
                    <Input
                      type='select'
                      name='select'
                      id='select-field-recation-id'
                      style={{ borderRadius: 10 }}
                      placeholder='Select'
                      onChange={e => props.setRelationMapping(e.target.event)}
                    >
                      {relationName && relationMatching &&
                        [{ fieldId: -1 }, ...relationMatching].map(item => (
                          <option key={item.fieldId} value={item.fieldId}>
                            {item.fieldLabel && getFieldLabel(item, 'label')}
                          </option>
                        ))}
                    </Input>
                  </div>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
      <div className='mb-3'>
        <a title='' className='color-blue'>
          {translate('setting.importCSV.screenTwo.matchingSettingLabel')}
        </a>
      </div>
      <div className='w65 block-feedback block-feedback-blue mb-2'>
        <span className='color-red'>
          {translate('setting.importCSV.screenTwo.red')}
        </span>
        {translate('setting.importCSV.screenTwo.itemDisplayLabel')}
      </div>
      {
        props.errorCode &&
        <div className="w65 block-feedback block-feedback-blue">
          <span className="color-red">{translate('messages.' + props.errorMessage)}</span>
        </div>
      }
      {!props.errorCode &&
        <div style={{ overflow: 'auto' }}>
          {headersCSV && headersCSV.length > 0 && headers && headers.length > 0 && (
            <table className='table-default table-align-cente' style={{ minWidth: '1300px' }}>
              <tbody>
                <tr>
                  <td className='title-table'>
                    <div style={{ width: '170px' }}>
                      {translate('setting.importCSV.screenTwo.CSVHeader')}
                    </div>
                  </td>
                  {headersCSV.map(header => (
                    <td className='title-table' key={header.fieldName}>
                      <div style={{ minWidth: header.modifyFlag === 2 || header.modifyFlag === 3 ? '250px' : '130px' }}>
                        {header}
                      </div>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className='title-table'>
                    {translate('setting.importCSV.screenTwo.dataHeader')}
                  </td>
                  {headers.map(header => (
                    <td className='title-table' key={header.fieldName}>
                      <div style={{ minWidth: header.modifyFlag === 2 || header.modifyFlag === 3 ? '250px' : '130px' }}>
                        {header.label}
                      </div>
                    </td>
                  ))}
                </tr>
                {tableRows.map((record, indexRow) => (
                  <tr key={`${indexRow}_key`}>
                    <td className='title-table'>{`${translate('setting.importCSV.screenTwo.numberHeader')}${indexRow + 1}`}</td>
                    {props.importMappingItemsData && props.importMappingItemsData.map((item, indexCol) => (
                      <td key={`${indexCol}_key`} className='title-table'>
                        <a title='' className={item.fieldName === matchingKeys ? 'color-red' : 'color-blue'}>
                          {record[item.columnCsv]}
                        </a>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      }
    </div>
  );
};

const mapStateToProps = ({ uploadCSV }: IRootState) => ({
  importMatchingKeysData: uploadCSV.importMatchingKeys,
  fieldRelationItemsData: uploadCSV.fieldRelationItems,
  importMappingItemsData: uploadCSV.importMappingItems,
  errorMessage: uploadCSV.errorMessage
});

const mapDispatchToProps = {
  handleGetFieldRelationItems,
  handleGetImportMatchingKeys,
  handleGetImportMappingItems,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MappingFileStep);

