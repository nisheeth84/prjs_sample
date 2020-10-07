package com.viettel.aio.dto;

import com.viettel.aio.bo.AIOStaffBO;
import com.viettel.coms.dto.ComsBaseFWDTO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import javax.xml.bind.annotation.XmlRootElement;

//VietNT_20190711_create
@XmlRootElement(name = "AIO_STAFFBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class AIOStaffDTO extends ComsBaseFWDTO<AIOStaffBO> {
    private Long staffId;
    private Long sysUserId;
    private String code;
    private String name;
    private Double type;
    private Long sysGroupId;

    public Long getStaffId() {
        return staffId;
    }

    public void setStaffId(Long staffId) {
        this.staffId = staffId;
    }

    public Long getSysUserId() {
        return sysUserId;
    }

    public void setSysUserId(Long sysUserId) {
        this.sysUserId = sysUserId;
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

    public Double getType() {
        return type;
    }

    public void setType(Double type) {
        this.type = type;
    }

    public Long getSysGroupId() {
        return sysGroupId;
    }

    public void setSysGroupId(Long sysGroupId) {
        this.sysGroupId = sysGroupId;
    }

    @Override
    public AIOStaffBO toModel() {
        AIOStaffBO bo = new AIOStaffBO();
        bo.setStaffId(this.getStaffId());
        bo.setSysUserId(this.getSysUserId());
        bo.setCode(this.getCode());
        bo.setName(this.getName());
        bo.setType(this.getType());
        bo.setSysGroupId(this.getSysGroupId());
        return bo;
    }

    @Override
    public Long getFWModelId() {
        return staffId;
    }

    @Override
    public String catchName() {
        return staffId.toString();
    }
}
