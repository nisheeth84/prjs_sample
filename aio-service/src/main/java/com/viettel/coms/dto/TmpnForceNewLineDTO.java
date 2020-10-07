/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.dto;

import com.viettel.coms.bo.TmpnForceNewLineBO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import javax.xml.bind.annotation.XmlRootElement;

/**
 * @author thuannht
 */
@XmlRootElement(name = "TMPN_FORCE_NEW_LINEBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class TmpnForceNewLineDTO extends ComsBaseFWDTO<TmpnForceNewLineBO> {

    private java.lang.Long tmpnForceNewLineId;
    private java.lang.Long totalMonthPlanId;
    private java.lang.Long sysGroupId;
    private java.lang.Long month;
    private java.lang.Long year;
    private java.lang.Double stationNumber;
    private java.lang.Double currentHaveLicense;
    private java.lang.Double currentQuantity;
    private java.lang.Double curentStationComplete;
    private java.lang.Double remainHaveLicense;
    private java.lang.Double remainQuantity;
    private java.lang.Double remainStationComplete;
    private java.lang.String description;
    private String sysGroupName;
    private String errorFilePath;

    @Override
    public TmpnForceNewLineBO toModel() {
        TmpnForceNewLineBO tmpnForceNewLineBO = new TmpnForceNewLineBO();
        tmpnForceNewLineBO.setTmpnForceNewLineId(this.tmpnForceNewLineId);
        tmpnForceNewLineBO.setTotalMonthPlanId(this.totalMonthPlanId);
        tmpnForceNewLineBO.setSysGroupId(this.sysGroupId);
        tmpnForceNewLineBO.setMonth(this.month);
        tmpnForceNewLineBO.setYear(this.year);
        tmpnForceNewLineBO.setStationNumber(this.stationNumber);
        tmpnForceNewLineBO.setCurrentHaveLicense(this.currentHaveLicense);
        tmpnForceNewLineBO.setCurrentQuantity(this.currentQuantity);
        tmpnForceNewLineBO.setCurentStationComplete(this.curentStationComplete);
        tmpnForceNewLineBO.setRemainHaveLicense(this.remainHaveLicense);
        tmpnForceNewLineBO.setRemainQuantity(this.remainQuantity);
        tmpnForceNewLineBO.setRemainStationComplete(this.remainStationComplete);
        tmpnForceNewLineBO.setDescription(this.description);
        return tmpnForceNewLineBO;
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
        return tmpnForceNewLineId;
    }

    @Override
    public String catchName() {
        return getTmpnForceNewLineId().toString();
    }

    public java.lang.Long getTmpnForceNewLineId() {
        return tmpnForceNewLineId;
    }

    public void setTmpnForceNewLineId(java.lang.Long tmpnForceNewLineId) {
        this.tmpnForceNewLineId = tmpnForceNewLineId;
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

    public java.lang.Double getStationNumber() {
        return stationNumber;
    }

    public void setStationNumber(java.lang.Double stationNumber) {
        this.stationNumber = stationNumber;
    }

    public java.lang.Double getCurrentHaveLicense() {
        return currentHaveLicense;
    }

    public void setCurrentHaveLicense(java.lang.Double currentHaveLicense) {
        this.currentHaveLicense = currentHaveLicense;
    }

    public java.lang.Double getCurrentQuantity() {
        return currentQuantity;
    }

    public void setCurrentQuantity(java.lang.Double currentQuantity) {
        this.currentQuantity = currentQuantity;
    }

    public java.lang.Double getCurentStationComplete() {
        return curentStationComplete;
    }

    public void setCurentStationComplete(java.lang.Double curentStationComplete) {
        this.curentStationComplete = curentStationComplete;
    }

    public java.lang.Double getRemainHaveLicense() {
        return remainHaveLicense;
    }

    public void setRemainHaveLicense(java.lang.Double remainHaveLicense) {
        this.remainHaveLicense = remainHaveLicense;
    }

    public java.lang.Double getRemainQuantity() {
        return remainQuantity;
    }

    public void setRemainQuantity(java.lang.Double remainQuantity) {
        this.remainQuantity = remainQuantity;
    }

    public java.lang.Double getRemainStationComplete() {
        return remainStationComplete;
    }

    public void setRemainStationComplete(java.lang.Double remainStationComplete) {
        this.remainStationComplete = remainStationComplete;
    }

    public java.lang.String getDescription() {
        return description;
    }

    public void setDescription(java.lang.String description) {
        this.description = description;
    }

}
