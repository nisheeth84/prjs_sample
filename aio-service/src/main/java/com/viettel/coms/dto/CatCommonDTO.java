package com.viettel.coms.dto;

import com.viettel.service.base.model.BaseFWModelImpl;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class CatCommonDTO extends ComsBaseFWDTO<BaseFWModelImpl> {

    /**
     *
     */
    private static final long serialVersionUID = 1L;

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
    private java.lang.Long id;
    private java.lang.Long catContructionTypeId;
    private java.lang.Long catWorkItemGroupId;

    public java.lang.String getCode() {
        return code;
    }

    public java.lang.Long getCatContructionTypeId() {
        return catContructionTypeId;
    }

    public void setCatContructionTypeId(java.lang.Long catContructionTypeId) {
        this.catContructionTypeId = catContructionTypeId;
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

    public java.lang.Long getId() {
        return id;
    }

    public void setId(java.lang.Long id) {
        this.id = id;
    }

	public java.lang.Long getCatWorkItemGroupId() {
		return catWorkItemGroupId;
	}

	public void setCatWorkItemGroupId(java.lang.Long catWorkItemGroupId) {
		this.catWorkItemGroupId = catWorkItemGroupId;
	}
    
    

}
