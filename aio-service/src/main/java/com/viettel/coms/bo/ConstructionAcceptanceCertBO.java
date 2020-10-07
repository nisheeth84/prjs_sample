/*
 * Copyright 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.coms.bo;

import com.viettel.coms.dto.ConstructionAcceptanceCertDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@Entity
@Table(name = "CONSTRUCTION_ACCEPTANCE_CERT")
/**
 *
 * @author: ThuanNHT
 * @version: 1.0
 * @since: 1.0
 */
public class ConstructionAcceptanceCertBO extends BaseFWModelImpl {

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
    private java.util.Date completeDate;
    private java.util.Date startingDate;
    private java.lang.Long constructionId;
    private java.lang.Long constructionAcceptCertId;

    @Column(name = "IMPORTER", length = 400)
    public java.lang.String getImporter() {
        return importer;
    }

    public void setImporter(java.lang.String importer) {
        this.importer = importer;
    }

    @Column(name = "IS_ACTIVE", length = 2)
    public java.lang.String getIsActive() {
        return isActive;
    }

    public void setIsActive(java.lang.String isActive) {
        this.isActive = isActive;
    }

    @Column(name = "UPDATED_GROUP_ID", length = 22)
    public java.lang.Long getUpdatedGroupId() {
        return updatedGroupId;
    }

    public void setUpdatedGroupId(java.lang.Long updatedGroupId) {
        this.updatedGroupId = updatedGroupId;
    }

    @Column(name = "UPDATED_USER_ID", length = 22)
    public java.lang.Long getUpdatedUserId() {
        return updatedUserId;
    }

    public void setUpdatedUserId(java.lang.Long updatedUserId) {
        this.updatedUserId = updatedUserId;
    }

    @Column(name = "UPDATED_DATE", length = 7)
    public java.util.Date getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(java.util.Date updatedDate) {
        this.updatedDate = updatedDate;
    }

    @Column(name = "CREATED_GROUP_ID", length = 22)
    public java.lang.Long getCreatedGroupId() {
        return createdGroupId;
    }

    public void setCreatedGroupId(java.lang.Long createdGroupId) {
        this.createdGroupId = createdGroupId;
    }

    @Column(name = "CREATED_USER_ID", length = 22)
    public java.lang.Long getCreatedUserId() {
        return createdUserId;
    }

    public void setCreatedUserId(java.lang.Long createdUserId) {
        this.createdUserId = createdUserId;
    }

    @Column(name = "CREATED_DATE", length = 7)
    public java.util.Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(java.util.Date createdDate) {
        this.createdDate = createdDate;
    }

    @Column(name = "DESCRIPTION", length = 2000)
    public java.lang.String getDescription() {
        return description;
    }

    public void setDescription(java.lang.String description) {
        this.description = description;
    }

    @Column(name = "ACCEPTANCE_RESULT", length = 2)
    public java.lang.String getAcceptanceResult() {
        return acceptanceResult;
    }

    public void setAcceptanceResult(java.lang.String acceptanceResult) {
        this.acceptanceResult = acceptanceResult;
    }

    @Column(name = "COMPLETE_DATE", length = 7)
    public java.util.Date getCompleteDate() {
        return completeDate;
    }

    public void setCompleteDate(java.util.Date completeDate) {
        this.completeDate = completeDate;
    }

    @Column(name = "STARTING_DATE", length = 7)
    public java.util.Date getStartingDate() {
        return startingDate;
    }

    public void setStartingDate(java.util.Date startingDate) {
        this.startingDate = startingDate;
    }

    @Column(name = "CONSTRUCTION_ID", length = 22)
    public java.lang.Long getConstructionId() {
        return constructionId;
    }

    public void setConstructionId(java.lang.Long constructionId) {
        this.constructionId = constructionId;
    }

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @Parameter(name = "sequence", value = "CONSTR_ACCEPTANCE_CERT_SEQ")})
    @Column(name = "CONSTRUCTION_ACCEPT_CERT_ID", length = 22)
    public java.lang.Long getConstructionAcceptCertId() {
        return constructionAcceptCertId;
    }

    public void setConstructionAcceptCertId(java.lang.Long constructionAcceptCertId) {
        this.constructionAcceptCertId = constructionAcceptCertId;
    }

    @Override
    public ConstructionAcceptanceCertDTO toDTO() {
        ConstructionAcceptanceCertDTO constructionAcceptanceCertDTO = new ConstructionAcceptanceCertDTO();
        // set cac gia tri
        constructionAcceptanceCertDTO.setImporter(this.importer);
        constructionAcceptanceCertDTO.setIsActive(this.isActive);
        constructionAcceptanceCertDTO.setUpdatedGroupId(this.updatedGroupId);
        constructionAcceptanceCertDTO.setUpdatedUserId(this.updatedUserId);
        constructionAcceptanceCertDTO.setUpdatedDate(this.updatedDate);
        constructionAcceptanceCertDTO.setCreatedGroupId(this.createdGroupId);
        constructionAcceptanceCertDTO.setCreatedUserId(this.createdUserId);
        constructionAcceptanceCertDTO.setCreatedDate(this.createdDate);
        constructionAcceptanceCertDTO.setDescription(this.description);
        constructionAcceptanceCertDTO.setAcceptanceResult(this.acceptanceResult);
        constructionAcceptanceCertDTO.setCompleteDate(this.completeDate);
        constructionAcceptanceCertDTO.setStartingDate(this.startingDate);
        constructionAcceptanceCertDTO.setConstructionId(this.constructionId);
        constructionAcceptanceCertDTO.setConstructionAcceptCertId(this.constructionAcceptCertId);
        return constructionAcceptanceCertDTO;
    }
}
