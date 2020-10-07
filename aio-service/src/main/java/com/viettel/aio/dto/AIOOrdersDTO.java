package com.viettel.aio.dto;

import com.viettel.aio.bo.AIOOrdersBO;
import com.viettel.erp.utils.JsonDateDeserializer;
import com.viettel.erp.utils.JsonDateSerializerDate;
import com.viettel.wms.dto.wmsBaseDTO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import javax.xml.bind.annotation.XmlRootElement;
import java.util.Date;
import java.util.List;

/**
 * Hoangnh created 11042019
 **/
@XmlRootElement(name = "aioOrders")
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonSerialize(include = JsonSerialize.Inclusion.NON_NULL)
public class AIOOrdersDTO extends ComsBaseFWDTO<AIOOrdersBO> {

    public static final Long STATUS_NEW = 1L;
    public static final Long STATUS_OK = 2L;
    public static final Long STATUS_NOK = 3L;
    public static final Long STATUS_CONTRACT_CREATED = 4L;

    private Long aioOrdersId;
    private Long catProviceId;
    private String catProviceCode;
    private String catProviceName;
    private Long serviceId;
    private String serviceName;
    private String customerName;
    private String customerAddress;
    private String customerPhone;
    private Double quantityTemp;
    private String contentOrder;
    private String callDate;
    private String contactChannel;
    private Long status;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date approvedDate;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date createdContractDate;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date createdDate;
    private Long createdUser;
    private Long createdGroupId;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date updatedDate;
    private Long updatedUser;
    private Long updatedGroupId;
    private String reasonClose;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date dateClose;
    private String keySearch;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date startDate;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date endDate;
    private List<String> listStatus;
    private List<String> listStatusOrders;
    private String createdDateStr;
    private String approvedDateStr;
    private String createdContractDateStr;
    private String dateCloseStr;
    private String code;
    private String createdUserName;
    private String createdGroupName;
    private String updatedUserName;
    private String updatedGroupName;
    private List<Long> listId;
    private String pastDueApproved;
    private String pastDueContact;
    private String contractStatus;
    private String pastDue;
    private String lstStatus;
    private String callDateStr;
    private String email;
    private Long sysUserId;
    private String fullName;
    private String orderCodeVTP;
    private String orderCode;
    private Long ordersType;
    private Double quantity;
    private Long reasonId;
    private String reasonName;
    private String description;
    private Long performerId;
    private Long areaId;

    private String performerName;
    private String industryCode;
    private String industryName;

    public String getIndustryCode() {
        return industryCode;
    }

    public void setIndustryCode(String industryCode) {
        this.industryCode = industryCode;
    }

    public String getIndustryName() {
        return industryName;
    }

    public void setIndustryName(String industryName) {
        this.industryName = industryName;
    }

    //dto only
    private String endDateStr;
    private int flag;
    private Long serviceType;
    private Long areaProvinceId;
    private Long areaDistrictId;

    //------------ trungPT add 04/12/2019
    private String provinceCode;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date dateFrom;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date dateTo;
    private String sysGroupId;
    private String areaCode;
    private Double tong;
    private Double nok;
    private Double percent;
    private int isDetail;
    private Double slyc;
    private Double quahan;
    private Double tyleqh;
    //------------TrungPT end

    //------------tungmt92 start 12122019
    private int checkSysUser;
    private String contentSearch;
    private Integer obsoleteStatus;
    private Integer orderStatus;
    private Integer orderFrom;
    private  Long statusOrder;
    private  Long statusContract;
    private String statusObsoleteContract;


    public String getStatusObsoleteContract() {
        return statusObsoleteContract;
    }

    public void setStatusObsoleteContract(String statusObsoleteContract) {
        this.statusObsoleteContract = statusObsoleteContract;
    }

    public String getPerformerName() {
        return performerName;
    }

    public void setPerformerName(String performerName) {
        this.performerName = performerName;
    }

    public Long getStatusContract() {
        return statusContract;
    }

    public void setStatusContract(Long statusContract) {
        this.statusContract = statusContract;
    }

    public Long getStatusOrder() {
        return statusOrder;
    }

