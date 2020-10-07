package com.viettel.vtpgw.persistence.repository;

import com.viettel.vtpgw.persistence.entity.ApplicationEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.transaction.Transactional;

@Transactional
public interface IApplicationRepository extends JpaRepository<ApplicationEntity, Long> {
    Page<ApplicationEntity> findByAppIdContainingOrContactContaining(String appId, String contact, Pageable pageable);
    Page<ApplicationEntity> findAllByOrderByIdDesc(Pageable pageable);
    ApplicationEntity findByAppId(String appId);
}
