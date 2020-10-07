package com.viettel.aio.dto;

import com.viettel.aio.bo.AIOTokenBO;
import com.viettel.coms.dto.ComsBaseFWDTO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import javax.xml.bind.annotation.XmlRootElement;
import java.util.Date;

//VietNT_20190607_create
@XmlRootElement(name = "AIO_TOKENBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class AIOTokenDTO extends ComsBaseFWDTO<AIOTokenBO> {

    private Long aioTokenId;
    private Long sysUserId;
    private String sysUserPhone;
    private String payPhone;
    private String token;
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
    public AIOTokenBO toModel() {
        AIOTokenBO bo = new AIOTokenBO();
        bo.setAioTokenId(this.getAioTokenId());
        bo.setSysUserId(this.getSysUserId());
        bo.setSysUserPhone(this.getSysUserPhone());
        bo.setPayPhone(this.getPayPhone());
        bo.setToken(this.getToken());
        bo.setCreatedDate(this.getCreatedDate());
        return bo;
    }

    @Override
    public Long getFWModelId() {
        return aioTokenId;
    }

    @Override
    public String catchName() {
        return aioTokenId.toString();
    }
}
