/*
 * Copyright 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.coms.bo;

import com.viettel.coms.dto.KpiLogDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@Entity
@Table(name = "KPI_LOG")
/**
 *
 * @author: ThuanNHT
 * @version: 1.0
 * @since: 1.0
 */
public class KpiLogBO extends BaseFWModelImpl {

    private java.lang.Long kpiLogId;
    private java.util.Date createDatetime;
    private java.lang.String functionCode;
    private java.lang.String description;
    private java.lang.String transactionCode;
    private java.util.Date startTime;
    private java.util.Date endTime;
    private java.lang.Long duration;
    private java.lang.String status;
    private java.lang.String reason;
    private java.lang.Long createUserId;

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @Parameter(name = "sequence", value = "KPI_LOG_SEQ")})
    @Column(name = "KPI_LOG_ID", length = 22)
    public java.lang.Long getKpiLogId() {
        return kpiLogId;
    }

    public void setKpiLogId(java.lang.Long kpiLogId) {
        this.kpiLogId = kpiLogId;
    }

    @Column(name = "CREATE_DATETIME", length = 7)
    public java.util.Date getCreateDatetime() {
        return createDatetime;
    }

    public void setCreateDatetime(java.util.Date createDatetime) {
        this.createDatetime = createDatetime;
    }

    @Column(name = "FUNCTION_CODE", length = 100)
    public java.lang.String getFunctionCode() {
        return functionCode;
    }

    public void setFunctionCode(java.lang.String functionCode) {
        this.functionCode = functionCode;
    }

    @Column(name = "DESCRIPTION", length = 1000)
    public java.lang.String getDescription() {
        return description;
    }

    public void setDescription(java.lang.String description) {
        this.description = description;
    }

    @Column(name = "TRANSACTION_CODE", length = 100)
    public java.lang.String getTransactionCode() {
        return transactionCode;
    }

    public void setTransactionCode(java.lang.String transactionCode) {
        this.transactionCode = transactionCode;
    }

    @Column(name = "START_TIME", length = 7)
    public java.util.Date getStartTime() {
        return startTime;
    }

    public void setStartTime(java.util.Date startTime) {
        this.startTime = startTime;
    }

    @Column(name = "END_TIME", length = 7)
    public java.util.Date getEndTime() {
        return endTime;
    }

    public void setEndTime(java.util.Date endTime) {
        this.endTime = endTime;
    }

    @Column(name = "DURATION", length = 22)
    public java.lang.Long getDuration() {
        return duration;
    }

    public void setDuration(java.lang.Long duration) {
        this.duration = duration;
    }

    @Column(name = "STATUS", length = 4)
    public java.lang.String getStatus() {
        return status;
    }

    public void setStatus(java.lang.String status) {
        this.status = status;
    }

    @Column(name = "REASON", length = 400)
    public java.lang.String getReason() {
        return reason;
    }

    public void setReason(java.lang.String reason) {
        this.reason = reason;
    }

    @Column(name = "CREATE_USER_ID", length = 22)
    public java.lang.Long getCreateUserId() {
        return createUserId;
    }

    public void setCreateUserId(java.lang.Long createUserId) {
        this.createUserId = createUserId;
    }

    @Override
    public KpiLogDTO toDTO() {
        KpiLogDTO kpiLogDTO = new KpiLogDTO();
        // set cac gia tri
        kpiLogDTO.setKpiLogId(this.kpiLogId);
        kpiLogDTO.setCreateDatetime(this.createDatetime);
        kpiLogDTO.setFunctionCode(this.functionCode);
        kpiLogDTO.setDescription(this.description);
        kpiLogDTO.setTransactionCode(this.transactionCode);
        kpiLogDTO.setStartTime(this.startTime);
        kpiLogDTO.setEndTime(this.endTime);
        kpiLogDTO.setDuration(this.duration);
        kpiLogDTO.setStatus(this.status);
        kpiLogDTO.setReason(this.reason);
        kpiLogDTO.setCreateUserId(this.createUserId);
        return kpiLogDTO;
    }
}
