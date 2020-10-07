package com.viettel.aio.bo;

import com.viettel.aio.dto.AIOContractDTO;
import com.viettel.service.base.dto.BaseFWDTOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.Date;

//VietNT_20190313_start
@Entity
@Table(name = "AIO_CONTRACT")
public class AIOContractBO extends BaseFWModelImpl {

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @org.hibernate.annotations.Parameter(name = "sequence", value = "AIO_CONTRACT_SEQ")})
    @Column(name = "CONTRACT_ID", length = 10)
    private Long contractId;
    @Column(name = "CONTRACT_CODE", length = 50)
    private String contractCode;
    @Column(name = "CONTRACT_CONTENT", length = 50)
    private String contractContent;
    @Column(name = "SERVICE_POINT_ID", length = 10)
    private Long servicePointId;
    @Column(name = "SIGN_DATE", length = 22)
    private Date signDate;
    @Column(name = "SIGN_PLACE", length = 20)
    private String signPlace;
    @Column(name = "CUSTOMER_ID", length = 10)
    private Long customerId;
    @Column(name = "CUSTOMER_CODE", length = 50)
    private String customerCode;
    @Column(name = "CUSTOMER_NAME", length = 20)
    private String customerName;
    @Column(name = "CUSTOMER_PHONE", length = 30)
    private String customerPhone;
    @Column(name = "CUSTOMER_ADDRESS", length = 50)
    private String customerAddress;
    @Column(name = "CUSTOMER_TAX_CODE", length = 30)
    private String customerTaxCode;
    @Column(name = "PERFORMER_ID", length = 10)
    private Long performerId;
    @Column(name = "STATUS", length = 1)
    private Long status;
    @Column(name = "TYPE", length = 1)
    private Long type;
    @Column(name = "SPECIES_ID", length = 10)
    private Long speciesId;
    @Column(name = "SPECIES_NAME", length = 50)
    private String speciesName;
    @Column(name = "AMOUNT_ELECTRIC", length = 15)
    private Double amountElectric;
    @Column(name = "DESCRIPTION", length = 50)
    private String description;
    @Column(name = "CREATED_DATE", length = 22)
    private Date createdDate;
    @Column(name = "CREATED_USER", length = 10)
    private Long createdUser;
    @Column(name = "CREATED_GROUP_ID", length = 10)
    private Long createdGroupId;
    @Column(name = "UPDATED_DATE", length = 22)
    private Date updatedDate;
    @Column(name = "UPDATED_USER", length = 10)
    private Long updatedUser;
    @Column(name = "UPDATED_GROUP_ID", length = 10)
    private Long updatedGroupId;
    @Column(name = "AREA_ID", length = 10)
    private Long areaId;
    @Column(name = "AREA_NAME", length = 50)
    private String areaName;
    @Column(name = "CAT_PROVINCE_ID", length = 10)
    private Long catProvinceId;
    @Column(name = "CAT_PROVINCE_CODE", length = 50)
    private String catProvinceCode;
    @Column(name = "IS_MONEY", length = 1)
    private Long isMoney;
    @Column(name = "CONTRACT_AMOUNT", length = 15)
    private Double contractAmount;
    @Column(name = "SELLER_ID", length = 10)
    private Long sellerId;
    @Column(name = "SELLER_NAME", length = 200)
    private String sellerName;
    @Column(name = "SELLER_CODE", length = 50)
    private String sellerCode;
    @Column(name = "PERFORMER_NAME", length = 200)
    private String performerName;
    @Column(name = "PERFORMER_CODE", length = 50)
    private String performerCode;
    @Column(name = "SERVICE_CODE", length = 20)
    private String serviceCode;
    @Column(name = "INDUSTRY_CODE", length = 20)
    private String industryCode;
    //HuyPq-20190425
    @Column(name = "PERFORMER_GROUP_ID")
    private Long performerGroupId;
 	@Column(name = "IS_INVOICE", length = 1)
    private Long isInvoice;
 	//VietNT_24/06/2019_start
    @Column(name = "IS_PAY", length = 1)
    private Long isPay;
    @Column(name = "AMOUNT_PAY", length = 20)
    private Double amountPay;
    @Column(name = "PAY_DATE", length = 20)
    private Date payDate;
 	//VietNT_end
    //VietNT_10/07/2019_start
    @Column(name = "SALES_TOGETHER", length = 2000)
    private String salesTogether;
    //VietNT_end
    //VietNT_23/07/2019_start
    @Column(name = "PAY_TYPE", length = 2)
    private Long payType;
    @Column(name = "NUMBER_PAY", length = 10)
    private Long numberPay;
    @Column(name = "APPROVED_PAY", length = 2)
    private Long approvedPay;
    @Column(name = "APPROVED_DATE", length = 22)
    private Date approvedDate;
    @Column(name = "APPROVED_DESCRIPTION", length = 2000)
    private String approvedDescription;
    //VietNT_end
    //VietNT_24/07/2019_start
    @Column(name = "THU_HO", length = 30)
    private Double thuHo;
    //VietNT_end
    @Column(name = "REASON_OUTOFDATE", length = 500)
    private String reasonOutOfDate;
    @Column(name = "IS_INTERNAL", length = 1)
    private Long isInternal;
    @Column(name = "STAFF_CODE", length = 100)
    private String staffCode;

    //Huy-end
	@Override
    public BaseFWDTOImpl toDTO() {
        AIOContractDTO dto = new AIOContractDTO();
        dto.setContractId(this.getContractId());
        dto.setContractCode(this.getContractCode());
        dto.setContractContent(this.getContractContent());
        dto.setServicePointId(this.getServicePointId());
        dto.setSignDate(this.getSignDate());
        dto.setSignPlace(this.getSignPlace());
        dto.setCustomerId(this.getCustomerId());
        dto.setCustomerCode(this.getCustomerCode());
        dto.setCustomerName(this.getCustomerName());
        dto.setCustomerPhone(this.getCustomerPhone());
        dto.setCustomerAddress(this.getCustomerAddress());
        dto.setCustomerTaxCode(this.getCustomerTaxCode());
        dto.setPerformerId(this.getPerformerId());
        dto.setStatus(this.getStatus());
        dto.setType(this.getType());
        dto.setSpeciesId(this.getSpeciesId());
        dto.setSpeciesName(this.getSpeciesName());
        dto.setAmountElectric(this.getAmountElectric());
        dto.setDescription(this.getDescription());
        dto.setCreatedDate(this.getCreatedDate());
        dto.setCreatedUser(this.getCreatedUser());
        dto.setCreatedGroupId(this.getCreatedGroupId());
        dto.setUpdatedDate(this.getUpdatedDate());
        dto.setUpdatedUser(this.getUpdatedUser());
        dto.setUpdatedGroupId(this.getUpdatedGroupId());
        dto.setAreaId(this.getAreaId());
        dto.setAreaName(this.getAreaName());
        dto.setCatProvinceId(this.getCatProvinceId());
        dto.setCatProvinceCode(this.getCatProvinceCode());
        dto.setIsMoney(this.getIsMoney());
        dto.setContractAmount(this.getContractAmount());
        dto.setSellerId(this.getSellerId());
        dto.setSellerName(this.getSellerName());
        dto.setSellerCode(this.getSellerCode());
        dto.setPerformerName(this.getPerformerName());
        dto.setPerformerCode(this.getPerformerCode());
        dto.setServiceCode(this.getServiceCode());
        dto.setIndustryCode(this.getIndustryCode());
        dto.setPerformerGroupId(this.getPerformerGroupId());
        dto.setIsInvoice(this.getIsInvoice());
        dto.setIsPay(this.getIsPay());
        dto.setAmountPay(this.getAmountPay());
        dto.setPayDate(this.getPayDate());
        dto.setSalesTogether(this.getSalesTogether());
        dto.setPayType(this.getPayType());
        dto.setNumberPay(this.getNumberPay());
        dto.setApprovedPay(this.getApprovedPay());
        dto.setApprovedDate(this.getApprovedDate());
        dto.setApprovedDescription(this.getApprovedDescription());
        dto.setThuHo(this.getThuHo());
        dto.setReasonOutOfDate(this.getReasonOutOfDate());
        dto.setIsInternal(this.getIsInternal());
        dto.setStaffCode(this.getStaffCode());
        return dto;
    }

    public String getStaffCode() {
        return staffCode;
    }

    public void setStaffCode(String staffCode) {
        this.staffCode = staffCode;
    }

    public String getServiceCode() {
        return serviceCode;
    }

    public void setServiceCode(String serviceCode) {
        this.serviceCode = serviceCode;
    }

    public String getSellerCode() {
        return sellerCode;
    }

    public void setSellerCode(String sellerCode) {
        this.sellerCode = sellerCode;
    }

    public String getPerformerName() {
        return performerName;
    }

    public void setPerformerName(String performerName) {
        this.performerName = performerName;
    }

    public String getPerformerCode() {
        return performerCode;
    }

    public void setPerformerCode(String performerCode) {
        this.performerCode = performerCode;
    }

    public Long getSellerId() {
        return sellerId;
    }

    public void setSellerId(Long sellerId) {
        this.sellerId = sellerId;
    }

    public String getSellerName() {
        return sellerName;
    }

    public void setSellerName(String sellerName) {
        this.sellerName = sellerName;
    }

    public Double getContractAmount() {
        return contractAmount;
    }

    public void setContractAmount(Double contractAmount) {
        this.contractAmount = contractAmount;
    }

    public String getCustomerTaxCode() {
        return customerTaxCode;
    }

    public void setCustomerTaxCode(String customerTaxCode) {
        this.customerTaxCode = customerTaxCode;
    }

    public Long getContractId() {
        return contractId;
    }

    public void setContractId(Long contractId) {
        this.contractId = contractId;
    }

    public String getContractCode() {
        return contractCode;
    }

    public void setContractCode(String contractCode) {
        this.contractCode = contractCode;
    }

    public String getContractContent() {
        return contractContent;
    }

    public void setContractContent(String contractContent) {
        this.contractContent = contractContent;
    }

    public Long getServicePointId() {
        return servicePointId;
    }

    public void setServicePointId(Long servicePointId) {
        this.servicePointId = servicePointId;
    }

    public Date getSignDate() {
        return signDate;
    }

    public void setSignDate(Date signDate) {
        this.signDate = signDate;
    }

    public String getSignPlace() {
        return signPlace;
    }

    public void setSignPlace(String signPlace) {
        this.signPlace = signPlace;
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

    public Long getPerformerId() {
        return performerId;
    }

    public void setPerformerId(Long performerId) {
        this.performerId = performerId;
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

    public Long getSpeciesId() {
        return speciesId;
    }

    public void setSpeciesId(Long speciesId) {
        this.speciesId = speciesId;
    }

    public String getSpeciesName() {
        return speciesName;
    }

    public void setSpeciesName(String speciesName) {
        this.speciesName = speciesName;
    }

    public Double getAmountElectric() {
        return amountElectric;
    }

    public void setAmountElectric(Double amountElectric) {
        this.amountElectric = amountElectric;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    public Long getCreatedUser() {
        return createdUser;
    }

    public void setCreatedUser(Long createdUser) {
        this.createdUser = createdUser;
    }

    public Long getCreatedGroupId() {
        return createdGroupId;
    }

    public void setCreatedGroupId(Long createdGroupId) {
        this.createdGroupId = createdGroupId;
    }

    public Date getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(Date updatedDate) {
        this.updatedDate = updatedDate;
    }

    public Long getUpdatedUser() {
        return updatedUser;
    }

    public void setUpdatedUser(Long updatedUser) {
        this.updatedUser = updatedUser;
    }

    public Long getUpdatedGroupId() {
        return updatedGroupId;
    }

    public void setUpdatedGroupId(Long updatedGroupId) {
        this.updatedGroupId = updatedGroupId;
    }

    public Long getAreaId() {
        return areaId;
    }

    public void setAreaId(Long areaId) {
        this.areaId = areaId;
    }

    public String getAreaName() {
        return areaName;
    }

    public void setAreaName(String areaName) {
        this.areaName = areaName;
    }

    public Long getCatProvinceId() {
        return catProvinceId;
    }

    public void setCatProvinceId(Long catProvinceId) {
        this.catProvinceId = catProvinceId;
    }

    public String getCatProvinceCode() {
        return catProvinceCode;
    }

    public void setCatProvinceCode(String catProvinceCode) {
        this.catProvinceCode = catProvinceCode;
    }

    public Long getIsMoney() {
        return isMoney;
    }

    public void setIsMoney(Long isMoney) {
        this.isMoney = isMoney;
    }

    public Long getIsInvoice() {
        return isInvoice;
    }

    public void setIsInvoice(Long isInvoice) {
        this.isInvoice = isInvoice;
    }

    public Long getIsPay() {
        return isPay;
    }

    public void setIsPay(Long isPay) {
        this.isPay = isPay;
    }

    public Double getAmountPay() {
        return amountPay;
    }

    public void setAmountPay(Double amountPay) {
        this.amountPay = amountPay;
    }

    public Date getPayDate() {
        return payDate;
    }

    public void setPayDate(Date payDate) {
        this.payDate = payDate;
    }

    public String getSalesTogether() {
        return salesTogether;
    }

    public void setSalesTogether(String salesTogether) {
        this.salesTogether = salesTogether;
    }

    public Long getPayType() {
        return payType;
    }

    public void setPayType(Long payType) {
        this.payType = payType;
    }

    public Long getNumberPay() {
        return numberPay;
    }

    public void setNumberPay(Long numberPay) {
        this.numberPay = numberPay;
    }

    public Long getApprovedPay() {
        return approvedPay;
    }

    public void setApprovedPay(Long approvedPay) {
        this.approvedPay = approvedPay;
    }

    public Date getApprovedDate() {
        return approvedDate;
    }

    public void setApprovedDate(Date approvedDate) {
        this.approvedDate = approvedDate;
    }

    public String getApprovedDescription() {
        return approvedDescription;
    }

    public void setApprovedDescription(String approvedDescription) {
        this.approvedDescription = approvedDescription;
    }

    public Double getThuHo() {
        return thuHo;
    }

    public void setThuHo(Double thuHo) {
        this.thuHo = thuHo;
    }

    public Long getIsInternal() {
        return isInternal;
    }

    public void setIsInternal(Long isInternal) {
        this.isInternal = isInternal;
    }

    public Long getPerformerGroupId() {
        return performerGroupId;
    }

    public void setPerformerGroupId(Long performerGroupId) {
        this.performerGroupId = performerGroupId;
    }

    public String getReasonOutOfDate() {
        return reasonOutOfDate;
    }

    public void setReasonOutOfDate(String reasonOutOfDate) {
        this.reasonOutOfDate = reasonOutOfDate;
    }

    public String getIndustryCode() {
        return industryCode;
    }

    public void setIndustryCode(String industryCode) {
        this.industryCode = industryCode;
    }
}
