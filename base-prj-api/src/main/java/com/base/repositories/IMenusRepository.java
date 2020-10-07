package com.base.repositories;

import com.base.entities.MenusEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IMenusRepository extends JpaRepository<MenusEntity, Integer> {
}
