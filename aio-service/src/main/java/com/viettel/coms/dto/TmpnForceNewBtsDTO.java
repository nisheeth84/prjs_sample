/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.dto;

import com.viettel.coms.bo.TmpnForceNewBtsBO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import javax.xml.bind.annotation.XmlRootElement;

/**
 * @author thuannht
 */
@XmlRootElement(name = "TMPN_FORCE_NEW_BTSBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class TmpnForceNewBtsDTO extends ComsBaseFWDTO<TmpnForceNewBtsBO> {

    private java.lang.Long tmpnForceNewBtsId;
    private java.lang.Long totalMonthPlanId;
    private java.lang.Long sysGroupId;
    private java.lang.Long month;
    private java.lang.Long year;
    private java.lang.Long stationNumber;
    private java.lang.Long teamBuildRequire;
    private java.lang.Long teamBuildAvaiable;
    private java.lang.Double selfImplementPercent;
    private java.lang.String description;
    private String sysGroupName;
    private String errorFilePath;

    @Override
    public TmpnForceNewBtsBO toModel() {
        TmpnForceNewBtsBO tmpnForceNewBtsBO = new TmpnForceNewBtsBO();
        tmpnForceNewBtsBO.setTmpnForceNewBtsId(this.tmpnForceNewBtsId);
        tmpnForceNewBtsBO.setTotalMonthPlanId(this.totalMonthPlanId);
        tmpnForceNewBtsBO.setSysGroupId(this.sysGroupId);
        tmpnForceNewBtsBO.setMonth(this.month);
        tmpnForceNewBtsBO.setYear(this.year);
        tmpnForceNewBtsBO.setStationNumber(this.stationNumber);
        tmpnForceNewBtsBO.setTeamBuildRequire(this.teamBuildRequire);
        tmpnForceNewBtsBO.setTeamBuildAvaiable(this.teamBuildAvaiable);
        tmpnForceNewBtsBO.setSelfImplementPercent(this.selfImplementPercent);
        tmpnForceNewBtsBO.setDescription(this.description);
        return tmpnForceNewBtsBO;
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
        return tmpnForceNewBtsId;
    }

    @Override
    public String catchName() {
        return getTmpnForceNewBtsId().toString();
    }

    public java.lang.Long getTmpnForceNewBtsId() {
        return tmpnForceNewBtsId;
    }

    public void setTmpnForceNewBtsId(java.lang.Long tmpnForceNewBtsId) {
        this.tmpnForceNewBtsId = tmpnForceNewBtsId;
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

    public java.lang.Long getStationNumber() {
        return stationNumber;
    }

    public void setStationNumber(java.lang.Long stationNumber) {
        this.stationNumber = stationNumber;
    }

    public java.lang.Long getTeamBuildRequire() {
        return teamBuildRequire;
    }

    public void setTeamBuildRequire(java.lang.Long teamBuildRequire) {
        this.teamBuildRequire = teamBuildRequire;
    }

    public java.lang.Long getTeamBuildAvaiable() {
        return teamBuildAvaiable;
    }

    public void setTeamBuildAvaiable(java.lang.Long teamBuildAvaiable) {
        this.teamBuildAvaiable = teamBuildAvaiable;
    }

    public java.lang.Double getSelfImplementPercent() {
        return selfImplementPercent;
    }

    public void setSelfImplementPercent(java.lang.Double selfImplementPercent) {
        this.selfImplementPercent = selfImplementPercent;
    }

    public java.lang.String getDescription() {
        return description;
    }

    public void setDescription(java.lang.String description) {
        this.description = description;
    }

}
