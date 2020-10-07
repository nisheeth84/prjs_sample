package com.viettel.aio.bo;

import com.viettel.service.base.dto.BaseFWDTOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "SYS_GROUP")
public class AIOSysGroupBO extends BaseFWModelImpl {

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @org.hibernate.annotations.Parameter(name = "sequence", value = "SYS_GROUP_SEQ")})
    @Column(name = "SYS_GROUP_ID")
    private Long sysGroupId;

    public Long getSysGroupId() {
        return sysGroupId;
    }

    public void setSysGroupId(Long sysGroupId) {
        this.sysGroupId = sysGroupId;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public Date getEffectDate() {
        return effectDate;
    }

    public void setEffectDate(Date effectDate) {
        this.effectDate = effectDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
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

    public String getGroupOrder() {
        return groupOrder;
    }

    public void setGroupOrder(String groupOrder) {
        this.groupOrder = groupOrder;
    }

    public int getGroupLevel() {
        return groupLevel;
    }

    public void setGroupLevel(int groupLevel) {
        this.groupLevel = groupLevel;
    }

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

    @Column(name = "CODE")
    private String code;
    @Column(name = "NAME")
    private String name;
    @Column(name = "PARENT_ID")
    private Long parentId;
    @Column(name = "STATUS")
    private int status;
    @Column(name = "PATH")
    private String path;
    @Column(name = "EFFECT_DATE")
    private Date effectDate;
    @Column(name = "END_DATE")
    private Date endDate;
    @Column(name = "GROUP_NAME_LEVEL1")
    private String groupNameLevel1;
    @Column(name = "GROUP_NAME_LEVEL2")
    private String groupNameLevel2;
    @Column(name = "GROUP_NAME_LEVEL3")
    private String groupNameLevel3;
    @Column(name = "GROUP_ORDER")
    private String groupOrder;
    @Column(name = "GROUP_LEVEL")
    private int groupLevel;
    @Column(name = "AREA_ID")
    private Long areaId;
    @Column(name = "AREA_CODE")
    private String areaCode;
    @Column(name = "PROVINCE_ID")
    private Long provinceId;
    @Column(name = "PROVINCE_CODE")
    private String provinceCode;


    @Override
    public BaseFWDTOImpl toDTO() {
        return null;
    }
}
