package com.viettel.aio.dto;

import com.viettel.aio.bo.AIOReglectBO;
import com.viettel.coms.dto.ComsBaseFWDTO;
import com.viettel.erp.utils.JsonDateDeserializer;
import com.viettel.erp.utils.JsonDateSerializerDate;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import javax.xml.bind.annotation.XmlRootElement;
import java.util.Date;
import java.util.List;

@XmlRootElement(name = "AIO_REFLECT_BO")
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonSerialize(include=JsonSerialize.Inclusion.NON_NULL)
public class AIOReglectDTO extends ComsBaseFWDTO<AIOReglectBO> {

    private Long aioReglectId;
    private Long customerId;
    private String customerCode;
    private String customerName;
    private String customerPhone;
    private String customerAddress;
    private Long status;
    private Long type;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date createdDate;
    private Long createdUserId;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date supportDate;
    private String reglectContent;
    private String description;
    private Long performerGroupId;
    private Date updatedDate;
    private Long updatedUserId;
    private String performerName;

    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date sysDateNow;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date startDate;

    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date endDate;

    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date endDateDetail;

    private String checkExpiry;
    private Long aioAreaId;
    private Long serviceType;
    private String createdDateStr;
    private String supportDateStr;
//dto only
    private List<AIOReglectDetailDTO> reglectDetailDTOS;
    private AIOReglectDetailDTO detailDTO;
    private List<String> reasons;
    private AIOCustomerDTO customer;
    private int isNewCustomer;

    public int getIsNewCustomer() {
        return isNewCustomer;
    }

    public void setIsNewCustomer(int isNewCustomer) {
        this.isNewCustomer = isNewCustomer;
    }

    public AIOCustomerDTO getCustomer() {
        return customer;
    }

    public void setCustomer(AIOCustomerDTO customer) {
        this.customer = customer;
    }

    public List<String> getReasons() {
        return reasons;
    }

    public void setReasons(List<String> reasons) {
        this.reasons = reasons;
    }

    public AIOReglectDetailDTO getDetailDTO() {
        return detailDTO;
    }

    public void setDetailDTO(AIOReglectDetailDTO detailDTO) {
        this.detailDTO = detailDTO;
    }

    public List<AIOReglectDetailDTO> getReglectDetailDTOS() {
        return reglectDetailDTOS;
    }

    public void setReglectDetailDTOS(List<AIOReglectDetailDTO> reglectDetailDTOS) {
        this.reglectDetailDTOS = reglectDetailDTOS;
    }

    public String getSupportDateStr() {
        return supportDateStr;
    }

    public void setSupportDateStr(String supportDateStr) {
        this.supportDateStr = supportDateStr;
    }

    public String getCreatedDateStr() {
        return createdDateStr;
    }

    public void setCreatedDateStr(String createdDateStr) {
        this.createdDateStr = createdDateStr;
    }

    public Long getServiceType() {
        return serviceType;
    }

    public void setServiceType(Long serviceType) {
        this.serviceType = serviceType;
    }

    public Long getAioAreaId() {
        return aioAreaId;
    }

    public void setAioAreaId(Long aioAreaId) {
        this.aioAreaId = aioAreaId;
    }

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

    public void setCreatedUserId(Long createdUserId) {
        this.createdUserId = createdUserId;
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

    public void setUpdatedUserId(Long updatedUserId) {
        this.updatedUserId = updatedUserId;
    }

    public Date getSysDate() {
        return sysDateNow;
    }

    public void setSysDate(Date sysDateNow) {
        this.sysDateNow = sysDateNow;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public String getCheckExpiry() {
        return checkExpiry;
    }

    public void setCheckExpiry(String checkExpiry) {
        this.checkExpiry = checkExpiry;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDateDetail() {
        return endDateDetail;
    }

    public void setEndDateDetail(Date endDateDetail) {
        this.endDateDetail = endDateDetail;
    }

    public String getPerformerName() {
        return performerName;
    }

    public void setPerformerName(String performerName) {
        this.performerName = performerName;
    }

    @Override
    public AIOReglectBO toModel() {
        AIOReglectBO bo = new AIOReglectBO();
        bo.setAioReglectId(this.getAioReglectId());
        bo.setCustomerId(this.getCustomerId());
        bo.setCustomerName(this.getCustomerName());
        bo.setCustomerCode(this.getCustomerCode());
        bo.setCustomerAddress(this.getCustomerAddress());
        bo.setCustomerPhone(this.getCustomerPhone());
        bo.setStatus(this.getStatus());
        bo.setType(this.getType());
        bo.setCreatedDate(this.getCreatedDate());
        bo.setCreatedUserId(this.getCreatedUserId());
        bo.setUpdatedDate(this.getUpdatedDate());
        bo.setUpdatedUserId(this.getUpdatedUserId());
        bo.setPerformerGroupId(this.getPerformerGroupId());
        bo.setSupportDate(this.getSupportDate());
        bo.setDescription(this.getDescription());
        bo.setReglectContent(this.getReglectContent());
        return bo;
    }

    @Override
    public Long getFWModelId() {
        return aioReglectId;
    }

    @Override
    public String catchName() {
        return aioReglectId.toString();
    }

}
