package com.viettel.aio.bo;

import com.viettel.aio.dto.AIOAcceptanceRecordsDTO;
import com.viettel.service.base.dto.BaseFWDTOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.Date;

//VietNT_20190313_start
@Entity
@Table(name = "AIO_ACCEPTANCE_RECORDS")
public class AIOAcceptanceRecordsBO extends BaseFWModelImpl {

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @org.hibernate.annotations.Parameter(name = "sequence", value = "AIO_ACCEPTANCE_RECORDS_SEQ")})
    @Column(name = "ACCEPTANCE_RECORDS_ID", length = 10)
    private Long acceptanceRecordsId;
    @Column(name = "CONTRACT_ID", length = 10)
    private Long contractId;
    @Column(name = "PACKAGE_ID", length = 10)
    private Long packageId;
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
    @Column(name = "PERFORMER_ID", length = 10)
    private Long performerId;
    @Column(name = "START_DATE", length = 22)
    private Date startDate;
    @Column(name = "END_DATE", length = 22)
    private Date endDate;
    @Column(name = "TYPE", length = 1)
    private Long type;
    @Column(name = "AMOUNT", length = 15)
    private Double amount;
    @Column(name = "PACKAGE_DETAIL_ID", length = 10)
    private Long packageDetailId;
    @Column(name = "CONTRACT_DETAIL_ID", length = 10)
    private Long contractDetailId;
    @Column(name = "PERFORMER_TOGETHER", length = 500)
    private String performerTogether;
    @Column(name = "MONEY_PROMOTION", length = 30)
    private Long moneyPromotion;

    @Override
    public BaseFWDTOImpl toDTO() {
        AIOAcceptanceRecordsDTO dto = new AIOAcceptanceRecordsDTO();
        dto.setAcceptanceRecordsId(this.getAcceptanceRecordsId());
        dto.setContractId(this.getContractId());
        dto.setPackageId(this.getPackageId());
        dto.setCustomerId(this.getCustomerId());
        dto.setCustomerCode(this.getCustomerCode());
        dto.setCustomerName(this.getCustomerName());
        dto.setCustomerPhone(this.getCustomerPhone());
        dto.setCustomerAddress(this.getCustomerAddress());
        dto.setPerformerId(this.getPerformerId());
        dto.setStartDate(this.getStartDate());
        dto.setEndDate(this.getEndDate());
        dto.setType(this.getType());
        dto.setAmount(this.getAmount());
        dto.setPackageDetailId(this.getPackageDetailId());
        dto.setContractDetailId(this.getContractDetailId());
        dto.setPerformerTogether(this.getPerformerTogether());
        dto.setMoneyPromotion(this.getMoneyPromotion());
        return dto;
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

    public Long getContractDetailId() {
        return contractDetailId;
    }

    public void setContractDetailId(Long contractDetailId) {
        this.contractDetailId = contractDetailId;
    }
}
