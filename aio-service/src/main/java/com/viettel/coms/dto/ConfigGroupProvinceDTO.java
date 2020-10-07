/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.dto;

import com.viettel.coms.bo.ConfigGroupProvinceBO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import javax.xml.bind.annotation.XmlRootElement;
import java.util.List;

/**
 * @author thuannht
 */
@XmlRootElement(name = "CONFIG_GROUP_PROVINCEBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class ConfigGroupProvinceDTO extends ComsBaseFWDTO<ConfigGroupProvinceBO> {

    private java.lang.Long configGroupProvinceId;
    private java.lang.Long sysGroupId;
    private java.lang.String sysGroupName;
    private java.lang.Long catProvinceId;
    private java.lang.String catProvinceCode;
    private java.lang.String catProvinceName;
    List<ConfigGroupProvinceDTO> workItemTypeList;

    @Override
    public ConfigGroupProvinceBO toModel() {
        ConfigGroupProvinceBO configGroupProvinceBO = new ConfigGroupProvinceBO();
        configGroupProvinceBO.setConfigGroupProvinceId(this.configGroupProvinceId);
        configGroupProvinceBO.setSysGroupId(this.sysGroupId);
        configGroupProvinceBO.setSysGroupName(this.sysGroupName);
        configGroupProvinceBO.setCatProvinceId(this.catProvinceId);
        configGroupProvinceBO.setCatProvinceCode(this.catProvinceCode);
        configGroupProvinceBO.setCatProvinceName(this.catProvinceName);
        return configGroupProvinceBO;
    }

    public java.lang.Long getConfigGroupProvinceId() {
        return configGroupProvinceId;
    }

    public void setConfigGroupProvinceId(java.lang.Long configGroupProvinceId) {
        this.configGroupProvinceId = configGroupProvinceId;
    }

    public java.lang.Long getSysGroupId() {
        return sysGroupId;
    }

    public void setSysGroupId(java.lang.Long sysGroupId) {
        this.sysGroupId = sysGroupId;
    }

    public java.lang.String getSysGroupName() {
        return sysGroupName;
    }

    public void setSysGroupName(java.lang.String sysGroupName) {
        this.sysGroupName = sysGroupName;
    }

    public java.lang.Long getCatProvinceId() {
        return catProvinceId;
    }

    public void setCatProvinceId(java.lang.Long catProvinceId) {
        this.catProvinceId = catProvinceId;
    }

    public java.lang.String getCatProvinceCode() {
        return catProvinceCode;
    }

    public void setCatProvinceCode(java.lang.String catProvinceCode) {
        this.catProvinceCode = catProvinceCode;
    }

    public java.lang.String getCatProvinceName() {
        return catProvinceName;
    }

    public void setCatProvinceName(java.lang.String catProvinceName) {
        this.catProvinceName = catProvinceName;
    }

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

    public List<ConfigGroupProvinceDTO> getWorkItemTypeList() {
        return workItemTypeList;
    }

    public void setWorkItemTypeList(List<ConfigGroupProvinceDTO> workItemTypeList) {
        this.workItemTypeList = workItemTypeList;
    }

}
