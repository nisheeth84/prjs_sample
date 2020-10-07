/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.dto;

import com.viettel.coms.bo.TmpnTargetBO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import javax.xml.bind.annotation.XmlRootElement;
import java.util.List;

/**
 * @author thuannht
 */
@XmlRootElement(name = "TMPN_TARGETBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class TmpnTargetDTO extends ComsBaseFWDTO<TmpnTargetBO> {

    private java.lang.Long tmpnTargetId;
    private java.lang.Long totalMonthPlanId;
    private java.lang.Long sysGroupId;
    private java.lang.Long month;
    private java.lang.Long year;
    private java.lang.Double quantity;
    private java.lang.Double complete;
    private java.lang.Double revenue;
    private Double quantityInYear;
    private Double completeInYear;
    private Double revenueInYear;
    private Double quantityLk;
    private Double completeLk;
    private Double revenueLk;
    private double mil = 1000000;
    private String sysGroupName;
    private String errorFilePath;
    private String quantityPercen;
    private String completePercen;
    private List<Long> sysGroupIdList;

    @Override
    public TmpnTargetBO toModel() {
        TmpnTargetBO tmpnTargetBO = new TmpnTargetBO();
        tmpnTargetBO.setTmpnTargetId(this.tmpnTargetId);
        tmpnTargetBO.setTotalMonthPlanId(this.totalMonthPlanId);
        tmpnTargetBO.setSysGroupId(this.sysGroupId);
        tmpnTargetBO.setMonth(this.month);
        tmpnTargetBO.setYear(this.year);
        tmpnTargetBO.setQuantity((long) (this.quantity != null ? this.quantity * mil : 0));
        tmpnTargetBO.setComplete((long) (this.complete != null ? this.complete * mil : 0));
        tmpnTargetBO.setRevenue((long) (this.revenue != null ? this.revenue * mil : 0));
        return tmpnTargetBO;
    }

    public List<Long> getSysGroupIdList() {
        return sysGroupIdList;
    }

    public void setSysGroupIdList(List<Long> sysGroupIdList) {
        this.sysGroupIdList = sysGroupIdList;
    }

    public String getQuantityPercen() {
        return quantityPercen;
    }

    public void setQuantityPercen(String quantityPercen) {
        this.quantityPercen = quantityPercen;
    }

    public String getCompletePercen() {
        return completePercen;
    }

    public void setCompletePercen(String completePercen) {
        this.completePercen = completePercen;
    }

    public String getErrorFilePath() {
        return errorFilePath;
    }

    public void setErrorFilePath(String errorFilePath) {
        this.errorFilePath = errorFilePath;
    }

    public String getSysGroupName() {
        return sysGroupName;
    }

    public void setSysGroupName(String sysGroupName) {
        this.sysGroupName = sysGroupName;
    }

    public Double getQuantityInYear() {
        return quantityInYear != null ? quantityInYear / mil : 0;
    }

    public void setQuantityInYear(Double quantityInYear) {
        this.quantityInYear = quantityInYear;
    }

    public Double getCompleteInYear() {
        return completeInYear != null ? completeInYear / mil : 0;
    }

    public void setCompleteInYear(Double completeInYear) {
        this.completeInYear = completeInYear;
    }

    public Double getRevenueInYear() {
        return revenueInYear != null ? revenueInYear / mil : 0;
    }

    public void setRevenueInYear(Double revenueInYear) {
        this.revenueInYear = revenueInYear;
    }

    public Double getQuantityLk() {
        return quantityLk != null ? quantityLk / mil : 0;
    }

    public void setQuantityLk(Double quantityLk) {
        this.quantityLk = quantityLk;
    }

    public Double getCompleteLk() {
        return completeLk != null ? completeLk / mil : 0;
    }

    public void setCompleteLk(Double completeLk) {
        this.completeLk = completeLk;
    }

    public Double getRevenueLk() {
        return revenueLk != null ? revenueLk / mil : 0;
    }

    public void setRevenueLk(Double revenueLk) {
        this.revenueLk = revenueLk;
    }

    @Override
    public Long getFWModelId() {
        return tmpnTargetId;
    }

    @Override
    public String catchName() {
        return getTmpnTargetId().toString();
    }

    public java.lang.Long getTmpnTargetId() {
        return tmpnTargetId;
    }

    public void setTmpnTargetId(java.lang.Long tmpnTargetId) {
        this.tmpnTargetId = tmpnTargetId;
    }

    public java.lang.Long getTotalMonthPlanId() {
        return totalMonthPlanId;
    }

    public void setTotalMonthPlanId(java.lang.Long totalMonthPlanId) {
        this.totalMonthPlanId = totalMonthPlanId;
    }

    public java.lang.Long getSysGroupId() {
        return sysGroupId;
    }

    public void setSysGroupId(java.lang.Long sysGroupId) {
        this.sysGroupId = sysGroupId;
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

    public java.lang.Double getQuantity() {
        return quantity != null ? quantity / mil : 0;
    }

    public void setQuantity(java.lang.Double quantity) {
        this.quantity = quantity;
    }

    public java.lang.Double getComplete() {
        return complete != null ? complete / mil : 0;
    }

    public void setComplete(java.lang.Double complete) {
        this.complete = complete;
    }

    public java.lang.Double getRevenue() {
        return revenue != null ? revenue / mil : 0;
    }

    public void setRevenue(java.lang.Double revenue) {
        this.revenue = revenue;
    }

}
