/*
 * Copyright 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.coms.bo;

import com.viettel.coms.dto.TmpnFinanceDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@Entity
@Table(name = "TMPN_FINANCE")
/**
 *
 * @author: ThuanNHT
 * @version: 1.0
 * @since: 1.0
 */
public class TmpnFinanceBO extends BaseFWModelImpl {

    private java.lang.Long tmpnFinanceId;
    private java.lang.Long totalMonthPlanId;
    private java.lang.Long sysGroupId;
    private java.lang.Long month;
    private java.lang.Long year;
    private java.lang.Double firstTimes;
    private java.lang.Double secondTimes;
    private java.lang.Double threeTimes;
    private java.lang.String description;

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @Parameter(name = "sequence", value = "TMPN_FINANCE_SEQ")})
    @Column(name = "TMPN_FINANCE_ID", length = 22)
    public java.lang.Long getTmpnFinanceId() {
        return tmpnFinanceId;
    }

    public void setTmpnFinanceId(java.lang.Long tmpnFinanceId) {
        this.tmpnFinanceId = tmpnFinanceId;
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

    @Column(name = "FIRST_TIMES", length = 22)
    public java.lang.Double getFirstTimes() {
        return firstTimes;
    }

    public void setFirstTimes(java.lang.Double firstTimes) {
        this.firstTimes = firstTimes;
    }

    @Column(name = "SECOND_TIMES", length = 22)
    public java.lang.Double getSecondTimes() {
        return secondTimes;
    }

    public void setSecondTimes(java.lang.Double secondTimes) {
        this.secondTimes = secondTimes;
    }

    @Column(name = "THREE_TIMES", length = 22)
    public java.lang.Double getThreeTimes() {
        return threeTimes;
    }

    public void setThreeTimes(java.lang.Double threeTimes) {
        this.threeTimes = threeTimes;
    }

    @Column(name = "DESCRIPTION", length = 1000)
    public java.lang.String getDescription() {
        return description;
    }

    public void setDescription(java.lang.String description) {
        this.description = description;
    }

    @Override
    public TmpnFinanceDTO toDTO() {
        TmpnFinanceDTO tmpnFinanceDTO = new TmpnFinanceDTO();
        // set cac gia tri
        tmpnFinanceDTO.setTmpnFinanceId(this.tmpnFinanceId);
        tmpnFinanceDTO.setTotalMonthPlanId(this.totalMonthPlanId);
        tmpnFinanceDTO.setSysGroupId(this.sysGroupId);
        tmpnFinanceDTO.setMonth(this.month);
        tmpnFinanceDTO.setYear(this.year);
        tmpnFinanceDTO.setFirstTimes(this.firstTimes / 1000000);
        tmpnFinanceDTO.setSecondTimes(this.secondTimes / 1000000);
        tmpnFinanceDTO.setThreeTimes(this.threeTimes / 1000000);
        tmpnFinanceDTO.setDescription(this.description);
        return tmpnFinanceDTO;
    }
}
