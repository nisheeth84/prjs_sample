/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.dto;

import com.viettel.coms.bo.TmpnMaterialBO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import javax.xml.bind.annotation.XmlRootElement;

/**
 * @author thuannht
 */
@XmlRootElement(name = "TMPN_MATERIALBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class TmpnMaterialDTO extends ComsBaseFWDTO<TmpnMaterialBO> {

    private java.lang.Long tmpnMaterialId;
    private java.lang.Long totalMonthPlanId;
    private java.lang.Long sysGroupId;
    private java.lang.Long month;
    private java.lang.Long year;
    private java.lang.String description;
    private java.lang.Long catConstructionDeployId;
    private java.lang.Long catConstructionTypeId;
    private String catConstructionDeployName;
    private String catConstructionTypeName;
    private String sysGroupName;
    private String errorFilePath;

    @Override
    public TmpnMaterialBO toModel() {
        TmpnMaterialBO tmpnMaterialBO = new TmpnMaterialBO();
        tmpnMaterialBO.setTmpnMaterialId(this.tmpnMaterialId);
        tmpnMaterialBO.setTotalMonthPlanId(this.totalMonthPlanId);
        tmpnMaterialBO.setSysGroupId(this.sysGroupId);
        tmpnMaterialBO.setMonth(this.month);
        tmpnMaterialBO.setYear(this.year);
        tmpnMaterialBO.setDescription(this.description);
        tmpnMaterialBO.setCatConstructionDeployId(this.catConstructionDeployId);
        tmpnMaterialBO.setCatConstructionTypeId(this.catConstructionTypeId);
        return tmpnMaterialBO;
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

    public String getCatConstructionDeployName() {
        return catConstructionDeployName;
    }

    public void setCatConstructionDeployName(String catConstructionDeployName) {
        this.catConstructionDeployName = catConstructionDeployName;
    }

    public String getCatConstructionTypeName() {
        return catConstructionTypeName;
    }

    public void setCatConstructionTypeName(String catConstructionTypeName) {
        this.catConstructionTypeName = catConstructionTypeName;
    }

    @Override
    public Long getFWModelId() {
        return tmpnMaterialId;
    }

    @Override
    public String catchName() {
        return getTmpnMaterialId().toString();
    }

    public java.lang.Long getTmpnMaterialId() {
        return tmpnMaterialId;
    }

    public void setTmpnMaterialId(java.lang.Long tmpnMaterialId) {
        this.tmpnMaterialId = tmpnMaterialId;
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

    public java.lang.String getDescription() {
        return description;
    }

    public void setDescription(java.lang.String description) {
        this.description = description;
    }

    public java.lang.Long getCatConstructionDeployId() {
        return catConstructionDeployId;
    }

    public void setCatConstructionDeployId(java.lang.Long catConstructionDeployId) {
        this.catConstructionDeployId = catConstructionDeployId;
    }

    public java.lang.Long getCatConstructionTypeId() {
        return catConstructionTypeId;
    }

    public void setCatConstructionTypeId(java.lang.Long catConstructionTypeId) {
        this.catConstructionTypeId = catConstructionTypeId;
    }

}
