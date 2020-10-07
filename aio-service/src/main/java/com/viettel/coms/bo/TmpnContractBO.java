/*
 * Copyright 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.coms.bo;

import com.viettel.coms.dto.TmpnContractDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@Entity
@Table(name = "TMPN_CONTRACT")
/**
 *
 * @author: ThuanNHT
 * @version: 1.0
 * @since: 1.0
 */
public class TmpnContractBO extends BaseFWModelImpl {

    private java.lang.Long tmpnContractId;
    private java.lang.Long totalMonthPlanId;
    private java.lang.Long sysGroupId;
    private java.lang.Long month;
    private java.lang.Long year;
    private java.lang.Double complete;
    private java.lang.Double enoughCondition;
    private java.lang.Double noEnoughCondition;
    private java.lang.String description;

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @Parameter(name = "sequence", value = "TMPN_CONTRACT_SEQ")})
    @Column(name = "TMPN_CONTRACT_ID", length = 22)
    public java.lang.Long getTmpnContractId() {
        return tmpnContractId;
    }

    public void setTmpnContractId(java.lang.Long tmpnContractId) {
        this.tmpnContractId = tmpnContractId;
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

    @Column(name = "COMPLETE", length = 22)
    public java.lang.Double getComplete() {
        return complete;
    }

    public void setComplete(java.lang.Double complete) {
        this.complete = complete;
    }

    @Column(name = "ENOUGH_CONDITION", length = 22)
    public java.lang.Double getEnoughCondition() {
        return enoughCondition;
    }

    public void setEnoughCondition(java.lang.Double enoughCondition) {
        this.enoughCondition = enoughCondition;
    }

    @Column(name = "NO_ENOUGH_CONDITION", length = 22)
    public java.lang.Double getNoEnoughCondition() {
        return noEnoughCondition;
    }

    public void setNoEnoughCondition(java.lang.Double noEnoughCondition) {
        this.noEnoughCondition = noEnoughCondition;
    }

    @Column(name = "DESCRIPTION", length = 1000)
    public java.lang.String getDescription() {
        return description;
    }

    public void setDescription(java.lang.String description) {
        this.description = description;
    }

    @Override
    public TmpnContractDTO toDTO() {
        TmpnContractDTO tmpnContractDTO = new TmpnContractDTO();
        // set cac gia tri
        tmpnContractDTO.setTmpnContractId(this.tmpnContractId);
        tmpnContractDTO.setTotalMonthPlanId(this.totalMonthPlanId);
        tmpnContractDTO.setSysGroupId(this.sysGroupId);
        tmpnContractDTO.setMonth(this.month);
        tmpnContractDTO.setYear(this.year);
        tmpnContractDTO.setComplete(this.complete);
        tmpnContractDTO.setEnoughCondition(this.enoughCondition);
        tmpnContractDTO.setNoEnoughCondition(this.noEnoughCondition);
        tmpnContractDTO.setDescription(this.description);
        return tmpnContractDTO;
    }
}
