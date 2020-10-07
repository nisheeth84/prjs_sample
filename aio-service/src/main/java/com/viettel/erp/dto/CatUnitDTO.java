/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.erp.dto;

import com.viettel.erp.bo.CatUnitBO;
import com.viettel.service.base.dto.BaseFWDTOImpl;

import javax.xml.bind.annotation.XmlRootElement;

/**
 * @author thuannht
 */
@XmlRootElement(name = "CAT_UNITBO")
public class CatUnitDTO extends BaseFWDTOImpl<CatUnitBO> {

    private java.lang.Long unitId;
    private java.lang.String name;
    private java.lang.String description;
    private java.lang.String sortChar;
    private java.lang.Long isActive;
    private java.lang.Long type;
    private java.lang.String enName;

    @Override
    public CatUnitBO toModel() {
        CatUnitBO catUnitBO = new CatUnitBO();
        catUnitBO.setUnitId(this.unitId);
        catUnitBO.setName(this.name);
        catUnitBO.setDescription(this.description);
        catUnitBO.setSortChar(this.sortChar);
        catUnitBO.setIsActive(this.isActive);
        catUnitBO.setType(this.type);
        catUnitBO.setEnName(this.enName);
        return catUnitBO;
    }

    @Override
    public Long getFWModelId() {
        return unitId;
    }

    @Override
    public String catchName() {
        return getUnitId().toString();
    }

    public java.lang.Long getUnitId() {
        return unitId;
    }

    public void setUnitId(java.lang.Long unitId) {
        this.unitId = unitId;
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

    public java.lang.String getSortChar() {
        return sortChar;
    }

    public void setSortChar(java.lang.String sortChar) {
        this.sortChar = sortChar;
    }

    public java.lang.Long getIsActive() {
        return isActive;
    }

    public void setIsActive(java.lang.Long isActive) {
        this.isActive = isActive;
    }

    public java.lang.Long getType() {
        return type;
    }

    public void setType(java.lang.Long type) {
        this.type = type;
    }

    public java.lang.String getEnName() {
        return enName;
    }

    public void setEnName(java.lang.String enName) {
        this.enName = enName;
    }


}
