package com.viettel.vtpgw.persistence.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.viettel.vtpgw.persistence.entity.ContactEntity;

public interface IContactRepository extends JpaRepository<ContactEntity, String>{
	Page<ContactEntity> findByEmailContainingOrPhoneContainingOrFullnameContaining(String email, String Phone, String fullname, Pageable pageable);
	ContactEntity findByEmail(String email);
}
