/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.dto;

import com.viettel.coms.bo.ConstructionAcceptanceCertBO;
import com.viettel.erp.utils.JsonDateDeserializer;
import com.viettel.erp.utils.JsonDateSerializerDate;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import javax.xml.bind.annotation.XmlRootElement;

/**
 * @author thuannht
 */
@XmlRootElement(name = "CONSTRUCTION_ACCEPTANCE_CERTBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class ConstructionAcceptanceCertDTO extends ComsBaseFWDTO<ConstructionAcceptanceCertBO> {

    private java.lang.String importer;
    private java.lang.String isActive;
    private java.lang.Long updatedGroupId;
    private java.lang.Long updatedUserId;
    private java.util.Date updatedDate;
    private java.lang.Long createdGroupId;
    private java.lang.Long createdUserId;
    private java.util.Date createdDate;
    private java.lang.String description;
    private java.lang.String acceptanceResult;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private java.util.Date completeDate;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private java.util.Date startingDate;
    private java.lang.Long constructionId;
    private java.lang.Long constructionAcceptCertId;

    @Override
    public ConstructionAcceptanceCertBO toModel() {
        ConstructionAcceptanceCertBO constructionAcceptanceCertBO = new ConstructionAcceptanceCertBO();
        constructionAcceptanceCertBO.setImporter(this.importer);
        constructionAcceptanceCertBO.setIsActive(this.isActive);
        constructionAcceptanceCertBO.setUpdatedGroupId(this.updatedGroupId);
        constructionAcceptanceCertBO.setUpdatedUserId(this.updatedUserId);
        constructionAcceptanceCertBO.setUpdatedDate(this.updatedDate);
        constructionAcceptanceCertBO.setCreatedGroupId(this.createdGroupId);
        constructionAcceptanceCertBO.setCreatedUserId(this.createdUserId);
        constructionAcceptanceCertBO.setCreatedDate(this.createdDate);
        constructionAcceptanceCertBO.setDescription(this.description);
        constructionAcceptanceCertBO.setAcceptanceResult(this.acceptanceResult);
        constructionAcceptanceCertBO.setCompleteDate(this.completeDate);
        constructionAcceptanceCertBO.setStartingDate(this.startingDate);
        constructionAcceptanceCertBO.setConstructionId(this.constructionId);
        constructionAcceptanceCertBO.setConstructionAcceptCertId(this.constructionAcceptCertId);
        return constructionAcceptanceCertBO;
    }

    public java.lang.String getImporter() {
        return importer;
    }

    public void setImporter(java.lang.String importer) {
        this.importer = importer;
    }

    public java.lang.String getIsActive() {
        return isActive;
    }

    public void setIsActive(java.lang.String isActive) {
        this.isActive = isActive;
    }

    public java.lang.Long getUpdatedGroupId() {
        return updatedGroupId;
    }

    public void setUpdatedGroupId(java.lang.Long updatedGroupId) {
        this.updatedGroupId = updatedGroupId;
    }

    public java.lang.Long getUpdatedUserId() {
        return updatedUserId;
    }

    public void setUpdatedUserId(java.lang.Long updatedUserId) {
        this.updatedUserId = updatedUserId;
    }

    public java.util.Date getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(java.util.Date updatedDate) {
        this.updatedDate = updatedDate;
    }

    public java.lang.Long getCreatedGroupId() {
        return createdGroupId;
    }

    public void setCreatedGroupId(java.lang.Long createdGroupId) {
        this.createdGroupId = createdGroupId;
    }

    public java.lang.Long getCreatedUserId() {
        return createdUserId;
    }

    public void setCreatedUserId(java.lang.Long createdUserId) {
        this.createdUserId = createdUserId;
    }

    public java.util.Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(java.util.Date createdDate) {
        this.createdDate = createdDate;
    }

    public java.lang.String getDescription() {
        return description;
    }

    public void setDescription(java.lang.String description) {
        this.description = description;
    }

    public java.lang.String getAcceptanceResult() {
        return acceptanceResult;
    }

    public void setAcceptanceResult(java.lang.String acceptanceResult) {
        this.acceptanceResult = acceptanceResult;
    }

    public java.util.Date getCompleteDate() {
        return completeDate;
    }

    public void setCompleteDate(java.util.Date completeDate) {
        this.completeDate = completeDate;
    }

    public java.util.Date getStartingDate() {
        return startingDate;
    }

    public void setStartingDate(java.util.Date startingDate) {
        this.startingDate = startingDate;
    }

    public java.lang.Long getConstructionId() {
        return constructionId;
    }

    public void setConstructionId(java.lang.Long constructionId) {
        this.constructionId = constructionId;
    }

    @Override
    public Long getFWModelId() {
        return constructionAcceptCertId;
    }

    @Override
    public String catchName() {
        return getConstructionAcceptCertId().toString();
    }

    public java.lang.Long getConstructionAcceptCertId() {
        return constructionAcceptCertId;
    }

    public void setConstructionAcceptCertId(java.lang.Long constructionAcceptCertId) {
        this.constructionAcceptCertId = constructionAcceptCertId;
    }

}
