/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.dto;

import com.viettel.coms.bo.TmpnFinanceBO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import javax.xml.bind.annotation.XmlRootElement;

/**
 * @author thuannht
 */
@XmlRootElement(name = "TMPN_FINANCEBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class TmpnFinanceDTO extends ComsBaseFWDTO<TmpnFinanceBO> {

    private java.lang.Long tmpnFinanceId;
    private java.lang.Long totalMonthPlanId;
    private java.lang.Long sysGroupId;
    private java.lang.Long month;
    private java.lang.Long year;
    private java.lang.Double firstTimes;
    private java.lang.Double secondTimes;
    private java.lang.Double threeTimes;
    private java.lang.String description;
    private String sysGroupName;
    private String errorFilePath;

    @Override
    public TmpnFinanceBO toModel() {
        TmpnFinanceBO tmpnFinanceBO = new TmpnFinanceBO();
        tmpnFinanceBO.setTmpnFinanceId(this.tmpnFinanceId);
        tmpnFinanceBO.setTotalMonthPlanId(this.totalMonthPlanId);
        tmpnFinanceBO.setSysGroupId(this.sysGroupId);
        tmpnFinanceBO.setMonth(this.month);
        tmpnFinanceBO.setYear(this.year);
        tmpnFinanceBO.setFirstTimes(this.firstTimes * 1000000);
        if (this.secondTimes != null) {
            tmpnFinanceBO.setSecondTimes(this.secondTimes * 1000000);
        } else {
            tmpnFinanceBO.setSecondTimes(0D);
        }
        if (this.threeTimes != null) {
            tmpnFinanceBO.setThreeTimes(this.threeTimes * 1000000);
        } else {
            tmpnFinanceBO.setThreeTimes(0D);
        }
        tmpnFinanceBO.setDescription(this.description);
        return tmpnFinanceBO;
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
        return tmpnFinanceId;
    }

    @Override
    public String catchName() {
        return getTmpnFinanceId().toString();
    }

    public java.lang.Long getTmpnFinanceId() {
        return tmpnFinanceId;
    }

    public void setTmpnFinanceId(java.lang.Long tmpnFinanceId) {
        this.tmpnFinanceId = tmpnFinanceId;
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

    public java.lang.Double getFirstTimes() {
        return firstTimes != null ? firstTimes / 1000000 : 0;
    }

    public void setFirstTimes(java.lang.Double firstTimes) {
        this.firstTimes = firstTimes;
    }

    public java.lang.Double getSecondTimes() {
        return secondTimes != null ? secondTimes / 1000000 : 0;
    }

    public void setSecondTimes(java.lang.Double secondTimes) {
        this.secondTimes = secondTimes;
    }

    public java.lang.Double getThreeTimes() {
        return threeTimes != null ? threeTimes / 1000000 : 0;
    }

    public void setThreeTimes(java.lang.Double threeTimes) {
        this.threeTimes = threeTimes;
    }

    public java.lang.String getDescription() {
        return description;
    }

    public void setDescription(java.lang.String description) {
        this.description = description;
    }

}
