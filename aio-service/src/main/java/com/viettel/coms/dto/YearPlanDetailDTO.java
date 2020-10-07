/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.dto;

import com.viettel.coms.bo.YearPlanDetailBO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import javax.xml.bind.annotation.XmlRootElement;

/**
 * @author thuannht
 */
@XmlRootElement(name = "YEAR_PLAN_DETAILBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class YearPlanDetailDTO extends ComsBaseFWDTO<YearPlanDetailBO> {

    private java.lang.Long sysGroupId;
    private java.lang.Double source;
    private java.lang.Double quantity;
    private java.lang.Double complete;
    private java.lang.Double revenue;
    private java.lang.Long yearPlanId;
    private java.lang.Long yearPlanDetailId;
    private java.lang.Long month;
    private java.lang.Long year;
    private String sysGroupName;
    private String errorFilePath;
    private String column1Name;

    @Override
    public YearPlanDetailBO toModel() {
        YearPlanDetailBO yearPlanDetailBO = new YearPlanDetailBO();
        yearPlanDetailBO.setSysGroupId(this.sysGroupId);
        yearPlanDetailBO.setSource(
                Double.valueOf((this.source != null ? this.source.doubleValue() * 1000000 : 0)).doubleValue());
        yearPlanDetailBO.setQuantity(
                Double.valueOf((this.quantity != null ? this.quantity.doubleValue() * 1000000 : 0)).doubleValue());
        yearPlanDetailBO.setComplete(
                Double.valueOf((this.complete != null ? this.complete.doubleValue() * 1000000 : 0)).doubleValue());
        yearPlanDetailBO.setRevenue(
                Double.valueOf((this.revenue != null ? this.revenue.doubleValue() * 1000000 : 0)).doubleValue());
        yearPlanDetailBO.setYearPlanId(this.yearPlanId);
        yearPlanDetailBO.setYearPlanDetailId(yearPlanDetailId);
        yearPlanDetailBO.setMonth(this.month);
        yearPlanDetailBO.setYear(year);
        return yearPlanDetailBO;
    }

    public String getColumn1Name() {
        return column1Name;
    }

    public void setColumn1Name(String column1Name) {
        this.column1Name = column1Name;
    }

    public String getErrorFilePath() {
        return errorFilePath;
    }

    public void setErrorFilePath(String errorFilePath) {
        this.errorFilePath = errorFilePath;
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

    public java.lang.Long getYearPlanDetailId() {
        return yearPlanDetailId;
    }

    public void setYearPlanDetailId(java.lang.Long yearPlanDetailId) {
        this.yearPlanDetailId = yearPlanDetailId;
    }

    public String getSysGroupName() {
        return sysGroupName;
    }

    public void setSysGroupName(String sysGroupName) {
        this.sysGroupName = sysGroupName;
    }

    public java.lang.Long getSysGroupId() {
        return sysGroupId;
    }

    public void setSysGroupId(java.lang.Long sysGroupId) {
        this.sysGroupId = sysGroupId;
    }

    public java.lang.Double getSource() {
        return source != null ? source / 1000000 : 0;
    }

    public void setSource(java.lang.Double source) {
        this.source = source;
    }

    public java.lang.Double getQuantity() {
        return quantity != null ? quantity / 1000000 : 0;
    }

    public void setQuantity(java.lang.Double quantity) {
        this.quantity = quantity;
    }

    public java.lang.Double getComplete() {
        return complete != null ? complete / 1000000 : 0;
    }

    public void setComplete(java.lang.Double complete) {
        this.complete = complete;
    }

    public java.lang.Double getRevenue() {
        return revenue != null ? revenue / 1000000 : 0;
    }

    public void setRevenue(java.lang.Double revenue) {
        this.revenue = revenue;
    }

    public java.lang.Long getYearPlanId() {
        return yearPlanId;
    }

    public void setYearPlanId(java.lang.Long yearPlanId) {
        this.yearPlanId = yearPlanId;
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
