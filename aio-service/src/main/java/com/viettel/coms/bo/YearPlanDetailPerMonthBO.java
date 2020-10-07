/*
 * Copyright 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.coms.bo;

import com.viettel.coms.dto.YearPlanDetailPerMonthDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@Entity
@Table(name = "YEAR_PLAN_DETAIL_PER_MONTH")
/**
 *
 * @author: ThuanNHT
 * @version: 1.0
 * @since: 1.0
 */
public class YearPlanDetailPerMonthBO extends BaseFWModelImpl {
    private java.lang.Long yearPlanDetailPerMonthId;
    private java.lang.Long yearPlanDetailId;
    private java.lang.Long yearPlanId;
    private java.lang.Long sysGroupId;
    private java.lang.Long source;
    private java.lang.Long month;
    private java.lang.Long year;
    private java.lang.Long quantity;
    private java.lang.Long complete;
    private java.lang.Long revenue;

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @Parameter(name = "sequence", value = "YEAR_PLAN_DETAIL_PER_MONTH_SEQ")})
    @Column(name = "YEAR_PLAN_DETAIL_PER_MONTH_ID", length = 10)
    public java.lang.Long getYearPlanDetailPerMonthId() {
        return yearPlanDetailPerMonthId;
    }

    public void setYearPlanDetailPerMonthId(java.lang.Long yearPlanDetailPerMonthId) {
        this.yearPlanDetailPerMonthId = yearPlanDetailPerMonthId;
    }

    @Column(name = "YEAR_PLAN_DETAIL_ID", length = 22)
    public java.lang.Long getYearPlanDetailId() {
        return yearPlanDetailId;
    }

    public void setYearPlanDetailId(java.lang.Long yearPlanDetailId) {
        this.yearPlanDetailId = yearPlanDetailId;
    }

    @Column(name = "YEAR_PLAN_ID", length = 22)
    public java.lang.Long getYearPlanId() {
        return yearPlanId;
    }

    public void setYearPlanId(java.lang.Long yearPlanId) {
        this.yearPlanId = yearPlanId;
    }

    @Column(name = "SYS_GROUP_ID", length = 22)
    public java.lang.Long getSysGroupId() {
        return sysGroupId;
    }

    public void setSysGroupId(java.lang.Long sysGroupId) {
        this.sysGroupId = sysGroupId;
    }

    @Column(name = "SOURCE", length = 22)
    public java.lang.Long getSource() {
        return source;
    }

    public void setSource(java.lang.Long source) {
        this.source = source;
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

    @Column(name = "QUANTITY", length = 22)
    public java.lang.Long getQuantity() {
        return quantity;
    }

    public void setQuantity(java.lang.Long quantity) {
        this.quantity = quantity;
    }

    @Column(name = "COMPLETE", length = 22)
    public java.lang.Long getComplete() {
        return complete;
    }

    public void setComplete(java.lang.Long complete) {
        this.complete = complete;
    }

    @Column(name = "REVENUE", length = 22)
    public java.lang.Long getRevenue() {
        return revenue;
    }

    public void setRevenue(java.lang.Long revenue) {
        this.revenue = revenue;
    }

    @Override
    public YearPlanDetailPerMonthDTO toDTO() {
        YearPlanDetailPerMonthDTO yearPlanDetailPerMonthDTO = new YearPlanDetailPerMonthDTO();
        // set cac gia tri
        yearPlanDetailPerMonthDTO.setYearPlanDetailId(this.yearPlanDetailId);
        yearPlanDetailPerMonthDTO.setYearPlanId(this.yearPlanId);
        yearPlanDetailPerMonthDTO.setSysGroupId(this.sysGroupId);
        yearPlanDetailPerMonthDTO.setSource(this.source);
        yearPlanDetailPerMonthDTO.setMonth(this.month);
        yearPlanDetailPerMonthDTO.setYear(this.year);
        yearPlanDetailPerMonthDTO.setQuantity(this.quantity);
        yearPlanDetailPerMonthDTO.setComplete(this.complete);
        yearPlanDetailPerMonthDTO.setRevenue(this.revenue);
        return yearPlanDetailPerMonthDTO;
    }
}
