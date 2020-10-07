package com.viettel.aio.bo;

import com.viettel.aio.dto.AIOStaffDTO;
import com.viettel.service.base.dto.BaseFWDTOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

//VietNT_20190711_start
@Entity
@Table(name = "AIO_STAFF")
public class AIOStaffBO extends BaseFWModelImpl {

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @org.hibernate.annotations.Parameter(name = "sequence", value = "AIO_STAFF_SEQ")})
    @Column(name = "STAFF_ID", length = 10)
    private Long staffId;
    @Column(name = "SYS_USER_ID", length = 10)
    private Long sysUserId;
    @Column(name = "CODE", length = 200)
    private String code;
    @Column(name = "NAME", length = 500)
    private String name;
    @Column(name = "TYPE", length = 2)
    private Double type;
    @Column(name = "SYS_GROUP_ID", length = 10)
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
    public BaseFWDTOImpl toDTO() {
        AIOStaffDTO dto = new AIOStaffDTO();
        dto.setStaffId(this.getStaffId());
        dto.setSysUserId(this.getSysUserId());
        dto.setCode(this.getCode());
        dto.setName(this.getName());
        dto.setType(this.getType());
        dto.setSysGroupId(this.getSysGroupId());
        return dto;
    }
}
