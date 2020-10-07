/*
 * Copyright 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.coms.bo;

import com.viettel.coms.dto.ContructionLandHandoverPlanDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@Entity
@Table(name = "CONTRUCTION_LAND_HANDOVER_PLAN")
/**
 *
 * @author: ThuanNHT
 * @version: 1.0
 * @since: 1.0
 */
public class ContructionLandHandoverPlanBO extends BaseFWModelImpl {

    private java.lang.Long updateUser;
    private java.util.Date updateDate;
    private java.lang.String name;
    private java.lang.Long month;
    private java.lang.Long year;
    private java.lang.Long sysGroupId;
    private java.lang.Long catStationId;
    private java.lang.Long catPartnerId;
    private java.util.Date groundPlanDate;
    private java.lang.String description;
    private java.util.Date createDate;
    private java.lang.Long createUser;
    private java.lang.Long constructionId;
    private java.lang.Long contructionLandHanPlanId;

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @Parameter(name = "sequence", value = "CONTRUCTION_LAND_HAN_PLAN_SEQ")})
    @Column(name = "CONTRUCTION_LAND_HAN_PLAN_ID", length = 22)
    public java.lang.Long getContructionLandHanPlanId() {
        return contructionLandHanPlanId;
    }

    public void setContructionLandHanPlanId(java.lang.Long contructionLandHanPlanId) {
        this.contructionLandHanPlanId = contructionLandHanPlanId;
    }

    @Column(name = "UPDATE_USER", length = 22)
    public java.lang.Long getUpdateUser() {
        return updateUser;
    }

    public void setUpdateUser(java.lang.Long updateUser) {
        this.updateUser = updateUser;
    }

    @Column(name = "UPDATE_DATE", length = 7)
    public java.util.Date getUpdateDate() {
        return updateDate;
    }

    public void setUpdateDate(java.util.Date updateDate) {
        this.updateDate = updateDate;
    }

    @Column(name = "NAME", length = 200)
    public java.lang.String getName() {
        return name;
    }

    public void setName(java.lang.String name) {
        this.name = name;
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

    @Column(name = "SYS_GROUP_ID", length = 10)
    public java.lang.Long getSysGroupId() {
        return sysGroupId;
    }

    public void setSysGroupId(java.lang.Long sysGroupId) {
        this.sysGroupId = sysGroupId;
    }

    @Column(name = "CAT_STATION_ID", length = 22)
    public java.lang.Long getCatStationId() {
        return catStationId;
    }

    public void setCatStationId(java.lang.Long catStationId) {
        this.catStationId = catStationId;
    }

    @Column(name = "CAT_PARTNER_ID", length = 10)
    public java.lang.Long getCatPartnerId() {
        return catPartnerId;
    }

    public void setCatPartnerId(java.lang.Long catPartnerId) {
        this.catPartnerId = catPartnerId;
    }

    @Column(name = "GROUND_PLAN_DATE", length = 7)
    public java.util.Date getGroundPlanDate() {
        return groundPlanDate;
    }

    public void setGroundPlanDate(java.util.Date groundPlanDate) {
        this.groundPlanDate = groundPlanDate;
    }

    @Column(name = "DESCRIPTION", length = 10)
    public java.lang.String getDescription() {
        return description;
    }

    public void setDescription(java.lang.String description) {
        this.description = description;
    }

    @Column(name = "CREATE_DATE", length = 7)
    public java.util.Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(java.util.Date createDate) {
        this.createDate = createDate;
    }

    @Column(name = "CREATE_USER", length = 22)
    public java.lang.Long getCreateUser() {
        return createUser;
    }

    public void setCreateUser(java.lang.Long createUser) {
        this.createUser = createUser;
    }

    @Column(name = "CONSTRUCTION_ID", length = 22)
    public java.lang.Long getConstructionId() {
        return constructionId;
    }

    public void setConstructionId(java.lang.Long constructionId) {
        this.constructionId = constructionId;
    }

    @Override
    public ContructionLandHandoverPlanDTO toDTO() {
        ContructionLandHandoverPlanDTO contructionLandHandoverPlanDTO = new ContructionLandHandoverPlanDTO();
        // set cac gia tri
        contructionLandHandoverPlanDTO.setUpdateUser(this.updateUser);
        contructionLandHandoverPlanDTO.setUpdateDate(this.updateDate);
        contructionLandHandoverPlanDTO.setName(this.name);
        contructionLandHandoverPlanDTO.setMonth(this.month);
        contructionLandHandoverPlanDTO.setYear(this.year);
        contructionLandHandoverPlanDTO.setSysGroupId(this.sysGroupId);
        contructionLandHandoverPlanDTO.setCatStationId(this.catStationId);
        contructionLandHandoverPlanDTO.setCatPartnerId(this.catPartnerId);
        contructionLandHandoverPlanDTO.setGroundPlanDate(this.groundPlanDate);
        contructionLandHandoverPlanDTO.setDescription(this.description);
        contructionLandHandoverPlanDTO.setCreateDate(this.createDate);
        contructionLandHandoverPlanDTO.setCreateUser(this.createUser);
        contructionLandHandoverPlanDTO.setConstructionId(this.constructionId);
        contructionLandHandoverPlanDTO.setConstructionId(this.contructionLandHanPlanId);

        return contructionLandHandoverPlanDTO;
    }

}
