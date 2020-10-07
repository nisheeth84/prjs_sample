package com.viettel.vtpgw.persistence.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.Date;

@Entity
@Table(name="vtpgw_log")
@Getter
@Setter
public class ReportEntity {

    @Id
    private Integer id;
    private Date executionTime;
    private Integer responseTime;
    private Integer statusCode;
    private String requestContent;
    private String responseContent;
    private String serviceName;
    private String appId;
    private String nodeUrl;
}
