package com.viettel.aio.bo;

import com.viettel.aio.dto.AIOWoGoodsDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@SuppressWarnings("serial")
@Entity(name = "com.viettel.erp.bo.AIOWoGoodsBO")
@Table(name = "AIO_WO_GOODS")
public class AIOWoGoodsBO extends BaseFWModelImpl {
    @Id
//    @GeneratedValue(generator = "sequence")
//    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
//            @org.hibernate.annotations.Parameter(name = "sequence", value = "AIO_WO_GOODS_SEQ")})
    @Column(name = "WO_GOODS_ID", length = 22)
    private java.lang.Long woGoodsId;
    @Column(name = "CODE", length = 50)
    private java.lang.String code;
    @Column(name = "INDUSTRY_ID", length = 22)
    private java.lang.Long industryId;
    @Column(name = "INDUSTRY_CODE", length = 50)
    private java.lang.String industryCode;
    @Column(name = "CREATED_USER", length = 22)
    private java.lang.Long createdUser;
    @Column(name = "PERFORMER_ID", length = 22)
    private java.lang.Long performerId;
    @Column(name = "CUSTOMER_NAME", length = 200)
    private java.lang.String customerName;
    @Column(name = "CUSTOMER_ADDRESS", length = 500)
    private java.lang.String customerAddress;
    @Column(name = "CREATED_DATE", length = 7)
    private java.util.Date createdDate;
    @Column(name = "START_DATE", length = 7)
    private java.util.Date startDate;
    @Column(name = "END_DATE", length = 7)
    private java.util.Date endDate;
    @Column(name = "ACTUAL_END_DATE", length = 7)
    private java.util.Date actualEndDate;
    @Column(name = "STATUS", length = 22)
    private java.lang.Long status;
    @Column(name = "PERFORMER_GROUP_ID", length = 22)
    private java.lang.Long performerGroupId;
    @Column(name = "KPI", length = 22)
    private java.lang.Long kpi;
    @Column(name = "FORM_GUARANTEE_ID", length = 22)
    private java.lang.Long formGuaranteeId;
    @Column(name = "FORM_GUARANTEE_NAME", length = 200)
    private java.lang.String formGuaranteeName;
    @Column(name = "REASON", length = 2000)
    private java.lang.String reason;
    @Column(name = "PHONE_NUMBER")
    private java.lang.String phoneNumber;
    @Column(name = "INDUSTRY_NAME", length = 200)
    private java.lang.String industryName;
    @Column(name = "PERFORMER_GROUP_CODE", length = 200)
    private java.lang.String performerGroupCode;
    @Column(name = "CREATED_USER_NAME", length = 200)
    private java.lang.String createdUserName;

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getIndustryName() {
        return industryName;
    }

    public void setIndustryName(String industryName) {
        this.industryName = industryName;
    }

    public String getPerformerGroupCode() {
        return performerGroupCode;
    }

    public void setPerformerGroupCode(String performerGroupCode) {
        this.performerGroupCode = performerGroupCode;
    }

    public String getCreatedUserName() {
        return createdUserName;
    }

    public void setCreatedUserName(String createdUserName) {
        this.createdUserName = createdUserName;
    }

    public java.lang.Long getWoGoodsId() {
        return woGoodsId;
    }

    public void setWoGoodsId(java.lang.Long woGoodsId) {
        this.woGoodsId = woGoodsId;
    }

    public java.lang.String getCode() {
        return code;
    }

    public void setCode(java.lang.String code) {
        this.code = code;
    }

    public java.lang.Long getIndustryId() {
        return industryId;
    }

    public void setIndustryId(java.lang.Long industryId) {
        this.industryId = industryId;
    }

    public java.lang.String getIndustryCode() {
        return industryCode;
    }

    public void setIndustryCode(java.lang.String industryCode) {
        this.industryCode = industryCode;
    }

    public java.lang.Long getCreatedUser() {
        return createdUser;
    }

    public void setCreatedUser(java.lang.Long createdUser) {
        this.createdUser = createdUser;
    }

