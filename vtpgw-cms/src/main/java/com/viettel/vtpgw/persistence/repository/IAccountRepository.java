package com.viettel.vtpgw.persistence.repository;

import com.viettel.vtpgw.persistence.entity.AccountEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.transaction.Transactional;

@Transactional
public interface IAccountRepository extends JpaRepository<AccountEntity, Long> {

    Page<AccountEntity> findByEmailContainingOrFullnameContainingOrPhoneContaining(String email, String fullname, String phone, Pageable pageable);
    Page<AccountEntity> findAllByOrderByIdDesc(Pageable pageable);
    AccountEntity findByEmail(String username);
    AccountEntity findByEmailAndStatus(String username, Integer status);
}
