package com.viettel.aio.bo;

import com.viettel.aio.dto.AIOPackageDTO;
import com.viettel.coms.dto.AssignHandoverDTO;
import com.viettel.service.base.dto.BaseFWDTOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.Date;

//VietNT_20190308_create
@Entity
@Table(name = "AIO_PACKAGE")
public class AIOPackageBO extends BaseFWModelImpl {

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @org.hibernate.annotations.Parameter(name = "sequence", value = "AIO_PACKAGE_SEQ")})
    @Column(name = "AIO_PACKAGE_ID", length = 10)
    private Long aioPackageId;
    @Column(name = "CODE", length = 50)
    private String code;
    @Column(name = "NAME", length = 50)
    private String name;
    @Column(name = "PACKAGE_TYPE", length = 1)
    private Long packageType;
    @Column(name = "TIME", length = 10)
    private Double time;
    @Column(name = "DESCRIPTION", length = 20)
    private String description;
    @Column(name = "STATUS", length = 1)
    private Long status;
    @Column(name = "START_DATE", length = 22)
    private Date startDate;
    @Column(name = "END_DATE", length = 22)
    private Date endDate;
    @Column(name = "SERVICE_ID", length = 10)
    private Long serviceId;
    @Column(name = "SERVICE_CODE", length = 50)
    private String serviceCode;
    //VietNT_20190417_start
    @Column(name = "REPEAT_NUMBER", length = 15)
    private Long repeatNumber;
    @Column(name = "REPEAT_INTERVAL", length = 15)
    private Double repeatInterval;
    @Column(name = "IS_REPEAT", length = 1)
    private Long isRepeat;
    //VietNT_end
    //VietNT_25/06/2019_start
    @Column(name = "SALE_CHANNEL", length = 1)
    private String saleChannel;
    //VietNT_end
    @Column(name = "IS_PROMOTION", length = 1)
    private Long isPromotion;
    @Column(name = "PACKAGE_POINT", length = 30)
    private Long packagePoint;
    @Column(name = "IS_INTERNAL", length = 1)
    private Long isInternal;
    @Column(name = "CREATED_USER", length = 10)
    private Long createdUser;
    @Column(name = "CREATED_DATE", length = 22)
    private Date createdDate;
    @Column(name = "UPDATE_USER", length = 10)
    private Long updateUser;
    @Column(name = "UPDATE_DATE", length = 22)
    private Date updateDate;
    @Column(name = "INDUSTRY_CODE", length = 22)
    private String industryCode;

    @Override
    public BaseFWDTOImpl toDTO() {
        AIOPackageDTO dto = new AIOPackageDTO();
        dto.setAioPackageId(this.getAioPackageId());
        dto.setCode(this.getCode());
        dto.setName(this.getName());
        dto.setPackageType(this.getPackageType());
        dto.setTime(this.getTime());
        dto.setDescription(this.getDescription());
        dto.setStatus(this.getStatus());
        dto.setStartDate(this.getStartDate());
        dto.setEndDate(this.getEndDate());
        dto.setServiceId(this.getServiceId());
        dto.setServiceCode(this.getServiceCode());
        dto.setRepeatNumber(this.getRepeatNumber());
        dto.setRepeatInterval(this.getRepeatInterval());
        dto.setIsRepeat(this.getIsRepeat());
        dto.setSaleChannel(this.getSaleChannel());
        dto.setIsPromotion(this.getIsPromotion());
        dto.setPackagePoint(this.getPackagePoint());
        dto.setIsInternal(this.getIsInternal());
        dto.setCreatedUser(this.getCreatedUser());
        dto.setCreatedDate(this.getCreatedDate());
        dto.setUpdateUser(this.getUpdateUser());
        dto.setUpdateDate(this.getUpdateDate());
        dto.setIndustryCode(this.getIndustryCode());
        return dto;
    }

    public Long getPackagePoint() {
        return packagePoint;
    }

    public void setPackagePoint(Long packagePoint) {
        this.packagePoint = packagePoint;
    }

    public Long getIsPromotion() {
        return isPromotion;
    }

    public void setIsPromotion(Long isPromotion) {
        this.isPromotion = isPromotion;
    }

    public Long getCreatedUser() {
        return createdUser;
    }

    public void setCreatedUser(Long createdUser) {
        this.createdUser = createdUser;
    }

    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    public Long getUpdateUser() {
        return updateUser;
    }

    public void setUpdateUser(Long updateUser) {
        this.updateUser = updateUser;
    }

    public Date getUpdateDate() {
        return updateDate;
    }

    public void setUpdateDate(Date updateDate) {
        this.updateDate = updateDate;
    }

    public Double getTime() {
        return time;
    }

    public void setTime(Double time) {
        this.time = time;
    }

    public Long getAioPackageId() {
        return aioPackageId;
    }

    public void setAioPackageId(Long aioPackageId) {
        this.aioPackageId = aioPackageId;
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

    public Long getPackageType() {
        return packageType;
    }

    public void setPackageType(Long packageType) {
        this.packageType = packageType;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getStatus() {
        return status;
    }

    public void setStatus(Long status) {
        this.status = status;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public Long getServiceId() {
        return serviceId;
    }

    public void setServiceId(Long serviceId) {
        this.serviceId = serviceId;
    }

    public String getServiceCode() {
        return serviceCode;
    }

    public void setServiceCode(String serviceCode) {
        this.serviceCode = serviceCode;
    }

    public Long getRepeatNumber() {
        return repeatNumber;
    }

    public void setRepeatNumber(Long repeatNumber) {
        this.repeatNumber = repeatNumber;
    }

    public Double getRepeatInterval() {
        return repeatInterval;
    }

    public void setRepeatInterval(Double repeatInterval) {
        this.repeatInterval = repeatInterval;
    }

    public Long getIsRepeat() {
        return isRepeat;
    }

    public void setIsRepeat(Long isRepeat) {
        this.isRepeat = isRepeat;
    }

    public String getSaleChannel() {
        return saleChannel;
    }

    public void setSaleChannel(String saleChannel) {
        this.saleChannel = saleChannel;
    }

    public Long getIsInternal() {
        return isInternal;
    }

    public void setIsInternal(Long isInternal) {
        this.isInternal = isInternal;
    }

    public String getIndustryCode() {
        return industryCode;
    }

    public void setIndustryCode(String industryCode) {
        this.industryCode = industryCode;
    }
}
