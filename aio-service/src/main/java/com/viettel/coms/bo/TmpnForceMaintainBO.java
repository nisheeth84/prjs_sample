/*
 * Copyright 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.coms.bo;

import com.viettel.coms.dto.TmpnForceMaintainDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@Entity
@Table(name = "TMPN_FORCE_MAINTAIN")
/**
 *
 * @author: ThuanNHT
 * @version: 1.0
 * @since: 1.0
 */
public class TmpnForceMaintainBO extends BaseFWModelImpl {

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

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @Parameter(name = "sequence", value = "TMPN_FORCE_MAINTAIN_SEQ")})
    @Column(name = "TMPN_FORCE_MAINTAIN_ID", length = 22)
    public java.lang.Long getTmpnForceMaintainId() {
        return tmpnForceMaintainId;
    }

    public void setTmpnForceMaintainId(java.lang.Long tmpnForceMaintainId) {
        this.tmpnForceMaintainId = tmpnForceMaintainId;
    }

    @Column(name = "TOTAL_MONTH_PLAN_ID", length = 22)
    public java.lang.Long getTotalMonthPlanId() {
        return totalMonthPlanId;
    }

    public void setTotalMonthPlanId(java.lang.Long totalMonthPlanId) {
        this.totalMonthPlanId = totalMonthPlanId;
    }

    @Column(name = "SYS_GROUP_ID", length = 22)
    public java.lang.Long getSysGroupId() {
        return sysGroupId;
    }

    public void setSysGroupId(java.lang.Long sysGroupId) {
        this.sysGroupId = sysGroupId;
    }

    @Column(name = "MONTH", length = 22)
    public java.lang.Long getMonth() {
        return month;
    }

    public void setMonth(java.lang.Long month) {
        this.month = month;
    }

    @Column(name = "YEAR", length = 22)
    public java.lang.Long getYear() {
        return year;
    }

    public void setYear(java.lang.Long year) {
        this.year = year;
    }

    @Column(name = "BUILD_PLAN", length = 22)
    public java.lang.Long getBuildPlan() {
        return buildPlan;
    }

    public void setBuildPlan(java.lang.Long buildPlan) {
        this.buildPlan = buildPlan;
    }

    @Column(name = "INSTALL_PLAN", length = 22)
    public java.lang.Long getInstallPlan() {
        return installPlan;
    }

    public void setInstallPlan(java.lang.Long installPlan) {
        this.installPlan = installPlan;
    }

    @Column(name = "REPLACE_PLAN", length = 22)
    public java.lang.Long getReplacePlan() {
        return replacePlan;
    }

    public void setReplacePlan(java.lang.Long replacePlan) {
        this.replacePlan = replacePlan;
    }

    @Column(name = "TEAM_BUILD_REQUIRE", length = 22)
    public java.lang.Long getTeamBuildRequire() {
        return teamBuildRequire;
    }

    public void setTeamBuildRequire(java.lang.Long teamBuildRequire) {
        this.teamBuildRequire = teamBuildRequire;
    }

    @Column(name = "TEAM_BUILD_AVAIABLE", length = 22)
    public java.lang.Long getTeamBuildAvaiable() {
        return teamBuildAvaiable;
    }

    public void setTeamBuildAvaiable(java.lang.Long teamBuildAvaiable) {
        this.teamBuildAvaiable = teamBuildAvaiable;
    }

    @Column(name = "TEAM_INSTALL_REQUIRE", length = 22)
    public java.lang.Long getTeamInstallRequire() {
        return teamInstallRequire;
    }

    public void setTeamInstallRequire(java.lang.Long teamInstallRequire) {
        this.teamInstallRequire = teamInstallRequire;
    }

    @Column(name = "TEAM_INSTALL_AVAIABLE", length = 22)
    public java.lang.Long getTeamInstallAvaiable() {
        return teamInstallAvaiable;
    }

    public void setTeamInstallAvaiable(java.lang.Long teamInstallAvaiable) {
        this.teamInstallAvaiable = teamInstallAvaiable;
    }

    @Column(name = "DESCRIPTION", length = 1000)
    public java.lang.String getDescription() {
        return description;
    }

    public void setDescription(java.lang.String description) {
        this.description = description;
    }

    @Override
    public TmpnForceMaintainDTO toDTO() {
        TmpnForceMaintainDTO tmpnForceMaintainDTO = new TmpnForceMaintainDTO();
        // set cac gia tri
        tmpnForceMaintainDTO.setTmpnForceMaintainId(this.tmpnForceMaintainId);
        tmpnForceMaintainDTO.setTotalMonthPlanId(this.totalMonthPlanId);
        tmpnForceMaintainDTO.setSysGroupId(this.sysGroupId);
        tmpnForceMaintainDTO.setMonth(this.month);
        tmpnForceMaintainDTO.setYear(this.year);
        tmpnForceMaintainDTO.setBuildPlan(this.buildPlan);
        tmpnForceMaintainDTO.setInstallPlan(this.installPlan);
        tmpnForceMaintainDTO.setReplacePlan(this.replacePlan);
        tmpnForceMaintainDTO.setTeamBuildRequire(this.teamBuildRequire);
        tmpnForceMaintainDTO.setTeamBuildAvaiable(this.teamBuildAvaiable);
        tmpnForceMaintainDTO.setTeamInstallRequire(this.teamInstallRequire);
        tmpnForceMaintainDTO.setTeamInstallAvaiable(this.teamInstallAvaiable);
        tmpnForceMaintainDTO.setDescription(this.description);
        return tmpnForceMaintainDTO;
    }
}
