package com.viettel.aio.dto;

import com.viettel.aio.bo.AIORequestBHSCBO;
import com.viettel.coms.dto.ComsBaseFWDTO;
import com.viettel.coms.dto.UtilAttachDocumentDTO;
import com.viettel.erp.utils.JsonDateDeserializer;
import com.viettel.erp.utils.JsonDateSerializerDate;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import javax.xml.bind.annotation.XmlRootElement;
import java.util.Date;
import java.util.List;

//VietNT_20190913_create
@XmlRootElement(name = "AIO_REQUEST_BHSCBO")
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonSerialize(include=JsonSerialize.Inclusion.NON_NULL)
public class AIORequestBHSCDTO extends ComsBaseFWDTO<AIORequestBHSCBO> {

    private Long aioRequestBhscId;
    private Long customerId;
    private String customerCode;
    private String customerName;
    private String customerAddress;
    private String customerPhone;
    private String state;
    private Long warrantyForm;
    private Long status;
    private Long statusApproved;
    private Long performerId;
    private Long createdUser;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date createdDate;
    private Long updatedUser;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date updatedDate;
    private Long performerGroupId;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date startDate;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date endDate;
    private String descriptionStatus;

    // dto
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date fromDate;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date toDate;

    private String performerName;
    private String performerEmail;
    private String performerCode;
    private List<Long> performerGroupIds;
    private List<Long> requestBhscIds;
    private String startDateStr;
    private String endDateStr;
    private Long contractId;
    private Long serviceType;
    private List<AIORequestBHSCDTO> listRequest;
    private List<AIORequestBHSCDetailDTO> listRequestDetail;
    private List<UtilAttachDocumentDTO> listImage;
    private List<UtilAttachDocumentDTO> images;
    private List<AIORequestBHSCDetailDTO> goods;

    public Date getFromDate() {
        return fromDate;
    }

    public void setFromDate(Date fromDate) {
        this.fromDate = fromDate;
    }

    public Date getToDate() {
        return toDate;
    }

    public void setToDate(Date toDate) {
        this.toDate = toDate;
    }

    public String getPerformerName() {
        return performerName;
    }

    public void setPerformerName(String performerName) {
        this.performerName = performerName;
    }

    public String getPerformerEmail() {
        return performerEmail;
    }

    public void setPerformerEmail(String performerEmail) {
        this.performerEmail = performerEmail;
    }

    public String getPerformerCode() {
        return performerCode;
    }

    public void setPerformerCode(String performerCode) {
        this.performerCode = performerCode;
    }

    public List<Long> getPerformerGroupIds() {
        return performerGroupIds;
    }

    public void setPerformerGroupIds(List<Long> performerGroupIds) {
        this.performerGroupIds = performerGroupIds;
    }

    public List<Long> getRequestBhscIds() {
        return requestBhscIds;
    }

    public void setRequestBhscIds(List<Long> requestBhscIds) {
        this.requestBhscIds = requestBhscIds;
    }

    public String getStartDateStr() {
        return startDateStr;
    }

    public void setStartDateStr(String startDateStr) {
        this.startDateStr = startDateStr;
    }

    public String getEndDateStr() {
        return endDateStr;
    }

    public void setEndDateStr(String endDateStr) {
        this.endDateStr = endDateStr;
    }

    public Long getContractId() {
        return contractId;
    }

    public void setContractId(Long contractId) {
        this.contractId = contractId;
    }

    public List<UtilAttachDocumentDTO> getImages() {
        return images;
    }

    public void setImages(List<UtilAttachDocumentDTO> images) {
        this.images = images;
    }

    public List<AIORequestBHSCDetailDTO> getGoods() {
        return goods;
    }

    public void setGoods(List<AIORequestBHSCDetailDTO> goods) {
        this.goods = goods;
    }

    public List<UtilAttachDocumentDTO> getListImage() {
        return listImage;
    }

    public void setListImage(List<UtilAttachDocumentDTO> listImage) {
        this.listImage = listImage;
    }

    public List<AIORequestBHSCDTO> getListRequest() {
        return listRequest;
    }

    public void setListRequest(List<AIORequestBHSCDTO> listRequest) {
        this.listRequest = listRequest;
    }

    public List<AIORequestBHSCDetailDTO> getListRequestDetail() {
        return listRequestDetail;
    }

    public void setListRequestDetail(List<AIORequestBHSCDetailDTO> listRequestDetail) {
        this.listRequestDetail = listRequestDetail;
    }

    public Long getServiceType() {
        return serviceType;
    }

    public void setServiceType(Long serviceType) {
        this.serviceType = serviceType;
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

    public String getDescriptionStatus() {
        return descriptionStatus;
    }

    public void setDescriptionStatus(String descriptionStatus) {
        this.descriptionStatus = descriptionStatus;
    }

    @Override
    public AIORequestBHSCBO toModel() {
        AIORequestBHSCBO bo = new AIORequestBHSCBO();
        bo.setAioRequestBhscId(this.getAioRequestBhscId());
        bo.setCustomerId(this.getCustomerId());
        bo.setCustomerCode(this.getCustomerCode());
        bo.setCustomerName(this.getCustomerName());
        bo.setCustomerAddress(this.getCustomerAddress());
        bo.setCustomerPhone(this.getCustomerPhone());
        bo.setState(this.getState());
        bo.setWarrantyForm(this.getWarrantyForm());
        bo.setStatus(this.getStatus());
        bo.setStatusApproved(this.getStatusApproved());
        bo.setPerformerId(this.getPerformerId());
        bo.setCreatedUser(this.getCreatedUser());
        bo.setCreatedDate(this.getCreatedDate());
        bo.setUpdatedUser(this.getUpdatedUser());
        bo.setUpdatedDate(this.getUpdatedDate());
        bo.setPerformerGroupId(this.getPerformerGroupId());
        bo.setStartDate(this.getStartDate());
        bo.setEndDate(this.getEndDate());
        bo.setDescriptionStatus(this.getDescriptionStatus());
        return bo;
    }

    @Override
    public Long getFWModelId() {
        return aioRequestBhscId;
    }

    @Override
    public String catchName() {
        return aioRequestBhscId.toString();
    }
}
