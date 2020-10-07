/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.dto;

import com.viettel.coms.bo.SysUserCOMSBO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import javax.xml.bind.annotation.XmlRootElement;

/**
 * @author PhongPV
 */
@XmlRootElement(name = "SYS_USERwmsBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class SysUserCOMSDTO extends ComsBaseFWDTO<SysUserCOMSBO> {

    private java.lang.Long sysUserId;
    private java.lang.String loginName;
    private java.lang.String fullName;
    private java.lang.String password;
    private java.lang.String employeeCode;
    private java.lang.String email;
    private java.lang.String phoneNumber;
    private java.lang.String status;
    private java.util.Date birthday;
    private java.lang.String position;
    private java.lang.String namePhone;
    private java.lang.String sysGroupName;
    private java.lang.Long sysGroupId;
    private java.lang.String departmentName;
    private String vofficePass;
    private String catProvinceCode;
    private String constructionCode;
    private String groupLevel;
    private String path;
    private String groupNameLevel3;
    //VietNT_25/06/2019_start
    private String saleChannel;
    //VietNT_end

    //VietNT_16/09/2019_start
    private Long typeUser;
    private String address;
    private String taxCode;
    //VietNT_end

    public String getTaxCode() {
        return taxCode;
    }

    public void setTaxCode(String taxCode) {
        this.taxCode = taxCode;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Long getTypeUser() {
        return typeUser;
    }

    public void setTypeUser(Long typeUser) {
        this.typeUser = typeUser;
    }

    public String getSaleChannel() {
        return saleChannel;
    }

    public void setSaleChannel(String saleChannel) {
        this.saleChannel = saleChannel;
    }

    public String getGroupNameLevel3() {
		return groupNameLevel3;
	}

	public void setGroupNameLevel3(String groupNameLevel3) {
		this.groupNameLevel3 = groupNameLevel3;
	}

	public String getGroupLevel() {
		return groupLevel;
	}

	public void setGroupLevel(String groupLevel) {
		this.groupLevel = groupLevel;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	//tienth 20180406 START
    private Long departmentId;
//tienth 20180406 END

    public void setConstructionCode(String constructionCode) {
        this.constructionCode = constructionCode;
    }

    public String getConstructionCode() {
        return constructionCode;
    }

    public void setNamePhone(java.lang.String namePhone) {
        this.namePhone = namePhone;
    }

    public void setCatProvinceCode(String catProvinceCode) {
        this.catProvinceCode = catProvinceCode;
    }

    public java.lang.String getSysGroupName() {
        return sysGroupName;
    }

    public void setSysGroupName(java.lang.String sysGroupName) {
        this.sysGroupName = sysGroupName;
    }

    public String getCatProvinceCode() {
        return catProvinceCode;
    }

    public String getVofficePass() {
        return vofficePass;
    }

    public void setVofficePass(String vofficePass) {
        this.vofficePass = vofficePass;
    }

    public java.lang.String getNamePhone() {
        return fullName + " - " + phoneNumber;
    }

    private java.lang.String name;

    @Override
    public SysUserCOMSBO toModel() {
        SysUserCOMSBO sysUserwmsBO = new SysUserCOMSBO();
        sysUserwmsBO.setSysUserId(this.sysUserId);
        sysUserwmsBO.setLoginName(this.loginName);
        sysUserwmsBO.setFullName(this.fullName);
        sysUserwmsBO.setPassword(this.password);
        sysUserwmsBO.setEmployeeCode(this.employeeCode);
        sysUserwmsBO.setEmail(this.email);
        sysUserwmsBO.setPhoneNumber(this.phoneNumber);
        sysUserwmsBO.setStatus(this.status);
//        sysUserwmsBO.setBirthday(this.birthday);
//        sysUserwmsBO.setPosition(this.position);
        sysUserwmsBO.setSysGroupId(this.sysGroupId);
        sysUserwmsBO.setSaleChannel(this.getSaleChannel());
        sysUserwmsBO.setTypeUser(this.getTypeUser());
//        sysUserwmsBO.setAddress(this.getAddress());
        sysUserwmsBO.setTaxCode(this.getTaxCode());
        return sysUserwmsBO;
    }

    @Override
    public Long getFWModelId() {
        return sysUserId;
    }

    @Override
    public String catchName() {
        return getSysUserId().toString();
    }

    public java.lang.Long getSysUserId() {
        return sysUserId;
    }

    public void setSysUserId(java.lang.Long sysUserId) {
        this.sysUserId = sysUserId;
    }

    public java.lang.String getLoginName() {
        return loginName;
    }

    public void setLoginName(java.lang.String loginName) {
        this.loginName = loginName;
    }

    public java.lang.String getFullName() {
        return fullName;
    }

    public void setFullName(java.lang.String fullName) {
        this.fullName = fullName;
    }

    public java.lang.String getPassword() {
        return password;
    }

    public void setPassword(java.lang.String password) {
        this.password = password;
    }

    public java.lang.String getEmployeeCode() {
        return employeeCode;
    }

    public void setEmployeeCode(java.lang.String employeeCode) {
        this.employeeCode = employeeCode;
    }

    public java.lang.String getEmail() {
        return email;
    }

    public void setEmail(java.lang.String email) {
        this.email = email;
    }

    public java.lang.String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(java.lang.String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public java.lang.String getStatus() {
        return status;
    }

    public void setStatus(java.lang.String status) {
        this.status = status;
    }

    public java.util.Date getBirthday() {
        return birthday;
    }

    public void setBirthday(java.util.Date birthday) {
        this.birthday = birthday;
    }

    public java.lang.String getPosition() {
        return position;
    }

    public void setPosition(java.lang.String position) {
        this.position = position;
    }

    public java.lang.String getName() {
        return name;
    }

    public void setName(java.lang.String name) {
        this.name = name;
    }

    public java.lang.Long getSysGroupId() {
        return sysGroupId;
    }

    public void setSysGroupId(java.lang.Long sysGroupId) {
        this.sysGroupId = sysGroupId;
    }

    public java.lang.String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(java.lang.String departmentName) {
        this.departmentName = departmentName;
    }

    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }

}
