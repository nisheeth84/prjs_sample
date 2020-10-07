/*
 * Copyright 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.coms.bo;

import com.viettel.coms.dto.TmpnForceNewLineDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@Entity
@Table(name = "TMPN_FORCE_NEW_LINE")
/**
 *
 * @author: ThuanNHT
 * @version: 1.0
 * @since: 1.0
 */
public class TmpnForceNewLineBO extends BaseFWModelImpl {

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

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @Parameter(name = "sequence", value = "TMPN_FORCE_NEW_LINE_SEQ")})
    @Column(name = "TMPN_FORCE_NEW_LINE_ID", length = 22)
    public java.lang.Long getTmpnForceNewLineId() {
        return tmpnForceNewLineId;
    }

    public void setTmpnForceNewLineId(java.lang.Long tmpnForceNewLineId) {
        this.tmpnForceNewLineId = tmpnForceNewLineId;
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
    public java.lang.Double getStationNumber() {
        return stationNumber;
    }

    public void setStationNumber(java.lang.Double stationNumber) {
        this.stationNumber = stationNumber;
    }

    @Column(name = "CURRENT_HAVE_LICENSE", length = 22)
    public java.lang.Double getCurrentHaveLicense() {
        return currentHaveLicense;
    }

    public void setCurrentHaveLicense(java.lang.Double currentHaveLicense) {
        this.currentHaveLicense = currentHaveLicense;
    }

    @Column(name = "CURRENT_QUANTITY", length = 22)
    public java.lang.Double getCurrentQuantity() {
        return currentQuantity;
    }

    public void setCurrentQuantity(java.lang.Double currentQuantity) {
        this.currentQuantity = currentQuantity;
    }

    @Column(name = "CURENT_STATION_COMPLETE", length = 22)
    public java.lang.Double getCurentStationComplete() {
        return curentStationComplete;
    }

    public void setCurentStationComplete(java.lang.Double curentStationComplete) {
        this.curentStationComplete = curentStationComplete;
    }

    @Column(name = "REMAIN_HAVE_LICENSE", length = 22)
    public java.lang.Double getRemainHaveLicense() {
        return remainHaveLicense;
    }

    public void setRemainHaveLicense(java.lang.Double remainHaveLicense) {
        this.remainHaveLicense = remainHaveLicense;
    }

    @Column(name = "REMAIN_QUANTITY", length = 22)
    public java.lang.Double getRemainQuantity() {
        return remainQuantity;
    }

    public void setRemainQuantity(java.lang.Double remainQuantity) {
        this.remainQuantity = remainQuantity;
    }

    @Column(name = "REMAIN_STATION_COMPLETE", length = 22)
    public java.lang.Double getRemainStationComplete() {
        return remainStationComplete;
    }

    public void setRemainStationComplete(java.lang.Double remainStationComplete) {
        this.remainStationComplete = remainStationComplete;
    }

    @Column(name = "DESCRIPTION", length = 1000)
    public java.lang.String getDescription() {
        return description;
    }

    public void setDescription(java.lang.String description) {
        this.description = description;
    }

    @Override
    public TmpnForceNewLineDTO toDTO() {
        TmpnForceNewLineDTO tmpnForceNewLineDTO = new TmpnForceNewLineDTO();
        // set cac gia tri
        tmpnForceNewLineDTO.setTmpnForceNewLineId(this.tmpnForceNewLineId);
        tmpnForceNewLineDTO.setTotalMonthPlanId(this.totalMonthPlanId);
        tmpnForceNewLineDTO.setSysGroupId(this.sysGroupId);
        tmpnForceNewLineDTO.setMonth(this.month);
        tmpnForceNewLineDTO.setYear(this.year);
        tmpnForceNewLineDTO.setStationNumber(this.stationNumber);
        tmpnForceNewLineDTO.setCurrentHaveLicense(this.currentHaveLicense);
        tmpnForceNewLineDTO.setCurrentQuantity(this.currentQuantity);
        tmpnForceNewLineDTO.setCurentStationComplete(this.curentStationComplete);
        tmpnForceNewLineDTO.setRemainHaveLicense(this.remainHaveLicense);
        tmpnForceNewLineDTO.setRemainQuantity(this.remainQuantity);
        tmpnForceNewLineDTO.setRemainStationComplete(this.remainStationComplete);
        tmpnForceNewLineDTO.setDescription(this.description);
        return tmpnForceNewLineDTO;
    }
}
