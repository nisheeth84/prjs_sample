/*
 * Copyright 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.coms.bo;

import com.viettel.coms.dto.ConfigGroupProvinceDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@Entity
@Table(name = "CONFIG_GROUP_PROVINCE")
/**
 *
 * @author: ThuanNHT
 * @version: 1.0
 * @since: 1.0
 */
public class ConfigGroupProvinceBO extends BaseFWModelImpl {

    private java.lang.Long configGroupProvinceId;
    private java.lang.Long sysGroupId;
    private java.lang.String sysGroupName;
    private java.lang.Long catProvinceId;
    private java.lang.String catProvinceCode;
    private java.lang.String catProvinceName;

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @Parameter(name = "sequence", value = "CONFIG_GROUP_PROVINCE_SEQ")})
    @Column(name = "CONFIG_GROUP_PROVINCE_ID", length = 22)
    public java.lang.Long getConfigGroupProvinceId() {
        return configGroupProvinceId;
    }

    public void setConfigGroupProvinceId(java.lang.Long configGroupProvinceId) {
        this.configGroupProvinceId = configGroupProvinceId;
    }

    @Column(name = "SYS_GROUP_ID", length = 22)
    public java.lang.Long getSysGroupId() {
        return sysGroupId;
    }

    public void setSysGroupId(java.lang.Long sysGroupId) {
        this.sysGroupId = sysGroupId;
    }

    @Column(name = "SYS_GROUP_NAME", length = 400)
    public java.lang.String getSysGroupName() {
        return sysGroupName;
    }

    public void setSysGroupName(java.lang.String sysGroupName) {
        this.sysGroupName = sysGroupName;
    }

    @Column(name = "CAT_PROVINCE_ID", length = 22)
    public java.lang.Long getCatProvinceId() {
        return catProvinceId;
    }

    public void setCatProvinceId(java.lang.Long catProvinceId) {
        this.catProvinceId = catProvinceId;
    }

    @Column(name = "CAT_PROVINCE_CODE", length = 400)
    public java.lang.String getCatProvinceCode() {
        return catProvinceCode;
    }

    public void setCatProvinceCode(java.lang.String catProvinceCode) {
        this.catProvinceCode = catProvinceCode;
    }

    @Column(name = "CAT_PROVINCE_NAME", length = 400)
    public java.lang.String getCatProvinceName() {
        return catProvinceName;
    }

    public void setCatProvinceName(java.lang.String catProvinceName) {
        this.catProvinceName = catProvinceName;
    }

    @Override
    public ConfigGroupProvinceDTO toDTO() {
        ConfigGroupProvinceDTO configGroupProvinceDTO = new ConfigGroupProvinceDTO();
        // set cac gia tri
        configGroupProvinceDTO.setConfigGroupProvinceId(this.configGroupProvinceId);
        configGroupProvinceDTO.setSysGroupId(this.sysGroupId);
        configGroupProvinceDTO.setSysGroupName(this.sysGroupName);
        configGroupProvinceDTO.setCatProvinceId(this.catProvinceId);
        configGroupProvinceDTO.setCatProvinceCode(this.catProvinceCode);
        configGroupProvinceDTO.setCatProvinceName(this.catProvinceName);
        return configGroupProvinceDTO;
    }
}
