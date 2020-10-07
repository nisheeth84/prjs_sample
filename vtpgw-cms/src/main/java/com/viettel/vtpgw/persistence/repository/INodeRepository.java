package com.viettel.vtpgw.persistence.repository;

import com.viettel.vtpgw.persistence.entity.NodeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.transaction.Transactional;

@Transactional
public interface INodeRepository extends JpaRepository<NodeEntity, Long> {
}
