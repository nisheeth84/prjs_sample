package com.viettel.aio.dto;

import com.viettel.coms.dto.ComsBaseFWDTO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import javax.xml.bind.annotation.XmlRootElement;
import java.util.Date;

//VietNT_20190917_create
@XmlRootElement(name = "AIO_SYS_GROUPBO")
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonSerialize(include=JsonSerialize.Inclusion.NON_NULL)
public class AIOSysGroupDTO {
    private Long sysGroupId;
    private String code;
    private String name;
    private Long parentId;
    private String status;
    private String path;
    private Date effectDate;
    private Date endDate;
    private String groupNameLevel1;
    private String groupNameLevel2;
    private String groupNameLevel3;
    private String groupOrder;
    private String groupLevel;
    private Long areaId;
    private String areaCode;
    private Long provinceId;
    private String provinceCode;
    private String text;

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
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

    public String getGroupLevel() {
        return groupLevel;
    }

    public void setGroupLevel(String groupLevel) {
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
}
