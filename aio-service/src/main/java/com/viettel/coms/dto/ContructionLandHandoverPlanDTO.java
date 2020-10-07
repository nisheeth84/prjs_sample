/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.dto;

import com.viettel.coms.bo.ContructionLandHandoverPlanBO;
import com.viettel.erp.utils.JsonDateDeserializer;
import com.viettel.erp.utils.JsonDateSerializerDate;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import javax.xml.bind.annotation.XmlRootElement;

/**
 * @author thuannht
 */
@XmlRootElement(name = "CONTRUCTION_LAND_HANDOVER_PLANBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class ContructionLandHandoverPlanDTO extends ComsBaseFWDTO<ContructionLandHandoverPlanBO> {

    private java.lang.Long updateUser;
    private java.util.Date updateDate;
    private java.lang.String name;
    private java.lang.Long month;
    private java.lang.Long year;
    private java.lang.Long sysGroupId;
    private java.lang.Long catStationId;
    private java.lang.Long catPartnerId;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private java.util.Date groundPlanDate;
    private java.lang.String description;
    private java.util.Date createDate;
    private java.lang.Long createUser;
    private java.lang.Long constructionId;
    private java.lang.Long contructionLandHanPlanId;

    @Override
    public ContructionLandHandoverPlanBO toModel() {
        ContructionLandHandoverPlanBO contructionLandHandoverPlanBO = new ContructionLandHandoverPlanBO();
        contructionLandHandoverPlanBO.setUpdateUser(this.updateUser);
        contructionLandHandoverPlanBO.setUpdateDate(this.updateDate);
        contructionLandHandoverPlanBO.setName(this.name);
        contructionLandHandoverPlanBO.setMonth(this.month);
        contructionLandHandoverPlanBO.setYear(this.year);
        contructionLandHandoverPlanBO.setSysGroupId(this.sysGroupId);
        contructionLandHandoverPlanBO.setCatStationId(this.catStationId);
        contructionLandHandoverPlanBO.setCatPartnerId(this.catPartnerId);
        contructionLandHandoverPlanBO.setGroundPlanDate(this.groundPlanDate);
        contructionLandHandoverPlanBO.setDescription(this.description);
        contructionLandHandoverPlanBO.setCreateDate(this.createDate);
        contructionLandHandoverPlanBO.setCreateUser(this.createUser);
        contructionLandHandoverPlanBO.setConstructionId(this.constructionId);
        contructionLandHandoverPlanBO.setContructionLandHanPlanId(this.contructionLandHanPlanId);
        return contructionLandHandoverPlanBO;
    }

    public java.lang.Long getUpdateUser() {
        return updateUser;
    }

    public void setUpdateUser(java.lang.Long updateUser) {
        this.updateUser = updateUser;
    }

    public java.util.Date getUpdateDate() {
        return updateDate;
    }

    public void setUpdateDate(java.util.Date updateDate) {
        this.updateDate = updateDate;
    }

    public java.lang.String getName() {
        return name;
    }

    public void setName(java.lang.String name) {
        this.name = name;
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

    public java.lang.Long getSysGroupId() {
        return sysGroupId;
    }

    public void setSysGroupId(java.lang.Long sysGroupId) {
        this.sysGroupId = sysGroupId;
    }

    public java.lang.Long getCatStationId() {
        return catStationId;
    }

    public void setCatStationId(java.lang.Long catStationId) {
        this.catStationId = catStationId;
    }

    public java.lang.Long getCatPartnerId() {
        return catPartnerId;
    }

    public void setCatPartnerId(java.lang.Long catPartnerId) {
        this.catPartnerId = catPartnerId;
    }

    public java.util.Date getGroundPlanDate() {
        return groundPlanDate;
    }

    public void setGroundPlanDate(java.util.Date groundPlanDate) {
        this.groundPlanDate = groundPlanDate;
    }

    public java.lang.String getDescription() {
        return description;
    }

    public void setDescription(java.lang.String description) {
        this.description = description;
    }

    public java.util.Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(java.util.Date createDate) {
        this.createDate = createDate;
    }

    public java.lang.Long getCreateUser() {
        return createUser;
    }

    public void setCreateUser(java.lang.Long createUser) {
        this.createUser = createUser;
    }

    @Override
    public Long getFWModelId() {
        return constructionId;
    }

    @Override
    public String catchName() {
        return getConstructionId().toString();
    }

    public java.lang.Long getConstructionId() {
        return constructionId;
    }

    public void setConstructionId(java.lang.Long constructionId) {
        this.constructionId = constructionId;
    }

    public java.lang.Long getContructionLandHanPlanId() {
        return contructionLandHanPlanId;
    }

    public void setContructionLandHanPlanId(java.lang.Long contructionLandHanPlanId) {
        this.contructionLandHanPlanId = contructionLandHanPlanId;
    }

}
