package com.viettel.aio.bo;

import com.viettel.aio.dto.AIOTokenDTO;
import com.viettel.service.base.dto.BaseFWDTOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.Date;

//VietNT_20190607_start
@Entity
@Table(name = "AIO_TOKEN")
public class AIOTokenBO extends BaseFWModelImpl {

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @org.hibernate.annotations.Parameter(name = "sequence", value = "AIO_TOKEN_SEQ")})
    @Column(name = "AIO_TOKEN_ID", length = 10)
    private Long aioTokenId;
    @Column(name = "SYS_USER_ID", length = 10)
    private Long sysUserId;
    @Column(name = "SYS_USER_PHONE", length = 20)
    private String sysUserPhone;
    @Column(name = "PAY_PHONE", length = 20)
    private String payPhone;
    @Column(name = "TOKEN", length = 20)
    private String token;
    @Column(name = "CREATED_DATE", length = 22)
    private Date createdDate;

    public Long getAioTokenId() {
        return aioTokenId;
    }

    public void setAioTokenId(Long aioTokenId) {
        this.aioTokenId = aioTokenId;
    }

    public Long getSysUserId() {
        return sysUserId;
    }

    public void setSysUserId(Long sysUserId) {
        this.sysUserId = sysUserId;
    }

    public String getSysUserPhone() {
        return sysUserPhone;
    }

    public void setSysUserPhone(String sysUserPhone) {
        this.sysUserPhone = sysUserPhone;
    }

    public String getPayPhone() {
        return payPhone;
    }

    public void setPayPhone(String payPhone) {
        this.payPhone = payPhone;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    @Override
    public BaseFWDTOImpl toDTO() {
        AIOTokenDTO dto = new AIOTokenDTO();
        dto.setAioTokenId(this.getAioTokenId());
        dto.setSysUserId(this.getSysUserId());
        dto.setSysUserPhone(this.getSysUserPhone());
        dto.setPayPhone(this.getPayPhone());
        dto.setToken(this.getToken());
        dto.setCreatedDate(this.getCreatedDate());
        return dto;
    }
}
