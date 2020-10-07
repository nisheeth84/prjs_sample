/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.dto;

import com.viettel.coms.bo.TmpnContractBO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import javax.xml.bind.annotation.XmlRootElement;

/**
 * @author thuannht
 */
@XmlRootElement(name = "TMPN_CONTRACTBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class TmpnContractDTO extends ComsBaseFWDTO<TmpnContractBO> {

    private java.lang.Long tmpnContractId;
    private java.lang.Long totalMonthPlanId;
    private java.lang.Long sysGroupId;
    private java.lang.Long month;
    private java.lang.Long year;
    private java.lang.Double complete;
    private java.lang.Double enoughCondition;
    private java.lang.Double noEnoughCondition;
    private java.lang.String description;
    private String sysGroupName;
    private String errorFilePath;

    @Override
    public TmpnContractBO toModel() {
        TmpnContractBO tmpnContractBO = new TmpnContractBO();
        tmpnContractBO.setTmpnContractId(this.tmpnContractId);
        tmpnContractBO.setTotalMonthPlanId(this.totalMonthPlanId);
        tmpnContractBO.setSysGroupId(this.sysGroupId);
        tmpnContractBO.setMonth(this.month);
        tmpnContractBO.setYear(this.year);
        tmpnContractBO.setComplete(this.complete);
        tmpnContractBO.setEnoughCondition(this.enoughCondition);
        tmpnContractBO.setNoEnoughCondition(this.noEnoughCondition);
        tmpnContractBO.setDescription(this.description);
        return tmpnContractBO;
    }

    public String getErrorFilePath() {
        return errorFilePath;
    }

    public void setErrorFilePath(String errorFilePath) {
        this.errorFilePath = errorFilePath;
    }

    public String getSysGroupName() {
        return sysGroupName;
    }

    public void setSysGroupName(String sysGroupName) {
        this.sysGroupName = sysGroupName;
    }

    @Override
    public Long getFWModelId() {
        return tmpnContractId;
    }

    @Override
    public String catchName() {
        return getTmpnContractId().toString();
    }

    public java.lang.Long getTmpnContractId() {
        return tmpnContractId;
    }

    public void setTmpnContractId(java.lang.Long tmpnContractId) {
        this.tmpnContractId = tmpnContractId;
    }

    public java.lang.Long getTotalMonthPlanId() {
        return totalMonthPlanId;
    }

    public void setTotalMonthPlanId(java.lang.Long totalMonthPlanId) {
        this.totalMonthPlanId = totalMonthPlanId;
    }

    public java.lang.Long getSysGroupId() {
        return sysGroupId;
    }

    public void setSysGroupId(java.lang.Long sysGroupId) {
        this.sysGroupId = sysGroupId;
    }

    public java.lang.Long getMonth() {
        return month;
    }

    public void setMonth(java.lang.Long month) {
        this.month = month;
    }

    public java.lang.Long getYear() {
        return year;
    }

    public void setYear(java.lang.Long year) {
        this.year = year;
    }

    public java.lang.Double getComplete() {
        return complete;
    }

    public void setComplete(java.lang.Double complete) {
        this.complete = complete;
    }

    public java.lang.Double getEnoughCondition() {
        return enoughCondition;
    }

    public void setEnoughCondition(java.lang.Double enoughCondition) {
        this.enoughCondition = enoughCondition;
    }

    public java.lang.Double getNoEnoughCondition() {
        return noEnoughCondition;
    }

    public void setNoEnoughCondition(java.lang.Double noEnoughCondition) {
        this.noEnoughCondition = noEnoughCondition;
    }

    public java.lang.String getDescription() {
        return description;
    }

    public void setDescription(java.lang.String description) {
        this.description = description;
    }

}
