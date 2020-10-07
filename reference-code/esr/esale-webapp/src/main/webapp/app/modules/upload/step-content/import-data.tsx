import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

// export interface IUploadFileStepProps {

// }

const ImportData = props => {
  return (
    <div className='popup-tab-content align-center font-weight-500'>
      <div className='align-center mt-5 pt-5 pb-4 '>
        <div className='mb-4'>
          <strong>インポートシミユレーション完了 </strong>
        </div>
        <img title='' src='../../content/images/common/ic-csv-delete.svg' alt='' />
      </div>
      <div className='color-red mb-2'>エラーテータの窃認</div>
      <div>チェック完了データ数 538 件</div>
      <div>
        投入可能データ故 <span className='color-blue pl-4'>500</span> 件
      </div>
      <div>
        工ラーデータ数 <span className='color-red pl-4 ml-2'>38 </span> 件
      </div>
    </div>
  );
};

export default connect()(ImportData);