    public java.lang.Long getPerformerId() {
        return performerId;
    }

    public void setPerformerId(java.lang.Long performerId) {
        this.performerId = performerId;
    }

    public java.lang.String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(java.lang.String customerName) {
        this.customerName = customerName;
    }

    public java.lang.String getCustomerAddress() {
        return customerAddress;
    }

    public void setCustomerAddress(java.lang.String customerAddress) {
        this.customerAddress = customerAddress;
    }

    public java.util.Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(java.util.Date createdDate) {
        this.createdDate = createdDate;
    }

    public java.util.Date getStartDate() {
        return startDate;
    }

    public void setStartDate(java.util.Date startDate) {
        this.startDate = startDate;
    }

    public java.util.Date getEndDate() {
        return endDate;
    }

    public void setEndDate(java.util.Date endDate) {
        this.endDate = endDate;
    }

    public java.util.Date getActualEndDate() {
        return actualEndDate;
    }

    public void setActualEndDate(java.util.Date actualEndDate) {
        this.actualEndDate = actualEndDate;
    }

    public java.lang.Long getStatus() {
        return status;
    }

    public void setStatus(java.lang.Long status) {
        this.status = status;
    }

    public java.lang.Long getPerformerGroupId() {
        return performerGroupId;
    }

    public void setPerformerGroupId(java.lang.Long performerGroupId) {
        this.performerGroupId = performerGroupId;
    }

    public java.lang.Long getKpi() {
        return kpi;
    }

    public void setKpi(java.lang.Long kpi) {
        this.kpi = kpi;
    }

    public java.lang.Long getFormGuaranteeId() {
        return formGuaranteeId;
    }

    public void setFormGuaranteeId(java.lang.Long formGuaranteeId) {
        this.formGuaranteeId = formGuaranteeId;
    }

    public java.lang.String getFormGuaranteeName() {
        return formGuaranteeName;
    }

    public void setFormGuaranteeName(java.lang.String formGuaranteeName) {
        this.formGuaranteeName = formGuaranteeName;
    }

    public java.lang.String getReason() {
        return reason;
    }

    public void setReason(java.lang.String reason) {
        this.reason = reason;
    }

    @Override
    public AIOWoGoodsDTO toDTO() {
        AIOWoGoodsDTO aioWoGoodsDTO = new AIOWoGoodsDTO();
        aioWoGoodsDTO.setWoGoodsId(this.woGoodsId);
        aioWoGoodsDTO.setCode(this.code);
        aioWoGoodsDTO.setIndustryId(this.industryId);
        aioWoGoodsDTO.setIndustryCode(this.industryCode);
        aioWoGoodsDTO.setCreatedUser(this.createdUser);
        aioWoGoodsDTO.setPerformerId(this.performerId);
        aioWoGoodsDTO.setCustomerName(this.customerName);
        aioWoGoodsDTO.setCustomerAddress(this.customerAddress);
        aioWoGoodsDTO.setCreatedDate(this.createdDate);
        aioWoGoodsDTO.setStartDate(this.startDate);
        aioWoGoodsDTO.setEndDate(this.endDate);
        aioWoGoodsDTO.setActualEndDate(this.actualEndDate);
        aioWoGoodsDTO.setStatus(this.status);
        aioWoGoodsDTO.setPerformerGroupId(this.performerGroupId);
        aioWoGoodsDTO.setKpi(this.kpi);
        aioWoGoodsDTO.setFormGuaranteeId(this.formGuaranteeId);
        aioWoGoodsDTO.setFormGuaranteeName(this.formGuaranteeName);
        aioWoGoodsDTO.setReason(this.reason);
        aioWoGoodsDTO.setPhoneNumber(this.phoneNumber);
        aioWoGoodsDTO.setIndustryName(this.industryName);
        aioWoGoodsDTO.setPerformerGroupCode(this.performerGroupCode);
        aioWoGoodsDTO.setCreatedUserName(this.createdUserName);
        return aioWoGoodsDTO;
    }
}
