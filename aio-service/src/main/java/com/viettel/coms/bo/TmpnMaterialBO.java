/*
 * Copyright 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.coms.bo;

import com.viettel.coms.dto.TmpnMaterialDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@Entity
@Table(name = "TMPN_MATERIAL")
/**
 *
 * @author: ThuanNHT
 * @version: 1.0
 * @since: 1.0
 */
public class TmpnMaterialBO extends BaseFWModelImpl {

    private java.lang.Long tmpnMaterialId;
    private java.lang.Long totalMonthPlanId;
    private java.lang.Long sysGroupId;
    private java.lang.Long month;
    private java.lang.Long year;
    private java.lang.String description;
    private java.lang.Long catConstructionDeployId;
    private java.lang.Long catConstructionTypeId;

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @Parameter(name = "sequence", value = "TMPN_MATERIAL_SEQ")})
    @Column(name = "TMPN_MATERIAL_ID", length = 22)
    public java.lang.Long getTmpnMaterialId() {
        return tmpnMaterialId;
    }

    public void setTmpnMaterialId(java.lang.Long tmpnMaterialId) {
        this.tmpnMaterialId = tmpnMaterialId;
    }

    @Column(name = "TOTAL_MONTH_PLAN_ID", length = 22)
    public java.lang.Long getTotalMonthPlanId() {
        return totalMonthPlanId;
    }

    public void setTotalMonthPlanId(java.lang.Long totalMonthPlanId) {
        this.totalMonthPlanId = totalMonthPlanId;
    }

    @Column(name = "SYS_GROUP_ID", length = 22)
    public java.lang.Long getSysGroupId() {
        return sysGroupId;
    }

    public void setSysGroupId(java.lang.Long sysGroupId) {
        this.sysGroupId = sysGroupId;
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

    @Column(name = "DESCRIPTION", length = 1000)
    public java.lang.String getDescription() {
        return description;
    }

    public void setDescription(java.lang.String description) {
        this.description = description;
    }

    @Column(name = "CAT_CONSTRUCTION_TYPE_ID", length = 22)
    public java.lang.Long getCatConstructionTypeId() {
        return catConstructionTypeId;
    }

    @Column(name = "CAT_CONSTRUCTION_DEPLOY_ID", length = 22)
    public java.lang.Long getCatConstructionDeployId() {
        return catConstructionDeployId;
    }

    public void setCatConstructionDeployId(java.lang.Long catConstructionDeployId) {
        this.catConstructionDeployId = catConstructionDeployId;
    }

    public void setCatConstructionTypeId(java.lang.Long catConstructionTypeId) {
        this.catConstructionTypeId = catConstructionTypeId;
    }

    @Override
    public TmpnMaterialDTO toDTO() {
        TmpnMaterialDTO tmpnMaterialDTO = new TmpnMaterialDTO();
        // set cac gia tri
        tmpnMaterialDTO.setTmpnMaterialId(this.tmpnMaterialId);
        tmpnMaterialDTO.setTotalMonthPlanId(this.totalMonthPlanId);
        tmpnMaterialDTO.setSysGroupId(this.sysGroupId);
        tmpnMaterialDTO.setMonth(this.month);
        tmpnMaterialDTO.setYear(this.year);
        tmpnMaterialDTO.setDescription(this.description);
        tmpnMaterialDTO.setCatConstructionDeployId(this.catConstructionDeployId);
        tmpnMaterialDTO.setCatConstructionTypeId(this.catConstructionTypeId);
        return tmpnMaterialDTO;
    }
}
