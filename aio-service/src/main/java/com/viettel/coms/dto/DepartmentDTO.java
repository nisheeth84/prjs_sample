/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.dto;

import com.viettel.coms.bo.DepartmentBO;
import com.viettel.erp.utils.JsonDateDeserializer;
import com.viettel.erp.utils.JsonDateSerializerDate;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import javax.xml.bind.annotation.XmlRootElement;

/**
 * @author PhongPV
 */
@XmlRootElement(name = "DEPARTMENTBO")
public class DepartmentDTO extends ComsBaseFWDTO<DepartmentBO> {
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private java.util.Date endDate;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private java.util.Date effectDate;
    private java.lang.String path;
    private java.lang.String code;
    private java.lang.String name;
    private java.lang.Long parentId;
    private java.lang.String status;
    private java.lang.Long departmentId;
    private java.lang.String parentName;
    private String groupNameLevel1;
    private String groupNameLevel2;
    private String groupNameLevel3;
    private String address;
    private Long partnerType;
    private java.lang.Long sysGroupId;
    private java.lang.String groupLevel;
    
    //VietNT_10/07/2019_start
    private Long areaId;
    private String areaCode;
    private Long provinceId;
    private String provinceCode;

    public Long getAreaId() {
        return areaId;
    }

    public void setAreaId(Long areaId) {
        this.areaId = areaId;
    }

    public String getAreaCode() {
        return areaCode;
    }

    public void setAreaCode(String areaCode) {
        this.areaCode = areaCode;
    }

    public Long getProvinceId() {
        return provinceId;
    }

    public void setProvinceId(Long provinceId) {
        this.provinceId = provinceId;
    }

    public String getProvinceCode() {
        return provinceCode;
    }

    public void setProvinceCode(String provinceCode) {
        this.provinceCode = provinceCode;
    }

    //VietNT_end

    public java.lang.Long getSysGroupId() {
		return sysGroupId;
	}

	public void setSysGroupId(java.lang.Long sysGroupId) {
		this.sysGroupId = sysGroupId;
	}

	public java.lang.String getGroupLevel() {
		return groupLevel;
	}

	public void setGroupLevel(java.lang.String groupLevel) {
		this.groupLevel = groupLevel;
	}

	@Override
    public DepartmentBO toModel() {
        DepartmentBO departmentBO = new DepartmentBO();
        departmentBO.setEndDate(this.endDate);
        departmentBO.setEffectDate(this.effectDate);
        departmentBO.setPath(this.path);
        departmentBO.setCode(this.code);
        departmentBO.setName(this.name);
        departmentBO.setParentId(this.parentId);
        departmentBO.setStatus(this.status);
        return departmentBO;
    }

    public Long getPartnerType() {
        return partnerType;
    }

    public void setPartnerType(Long partnerType) {
        this.partnerType = partnerType;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getGroupNameLevel1() {
        return groupNameLevel1;
    }

    public void setGroupNameLevel1(String groupNameLevel1) {
        this.groupNameLevel1 = groupNameLevel1;
    }

    public String getGroupNameLevel2() {
        return groupNameLevel2;
    }

    public void setGroupNameLevel2(String groupNameLevel2) {
        this.groupNameLevel2 = groupNameLevel2;
    }

    public String getGroupNameLevel3() {
        return groupNameLevel3;
    }

    public void setGroupNameLevel3(String groupNameLevel3) {
        this.groupNameLevel3 = groupNameLevel3;
    }

    public java.util.Date getEndDate() {
        return endDate;
    }

    public void setEndDate(java.util.Date endDate) {
        this.endDate = endDate;
    }

    public java.util.Date getEffectDate() {
        return effectDate;
    }

    public void setEffectDate(java.util.Date effectDate) {
        this.effectDate = effectDate;
    }

    public java.lang.String getPath() {
        return path;
    }

    public void setPath(java.lang.String path) {
        this.path = path;
    }

    public java.lang.String getCode() {
        return code;
    }

    public void setCode(java.lang.String code) {
        this.code = code.toUpperCase();
    }

    public java.lang.String getName() {
        return name;
    }

    public void setName(java.lang.String name) {
        this.name = name;
    }

    public java.lang.Long getParentId() {
        return parentId;
    }

    public void setParentId(java.lang.Long parentId) {
        this.parentId = parentId;
    }

    public java.lang.String getStatus() {
        return status;
    }

    public void setStatus(java.lang.String status) {
        this.status = status;
    }

    public java.lang.String getParentName() {
        return parentName;
    }

    public void setParentName(java.lang.String parentName) {
        this.parentName = parentName;
    }

    @Override
    public Long getFWModelId() {
        return departmentId;
    }

    @Override
    public String catchName() {
        return getDepartmentId().toString();
    }

    public java.lang.Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(java.lang.Long departmentId) {
        this.departmentId = departmentId;
    }

}
