package com.viettel.coms.dto;

import com.viettel.service.base.model.BaseFWModelImpl;

public class CatConstructionTypeDTO extends ComsBaseFWDTO<BaseFWModelImpl> {

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

    @Override
    public BaseFWModelImpl toModel() {
        // TODO Auto-generated method stub
        return null;
    }

    private java.lang.String code;
    private java.lang.String name;
    private java.lang.Long catConstructionTypeId;
    private java.lang.String status;
    private java.lang.String description;

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

    public java.lang.Long getCatConstructionTypeId() {
        return catConstructionTypeId;
    }

    public void setCatConstructionTypeId(java.lang.Long catConstructionTypeId) {
        this.catConstructionTypeId = catConstructionTypeId;
    }

    public java.lang.String getStatus() {
        return status;
    }

    public void setStatus(java.lang.String status) {
        this.status = status;
    }

    public java.lang.String getDescription() {
        return description;
    }

    public void setDescription(java.lang.String description) {
        this.description = description;
    }

}
