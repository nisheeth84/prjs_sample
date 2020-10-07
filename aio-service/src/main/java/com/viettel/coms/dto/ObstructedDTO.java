/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.dto;

import com.viettel.coms.bo.ObstructedBO;
import com.viettel.erp.utils.JsonDateDeserializer;
import com.viettel.erp.utils.JsonDateSerializerDate;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import javax.xml.bind.annotation.XmlRootElement;

/**
 * @author thuannht
 */
@XmlRootElement(name = "OBSTRUCTEDBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class ObstructedDTO extends ComsBaseFWDTO<ObstructedBO> {

    private java.lang.Long obstructedId;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private java.util.Date closedDate;
    private java.lang.String obstructedState;
    private java.lang.String code;
    private java.lang.String obstructedContent;
    private java.lang.Long constructionId;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private java.util.Date createdDate;
    private java.lang.Long createdUserId;
    private java.lang.Long createdGroupId;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private java.util.Date updatedDate;
    private java.lang.Long updatedUserId;
    private java.lang.Long updatedGroupId;

    //	hoanm1_20180820_start
    private java.lang.Long workItemId;
    private java.lang.String workItemName;

    public java.lang.String getWorkItemName() {
        return workItemName;
    }

    public void setWorkItemName(java.lang.String workItemName) {
        this.workItemName = workItemName;
    }

    public java.lang.Long getWorkItemId() {
        return workItemId;
    }

    public void setWorkItemId(java.lang.Long workItemId) {
        this.workItemId = workItemId;
    }
//	hoanm1_20180820_end

    @Override
    public ObstructedBO toModel() {
        ObstructedBO obstructedBO = new ObstructedBO();
        obstructedBO.setObstructedId(this.obstructedId);
        obstructedBO.setClosedDate(this.closedDate);
        obstructedBO.setObstructedState(this.obstructedState);
        obstructedBO.setObstructedContent(this.obstructedContent);
        obstructedBO.setConstructionId(this.constructionId);
        obstructedBO.setCreatedDate(this.createdDate);
        obstructedBO.setCreatedUserId(this.createdUserId);
        obstructedBO.setCreatedGroupId(this.createdGroupId);
        obstructedBO.setUpdatedDate(this.updatedDate);
        obstructedBO.setUpdatedUserId(this.updatedUserId);
        obstructedBO.setUpdatedGroupId(this.updatedGroupId);
//		hoanm1_20180820_start
        obstructedBO.setWorkItemId(this.workItemId);
//		hoanm1_20180820_end
        return obstructedBO;
    }

    @Override
    public Long getFWModelId() {
        return obstructedId;
    }

    @Override
    public String catchName() {
        return getObstructedId().toString();
    }

    public java.lang.Long getObstructedId() {
        return obstructedId;
    }

    public void setObstructedId(java.lang.Long obstructedId) {
        this.obstructedId = obstructedId;
    }

    public java.lang.String getCode() {
        return code;
    }

    public void setCode(java.lang.String code) {
        this.code = code;
    }

    public java.util.Date getClosedDate() {
        return closedDate;
    }

    public void setClosedDate(java.util.Date closedDate) {
        this.closedDate = closedDate;
    }

    public java.lang.String getObstructedState() {
        return obstructedState;
    }

    public void setObstructedState(java.lang.String obstructedState) {
        this.obstructedState = obstructedState;
    }

    public java.lang.String getObstructedContent() {
        return obstructedContent;
    }

    public void setObstructedContent(java.lang.String obstructedContent) {
        this.obstructedContent = obstructedContent;
    }

    public java.lang.Long getConstructionId() {
        return constructionId;
    }

    public void setConstructionId(java.lang.Long constructionId) {
        this.constructionId = constructionId;
    }

    public java.util.Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(java.util.Date createdDate) {
        this.createdDate = createdDate;
    }

    public java.lang.Long getCreatedUserId() {
        return createdUserId;
    }

    public void setCreatedUserId(java.lang.Long createdUserId) {
        this.createdUserId = createdUserId;
    }

    public java.lang.Long getCreatedGroupId() {
        return createdGroupId;
    }

    public void setCreatedGroupId(java.lang.Long createdGroupId) {
        this.createdGroupId = createdGroupId;
    }

    public java.util.Date getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(java.util.Date updatedDate) {
        this.updatedDate = updatedDate;
    }

    public java.lang.Long getUpdatedUserId() {
        return updatedUserId;
    }

    public void setUpdatedUserId(java.lang.Long updatedUserId) {
        this.updatedUserId = updatedUserId;
    }

    public java.lang.Long getUpdatedGroupId() {
        return updatedGroupId;
    }

    public void setUpdatedGroupId(java.lang.Long updatedGroupId) {
        this.updatedGroupId = updatedGroupId;
    }

}
