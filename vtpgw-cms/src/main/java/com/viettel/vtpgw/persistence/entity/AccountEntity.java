package com.viettel.vtpgw.persistence.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

@Entity
@Table(
        name = "vtpgw_account",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "accountId", name = "UK_acc_accountId"),
                @UniqueConstraint(columnNames = "email", name = "UK_acc_email")
        }
)
@Getter
@Setter
public class AccountEntity extends BaseEntity {

    private String accountId;
    private Integer status;
    private String email;
    private String fullname;
    private String phone;
    private String salt;
    private String password;
}
