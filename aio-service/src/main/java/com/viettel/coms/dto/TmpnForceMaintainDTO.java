/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.dto;

import com.viettel.coms.bo.TmpnForceMaintainBO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import javax.xml.bind.annotation.XmlRootElement;

/**
 * @author thuannht
 */
@XmlRootElement(name = "TMPN_FORCE_MAINTAINBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class TmpnForceMaintainDTO extends ComsBaseFWDTO<TmpnForceMaintainBO> {

    private java.lang.Long tmpnForceMaintainId;
    private java.lang.Long totalMonthPlanId;
    private java.lang.Long sysGroupId;
    private java.lang.Long month;
    private java.lang.Long year;
    private java.lang.Long buildPlan;
    private java.lang.Long installPlan;
    private java.lang.Long replacePlan;
    private java.lang.Long teamBuildRequire;
    private java.lang.Long teamBuildAvaiable;
    private java.lang.Long teamInstallRequire;
    private java.lang.Long teamInstallAvaiable;
    private java.lang.String description;
    private String errorFilePath;
    private String sysGroupName;

    @Override
    public TmpnForceMaintainBO toModel() {
        TmpnForceMaintainBO tmpnForceMaintainBO = new TmpnForceMaintainBO();
        tmpnForceMaintainBO.setTmpnForceMaintainId(this.tmpnForceMaintainId);
        tmpnForceMaintainBO.setTotalMonthPlanId(this.totalMonthPlanId);
        tmpnForceMaintainBO.setSysGroupId(this.sysGroupId);
        tmpnForceMaintainBO.setMonth(this.month);
        tmpnForceMaintainBO.setYear(this.year);
        tmpnForceMaintainBO.setBuildPlan(this.buildPlan);
        tmpnForceMaintainBO.setInstallPlan(this.installPlan);
        tmpnForceMaintainBO.setReplacePlan(this.replacePlan);
        tmpnForceMaintainBO.setTeamBuildRequire(this.teamBuildRequire);
        tmpnForceMaintainBO.setTeamBuildAvaiable(this.teamBuildAvaiable);
        tmpnForceMaintainBO.setTeamInstallRequire(this.teamInstallRequire);
        tmpnForceMaintainBO.setTeamInstallAvaiable(this.teamInstallAvaiable);
        tmpnForceMaintainBO.setDescription(this.description);
        return tmpnForceMaintainBO;
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
        return tmpnForceMaintainId;
    }

    @Override
    public String catchName() {
        return getTmpnForceMaintainId().toString();
    }

    public java.lang.Long getTmpnForceMaintainId() {
        return tmpnForceMaintainId;
    }

    public void setTmpnForceMaintainId(java.lang.Long tmpnForceMaintainId) {
        this.tmpnForceMaintainId = tmpnForceMaintainId;
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

    public java.lang.Long getBuildPlan() {
        return buildPlan;
    }

    public void setBuildPlan(java.lang.Long buildPlan) {
        this.buildPlan = buildPlan;
    }

    public java.lang.Long getInstallPlan() {
        return installPlan;
    }

    public void setInstallPlan(java.lang.Long installPlan) {
        this.installPlan = installPlan;
    }

    public java.lang.Long getReplacePlan() {
        return replacePlan;
    }

    public void setReplacePlan(java.lang.Long replacePlan) {
        this.replacePlan = replacePlan;
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

    public java.lang.Long getTeamInstallRequire() {
        return teamInstallRequire;
    }

    public void setTeamInstallRequire(java.lang.Long teamInstallRequire) {
        this.teamInstallRequire = teamInstallRequire;
    }

    public java.lang.Long getTeamInstallAvaiable() {
        return teamInstallAvaiable;
    }

    public void setTeamInstallAvaiable(java.lang.Long teamInstallAvaiable) {
        this.teamInstallAvaiable = teamInstallAvaiable;
    }

    public java.lang.String getDescription() {
        return description;
    }

    public void setDescription(java.lang.String description) {
        this.description = description;
    }

}
