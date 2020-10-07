package com.viettel.aio.dto;

import com.viettel.aio.bo.AIOAcceptanceRecordsBO;
import com.viettel.coms.dto.ComsBaseFWDTO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import javax.xml.bind.annotation.XmlRootElement;
import java.util.Date;

//VietNT_20190313_create
@XmlRootElement(name = "AIO_ACCEPTANCE_RECORDSBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class AIOAcceptanceRecordsDTO extends ComsBaseFWDTO<AIOAcceptanceRecordsBO> {

    private Long acceptanceRecordsId;
    private Long contractId;
    private Long packageId;
    private Long customerId;
    private String customerCode;
    private String customerName;
    private String customerPhone;
    private String customerAddress;
    private Long performerId;
    private Date startDate;
    private Date endDate;
    private Long type;
    private Double amount;
    private Long packageDetailId;
    private Long contractDetailId;
    private String performerTogether;
    private Long moneyPromotion;

    public Long getContractDetailId() {
		return contractDetailId;
	}

	public void setContractDetailId(Long contractDetailId) {
		this.contractDetailId = contractDetailId;
	}

	@Override
    public AIOAcceptanceRecordsBO toModel() {
        AIOAcceptanceRecordsBO bo = new AIOAcceptanceRecordsBO();
        bo.setAcceptanceRecordsId(this.getAcceptanceRecordsId());
        bo.setContractId(this.getContractId());
        bo.setPackageId(this.getPackageId());
        bo.setCustomerId(this.getCustomerId());
        bo.setCustomerCode(this.getCustomerCode());
        bo.setCustomerName(this.getCustomerName());
        bo.setCustomerPhone(this.getCustomerPhone());
        bo.setCustomerAddress(this.getCustomerAddress());
        bo.setPerformerId(this.getPerformerId());
        bo.setStartDate(this.getStartDate());
        bo.setEndDate(this.getEndDate());
        bo.setType(this.getType());
        bo.setAmount(this.getAmount());
        bo.setPackageDetailId(this.getPackageDetailId());
        bo.setContractDetailId(this.getContractDetailId());
        bo.setContractDetailId(this.getContractDetailId());
        bo.setMoneyPromotion(this.getMoneyPromotion());
        return bo;
    }

    @Override
    public Long getFWModelId() {
        return acceptanceRecordsId;
    }

    @Override
    public String catchName() {
        return acceptanceRecordsId.toString();
    }

    public Long getMoneyPromotion() {
        return moneyPromotion;
    }

    public void setMoneyPromotion(Long moneyPromotion) {
        this.moneyPromotion = moneyPromotion;
    }

    public String getPerformerTogether() {
        return performerTogether;
    }

    public void setPerformerTogether(String performerTogether) {
        this.performerTogether = performerTogether;
    }

    public Long getPackageDetailId() {
        return packageDetailId;
    }

    public void setPackageDetailId(Long packageDetailId) {
        this.packageDetailId = packageDetailId;
    }

    public Long getAcceptanceRecordsId() {
        return acceptanceRecordsId;
    }

    public void setAcceptanceRecordsId(Long acceptanceRecordsId) {
        this.acceptanceRecordsId = acceptanceRecordsId;
    }

    public Long getContractId() {
        return contractId;
    }

    public void setContractId(Long contractId) {
        this.contractId = contractId;
    }

    public Long getPackageId() {
        return packageId;
    }

    public void setPackageId(Long packageId) {
        this.packageId = packageId;
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

    public Long getType() {
        return type;
    }

    public void setType(Long type) {
        this.type = type;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }
}
