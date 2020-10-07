package com.viettel.aio.dto;

import com.viettel.aio.bo.AIOLocationUserBO;
import com.viettel.coms.dto.ComsBaseFWDTO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import javax.xml.bind.annotation.XmlRootElement;
import java.util.Date;

//VietNT_20190318_create
@XmlRootElement(name = "AIO_LOCATION_USERBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class AIOLocationUserDTO extends ComsBaseFWDTO<AIOLocationUserBO> {

    private Long locationUserId;
    private Date createdDate;
    private Long sysUserId;
    private Double lat;
    private Double lng;
    private Long status;

    // name
    private String sysUserName;
    private String email;
    private String phoneNumber;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getSysUserName() {
        return sysUserName;
    }

    public void setSysUserName(String sysUserName) {
        this.sysUserName = sysUserName;
    }

    public Long getLocationUserId() {
        return locationUserId;
    }

    public void setLocationUserId(Long locationUserId) {
        this.locationUserId = locationUserId;
    }

    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    public Long getSysUserId() {
        return sysUserId;
    }

    public void setSysUserId(Long sysUserId) {
        this.sysUserId = sysUserId;
    }

    public Double getLat() {
        return lat;
    }

    public void setLat(Double lat) {
        this.lat = lat;
    }

    public Double getLng() {
        return lng;
    }

    public void setLng(Double lng) {
        this.lng = lng;
    }

    public Long getStatus() {
        return status;
    }

    public void setStatus(Long status) {
        this.status = status;
    }

    @Override
    public AIOLocationUserBO toModel() {
        AIOLocationUserBO bo = new AIOLocationUserBO();
        bo.setLocationUserId(this.getLocationUserId());
        bo.setCreatedDate(this.getCreatedDate());
        bo.setSysUserId(this.getSysUserId());
        bo.setLat(this.getLat());
        bo.setLng(this.getLng());
        bo.setStatus(this.getStatus());
        return bo;
    }

    @Override
    public Long getFWModelId() {
        return locationUserId;
    }

    @Override
    public String catchName() {
        return locationUserId.toString();
    }
}
