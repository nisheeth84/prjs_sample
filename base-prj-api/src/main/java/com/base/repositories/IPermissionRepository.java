package com.base.repositories;

import com.base.entities.PermissionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IPermissionRepository extends JpaRepository<PermissionEntity, Integer> {
    List<PermissionEntity> findByGroupId(Integer groupId);
}
