package com.viettel.vtpgw.persistence.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "vtpgw_contacts")
@Getter
@Setter
public class ContactEntity {

    @Id
    private String id;
    private String createdBy;
    private String email;
    private String fullname;
    private String phone;
    private String address;
    private Integer status;
    private String updatedBy;
    private Long updated;
}
