/*
 * Copyright 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.erp.bo;

import com.viettel.erp.dto.CatUnitDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@Entity(name = "catunit")
@Table(name = "CAT_UNIT")
/**
 *
 * @author: ThuanNHT
 * @version: 1.0
 * @since: 1.0
 */
public class CatUnitBO extends BaseFWModelImpl {

    private java.lang.Long unitId;
    private java.lang.String name;
    private java.lang.String description;
    private java.lang.String sortChar;
    private java.lang.Long isActive;
    private java.lang.Long type;
    private java.lang.String enName;

    public CatUnitBO() {
        setColId("unitId");
        setColName("unitId");
        setUniqueColumn(new String[]{"unitId"});
    }

    public CatUnitBO(java.lang.Long unitId) {
        this.unitId = unitId;
    }

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence",
            parameters = {
                    @Parameter(name = "sequence", value = "CAT_UNIT_SEQ")
            }
    )
    @Column(name = "UNIT_ID", length = 22)
    public java.lang.Long getUnitId() {
        return unitId;
    }

    public void setUnitId(java.lang.Long unitId) {
        this.unitId = unitId;
    }

    @Column(name = "NAME", length = 200)
    public java.lang.String getName() {
        return name;
    }

    public void setName(java.lang.String name) {
        this.name = name;
    }

    @Column(name = "DESCRIPTION", length = 400)
    public java.lang.String getDescription() {
        return description;
    }

    public void setDescription(java.lang.String description) {
        this.description = description;
    }

    @Column(name = "SORT_CHAR", length = 20)
    public java.lang.String getSortChar() {
        return sortChar;
    }

    public void setSortChar(java.lang.String sortChar) {
        this.sortChar = sortChar;
    }

    @Column(name = "IS_ACTIVE", length = 22)
    public java.lang.Long getIsActive() {
        return isActive;
    }

    public void setIsActive(java.lang.Long isActive) {
        this.isActive = isActive;
    }

    @Column(name = "TYPE", length = 22)
    public java.lang.Long getType() {
        return type;
    }

    public void setType(java.lang.Long type) {
        this.type = type;
    }

    @Column(name = "EN_NAME", length = 200)
    public java.lang.String getEnName() {
        return enName;
    }

    public void setEnName(java.lang.String enName) {
        this.enName = enName;
    }


    @Override
    public CatUnitDTO toDTO() {
        CatUnitDTO catUnitDTO = new CatUnitDTO();
        //set cac gia tri 
        catUnitDTO.setUnitId(this.unitId);
        catUnitDTO.setName(this.name);
        catUnitDTO.setDescription(this.description);
        catUnitDTO.setSortChar(this.sortChar);
        catUnitDTO.setIsActive(this.isActive);
        catUnitDTO.setType(this.type);
        catUnitDTO.setEnName(this.enName);
        return catUnitDTO;
    }
}
