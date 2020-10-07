/*
 * Copyright 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.coms.bo;

import com.viettel.coms.dto.YearPlanDetailDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@Entity
@Table(name = "YEAR_PLAN_DETAIL")
/**
 *
 * @author: ThuanNHT
 * @version: 1.0
 * @since: 1.0
 */
public class YearPlanDetailBO extends BaseFWModelImpl {

    private java.lang.Long sysGroupId;
    private java.lang.Double source;
    private java.lang.Double quantity;
    private java.lang.Double complete;
    private java.lang.Double revenue;
    private java.lang.Long yearPlanId;
    private java.lang.Long yearPlanDetailId;
    private java.lang.Long month;
    private java.lang.Long year;

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @Parameter(name = "sequence", value = "YEAR_PLAN_DETAIL_SEQ")})
    @Column(name = "YEAR_PLAN_DETAIL_ID", length = 10)
    public java.lang.Long getYearPlanDetailId() {
        return yearPlanDetailId;
    }

    public void setYearPlanDetailId(java.lang.Long yearPlanDetailId) {
        this.yearPlanDetailId = yearPlanDetailId;
    }

    @Column(name = "SYS_GROUP_ID", length = 22)
    public java.lang.Long getSysGroupId() {
        return sysGroupId;
    }

    public void setSysGroupId(java.lang.Long sysGroupId) {
        this.sysGroupId = sysGroupId;
    }

    @Column(name = "SOURCE", length = 20)
    public java.lang.Double getSource() {
        return source;
    }

    public void setSource(java.lang.Double source) {
        this.source = source;
    }

    @Column(name = "QUANTITY", length = 20)
    public java.lang.Double getQuantity() {
        return quantity;
    }

    public void setQuantity(java.lang.Double quantity) {
        this.quantity = quantity;
    }

    @Column(name = "COMPLETE", length = 20)
    public java.lang.Double getComplete() {
        return complete;
    }

    public void setComplete(java.lang.Double complete) {
        this.complete = complete;
    }

    @Column(name = "REVENUE", length = 20)
    public java.lang.Double getRevenue() {
        return revenue;
    }

    public void setRevenue(java.lang.Double revenue) {
        this.revenue = revenue;
    }

    @Column(name = "YEAR_PLAN_ID", length = 22)
    public java.lang.Long getYearPlanId() {
        return yearPlanId;
    }

    public void setYearPlanId(java.lang.Long yearPlanId) {
        this.yearPlanId = yearPlanId;
    }

    @Column(name = "MONTH", length = 2)
    public java.lang.Long getMonth() {
        return month;
    }

    public void setMonth(java.lang.Long month) {
        this.month = month;
    }

    @Column(name = "YEAR", length = 10)
    public java.lang.Long getYear() {
        return year;
    }

    public void setYear(java.lang.Long year) {
        this.year = year;
    }

    @Override
    public YearPlanDetailDTO toDTO() {
        YearPlanDetailDTO yearPlanDetailDTO = new YearPlanDetailDTO();
        // set cac gia tri
        yearPlanDetailDTO.setSysGroupId(this.sysGroupId);
        yearPlanDetailDTO.setSource((double) this.source);
        yearPlanDetailDTO.setQuantity((double) this.quantity);
        yearPlanDetailDTO.setComplete((double) this.complete);
        yearPlanDetailDTO.setRevenue((double) this.revenue);
        yearPlanDetailDTO.setYearPlanId(this.yearPlanId);
        yearPlanDetailDTO.setMonth(month);
        yearPlanDetailDTO.setYear(year);
        return yearPlanDetailDTO;
    }
}
