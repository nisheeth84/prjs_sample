package com.viettel.aio.bo;

import com.viettel.aio.dto.AIORequestBHSCDTO;
import com.viettel.service.base.dto.BaseFWDTOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.Date;

//VietNT_20190913_start
@Entity
@Table(name = "AIO_REQUEST_BHSC")
public class AIORequestBHSCBO extends BaseFWModelImpl {

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @org.hibernate.annotations.Parameter(name = "sequence", value = "AIO_REQUEST_BHSC_SEQ")})
    @Column(name = "AIO_REQUEST_BHSC_ID", length = 10)
    private Long aioRequestBhscId;
    @Column(name = "CUSTOMER_ID", length = 10)
    private Long customerId;
    @Column(name = "CUSTOMER_CODE", length = 50)
    private String customerCode;
    @Column(name = "CUSTOMER_NAME", length = 200)
    private String customerName;
    @Column(name = "CUSTOMER_ADDRESS", length = 500)
    private String customerAddress;
    @Column(name = "CUSTOMER_PHONE", length = 20)
    private String customerPhone;
    @Column(name = "STATE", length = 2000)
    private String state;
    @Column(name = "WARRANTY_FORM", length = 2)
    private Long warrantyForm;
    @Column(name = "STATUS", length = 2)
    private Long status;
    @Column(name = "STATUS_APPROVED", length = 2)
    private Long statusApproved;
    @Column(name = "PERFORMER_ID", length = 10)
    private Long performerId;
    @Column(name = "CREATED_USER", length = 10)
    private Long createdUser;
    @Column(name = "CREATED_DATE", length = 22)
    private Date createdDate;
    @Column(name = "UPDATED_USER", length = 10)
    private Long updatedUser;
    @Column(name = "UPDATED_DATE", length = 22)
    private Date updatedDate;
    @Column(name = "PERFORMER_GROUP_ID", length = 10)
    private Long performerGroupId;
    @Column(name = "START_DATE", length = 22)
    private Date startDate;
    @Column(name = "END_DATE", length = 22)
    private Date endDate;
    @Column(name = "DESCRIPTION_STATUS", length = 1000)
    private String descriptionStatus;

    public String getDescriptionStatus() {
        return descriptionStatus;
    }

    public void setDescriptionStatus(String descriptionStatus) {
        this.descriptionStatus = descriptionStatus;
    }

    public Long getAioRequestBhscId() {
        return aioRequestBhscId;
    }

    public void setAioRequestBhscId(Long aioRequestBhscId) {
        this.aioRequestBhscId = aioRequestBhscId;
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

    public String getCustomerAddress() {
        return customerAddress;
    }

    public void setCustomerAddress(String customerAddress) {
        this.customerAddress = customerAddress;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public Long getWarrantyForm() {
        return warrantyForm;
    }

    public void setWarrantyForm(Long warrantyForm) {
        this.warrantyForm = warrantyForm;
    }

    public Long getStatus() {
        return status;
    }

    public void setStatus(Long status) {
        this.status = status;
    }

    public Long getStatusApproved() {
        return statusApproved;
    }

    public void setStatusApproved(Long statusApproved) {
        this.statusApproved = statusApproved;
    }

    public Long getPerformerId() {
        return performerId;
    }

    public void setPerformerId(Long performerId) {
        this.performerId = performerId;
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

    public Long getUpdatedUser() {
        return updatedUser;
    }

    public void setUpdatedUser(Long updatedUser) {
        this.updatedUser = updatedUser;
    }

    public Date getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(Date updatedDate) {
        this.updatedDate = updatedDate;
    }

    public Long getPerformerGroupId() {
        return performerGroupId;
    }

    public void setPerformerGroupId(Long performerGroupId) {
        this.performerGroupId = performerGroupId;
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

    @Override
    public BaseFWDTOImpl toDTO() {
        AIORequestBHSCDTO dto = new AIORequestBHSCDTO();
        dto.setAioRequestBhscId(this.getAioRequestBhscId());
        dto.setCustomerId(this.getCustomerId());
        dto.setCustomerCode(this.getCustomerCode());
        dto.setCustomerName(this.getCustomerName());
        dto.setCustomerAddress(this.getCustomerAddress());
        dto.setCustomerPhone(this.getCustomerPhone());
        dto.setState(this.getState());
        dto.setWarrantyForm(this.getWarrantyForm());
        dto.setStatus(this.getStatus());
        dto.setStatusApproved(this.getStatusApproved());
        dto.setPerformerId(this.getPerformerId());
        dto.setCreatedUser(this.getCreatedUser());
        dto.setCreatedDate(this.getCreatedDate());
        dto.setUpdatedUser(this.getUpdatedUser());
        dto.setUpdatedDate(this.getUpdatedDate());
        dto.setPerformerGroupId(this.getPerformerGroupId());
        dto.setStartDate(this.getStartDate());
        dto.setEndDate(this.getEndDate());
        dto.setDescriptionStatus(this.getDescriptionStatus());
        return dto;
    }
}
