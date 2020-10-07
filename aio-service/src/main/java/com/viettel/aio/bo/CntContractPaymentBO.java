package com.viettel.aio.bo;

import com.viettel.aio.dto.CntContractPaymentDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@SuppressWarnings("serial")
@Entity(name = "com.viettel.aio.bo.CntContractPaymentBO")
@Table(name = "CNT_CONTRACT_PAYMENT")
/**
 *
 * @author: hailh10
 */
public class CntContractPaymentBO extends BaseFWModelImpl {

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {@Parameter(name = "sequence", value = "CNT_CONTRACT_PAYMENT_SEQ")})
    @Column(name = "CNT_CONTRACT_PAYMENT_ID", length = 22)
    private Long cntContractPaymentId;
    @Column(name = "PAYMENT_PHASE", length = 400)
    private String paymentPhase;
    @Column(name = "PAYMENT_PRICE", length = 22)
    private Double paymentPrice;
    @Column(name = "PAYMENT_DATE", length = 7)
    private java.util.Date paymentDate;
    @Column(name = "PAYMENT_MODE", length = 200)
    private String paymentMode;
    @Column(name = "DESCRIPTION", length = 4000)
    private String description;
    @Column(name = "CNT_CONTRACT_ID", length = 22)
    private Long cntContractId;
    @Column(name = "STATUS", length = 22)
    private Long status;
    @Column(name = "CREATED_USER_ID", length = 22)
    private Long createdUserId;
    @Column(name = "CREATED_GROUP_ID", length = 22)
    private Long createdGroupId;
    @Column(name = "UPDATED_DATE", length = 7)
    private java.util.Date updatedDate;
    @Column(name = "UPDATED_USER_ID", length = 22)
    private Long updatedUserId;
    @Column(name = "UPDATED_GROUP_ID", length = 22)
    private Long updatedGroupId;
    @Column(name = "CREATED_DATE", length = 7)
    private java.util.Date createdDate;
    @Column(name = "MONEY_TYPE", length = 6)
    private Integer moneyType;
    @Column(name = "PAYMENT_PLAN_PRICE", length = 22)
    private Double paymentPlanPrice;

    //Huypq-20190912-start
    @Column(name = "PAYMENT_DATE_TO")
    private java.util.Date paymentDateTo;

    public java.util.Date getPaymentDateTo() {
        return paymentDateTo;
    }

    public void setPaymentDateTo(java.util.Date paymentDateTo) {
        this.paymentDateTo = paymentDateTo;
    }


    //huy-end

    public Long getCntContractPaymentId() {
        return cntContractPaymentId;
    }

    public void setCntContractPaymentId(Long cntContractPaymentId) {
        this.cntContractPaymentId = cntContractPaymentId;
    }

    public String getPaymentPhase() {
        return paymentPhase;
    }

    public void setPaymentPhase(String paymentPhase) {
        this.paymentPhase = paymentPhase;
    }

    public Double getPaymentPrice() {
        return paymentPrice;
    }

    public void setPaymentPrice(Double paymentPrice) {
        this.paymentPrice = paymentPrice;
    }

    public java.util.Date getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(java.util.Date paymentDate) {
        this.paymentDate = paymentDate;
    }

    public String getPaymentMode() {
        return paymentMode;
    }

    public void setPaymentMode(String paymentMode) {
        this.paymentMode = paymentMode;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getCntContractId() {
        return cntContractId;
    }

    public void setCntContractId(Long cntContractId) {
        this.cntContractId = cntContractId;
    }

    public Long getStatus() {
        return status;
    }

    public void setStatus(Long status) {
        this.status = status;
    }

    public Long getCreatedUserId() {
        return createdUserId;
    }

    public void setCreatedUserId(Long createdUserId) {
        this.createdUserId = createdUserId;
    }

    public Long getCreatedGroupId() {
        return createdGroupId;
    }

    public void setCreatedGroupId(Long createdGroupId) {
        this.createdGroupId = createdGroupId;
    }

    public java.util.Date getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(java.util.Date updatedDate) {
        this.updatedDate = updatedDate;
    }

    public Long getUpdatedUserId() {
        return updatedUserId;
    }

    public void setUpdatedUserId(Long updatedUserId) {
        this.updatedUserId = updatedUserId;
    }

    public Long getUpdatedGroupId() {
        return updatedGroupId;
    }

    public void setUpdatedGroupId(Long updatedGroupId) {
        this.updatedGroupId = updatedGroupId;
    }

    public java.util.Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(java.util.Date createdDate) {
        this.createdDate = createdDate;
    }

    public Integer getMoneyType() {
        return moneyType;
    }

    public void setMoneyType(Integer moneyType) {
        this.moneyType = moneyType;
    }

    @Override
    public CntContractPaymentDTO toDTO() {
        CntContractPaymentDTO cntContractPaymentDTO = new CntContractPaymentDTO();
        cntContractPaymentDTO.setCntContractPaymentId(this.cntContractPaymentId);
        cntContractPaymentDTO.setPaymentPhase(this.paymentPhase);
        cntContractPaymentDTO.setPaymentPrice(this.paymentPrice);
        cntContractPaymentDTO.setPaymentDate(this.paymentDate);
        cntContractPaymentDTO.setPaymentMode(this.paymentMode);
        cntContractPaymentDTO.setDescription(this.description);
        cntContractPaymentDTO.setCntContractId(this.cntContractId);
        cntContractPaymentDTO.setStatus(this.status);
        cntContractPaymentDTO.setCreatedUserId(this.createdUserId);
        cntContractPaymentDTO.setCreatedGroupId(this.createdGroupId);
        cntContractPaymentDTO.setUpdatedDate(this.updatedDate);
        cntContractPaymentDTO.setUpdatedUserId(this.updatedUserId);
        cntContractPaymentDTO.setUpdatedGroupId(this.updatedGroupId);
        cntContractPaymentDTO.setCreatedDate(this.createdDate);
        cntContractPaymentDTO.setMoneyType(moneyType);
        cntContractPaymentDTO.setPaymentPlanPrice(paymentPlanPrice);
        cntContractPaymentDTO.setPaymentDateTo(this.paymentDateTo);
        return cntContractPaymentDTO;
    }

    public Double getPaymentPlanPrice() {
        return paymentPlanPrice;
    }

    public void setPaymentPlanPrice(Double paymentPlanPrice) {
        this.paymentPlanPrice = paymentPlanPrice;
    }
}
