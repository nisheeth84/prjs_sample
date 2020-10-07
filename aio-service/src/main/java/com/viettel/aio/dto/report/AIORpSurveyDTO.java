package com.viettel.aio.dto.report;

import com.viettel.coms.dto.ComsBaseFWDTO;
import com.viettel.service.base.model.BaseFWModelImpl;

import java.util.Date;

/**
 * Created by HaiND on 9/26/2019 12:22 AM.
 */
public class AIORpSurveyDTO extends ComsBaseFWDTO {

    private Long surveyId;
    private String surveyText;
    private String text;
    private String contentSurvey;
    private String contentAnswerA;
    private String contentAnswerB;
    private String contentAnswerC;
    private String contentAnswerD;
    private String contentAnswerE;
    private Double percentAnswerA;
    private Double percentAnswerB;
    private Double percentAnswerC;
    private Double percentAnswerD;
    private Double percentAnswerE;
    private Long createdUser;
    private Date startDate;
    private Date endDate;
    private Long numberCustomerExpect;
    private Long numberCustomerActual;
    private String sysGroupName;
    private Long sysGroupId;

    public Long getSurveyId() {
        return surveyId;
    }

    public void setSurveyId(Long surveyId) {
        this.surveyId = surveyId;
    }

    public String getSurveyText() {
        return surveyText;
    }

    public void setSurveyText(String surveyText) {
        this.surveyText = surveyText;
    }

    @Override
    public String getText() {
        return text;
    }

    @Override
    public void setText(String text) {
        this.text = text;
    }

    public String getContentSurvey() {
        return contentSurvey;
    }

    public void setContentSurvey(String contentSurvey) {
        this.contentSurvey = contentSurvey;
    }

    public String getContentAnswerA() {
        return contentAnswerA;
    }

    public void setContentAnswerA(String contentAnswerA) {
        this.contentAnswerA = contentAnswerA;
    }

    public String getContentAnswerB() {
        return contentAnswerB;
    }

    public void setContentAnswerB(String contentAnswerB) {
        this.contentAnswerB = contentAnswerB;
    }

    public String getContentAnswerC() {
        return contentAnswerC;
    }

    public void setContentAnswerC(String contentAnswerC) {
        this.contentAnswerC = contentAnswerC;
    }

    public String getContentAnswerD() {
        return contentAnswerD;
    }

    public void setContentAnswerD(String contentAnswerD) {
        this.contentAnswerD = contentAnswerD;
    }

    public String getContentAnswerE() {
        return contentAnswerE;
    }

    public void setContentAnswerE(String contentAnswerE) {
        this.contentAnswerE = contentAnswerE;
    }

    public Double getPercentAnswerA() {
        return percentAnswerA;
    }

    public void setPercentAnswerA(Double percentAnswerA) {
        this.percentAnswerA = percentAnswerA;
    }

    public Double getPercentAnswerB() {
        return percentAnswerB;
    }

    public void setPercentAnswerB(Double percentAnswerB) {
        this.percentAnswerB = percentAnswerB;
    }

    public Double getPercentAnswerC() {
        return percentAnswerC;
    }

    public void setPercentAnswerC(Double percentAnswerC) {
        this.percentAnswerC = percentAnswerC;
    }

    public Double getPercentAnswerD() {
        return percentAnswerD;
    }

    public void setPercentAnswerD(Double percentAnswerD) {
        this.percentAnswerD = percentAnswerD;
    }

    public Double getPercentAnswerE() {
        return percentAnswerE;
    }

    public void setPercentAnswerE(Double percentAnswerE) {
        this.percentAnswerE = percentAnswerE;
    }

    public Long getCreatedUser() {
        return createdUser;
    }

    public void setCreatedUser(Long createdUser) {
        this.createdUser = createdUser;
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

    public Long getNumberCustomerExpect() {
        return numberCustomerExpect;
    }

    public void setNumberCustomerExpect(Long numberCustomerExpect) {
        this.numberCustomerExpect = numberCustomerExpect;
    }

    public Long getNumberCustomerActual() {
        return numberCustomerActual;
    }

    public void setNumberCustomerActual(Long numberCustomerActual) {
        this.numberCustomerActual = numberCustomerActual;
    }

    public String getSysGroupName() {
        return sysGroupName;
    }

    public void setSysGroupName(String sysGroupName) {
        this.sysGroupName = sysGroupName;
    }

    public Long getSysGroupId() {
        return sysGroupId;
    }

    public void setSysGroupId(Long sysGroupId) {
        this.sysGroupId = sysGroupId;
    }

    @Override
    public BaseFWModelImpl toModel() {
        return null;
    }

    @Override
    public Long getFWModelId() {
        return null;
    }

    @Override
    public String catchName() {
        return null;
    }
}
