package com.viettel.vtpgw.persistence.repository;

import com.viettel.vtpgw.persistence.dto.model.ServiceDto;
import com.viettel.vtpgw.persistence.entity.ServiceEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import javax.transaction.Transactional;

@Transactional
public interface IServiceRepository extends JpaRepository<ServiceEntity, Long> {

    Page<ServiceEntity> findByNameContainingIgnoreCase(String name, Pageable pageable);
    ServiceEntity findByName(String name);

    @Query(value = "select new com.viettel.vtpgw.persistence.dto.model.ServiceDto " +
            "(se.id, se.serviceId, se.status, se.module, se.idleTimeout, se.connectTimeout, se.name, se.description, " +
            "se.capacity, se.period, se.contact, se.reportInterval, se.standardDuration, se.sandboxEndpoint) " +
            "from ServiceEntity se " +
            "order by se.id desc")
    Page<ServiceDto> findAllByOrderByIdDesc(Pageable pageable);
}