    public void setStatusOrder(Long statusOrder) {
        this.statusOrder = statusOrder;
    }

    //tungmt92 end

    public int getCheckSysUser() {
        return checkSysUser;
    }

    public void setCheckSysUser(int checkSysUser) {
        this.checkSysUser = checkSysUser;
    }

    public String getContentSearch() {
        return contentSearch;
    }

    public void setContentSearch(String contentSearch) {
        this.contentSearch = contentSearch;
    }


    public Integer getObsoleteStatus() {
        return obsoleteStatus;
    }

    public void setObsoleteStatus(Integer obsoleteStatus) {
        this.obsoleteStatus = obsoleteStatus;
    }

    public Integer getOrderStatus() {
        return orderStatus;
    }

    public void setOrderStatus(Integer orderStatus) {
        this.orderStatus = orderStatus;
    }

    public Integer getOrderFrom() {
        return orderFrom;
    }

    public void setOrderFrom(Integer orderFrom) {
        this.orderFrom = orderFrom;
    }
    //------------tungmt92 end

    public Double getSlyc() {
        return slyc;
    }

    public void setSlyc(Double slyc) {
        this.slyc = slyc;
    }

    public Double getQuahan() {
        return quahan;
    }

    public void setQuahan(Double quahan) {
        this.quahan = quahan;
    }

    public Double getTyleqh() {
        return tyleqh;
    }

    public void setTyleqh(Double tyleqh) {
        this.tyleqh = tyleqh;
    }

    public int getIsDetail() {
        return isDetail;
    }

    public void setIsDetail(int isDetail) {
        this.isDetail = isDetail;
    }

    public String getAreaCode() {
        return areaCode;
    }

    public void setAreaCode(String areaCode) {
        this.areaCode = areaCode;
    }

    public Double getTong() {
        return tong;
    }

    public void setTong(Double tong) {
        this.tong = tong;
    }

    public Double getNok() {
        return nok;
    }

    public void setNok(Double nok) {
        this.nok = nok;
    }

    public Double getPercent() {
        return percent;
    }

    public void setPercent(Double percent) {
        this.percent = percent;
    }

    public String getSysGroupId() {
        return sysGroupId;
    }

    public void setSysGroupId(String sysGroupId) {
        this.sysGroupId = sysGroupId;
    }

    public String getProvinceCode() {
        return provinceCode;
    }

    public void setProvinceCode(String provinceCode) {
        this.provinceCode = provinceCode;
    }

    public Date getDateFrom() {
        return dateFrom;
    }

    public void setDateFrom(Date dateFrom) {
        this.dateFrom = dateFrom;
    }

    public Date getDateTo() {
        return dateTo;
    }

    public void setDateTo(Date dateTo) {
        this.dateTo = dateTo;
    }

    public Long getAreaProvinceId() {
        return areaProvinceId;
    }

    public void setAreaProvinceId(Long areaProvinceId) {
        this.areaProvinceId = areaProvinceId;
    }

    public Long getAreaDistrictId() {
        return areaDistrictId;
    }

    public void setAreaDistrictId(Long areaDistrictId) {
        this.areaDistrictId = areaDistrictId;
    }

    public Long getServiceType() {
        return serviceType;
    }

    public void setServiceType(Long serviceType) {
        this.serviceType = serviceType;
    }

    public int getFlag() {
        return flag;
    }

    public void setFlag(int flag) {
        this.flag = flag;
    }

    public String getEndDateStr() {
        return endDateStr;
    }

    public void setEndDateStr(String endDateStr) {
        this.endDateStr = endDateStr;
    }

    public String getOrderCode() {
        return orderCode;
    }

    public void setOrderCode(String orderCode) {
        this.orderCode = orderCode;
    }

    public Long getOrdersType() {
        return ordersType;
    }

    public void setOrdersType(Long ordersType) {
        this.ordersType = ordersType;
    }

    public Double getQuantity() {
        return quantity;
    }

    public void setQuantity(Double quantity) {
        this.quantity = quantity;
    }

    public Long getReasonId() {
        return reasonId;
    }

