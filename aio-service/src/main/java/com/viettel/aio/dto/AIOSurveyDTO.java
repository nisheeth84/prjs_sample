package com.viettel.aio.dto;

import com.viettel.aio.bo.AIOContractBO;
import com.viettel.aio.bo.AIOSurveyBO;
import com.viettel.coms.dto.ComsBaseFWDTO;
import com.viettel.coms.dto.UtilAttachDocumentDTO;
import com.viettel.erp.utils.JsonDateDeserializer;
import com.viettel.erp.utils.JsonDateSerializerDate;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import javax.persistence.Column;
import javax.xml.bind.annotation.XmlRootElement;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

//VietNT_20190313_create
@XmlRootElement(name = "AIO_SURVEYBO")
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonSerialize(include=JsonSerialize.Inclusion.NON_NULL)
public class AIOSurveyDTO extends ComsBaseFWDTO<AIOSurveyBO> {

    public static final Long STATUS_ACTIVE = new Long(1);
    public static final Long STATUS_INACTIVE = new Long(0);

    public AIOSurveyDTO() {
        questionIds = new ArrayList<>();
        employeeCodes = new ArrayList<>();
        invalidCodes = new ArrayList<>();
        surveyCustomers = new ArrayList<>();
    }

    private Long surveyId;
    private String surveyContent;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date startDate;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date endDate;
    private Long numberCustomerSurvey;
    private Long status;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date createdDate;
    private Long createdUser;
    private String createdUserName;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date updatedDate;
    private Long updatedUser;

    private List<Long> questionIds;
    private boolean editable;
    private List<String> employeeCodes;
    private List<String> invalidCodes;
    private List<AIOSurveyCustomerDTO> surveyCustomers;

    @Override
    public AIOSurveyBO toModel() {
        AIOSurveyBO item = new AIOSurveyBO();
        item.setAioSurveyId(surveyId);
        item.setSurveyContent(surveyContent);
        item.setStartDate(startDate);
        item.setEndDate(endDate);
        item.setStatus(status);
        item.setCreatedDate(createdDate);
        item.setCreatedUser(createdUser);
        item.setUpdatedDate(updatedDate);
        item.setUpdatedUser(updatedUser);
        item.setNumberCustomerSurvey(numberCustomerSurvey);
        return item;
    }

    @Override
    public Long getFWModelId() {
        return surveyId;
    }

    @Override
    public String catchName() {
        return surveyId.toString();
    }

    public Long getSurveyId() {
        return surveyId;
    }

    public void setSurveyId(Long surveyId) {
        this.surveyId = surveyId;
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

    public String getCreatedUserName() {
        return createdUserName;
    }

    public void setCreatedUserName(String createdUserName) {
        this.createdUserName = createdUserName;
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

    public List<Long> getQuestionIds() {
        return questionIds;
    }

    public void setQuestionIds(List<Long> questionIds) {
        this.questionIds = questionIds;
    }

    public boolean isEditable() {
        return editable;
    }

    public void setEditable(boolean editable) {
        this.editable = editable;
    }

    public List<String> getEmployeeCodes() {
        return employeeCodes;
    }

    public void setEmployeeCodes(List<String> employeeCodes) {
        this.employeeCodes = employeeCodes;
    }

    public List<String> getInvalidCodes() {
        return invalidCodes;
    }

    public void setInvalidCodes(List<String> invalidCodes) {
        this.invalidCodes = invalidCodes;
    }

	public List<AIOSurveyCustomerDTO> getSurveyCustomers() {
		return surveyCustomers;
	}

	public void setSurveyCustomers(List<AIOSurveyCustomerDTO> surveyCustomers) {
		this.surveyCustomers = surveyCustomers;
	}

    public Long getSurveyCustomerId() {
        return surveyCustomerId;
    }

    public void setSurveyCustomerId(Long surveyCustomerId) {
        this.surveyCustomerId = surveyCustomerId;
    }

    public Long surveyCustomerId;
}
