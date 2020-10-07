package jp.co.softbrain.esales.tenants.service.impl;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jp.co.softbrain.esales.tenants.domain.BatchStatus;
import jp.co.softbrain.esales.tenants.repository.BatchStatusRepository;
import jp.co.softbrain.esales.tenants.service.BatchStatusService;

/**
 * Service Implementation for BatchStatusService
 * @author phamhoainam
 */
@Service
@Transactional(transactionManager = "tenantTransactionManager")
public class BatchStatusServiceImpl implements BatchStatusService {
    
    @Autowired
    private BatchStatusRepository batchStatusRepository;

    /**
     * @see BatchStatusService#createBatchStatus(BatchStatus)
     */
    @Override
    public BatchStatus createBatchStatus(BatchStatus batchStatus) {
        return batchStatusRepository.save(batchStatus);
    }

    /**
     * @see BatchStatusService#findForUpdate()
     */
    @Override
    public Optional<BatchStatus> findForUpdate() {
        return batchStatusRepository.findForUpdate();
    }

    /**
     * @see BatchStatusService#updateBatchStatusTime(BatchStatus)
     */
    @Override
    public void updateBatchStatusTime(BatchStatus batchStatus) {
        batchStatusRepository.save(batchStatus);
    }

}
