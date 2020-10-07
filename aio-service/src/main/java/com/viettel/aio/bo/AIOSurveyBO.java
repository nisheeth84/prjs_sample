package com.viettel.aio.bo;

import com.viettel.aio.dto.AIOContractDTO;
import com.viettel.aio.dto.AIOSurveyDTO;
import com.viettel.service.base.dto.BaseFWDTOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.Date;

//anhnd
@Entity
@Table(name = "AIO_SURVEY")
public class AIOSurveyBO extends BaseFWModelImpl {

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @org.hibernate.annotations.Parameter(name = "sequence", value = "AIO_SURVEY_SEQ")})
    @Column(name = "AIO_SURVEY_ID", length = 10)
    private Long aioSurveyId;
    @Column(name = "SURVEY_CONTENT", length = 50)
    private String surveyContent;
    @Column(name = "START_DATE", length = 22)
    private Date startDate;
    @Column(name = "END_DATE", length = 22)
    private Date endDate;
    @Column(name = "NUMBER_CUSTOMER_SURVEY", length = 10)
    private Long numberCustomerSurvey;
    @Column(name = "STATUS", length = 50)
    private Long status;
    @Column(name = "CREATED_DATE", length = 22)
    private Date createdDate;
    @Column(name = "CREATED_USER", length = 10)
    private Long createdUser;
    @Column(name = "UPDATED_DATE", length = 22)
    private Date updatedDate;
    @Column(name = "UPDATED_USER", length = 10)
    private Long updatedUser;

    public Long getAioSurveyId() {
        return aioSurveyId;
    }

    public void setAioSurveyId(Long aioSurveyId) {
        this.aioSurveyId = aioSurveyId;
    }

    public String getSurveyContent() {
        return surveyContent;
    }

    public void setSurveyContent(String surveyContent) {
        this.surveyContent = surveyContent;
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

    public Long getNumberCustomerSurvey() {
        return numberCustomerSurvey;
    }

    public void setNumberCustomerSurvey(Long numberCustomerSurvey) {
        this.numberCustomerSurvey = numberCustomerSurvey;
    }

    public Long getStatus() {
        return status;
    }

    public void setStatus(Long status) {
        this.status = status;
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

    @Override
    public BaseFWDTOImpl toDTO() {
        AIOSurveyDTO obj = new AIOSurveyDTO();
        obj.setSurveyId(aioSurveyId);
        obj.setSurveyContent(surveyContent);
        obj.setStartDate(startDate);
        obj.setEndDate(endDate);
        obj.setStatus(status);
        obj.setCreatedDate(createdDate);
        obj.setCreatedUser(createdUser);
        obj.setUpdatedDate(updatedDate);
        obj.setUpdatedUser(updatedUser);
        obj.setNumberCustomerSurvey(numberCustomerSurvey);
        return obj;
    }


}
