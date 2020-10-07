/*
 * Copyright 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.coms.bo;

import com.viettel.coms.dto.TmpnForceNewBtsDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@Entity
@Table(name = "TMPN_FORCE_NEW_BTS")
/**
 *
 * @author: ThuanNHT
 * @version: 1.0
 * @since: 1.0
 */
public class TmpnForceNewBtsBO extends BaseFWModelImpl {

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

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @Parameter(name = "sequence", value = "TMPN_FORCE_NEW_BTS_SEQ")})
    @Column(name = "TMPN_FORCE_NEW_BTS_ID", length = 22)
    public java.lang.Long getTmpnForceNewBtsId() {
        return tmpnForceNewBtsId;
    }

    public void setTmpnForceNewBtsId(java.lang.Long tmpnForceNewBtsId) {
        this.tmpnForceNewBtsId = tmpnForceNewBtsId;
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

    @Column(name = "STATION_NUMBER", length = 22)
    public java.lang.Long getStationNumber() {
        return stationNumber;
    }

    public void setStationNumber(java.lang.Long stationNumber) {
        this.stationNumber = stationNumber;
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

    @Column(name = "SELF_IMPLEMENT_PERCENT", length = 22)
    public java.lang.Double getSelfImplementPercent() {
        return selfImplementPercent;
    }

    public void setSelfImplementPercent(java.lang.Double selfImplementPercent) {
        this.selfImplementPercent = selfImplementPercent;
    }

    @Column(name = "DESCRIPTION", length = 1000)
    public java.lang.String getDescription() {
        return description;
    }

    public void setDescription(java.lang.String description) {
        this.description = description;
    }

    @Override
    public TmpnForceNewBtsDTO toDTO() {
        TmpnForceNewBtsDTO tmpnForceNewBtsDTO = new TmpnForceNewBtsDTO();
        // set cac gia tri
        tmpnForceNewBtsDTO.setTmpnForceNewBtsId(this.tmpnForceNewBtsId);
        tmpnForceNewBtsDTO.setTotalMonthPlanId(this.totalMonthPlanId);
        tmpnForceNewBtsDTO.setSysGroupId(this.sysGroupId);
        tmpnForceNewBtsDTO.setMonth(this.month);
        tmpnForceNewBtsDTO.setYear(this.year);
        tmpnForceNewBtsDTO.setStationNumber(this.stationNumber);
        tmpnForceNewBtsDTO.setTeamBuildRequire(this.teamBuildRequire);
        tmpnForceNewBtsDTO.setTeamBuildAvaiable(this.teamBuildAvaiable);
        tmpnForceNewBtsDTO.setSelfImplementPercent(this.selfImplementPercent);
        tmpnForceNewBtsDTO.setDescription(this.description);
        return tmpnForceNewBtsDTO;
    }
}
