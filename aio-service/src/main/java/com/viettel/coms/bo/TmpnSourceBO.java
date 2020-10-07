/*
 * Copyright 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.coms.bo;

import com.viettel.coms.dto.TmpnSourceDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@Entity
@Table(name = "TMPN_SOURCE")
/**
 *
 * @author: ThuanNHT
 * @version: 1.0
 * @since: 1.0
 */
public class TmpnSourceBO extends BaseFWModelImpl {

    private java.lang.Long tmpnSourceId;
    private java.lang.Long totalMonthPlanId;
    private java.lang.Long sysGroupId;
    private java.lang.Long month;
    private java.lang.Long year;
    private java.lang.Long source;
    private java.lang.Double quantity;
    private java.lang.Double difference;
    private java.lang.String description;

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @Parameter(name = "sequence", value = "TMPN_SOURCE_SEQ")})
    @Column(name = "TMPN_SOURCE_ID", length = 22)
    public java.lang.Long getTmpnSourceId() {
        return tmpnSourceId;
    }

    public void setTmpnSourceId(java.lang.Long tmpnSourceId) {
        this.tmpnSourceId = tmpnSourceId;
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

    @Column(name = "SOURCE", length = 22)
    public java.lang.Long getSource() {
        return source;
    }

    public void setSource(java.lang.Long source) {
        this.source = source;
    }

    @Column(name = "QUANTITY", length = 22)
    public java.lang.Double getQuantity() {
        return quantity;
    }

    public void setQuantity(java.lang.Double quantity) {
        this.quantity = quantity;
    }

    @Column(name = "DIFFERENCE", length = 22)
    public java.lang.Double getDifference() {
        return difference;
    }

    public void setDifference(java.lang.Double difference) {
        this.difference = difference;
    }

    @Column(name = "DESCRIPTION", length = 1000)
    public java.lang.String getDescription() {
        return description;
    }

    public void setDescription(java.lang.String description) {
        this.description = description;
    }

    @Override
    public TmpnSourceDTO toDTO() {
        TmpnSourceDTO tmpnSourceDTO = new TmpnSourceDTO();
        // set cac gia tri
        tmpnSourceDTO.setTmpnSourceId(this.tmpnSourceId);
        tmpnSourceDTO.setTotalMonthPlanId(this.totalMonthPlanId);
        tmpnSourceDTO.setSysGroupId(this.sysGroupId);
        tmpnSourceDTO.setMonth(this.month);
        tmpnSourceDTO.setYear(this.year);
        tmpnSourceDTO.setSource((double) (this.source != null ? this.source / 1000000 : this.source));
        tmpnSourceDTO.setQuantity(this.quantity != null ? this.quantity / 1000000 : this.quantity);
        tmpnSourceDTO.setDifference(this.difference != null ? this.difference / 1000000 : this.difference);
        tmpnSourceDTO.setDescription(this.description);
        return tmpnSourceDTO;
    }
}
