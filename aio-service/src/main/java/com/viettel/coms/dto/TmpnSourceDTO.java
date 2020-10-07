/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.dto;

import com.viettel.coms.bo.TmpnSourceBO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import javax.xml.bind.annotation.XmlRootElement;

/**
 * @author thuannht
 */
@XmlRootElement(name = "TMPN_SOURCEBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class TmpnSourceDTO extends ComsBaseFWDTO<TmpnSourceBO> {

    private java.lang.Long tmpnSourceId;
    private java.lang.Long totalMonthPlanId;
    private java.lang.Long sysGroupId;
    private java.lang.Long month;
    private java.lang.Long year;
    private java.lang.Double source;
    private java.lang.Double quantity;
    private java.lang.Double difference;
    private java.lang.String description;
    private String sysGroupName;
    private String errorFilePath;

    @Override
    public TmpnSourceBO toModel() {
        TmpnSourceBO tmpnSourceBO = new TmpnSourceBO();
        tmpnSourceBO.setTmpnSourceId(this.tmpnSourceId);
        tmpnSourceBO.setTotalMonthPlanId(this.totalMonthPlanId);
        tmpnSourceBO.setSysGroupId(this.sysGroupId);
        tmpnSourceBO.setMonth(this.month);
        tmpnSourceBO.setYear(this.year);
        tmpnSourceBO.setSource((long) (this.source != null ? this.source * 1000000 : 0));
        tmpnSourceBO.setQuantity(this.quantity != null ? this.quantity * 1000000 : 0);
        tmpnSourceBO.setDifference(this.difference != null ? this.difference * 1000000 : 0);
        tmpnSourceBO.setDescription(this.description);
        return tmpnSourceBO;
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

    @Override
    public Long getFWModelId() {
        return tmpnSourceId;
    }

    @Override
    public String catchName() {
        return getTmpnSourceId().toString();
    }

    public java.lang.Long getTmpnSourceId() {
        return tmpnSourceId;
    }

    public void setTmpnSourceId(java.lang.Long tmpnSourceId) {
        this.tmpnSourceId = tmpnSourceId;
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

    public java.lang.Double getDifference() {
        return difference != null ? difference / 1000000 : 0;
    }

    public void setDifference(java.lang.Double difference) {
        this.difference = difference;
    }

    public java.lang.String getDescription() {
        return description;
    }

    public void setDescription(java.lang.String description) {
        this.description = description;
    }

}
