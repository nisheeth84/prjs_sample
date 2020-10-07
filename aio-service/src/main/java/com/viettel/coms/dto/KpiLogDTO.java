/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.dto;

import com.viettel.coms.bo.KpiLogBO;

import javax.xml.bind.annotation.XmlRootElement;

/**
 * @author thuannht
 */
@XmlRootElement(name = "KPI_LOGBO")
public class KpiLogDTO extends ComsBaseFWDTO<KpiLogBO> {

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

    @Override
    public KpiLogBO toModel() {
        KpiLogBO kpiLogBO = new KpiLogBO();
        kpiLogBO.setKpiLogId(this.kpiLogId);
        kpiLogBO.setCreateDatetime(this.createDatetime);
        kpiLogBO.setFunctionCode(this.functionCode);
        kpiLogBO.setDescription(this.description);
        kpiLogBO.setTransactionCode(this.transactionCode);
        kpiLogBO.setStartTime(this.startTime);
        kpiLogBO.setEndTime(this.endTime);
        kpiLogBO.setDuration(this.duration);
        kpiLogBO.setStatus(this.status);
        kpiLogBO.setReason(this.reason);
        kpiLogBO.setCreateUserId(this.createUserId);
        return kpiLogBO;
    }

    public java.lang.Long getKpiLogId() {
        return kpiLogId;
    }

    public void setKpiLogId(java.lang.Long kpiLogId) {
        this.kpiLogId = kpiLogId;
    }

    public java.util.Date getCreateDatetime() {
        return createDatetime;
    }

    public void setCreateDatetime(java.util.Date createDatetime) {
        this.createDatetime = createDatetime;
    }

    public java.lang.String getFunctionCode() {
        return functionCode;
    }

    public void setFunctionCode(java.lang.String functionCode) {
        this.functionCode = functionCode;
    }

    public java.lang.String getDescription() {
        return description;
    }

    public void setDescription(java.lang.String description) {
        this.description = description;
    }

    public java.lang.String getTransactionCode() {
        return transactionCode;
    }

    public void setTransactionCode(java.lang.String transactionCode) {
        this.transactionCode = transactionCode;
    }

    public java.util.Date getStartTime() {
        return startTime;
    }

    public void setStartTime(java.util.Date startTime) {
        this.startTime = startTime;
    }

    public java.util.Date getEndTime() {
        return endTime;
    }

    public void setEndTime(java.util.Date endTime) {
        this.endTime = endTime;
    }

    public java.lang.Long getDuration() {
        return duration;
    }

    public void setDuration(java.lang.Long duration) {
        this.duration = duration;
    }

    public java.lang.String getStatus() {
        return status;
    }

    public void setStatus(java.lang.String status) {
        this.status = status;
    }

    public java.lang.String getReason() {
        return reason;
    }

    public void setReason(java.lang.String reason) {
        this.reason = reason;
    }

    public java.lang.Long getCreateUserId() {
        return createUserId;
    }

    public void setCreateUserId(java.lang.Long createUserId) {
        this.createUserId = createUserId;
    }

    @Override
    public String catchName() {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public Long getFWModelId() {
        // TODO Auto-generated method stub
        return null;
    }

}
