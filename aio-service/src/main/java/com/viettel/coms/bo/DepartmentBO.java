/*
 * Copyright 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.coms.bo;

import com.viettel.coms.dto.DepartmentDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@Entity
@Table(name = "SYS_GROUP")
/**
 *
 * @author: PhongPV
 * @version: 1.0
 * @since: 1.0
 */
public class DepartmentBO extends BaseFWModelImpl {

    private java.util.Date endDate;
    private java.util.Date effectDate;
    private java.lang.String path;
    private java.lang.String code;
    private java.lang.String name;
    private java.lang.Long parentId;
    private java.lang.String status;
    private java.lang.Long sysGroupId;

    public DepartmentBO() {
        setColId("sysGroupId");
        setColName("sysGroupId");
        setUniqueColumn(new String[]{"sysGroupId"});
    }

    @Column(name = "END_DATE", length = 7)
    public java.util.Date getEndDate() {
        return endDate;
    }

    public void setEndDate(java.util.Date endDate) {
        this.endDate = endDate;
    }

    @Column(name = "EFFECT_DATE", length = 7)
    public java.util.Date getEffectDate() {
        return effectDate;
    }

    public void setEffectDate(java.util.Date effectDate) {
        this.effectDate = effectDate;
    }

    @Column(name = "PATH", length = 1000)
    public java.lang.String getPath() {
        return path;
    }

    public void setPath(java.lang.String path) {
        this.path = path;
    }

    @Column(name = "CODE", length = 100)
    public java.lang.String getCode() {
        return code;
    }

    public void setCode(java.lang.String code) {
        this.code = code;
    }

    @Column(name = "NAME", length = 100)
    public java.lang.String getName() {
        return name;
    }

    public void setName(java.lang.String name) {
        this.name = name;
    }

    @Column(name = "PARENT_ID", length = 22)
    public java.lang.Long getParentId() {
        return parentId;
    }

    public void setParentId(java.lang.Long parentId) {
        this.parentId = parentId;
    }

    @Column(name = "STATUS", length = 20)
    public java.lang.String getStatus() {
        return status;
    }

    public void setStatus(java.lang.String status) {
        this.status = status;
    }

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @Parameter(name = "sequence", value = "CAT_OWNER.DEPARTMENT_SEQ")})
    @Column(name = "SYS_GROUP_ID", length = 22)
    public java.lang.Long getSysGroupId() {
        return sysGroupId;
    }

    public void setSysGroupId(java.lang.Long sysGroupId) {
        this.sysGroupId = sysGroupId;
    }

    @Override
    public DepartmentDTO toDTO() {
        DepartmentDTO departmentDTO = new DepartmentDTO();
        // set cac gia tri
        departmentDTO.setEndDate(this.endDate);
        departmentDTO.setEffectDate(this.effectDate);
        departmentDTO.setPath(this.path);
        departmentDTO.setCode(this.code);
        departmentDTO.setName(this.name);
        departmentDTO.setParentId(this.parentId);
        departmentDTO.setStatus(this.status);
        return departmentDTO;
    }

}
