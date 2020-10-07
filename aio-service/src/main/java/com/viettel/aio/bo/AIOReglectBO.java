package com.viettel.aio.bo;

import com.viettel.aio.dto.AIOReglectDTO;
import com.viettel.service.base.dto.BaseFWDTOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "AIO_REGLECT")
public class AIOReglectBO extends BaseFWModelImpl {
    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @org.hibernate.annotations.Parameter(name = "sequence", value = "AIO_REGLECT_SEQ")})
    @Column(name = "AIO_REGLECT_ID")
    private Long aioReglectId;
    @Column(name = "CUSTOMER_ID")
    private Long customerId;
    @Column(name = "CUSTOMER_CODE")
    private String customerCode;
    @Column(name = "CUSTOMER_NAME")
    private String customerName;
    @Column(name = "CUSTOMER_PHONE")
    private String customerPhone;
    @Column(name = "CUSTOMER_ADDRESS")
    private String customerAddress;
    @Column(name = "STATUS", length = 1)
    private Long status;
    @Column(name = "TYPE", length = 1)
    private Long type;
    @Column(name = "CREATED_DATE")
    private Date createdDate;
    @Column(name = "CREATED_USER_ID")
    private Long createdUserId;
    @Column(name = "SUPPORT_DATE")
    private Date supportDate;
    @Column(name = "REGLECT_CONTENT")
    private String reglectContent;
    @Column(name = "DESCRIPTION")
    private String description;
    @Column(name = "PERFORMER_GROUP_ID")
    private Long performerGroupId;
    @Column(name = "UPDATED_DATE")
    private Date updatedDate;
    @Column(name = "UPDATED_USER_ID")
    private Long updatedUserId;

    public Long getAioReglectId() {
        return aioReglectId;
    }

    public void setAioReglectId(Long aioReglectId) {
        this.aioReglectId = aioReglectId;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public String getCustomerCode() {
        return customerCode;
    }

    public void setCustomerCode(String customerCode) {
        this.customerCode = customerCode;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
    }

    public String getCustomerAddress() {
        return customerAddress;
    }

    public void setCustomerAddress(String customerAddress) {
        this.customerAddress = customerAddress;
    }

    public Long getStatus() {
        return status;
    }

    public void setStatus(Long status) {
        this.status = status;
    }

    public Long getType() {
        return type;
    }

    public void setType(Long type) {
        this.type = type;
    }

    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    public Long getCreatedUserId() {
        return createdUserId;
    }

    public void setCreatedUserId(Long createdUser) {
        this.createdUserId = createdUser;
    }

    public Date getSupportDate() {
        return supportDate;
    }

    public void setSupportDate(Date supportDate) {
        this.supportDate = supportDate;
    }

    public String getReglectContent() {
        return reglectContent;
    }

    public void setReglectContent(String reglectContent) {
        this.reglectContent = reglectContent;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getPerformerGroupId() {
        return performerGroupId;
    }

    public void setPerformerGroupId(Long performerGroupId) {
        this.performerGroupId = performerGroupId;
    }

    public Date getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(Date updatedDate) {
        this.updatedDate = updatedDate;
    }

    public Long getUpdatedUserId() {
        return updatedUserId;
    }

    public void setUpdatedUserId(Long updatedUser) {
        this.updatedUserId = updatedUser;
    }

    @Override
    public BaseFWDTOImpl toDTO() {
        AIOReglectDTO dto = new AIOReglectDTO();
        dto.setAioReglectId(this.getAioReglectId());
        dto.setCustomerId(this.getCustomerId());
        dto.setCustomerName(this.getCustomerName());
        dto.setCustomerCode(this.getCustomerCode());
        dto.setCustomerAddress(this.getCustomerAddress());
        dto.setCustomerPhone(this.getCustomerPhone());
        dto.setStatus(this.getStatus());
        dto.setType(this.getType());
        dto.setCreatedDate(this.getCreatedDate());
        dto.setCreatedUserId(this.getCreatedUserId());
        dto.setUpdatedDate(this.getUpdatedDate());
        dto.setUpdatedUserId(this.getUpdatedUserId());
        dto.setPerformerGroupId(this.getPerformerGroupId());
        dto.setSupportDate(this.getSupportDate());
        dto.setDescription(this.getDescription());
        dto.setReglectContent(this.getReglectContent());
        return dto;
    }
}
