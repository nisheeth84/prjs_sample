package com.base.repositories;

import com.base.entities.UsersEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IUsersRepository extends JpaRepository<UsersEntity, Long> {
    UsersEntity findByUsername(String username);
}
