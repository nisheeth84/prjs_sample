package com.viettel.aio.bo;

import com.viettel.aio.dto.AIOOrderRequestDTO;
import com.viettel.service.base.dto.BaseFWDTOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.Date;

//VietNT_20190819_start
@Entity
@Table(name = "AIO_ORDER_REQUEST")
public class AIOOrderRequestBO extends BaseFWModelImpl {

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @org.hibernate.annotations.Parameter(name = "sequence", value = "AIO_ORDER_REQUEST_SEQ")})
    @Column(name = "ORDER_REQUEST_ID", length = 10)
    private Long orderRequestId;
    @Column(name = "REQUEST_CODE", length = 100)
    private String requestCode;
    @Column(name = "STATUS", length = 1)
    private Long status;
    @Column(name = "SYS_GROUP_ID", length = 10)
    private Long sysGroupId;
    @Column(name = "CREATED_DATE", length = 22)
    private Date createdDate;
    @Column(name = "CREATE_BY", length = 10)
    private Long createBy;
    @Column(name = "SYS_GROUP_LEVEL_3", length = 10)
    private Long sysGroupLevel3;

    public Long getSysGroupLevel3() {
        return sysGroupLevel3;
    }

    public void setSysGroupLevel3(Long sysGroupLevel3) {
        this.sysGroupLevel3 = sysGroupLevel3;
    }

    public Long getOrderRequestId() {
        return orderRequestId;
    }

    public void setOrderRequestId(Long orderRequestId) {
        this.orderRequestId = orderRequestId;
    }

    public String getRequestCode() {
        return requestCode;
    }

    public void setRequestCode(String requestCode) {
        this.requestCode = requestCode;
    }

    public Long getStatus() {
        return status;
    }

    public void setStatus(Long status) {
        this.status = status;
    }

    public Long getSysGroupId() {
        return sysGroupId;
    }

    public void setSysGroupId(Long sysGroupId) {
        this.sysGroupId = sysGroupId;
    }

    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    public Long getCreateBy() {
        return createBy;
    }

    public void setCreateBy(Long createBy) {
        this.createBy = createBy;
    }

    @Override
    public BaseFWDTOImpl toDTO() {
        AIOOrderRequestDTO dto = new AIOOrderRequestDTO();
        dto.setOrderRequestId(this.getOrderRequestId());
        dto.setRequestCode(this.getRequestCode());
        dto.setStatus(this.getStatus());
        dto.setSysGroupId(this.getSysGroupId());
        dto.setCreatedDate(this.getCreatedDate());
        dto.setCreateBy(this.getCreateBy());
        dto.setSysGroupLevel3(this.getSysGroupLevel3());
        return dto;
    }
}
