package jp.co.softbrain.esales.tenants.service;

import java.util.Optional;
import com.amazonaws.xray.spring.aop.XRayEnabled;
import jp.co.softbrain.esales.tenants.domain.BatchStatus;

/**
 * Interface of business logic for BatchStatus
 *
 * @author phamhoainam
 */
@XRayEnabled
public interface BatchStatusService {


    /**
     * Insert batch status record
     *
     * @param batchStatus batchStatus
     * @return created batch status
     */
    BatchStatus createBatchStatus(BatchStatus batchStatus);

    /**
     * Lock record batch status
     *
     * @return BatchStatus
     */
    Optional<BatchStatus> findForUpdate();

    /**
     * Update timestamp for check batch running
     *
     * @param batchStatus current batchStatus
     */
    void updateBatchStatusTime(BatchStatus batchStatus);
}
