package com.viettel.vtpgw.persistence.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

@Entity
@Table(
        name = "vtpgw_app",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "appId", name = "UK_a_appId"),
                @UniqueConstraint(columnNames = "applicationId", name = "UK_a_applicationId")
        }
)
@Getter
@Setter
public class ApplicationEntity extends BaseEntity {

    private String applicationId;
    private Integer status;
    private String token;
    private String contact;
    private String appId;
}
