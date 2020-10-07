package com.viettel.aio.bo;

import com.viettel.aio.dto.AIOSurveyCustomerDTO;
import com.viettel.aio.dto.AIOSurveyQuestionDTO;
import com.viettel.service.base.dto.BaseFWDTOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.rmi.MarshalledObject;
import java.util.Date;

//anhnd
@Entity
@Table(name = "AIO_SURVEY_CUSTOMER")
public class AIOSurveyCustomerBO extends BaseFWModelImpl {

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @org.hibernate.annotations.Parameter(name = "sequence", value = "AIO_SURVEY_CUSTOMER_SEQ")})
    @Column(name = "AIO_SURVEY_CUSTOMER_ID", length = 10)
    private Long aioSurveyCustomerId;
    @Column(name = "CUSTOMER_ID", length = 10)
    private Long customerId;
    @Column(name = "CUSTOMER_NAME", length = 200)
    private String customerName;
    @Column(name = "CUSTOMER_ADDRESS", length = 200)
    private String customerAddress;
    @Column(name = "CUSTOMER_PHONE", length = 200)
    private String customerPhone;
    @Column(name = "CUSTOMER_EMAIL", length = 200)
    private String customerEmail;
    @Column(name = "SURVEY_ID", length = 10)
    private Long surveyId;
    @Column(name = "PERFORMER_ID", length = 10)
    private Long performerId;
    @Column(name = "STATUS", length = 10)
    private Long status;
    @Column(name = "START_DATE", length = 10)
    private Date startDate;
    @Column(name = "END_DATE", length = 10)
    private Date endDate;
    @Override
    public BaseFWDTOImpl toDTO() {
        AIOSurveyCustomerDTO obj = new AIOSurveyCustomerDTO();
        obj.setAioSurveyCustomerId(aioSurveyCustomerId);
        obj.setCustomerId(aioSurveyCustomerId);
        obj.setCustomerName(customerName);
        obj.setCustomerAddress(customerAddress);
        obj.setCustomerEmail(customerEmail);
        obj.setCustomerPhone(customerPhone);
        obj.setStartDate(startDate);
        obj.setEndDate(endDate);
        obj.setSurveyId(surveyId);
        obj.setStatus(status);
        obj	.setStartDate(startDate);
        obj.setPerformerId(performerId);

        return obj;
    }

    public Long getAioSurveyCustomerId() {
        return aioSurveyCustomerId;
    }

    public void setAioSurveyCustomerId(Long aioSurveyCustomerId) {
        this.aioSurveyCustomerId = aioSurveyCustomerId;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
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

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public Long getSurveyId() {
        return surveyId;
    }

    public void setSurveyId(Long surveyId) {
        this.surveyId = surveyId;
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
}
