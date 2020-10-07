/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.dto;

import com.viettel.coms.bo.YearPlanDetailPerMonthBO;

import javax.xml.bind.annotation.XmlRootElement;

/**
 * @author thuannht
 */
@XmlRootElement(name = "YEAR_PLAN_DETAIL_PER_MONTHBO")
public class YearPlanDetailPerMonthDTO extends ComsBaseFWDTO<YearPlanDetailPerMonthBO> {

    private java.lang.Long yearPlanDetailId;
    private java.lang.Long yearPlanId;
    private java.lang.Long sysGroupId;
    private java.lang.Long source;
    private java.lang.Long month;
    private java.lang.Long year;
    private java.lang.Long quantity;
    private java.lang.Long complete;
    private java.lang.Long revenue;
    private java.lang.Long yearPlanDetailPerMonthId;

    @Override
    public YearPlanDetailPerMonthBO toModel() {
        YearPlanDetailPerMonthBO yearPlanDetailPerMonthBO = new YearPlanDetailPerMonthBO();
        yearPlanDetailPerMonthBO.setYearPlanDetailId(this.yearPlanDetailId);
        yearPlanDetailPerMonthBO.setYearPlanId(this.yearPlanId);
        yearPlanDetailPerMonthBO.setSysGroupId(this.sysGroupId);
        yearPlanDetailPerMonthBO.setSource(this.source);
        yearPlanDetailPerMonthBO.setMonth(this.month);
        yearPlanDetailPerMonthBO.setYear(this.year);
        yearPlanDetailPerMonthBO.setQuantity(this.quantity);
        yearPlanDetailPerMonthBO.setComplete(this.complete);
        yearPlanDetailPerMonthBO.setRevenue(this.revenue);
        yearPlanDetailPerMonthBO.setYearPlanDetailPerMonthId(yearPlanDetailPerMonthId);
        return yearPlanDetailPerMonthBO;
    }

    public java.lang.Long getYearPlanDetailPerMonthId() {
        return yearPlanDetailPerMonthId;
    }

    public void setYearPlanDetailPerMonthId(java.lang.Long yearPlanDetailPerMonthId) {
        this.yearPlanDetailPerMonthId = yearPlanDetailPerMonthId;
    }

    public java.lang.Long getYearPlanDetailId() {
        return yearPlanDetailId;
    }

    public void setYearPlanDetailId(java.lang.Long yearPlanDetailId) {
        this.yearPlanDetailId = yearPlanDetailId;
    }

    public java.lang.Long getYearPlanId() {
        return yearPlanId;
    }

    public void setYearPlanId(java.lang.Long yearPlanId) {
        this.yearPlanId = yearPlanId;
    }

    public java.lang.Long getSysGroupId() {
        return sysGroupId;
    }

    public void setSysGroupId(java.lang.Long sysGroupId) {
        this.sysGroupId = sysGroupId;
    }

    public java.lang.Long getSource() {
        return source;
    }

    public void setSource(java.lang.Long source) {
        this.source = source;
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

    public java.lang.Long getQuantity() {
        return quantity;
    }

    public void setQuantity(java.lang.Long quantity) {
        this.quantity = quantity;
    }

    public java.lang.Long getComplete() {
        return complete;
    }

    public void setComplete(java.lang.Long complete) {
        this.complete = complete;
    }

    public java.lang.Long getRevenue() {
        return revenue;
    }

    public void setRevenue(java.lang.Long revenue) {
        this.revenue = revenue;
    }

    @Override
    public String catchName() {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public Long getFWModelId() {
        // TODO Auto-generated method stub
        return null;
    }

}
