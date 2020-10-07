package com.viettel.vtpgw.persistence.repository;

import com.viettel.vtpgw.persistence.entity.ReportEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.transaction.Transactional;
import java.util.Date;

@Transactional
public interface IReportRepository extends JpaRepository<ReportEntity, Long> {
    ReportEntity findByServiceNameAndAppId(String serviceName, String appId);
    Page<ReportEntity> findByServiceNameOrderByNodeUrl(String serviceName, Pageable pageable);
    Page<ReportEntity> findByServiceNameAndNodeUrl(String serviceName, String nodeUrl, Pageable pageable);
    Page<ReportEntity> findByServiceNameAndExecutionTimeBetween(String serviceName, Date startDate, Date endDate, Pageable pageable);
    Page<ReportEntity> findByServiceNameAndExecutionTimeGreaterThanEqual(String serviceName, Date startDate, Pageable pageable);
    Page<ReportEntity> findByServiceNameAndExecutionTimeLessThanEqual(String serviceName, Date endDate, Pageable pageable);
}
