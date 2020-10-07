package com.viettel.aio.dto;

import com.viettel.aio.bo.AIOReglectDetailBO;
import com.viettel.erp.utils.JsonDateDeserializer;
import com.viettel.erp.utils.JsonDateSerializerDate;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import javax.xml.bind.annotation.XmlRootElement;
import java.util.Date;

@XmlRootElement(name = "AIO_REGLECT_DETAILBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class AIOReglectDetailDTO extends ComsBaseFWDTO<AIOReglectDetailBO>{
	private Long aioReglectDetailId;
	private Long aioReglectId;
	private Long serviceType;
	private Long performerId;
	@JsonSerialize(using = JsonDateSerializerDate.class)
	@JsonDeserialize(using = JsonDateDeserializer.class)
	private Date startDate;
	@JsonSerialize(using = JsonDateSerializerDate.class)
	@JsonDeserialize(using = JsonDateDeserializer.class)
	private Date endDate;
	@JsonSerialize(using = JsonDateSerializerDate.class)
	@JsonDeserialize(using = JsonDateDeserializer.class)
	private Date actualStartDate;
	@JsonSerialize(using = JsonDateSerializerDate.class)
	@JsonDeserialize(using = JsonDateDeserializer.class)
	private Date actualEndDate;
	private Long status;
	@JsonSerialize(using = JsonDateSerializerDate.class)
	@JsonDeserialize(using = JsonDateDeserializer.class)
	private Date expertDate;
	@JsonSerialize(using = JsonDateSerializerDate.class)
	@JsonDeserialize(using = JsonDateDeserializer.class)
	private Date approvedExpertDate;
	private String reason;
	private String descriptionStaff;

	private String actualStartDateStr;
    private String actualEndDateStr;
    private String performerName;
    private String performerCode;

//dto only
	private Long customerId;
	private String customerCode;
	private String customerName;
	private String customerPhone;
	private String customerAddress;
	private Long type;
	@JsonSerialize(using = JsonDateSerializerDate.class)
	@JsonDeserialize(using = JsonDateDeserializer.class)
	private Date supportDate;
	private String reglectContent;
	private String description;

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

	public Long getType() {
		return type;
	}

	public void setType(Long type) {
		this.type = type;
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

    public String getActualStartDateStr() {
        return actualStartDateStr;
    }

    public void setActualStartDateStr(String actualStartDateStr) {
        this.actualStartDateStr = actualStartDateStr;
    }

    public String getActualEndDateStr() {
        return actualEndDateStr;
    }

    public void setActualEndDateStr(String actualEndDateStr) {
        this.actualEndDateStr = actualEndDateStr;
    }

    public Long getAioReglectDetailId() {
		return aioReglectDetailId;
	}

	public void setAioReglectDetailId(Long aioReglectDetailId) {
		this.aioReglectDetailId = aioReglectDetailId;
	}

	public Long getAioReglectId() {
		return aioReglectId;
	}

	public void setAioReglectId(Long aioReglectId) {
		this.aioReglectId = aioReglectId;
	}

	public Long getServiceType() {
		return serviceType;
	}

	public void setServiceType(Long serviceType) {
		this.serviceType = serviceType;
	}

	public Long getPerformerId() {
		return performerId;
	}

	public void setPerformerId(Long performerId) {
		this.performerId = performerId;
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

	public Date getActualStartDate() {
		return actualStartDate;
	}

	public void setActualStartDate(Date actualStartDate) {
		this.actualStartDate = actualStartDate;
	}

	public Date getActualEndDate() {
		return actualEndDate;
	}

	public void setActualEndDate(Date actualEndDate) {
		this.actualEndDate = actualEndDate;
	}

	public Long getStatus() {
		return status;
	}

	public void setStatus(Long status) {
		this.status = status;
	}

	public Date getExpertDate() {
		return expertDate;
	}

	public void setExpertDate(Date expertDate) {
		this.expertDate = expertDate;
	}

	public Date getApprovedExpertDate() {
		return approvedExpertDate;
	}

	public void setApprovedExpertDate(Date approvedExpertDate) {
		this.approvedExpertDate = approvedExpertDate;
	}

	public String getReason() {
		return reason;
	}

	public void setReason(String reason) {
		this.reason = reason;
	}

	public String getDescriptionStaff() {
		return descriptionStaff;
	}

	public void setDescriptionStaff(String descriptionStaff) {
		this.descriptionStaff = descriptionStaff;
	}

	@Override
	public String catchName() {
		// TODO Auto-generated method stub
		return aioReglectDetailId.toString();
	}

	@Override
	public Long getFWModelId() {
		// TODO Auto-generated method stub
		return aioReglectDetailId;
	}

	@Override
	public AIOReglectDetailBO toModel() {
		// TODO Auto-generated method stub
		AIOReglectDetailBO aioReglectDetailBO = new AIOReglectDetailBO();
		aioReglectDetailBO.setAioReglectDetailId(this.getAioReglectDetailId());
		aioReglectDetailBO.setAioReglectId(this.getAioReglectId());
		aioReglectDetailBO.setServiceType(this.getServiceType());
		aioReglectDetailBO.setPerformerId(this.getPerformerId());
		aioReglectDetailBO.setStartDate(this.getStartDate());
		aioReglectDetailBO.setEndDate(this.getEndDate());
		aioReglectDetailBO.setActualStartDate(this.getActualStartDate());
		aioReglectDetailBO.setActualEndDate(this.getActualEndDate());
		aioReglectDetailBO.setStatus(this.getStatus());
		aioReglectDetailBO.setExpertDate(this.getExpertDate());
		aioReglectDetailBO.setApprovedExpertDate(this.getApprovedExpertDate());
		aioReglectDetailBO.setReason(this.getReason());
		aioReglectDetailBO.setDescriptionStaff(this.getDescriptionStaff());
		return aioReglectDetailBO;
	}

}