    public void setReasonId(Long reasonId) {
        this.reasonId = reasonId;
    }

    public String getReasonName() {
        return reasonName;
    }

    public void setReasonName(String reasonName) {
        this.reasonName = reasonName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getPerformerId() {
        return performerId;
    }

    public void setPerformerId(Long performerId) {
        this.performerId = performerId;
    }

    public Long getAreaId() {
        return areaId;
    }

    public void setAreaId(Long areaId) {
        this.areaId = areaId;
    }

    public String getOrderCodeVTP() {
        return orderCodeVTP;
    }

    public void setOrderCodeVTP(String orderCodeVTP) {
        this.orderCodeVTP = orderCodeVTP;
    }

    public Long getSysUserId() {
        return sysUserId;
    }

    public void setSysUserId(Long sysUserId) {
        this.sysUserId = sysUserId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCallDateStr() {
        return callDateStr;
    }

    public void setCallDateStr(String callDateStr) {
        this.callDateStr = callDateStr;
    }

    public Date getDateClose() {
        return dateClose;
    }

    public void setDateClose(Date dateClose) {
        this.dateClose = dateClose;
    }

    public String getDateCloseStr() {
        return dateCloseStr;
    }

    public void setDateCloseStr(String dateCloseStr) {
        this.dateCloseStr = dateCloseStr;
    }

    public String getLstStatus() {
        return lstStatus;
    }

    public void setLstStatus(String lstStatus) {
        this.lstStatus = lstStatus;
    }

    public String getPastDue() {
        return pastDue;
    }

    public void setPastDue(String pastDue) {
        this.pastDue = pastDue;
    }

    public String getContractStatus() {
        return contractStatus;
    }

    public void setContractStatus(String contractStatus) {
        this.contractStatus = contractStatus;
    }

    public String getPastDueApproved() {
        return pastDueApproved;
    }

    public void setPastDueApproved(String pastDueApproved) {
        this.pastDueApproved = pastDueApproved;
    }

    public String getPastDueContact() {
        return pastDueContact;
    }

    public void setPastDueContact(String pastDueContact) {
        this.pastDueContact = pastDueContact;
    }

    public String getReasonClose() {
        return reasonClose;
    }

    public void setReasonClose(String reasonClose) {
        this.reasonClose = reasonClose;
    }

    public List<Long> getListId() {
        return listId;
    }

    public void setListId(List<Long> listId) {
        this.listId = listId;
    }

    public String getCreatedUserName() {
        return createdUserName;
    }

    public void setCreatedUserName(String createdUserName) {
        this.createdUserName = createdUserName;
    }

    public String getCreatedGroupName() {
        return createdGroupName;
    }

    public void setCreatedGroupName(String createdGroupName) {
        this.createdGroupName = createdGroupName;
    }

    public String getUpdatedUserName() {
        return updatedUserName;
    }

    public void setUpdatedUserName(String updatedUserName) {
        this.updatedUserName = updatedUserName;
    }

    public String getUpdatedGroupName() {
        return updatedGroupName;
    }

    public void setUpdatedGroupName(String updatedGroupName) {
        this.updatedGroupName = updatedGroupName;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getCreatedDateStr() {
        return createdDateStr;
    }

    public void setCreatedDateStr(String createdDateStr) {
        this.createdDateStr = createdDateStr;
    }

    public String getApprovedDateStr() {
        return approvedDateStr;
    }

    public void setApprovedDateStr(String approvedDateStr) {
        this.approvedDateStr = approvedDateStr;
    }

    public String getCreatedContractDateStr() {
        return createdContractDateStr;
    }

    public void setCreatedContractDateStr(String createdContractDateStr) {
        this.createdContractDateStr = createdContractDateStr;
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

    public List<String> getListStatus() {
        return listStatus;
    }

    public void setListStatus(List<String> listStatus) {
        this.listStatus = listStatus;
    }

    public List<String> getListStatusOrders() {
        return listStatusOrders;
    }

    public void setListStatusOrders(List<String> listStatusOrders) {
        this.listStatusOrders = listStatusOrders;
    }

    public String getKeySearch() {
        return keySearch;
    }

    public void setKeySearch(String keySearch) {
        this.keySearch = keySearch;
    }

    public Long getAioOrdersId() {
        return aioOrdersId;
    }

    public void setAioOrdersId(Long aioOrdersId) {
        this.aioOrdersId = aioOrdersId;
    }

    public Long getCatProviceId() {
        return catProviceId;
    }

    public void setCatProviceId(Long catProviceId) {
        this.catProviceId = catProviceId;
    }

    public String getCatProviceCode() {
        return catProviceCode;
    }

    public void setCatProviceCode(String catProviceCode) {
        this.catProviceCode = catProviceCode;
    }

    public String getCatProviceName() {
        return catProviceName;
    }

    public void setCatProviceName(String catProviceName) {
        this.catProviceName = catProviceName;
    }

    public Long getServiceId() {
        return serviceId;
    }

    public void setServiceId(Long serviceId) {
        this.serviceId = serviceId;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
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

    public Double getQuantityTemp() {
        return quantityTemp;
    }

    public void setQuantityTemp(Double quantityTemp) {
        this.quantityTemp = quantityTemp;
    }

    public String getContentOrder() {
        return contentOrder;
    }

    public void setContentOrder(String contentOrder) {
        this.contentOrder = contentOrder;
    }

    public String getCallDate() {
        return callDate;
    }

    public void setCallDate(String callDate) {
        this.callDate = callDate;
    }

    public String getContactChannel() {
        return contactChannel;
    }

    public void setContactChannel(String contactChannel) {
        this.contactChannel = contactChannel;
    }

    public Long getStatus() {
        return status;
    }

    public void setStatus(Long status) {
        this.status = status;
    }

    public Date getApprovedDate() {
        return approvedDate;
    }

    public void setApprovedDate(Date approvedDate) {
        this.approvedDate = approvedDate;
    }

    public Date getCreatedContractDate() {
        return createdContractDate;
    }

    public void setCreatedContractDate(Date createdContractDate) {
        this.createdContractDate = createdContractDate;
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

    @Override
    public AIOOrdersBO toModel() {
        AIOOrdersBO bo = new AIOOrdersBO();
        bo.setAioOrdersId(this.aioOrdersId);
        bo.setCatProviceId(this.catProviceId);
        bo.setCatProviceCode(this.catProviceCode);
        bo.setCatProviceName(this.catProviceName);
        bo.setServiceId(this.serviceId);
        bo.setServiceName(this.serviceName);
        bo.setCustomerName(this.customerName);
        bo.setCustomerAddress(this.customerAddress);
        bo.setCustomerPhone(this.customerPhone);
        bo.setQuantityTemp(this.quantityTemp);
        bo.setContentOrder(this.contentOrder);
        bo.setCallDate(this.callDate);
        bo.setContactChannel(this.contactChannel);
        bo.setStatus(this.status);
        bo.setApprovedDate(this.approvedDate);
        bo.setCreatedContractDate(this.createdContractDate);
        bo.setCreatedDate(this.createdDate);
        bo.setCreatedUser(this.createdUser);
        bo.setCreatedGroupId(this.createdGroupId);
        bo.setUpdatedDate(this.updatedDate);
        bo.setUpdatedUser(this.updatedUser);
        bo.setUpdatedGroupId(this.updatedGroupId);
        bo.setReasonClose(this.reasonClose);
        bo.setOrderCodeVTP(this.getOrderCodeVTP());
        bo.setOrderCode(this.getOrderCode());
        bo.setOrdersType(this.getOrdersType());
        bo.setQuantity(this.getQuantity());
        bo.setReasonId(this.getReasonId());
        bo.setReasonName(this.getReasonName());
        bo.setDescription(this.getDescription());
        bo.setPerformerId(this.getPerformerId());
        bo.setEndDate(this.getEndDate());
        bo.setAreaId(this.getAreaId());
        bo.setIndustryCode(this.getIndustryCode());
        bo.setIndustryName(this.getIndustryCode());
        return bo;
    }

    @Override
    public String catchName() {
        return null;
    }

    @Override
    public Long getFWModelId() {
        return null;
    }

}
