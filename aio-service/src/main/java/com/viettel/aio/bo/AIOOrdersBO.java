package com.viettel.aio.bo;

import com.viettel.aio.dto.AIOOrdersDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.Date;

/** Hoangnh created 11042019 **/
@Entity
@Table(name = "AIO_ORDERS")
@JsonIgnoreProperties(ignoreUnknown = true)
public class AIOOrdersBO extends BaseFWModelImpl {
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
	private Date approvedDate;
	private Date createdContractDate;
	private Date createdDate;
	private Long createdUser;
	private Long createdGroupId;
	private Date updatedDate;
	private Long updatedUser;
	private Long updatedGroupId;
	private String reasonClose;
	private String orderCodeVTP;
	private String orderCode;
	private Long ordersType;
	private Double quantity;
	private Long reasonId;
	private String reasonName;
	private String description;
	private Long performerId;
	private Date endDate;
	private Long areaId;
	private String industryCode;
	private String industryName;

	@Id
	@GeneratedValue(generator = "sequence")
	@GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
	@Parameter(name = "sequence", value = "AIO_ORDERS_SEQ") })
	@Column(name = "AIO_ORDERS_ID", unique = true, nullable = false, precision = 10, scale = 0)
	public Long getAioOrdersId() {
		return aioOrdersId;
	}

	public void setAioOrdersId(Long aioOrdersId) {
		this.aioOrdersId = aioOrdersId;
	}

	@Column(name = "CAT_PROVINCE_ID", length = 10)
	public Long getCatProviceId() {
		return catProviceId;
	}

	public void setCatProviceId(Long catProviceId) {
		this.catProviceId = catProviceId;
	}

	@Column(name = "CAT_PROVINCE_CODE", length = 100)
	public String getCatProviceCode() {
		return catProviceCode;
	}

	public void setCatProviceCode(String catProviceCode) {
		this.catProviceCode = catProviceCode;
	}

	@Column(name = "CAT_PROVINCE_NAME", length = 200)
	public String getCatProviceName() {
		return catProviceName;
	}

	public void setCatProviceName(String catProviceName) {
		this.catProviceName = catProviceName;
	}

	@Column(name = "SERVICE_ID", length = 10)
	public Long getServiceId() {
		return serviceId;
	}

	public void setServiceId(Long serviceId) {
		this.serviceId = serviceId;
	}

	@Column(name = "SERVICE_NAME", length = 200)
	public String getServiceName() {
		return serviceName;
	}

	public void setServiceName(String serviceName) {
		this.serviceName = serviceName;
	}

	@Column(name = "CUSTOMER_NAME", length = 200)
	public String getCustomerName() {
		return customerName;
	}

	public void setCustomerName(String customerName) {
		this.customerName = customerName;
	}

	@Column(name = "CUSTOMER_ADDRESS", length = 200)
	public String getCustomerAddress() {
		return customerAddress;
	}

	public void setCustomerAddress(String customerAddress) {
		this.customerAddress = customerAddress;
	}

	@Column(name = "CUSTOMER_PHONE", length = 50)
	public String getCustomerPhone() {
		return customerPhone;
	}

	public void setCustomerPhone(String customerPhone) {
		this.customerPhone = customerPhone;
	}

	@Column(name = "QUANTITY_TEMP", length = 10)
	public Double getQuantityTemp() {
		return quantityTemp;
	}

	public void setQuantityTemp(Double quantityTemp) {
		this.quantityTemp = quantityTemp;
	}

	@Column(name = "CONTENT_ORDER", length = 200)
	public String getContentOrder() {
		return contentOrder;
	}

	public void setContentOrder(String contentOrder) {
		this.contentOrder = contentOrder;
	}

	@Column(name = "CALL_DATE")
	public String getCallDate() {
		return callDate;
	}

	public void setCallDate(String callDate) {
		this.callDate = callDate;
	}	
	

	@Column(name = "CONTACT_CHANNEL", length = 200)
	public String getContactChannel() {
		return contactChannel;
	}

	public void setContactChannel(String contactChannel) {
		this.contactChannel = contactChannel;
	}

	@Column(name = "STATUS", length = 2)
	public Long getStatus() {
		return status;
	}

	public void setStatus(Long status) {
		this.status = status;
	}

	@Column(name = "APPROVED_DATE")
	public Date getApprovedDate() {
		return approvedDate;
	}

	public void setApprovedDate(Date approvedDate) {
		this.approvedDate = approvedDate;
	}

	@Column(name = "CREATED_CONTRACT_DATE")
	public Date getCreatedContractDate() {
		return createdContractDate;
	}

	public void setCreatedContractDate(Date createdContractDate) {
		this.createdContractDate = createdContractDate;
	}

	@Column(name = "CREATED_DATE")
	public Date getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(Date createdDate) {
		this.createdDate = createdDate;
	}

	@Column(name = "CREATED_USER", length = 10)
	public Long getCreatedUser() {
		return createdUser;
	}

	public void setCreatedUser(Long createdUser) {
		this.createdUser = createdUser;
	}

	@Column(name = "CREATED_GROUP_ID", length = 10)
	public Long getCreatedGroupId() {
		return createdGroupId;
	}

	public void setCreatedGroupId(Long createdGroupId) {
		this.createdGroupId = createdGroupId;
	}

	@Column(name = "UPDATED_DATE" )
	public Date getUpdatedDate() {
		return updatedDate;
	}

	public void setUpdatedDate(Date updatedDate) {
		this.updatedDate = updatedDate;
	}

	@Column(name = "UPDATED_USER", length = 10)
	public Long getUpdatedUser() {
		return updatedUser;
	}

	public void setUpdatedUser(Long updatedUser) {
		this.updatedUser = updatedUser;
	}

	@Column(name = "UPDATED_GROUP_ID", length = 10)
	public Long getUpdatedGroupId() {
		return updatedGroupId;
	}

	public void setUpdatedGroupId(Long updatedGroupId) {
		this.updatedGroupId = updatedGroupId;
	}
	
	@Column(name = "REASON_CLOSE", length = 200)
	public String getReasonClose() {
		return reasonClose;
	}

	public void setReasonClose(String reasonClose) {
		this.reasonClose = reasonClose;
	}

	@Column(name = "ORDER_CODE_VTP", length = 200)
	public String getOrderCodeVTP() {
		return orderCodeVTP;
	}

	public void setOrderCodeVTP(String orderCodeVTP) {
		this.orderCodeVTP = orderCodeVTP;
	}


	@Column(name = "ORDER_CODE", length = 200)
	public String getOrderCode() {
		return orderCode;
	}

	public void setOrderCode(String orderCode) {
		this.orderCode = orderCode;
	}

	@Column(name = "ORDERS_TYPE", length = 2)
	public Long getOrdersType() {
		return ordersType;
	}

	public void setOrdersType(Long ordersType) {
		this.ordersType = ordersType;
	}

	@Column(name = "QUANTITY", length = 30)
	public Double getQuantity() {
		return quantity;
	}

	public void setQuantity(Double quantity) {
		this.quantity = quantity;
	}

	@Column(name = "REASON_ID", length = 10)
	public Long getReasonId() {
		return reasonId;
	}

	public void setReasonId(Long reasonId) {
		this.reasonId = reasonId;
	}

	@Column(name = "REASON_NAME", length = 2000)
	public String getReasonName() {
		return reasonName;
	}

	public void setReasonName(String reasonName) {
		this.reasonName = reasonName;
	}

	@Column(name = "DESCRIPTION", length = 1000)
	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	@Column(name = "PERFORMER_ID", length = 10)
	public Long getPerformerId() {
		return performerId;
	}

	public void setPerformerId(Long performerId) {
		this.performerId = performerId;
	}

	@Column(name = "END_DATE", length = 22)
	public Date getEndDate() {
		return endDate;
	}

	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}

	@Column(name = "AREA_ID", length = 10)
	public Long getAreaId() {
		return areaId;
	}

	public void setAreaId(Long areaId) {
		this.areaId = areaId;
	}

	@Column(name = "INDUSTRY_CODE", length = 10)
	public String getIndustryCode() {
		return industryCode;
	}

	public void setIndustryCode(String industryCode) {
		this.industryCode = industryCode;
	}

	@Column(name = "INDUSTRY_NAME", length = 10)
	public String getIndustryName() {
		return industryName;
	}

	public void setIndustryName(String industryName) {
		this.industryName = industryName;
	}

	@Override
	public AIOOrdersDTO toDTO() {
		AIOOrdersDTO dto = new AIOOrdersDTO();
		dto.setAioOrdersId(this.aioOrdersId);
		dto.setCatProviceId(this.catProviceId);
		dto.setCatProviceCode(this.catProviceCode);
		dto.setCatProviceName(this.catProviceName);
		dto.setServiceId(this.serviceId);
		dto.setServiceName(this.serviceName);
		dto.setCustomerName(this.customerName);
		dto.setCustomerAddress(this.customerAddress);
		dto.setCustomerPhone(this.customerPhone);
		dto.setQuantityTemp(this.quantityTemp);
		dto.setContentOrder(this.contentOrder);
		dto.setCallDate(this.callDate);
		dto.setContactChannel(this.contactChannel);
		dto.setStatus(this.status);
		dto.setApprovedDate(this.approvedDate);
		dto.setCreatedContractDate(this.createdContractDate);
		dto.setCreatedDate(this.createdDate);
		dto.setCreatedUser(this.createdUser);
		dto.setCreatedGroupId(this.createdGroupId);
		dto.setUpdatedDate(this.updatedDate);
		dto.setUpdatedUser(this.updatedUser);
		dto.setUpdatedGroupId(this.updatedGroupId);
		dto.setReasonClose(this.reasonClose);
		dto.setOrderCodeVTP(this.getOrderCodeVTP());
		dto.setOrderCode(this.getOrderCode());
		dto.setOrdersType(this.getOrdersType());
		dto.setQuantity(this.getQuantity());
		dto.setReasonId(this.getReasonId());
		dto.setReasonName(this.getReasonName());
		dto.setDescription(this.getDescription());
		dto.setPerformerId(this.getPerformerId());
		dto.setEndDate(this.getEndDate());
		dto.setAreaId(this.getAreaId());
		dto.setIndustryCode(this.getIndustryCode());
		dto.setIndustryName(this.getIndustryName());
		return dto;
	}

}
