package com.viettel.vtpgw.persistence.repository;

import com.viettel.vtpgw.persistence.entity.PermissionEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.transaction.Transactional;

@Transactional
public interface IPermissionRepository extends JpaRepository<PermissionEntity, Long> {

    Page<PermissionEntity> findByServiceIdContainingOrAppIdContaining(String serviceId, String appId, Pageable pageable);
    Page<PermissionEntity> findAllByOrderByIdDesc(Pageable pageable);
}
