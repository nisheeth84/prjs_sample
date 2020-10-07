package com.viettel.aio.bo;

import com.viettel.aio.dto.AIOLocationUserDTO;
import com.viettel.service.base.dto.BaseFWDTOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.Date;

//VietNT_20190318_start
@Entity
@Table(name = "AIO_LOCATION_USER")
public class AIOLocationUserBO extends BaseFWModelImpl {

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @org.hibernate.annotations.Parameter(name = "sequence", value = "AIO_LOCATION_USER_SEQ")})
    @Column(name = "LOCATION_USER_ID", length = 10)
    private Long locationUserId;
    @Column(name = "CREATED_DATE", length = 22)
    private Date createdDate;
    @Column(name = "SYS_USER_ID", length = 10)
    private Long sysUserId;
    @Column(name = "LAT", length = 9)
    private Double lat;
    @Column(name = "LNG", length = 9)
    private Double lng;
    @Column(name = "STATUS", length = 1)
    private Long status;

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
    public BaseFWDTOImpl toDTO() {
        AIOLocationUserDTO dto = new AIOLocationUserDTO();
        dto.setLocationUserId(this.getLocationUserId());
        dto.setCreatedDate(this.getCreatedDate());
        dto.setSysUserId(this.getSysUserId());
        dto.setLat(this.getLat());
        dto.setLng(this.getLng());
        dto.setStatus(this.getStatus());
        return dto;
    }

}
