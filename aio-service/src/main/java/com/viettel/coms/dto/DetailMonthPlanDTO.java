/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.dto;

import com.viettel.coms.bo.DetailMonthPlanBO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import javax.xml.bind.annotation.XmlRootElement;

/**
 * @author thuannht
 */
@XmlRootElement(name = "DETAIL_MONTH_PLANBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class DetailMonthPlanDTO extends ComsBaseFWDTO<DetailMonthPlanBO> {

    private java.lang.Long detailMonthPlanId;
    private java.lang.Long month;
    private java.lang.Long year;
    private java.lang.String code;
    private java.lang.String name;
    private java.lang.String description;
    private java.lang.String signState;
    private java.lang.String status;
    private java.util.Date createdDate;
    private java.lang.Long createdUserId;
    private java.lang.Long createdGroupId;
    private java.util.Date updatedDate;
    private java.lang.Long updatedUserId;
    private java.lang.Long updatedGroupId;
    private java.lang.Long sysGroupId;

    public java.lang.Long getSysGroupId() {
        return sysGroupId;
    }

    public void setSysGroupId(java.lang.Long sysGroupId) {
        this.sysGroupId = sysGroupId;
    }

    @Override
    public DetailMonthPlanBO toModel() {
        DetailMonthPlanBO detailMonthPlanBO = new DetailMonthPlanBO();
        detailMonthPlanBO.setDetailMonthPlanId(this.detailMonthPlanId);
        detailMonthPlanBO.setMonth(this.month);
        detailMonthPlanBO.setYear(this.year);
        detailMonthPlanBO.setCode(this.code);
        detailMonthPlanBO.setName(this.name);
        detailMonthPlanBO.setDescription(this.description);
        detailMonthPlanBO.setSignState(this.signState);
        detailMonthPlanBO.setStatus(this.status);
        detailMonthPlanBO.setCreatedDate(this.createdDate);
        detailMonthPlanBO.setCreatedUserId(this.createdUserId);
        detailMonthPlanBO.setCreatedGroupId(this.createdGroupId);
        detailMonthPlanBO.setUpdatedDate(this.updatedDate);
        detailMonthPlanBO.setUpdatedUserId(this.updatedUserId);
        detailMonthPlanBO.setUpdatedGroupId(this.updatedGroupId);
        detailMonthPlanBO.setSysGroupId(this.sysGroupId);
        return detailMonthPlanBO;
    }

    @Override
    public Long getFWModelId() {
        return detailMonthPlanId;
    }

    @Override
    public String catchName() {
        return getDetailMonthPlanId().toString();
    }

    public java.lang.Long getDetailMonthPlanId() {
        return detailMonthPlanId;
    }

    public void setDetailMonthPlanId(java.lang.Long detailMonthPlanId) {
        this.detailMonthPlanId = detailMonthPlanId;
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

    public java.lang.String getCode() {
        return code;
    }

    public void setCode(java.lang.String code) {
        this.code = code;
    }

    public java.lang.String getName() {
        return name;
    }

    public void setName(java.lang.String name) {
        this.name = name;
    }

    public java.lang.String getDescription() {
        return description;
    }

    public void setDescription(java.lang.String description) {
        this.description = description;
    }

    public java.lang.String getSignState() {
        return signState;
    }

    public void setSignState(java.lang.String signState) {
        this.signState = signState;
    }

    public java.lang.String getStatus() {
        return status;
    }

    public void setStatus(java.lang.String status) {
        this.status = status;
    }

    public java.util.Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(java.util.Date createdDate) {
        this.createdDate = createdDate;
    }

    public java.lang.Long getCreatedUserId() {
        return createdUserId;
    }

    public void setCreatedUserId(java.lang.Long createdUserId) {
        this.createdUserId = createdUserId;
    }

    public java.lang.Long getCreatedGroupId() {
        return createdGroupId;
    }

    public void setCreatedGroupId(java.lang.Long createdGroupId) {
        this.createdGroupId = createdGroupId;
    }

    public java.util.Date getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(java.util.Date updatedDate) {
        this.updatedDate = updatedDate;
    }

    public java.lang.Long getUpdatedUserId() {
        return updatedUserId;
    }

    public void setUpdatedUserId(java.lang.Long updatedUserId) {
        this.updatedUserId = updatedUserId;
    }

    public java.lang.Long getUpdatedGroupId() {
        return updatedGroupId;
    }

    public void setUpdatedGroupId(java.lang.Long updatedGroupId) {
        this.updatedGroupId = updatedGroupId;
    }

}
