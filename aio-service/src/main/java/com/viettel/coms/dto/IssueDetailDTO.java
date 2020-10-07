package com.viettel.coms.dto;

import com.viettel.erp.utils.JsonDateDeserializer;
import com.viettel.erp.utils.JsonDateSerializerDate;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import java.util.Date;

@JsonIgnoreProperties(ignoreUnknown = true)
public class IssueDetailDTO extends IssueDTO {

    /**
     *
     */
    private static final long serialVersionUID = 1L;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date createdFrom;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date createdTo;
    private Long sysGroupId;
    private String constructionCode;
    private String createdUserName;
    private String currentHandingUserName;
    private String catStationCode;
    private String workItemName;
    private String createdPhoneNumber;
    private String currentHandingPhoneNumber;
    private String processContent;
    private Long currentHandingUserIdNew;
    private String oldStatus;
    private String discussContent;
    private Long catProvinceId;
    private String catProvinceCode;
    private String catProvinceName;

    public Long getCatProvinceId() {
        return catProvinceId;
    }

    public void setCatProvinceId(Long catProvinceId) {
        this.catProvinceId = catProvinceId;
    }

    public String getCatProvinceCode() {
        return catProvinceCode;
    }

    public void setCatProvinceCode(String catProvinceCode) {
        this.catProvinceCode = catProvinceCode;
    }

    public String getCatProvinceName() {
        return catProvinceName;
    }

    public void setCatProvinceName(String catProvinceName) {
        this.catProvinceName = catProvinceName;
    }

    public String getDiscussContent() {
        return discussContent;
    }

    public void setDiscussContent(String discussContent) {
        this.discussContent = discussContent;
    }

    public String getOldStatus() {
        return oldStatus;
    }

    public void setOldStatus(String oldStatus) {
        this.oldStatus = oldStatus;
    }

    public Long getCurrentHandingUserIdNew() {
        return currentHandingUserIdNew;
    }

    public void setCurrentHandingUserIdNew(Long currentHandingUserIdNew) {
        this.currentHandingUserIdNew = currentHandingUserIdNew;
    }

    public String getProcessContent() {
        return processContent;
    }

    public void setProcessContent(String processContent) {
        this.processContent = processContent;
    }

    public String getCatStationCode() {
        return catStationCode;
    }

    public void setCatStationCode(String catStationCode) {
        this.catStationCode = catStationCode;
    }

    public String getWorkItemName() {
        return workItemName;
    }

    public void setWorkItemName(String workItemName) {
        this.workItemName = workItemName;
    }

    public String getCreatedPhoneNumber() {
        return createdPhoneNumber;
    }

    public void setCreatedPhoneNumber(String createdPhoneNumber) {
        this.createdPhoneNumber = createdPhoneNumber;
    }

    public String getCurrentHandingPhoneNumber() {
        return currentHandingPhoneNumber;
    }

    public void setCurrentHandingPhoneNumber(String currentHandingPhoneNumber) {
        this.currentHandingPhoneNumber = currentHandingPhoneNumber;
    }

    public String getConstructionCode() {
        return constructionCode;
    }

    public void setConstructionCode(String constructionCode) {
        this.constructionCode = constructionCode;
    }

    public String getCreatedUserName() {
        return createdUserName;
    }

    public void setCreatedUserName(String createdUserName) {
        this.createdUserName = createdUserName;
    }

    public String getCurrentHandingUserName() {
        return currentHandingUserName;
    }

    public void setCurrentHandingUserName(String currentHandingUserName) {
        this.currentHandingUserName = currentHandingUserName;
    }

    public Date getCreatedFrom() {
        return createdFrom;
    }

    public void setCreatedFrom(Date createdFrom) {
        this.createdFrom = createdFrom;
    }

    public Date getCreatedTo() {
        return createdTo;
    }

    public void setCreatedTo(Date createdTo) {
        this.createdTo = createdTo;
    }

    public Long getSysGroupId() {
        return sysGroupId;
    }

    public void setSysGroupId(Long sysGroupId) {
        this.sysGroupId = sysGroupId;
    }

}
