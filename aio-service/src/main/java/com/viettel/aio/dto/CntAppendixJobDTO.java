package com.viettel.aio.dto;

import com.viettel.aio.bo.CntAppendixJobBO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;
import java.util.Date;

@XmlRootElement(name = "CntAppendixJobBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class CntAppendixJobDTO extends ComsBaseFWDTO<CntAppendixJobBO>{
    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = { @Parameter(name = "sequence", value = "CNT_CONSTR_WORK_ITEM_TASK_HCQT_SEQ") })
    @Column(name = "CNT_CONSTR_WORK_ITEM_TASK_HCQT_ID", length = 22)
    private Long cntWorkItemTaskHSQTId;
    @Column(name = "CNT_CONTRACT_ID", length = 22)
    private Long cntContractId;
    @Column(name = "CNT_CONTRACT_CODE")
    private String cntContractCode;
    @Column(name = "WORK_ITEM_ID")
    private Long workItemId;
    @Column(name = "WORK_ITEM_NAME")
    private String workItemName;
    @Column(name = "CAT_TASK_ID")
    private Long catTaskId;
    @Column(name = "CAT_TASK_NAME")
    private String catTaskName;
    @Column(name = "CAT_UNIT_NAME")
    private String catUnitName;
    @Column(name = "QUANTITY")
    private Double quantity;
    @Column(name = "PRICE")
    private Double price;
    @Column(name = "DESCRIPTION")
    private String description;
    @Column(name = "STATUS")
    private Long status;
    @Column(name = "CAT_UNIT_ID")
    private Long catUnitId;
    @Column(name = "UPDATED_USER_ID", length = 22)
    private Long updatedUserId;
    @Column(name = "UPDATED_DATE", length = 7)
    private Date updatedDate;
    @Column(name = "UPDATED_GROUP_ID", length = 7)
    private Long updateGroupId;
    @Column(name = "CREATED_GROUP_ID", length = 22)
    private Long createdGroupId;
    @Column(name = "CREATED_USER_ID", length = 22)
    private Long createdUserId;
    @Column(name = "CREATED_DATE", length = 7)
    private Date createdDate;


    public Long getCntWorkItemTaskHSQTId() {
        return cntWorkItemTaskHSQTId;
    }

    public void setCntWorkItemTaskHSQTId(Long cntWorkItemTaskHSQTId) {
        this.cntWorkItemTaskHSQTId = cntWorkItemTaskHSQTId;
    }

    public Long getCntContractId() {
        return cntContractId;
    }

    public void setCntContractId(Long cntContractId) {
        this.cntContractId = cntContractId;
    }

    public String getCntContractCode() {
        return cntContractCode;
    }

    public void setCntContractCode(String cntContractCode) {
        this.cntContractCode = cntContractCode;
    }

    public Long getWorkItemId() {
        return workItemId;
    }

    public void setWorkItemId(Long workItemId) {
        this.workItemId = workItemId;
    }

    public String getWorkItemName() {
        return workItemName;
    }

    public void setWorkItemName(String workItemName) {
        this.workItemName = workItemName;
    }

    public Long getCatTaskId() {
        return catTaskId;
    }

    public void setCatTaskId(Long catTaskId) {
        this.catTaskId = catTaskId;
    }

    public String getCatTaskName() {
        return catTaskName;
    }

    public void setCatTaskName(String catTaskName) {
        this.catTaskName = catTaskName;
    }

    public String getCatUnitName() {
        return catUnitName;
    }

    public void setCatUnitName(String catUnitName) {
        this.catUnitName = catUnitName;
    }

    public Double getQuantity() {
        return quantity;
    }

    public void setQuantity(Double quantity) {
        this.quantity = quantity;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getStatus() {
        return status;
    }

    public void setStatus(Long status) {
        this.status = status;
    }

    public Long getCatUnitId() {
        return catUnitId;
    }

    public void setCatUnitId(Long catUnitId) {
        this.catUnitId = catUnitId;
    }

    public Long getUpdatedUserId() {
        return updatedUserId;
    }

    public void setUpdatedUserId(Long updatedUserId) {
        this.updatedUserId = updatedUserId;
    }

    public Date getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(Date updatedDate) {
        this.updatedDate = updatedDate;
    }

    public Long getUpdateGroupId() {
        return updateGroupId;
    }

    public void setUpdateGroupId(Long updateGroupId) {
        this.updateGroupId = updateGroupId;
    }

    public Long getCreatedGroupId() {
        return createdGroupId;
    }

    public void setCreatedGroupId(Long createdGroupId) {
        this.createdGroupId = createdGroupId;
    }

    public Long getCreatedUserId() {
        return createdUserId;
    }

    public void setCreatedUserId(Long createdUserId) {
        this.createdUserId = createdUserId;
    }

    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }


    @Column(name = "WORK_ITEM_TYPE_NAME")
    private String workItemTypeName;
    public String getWorkItemTypeName() {
        return workItemTypeName;
    }

    public void setWorkItemTypeName(String workItemTypeName) {
        this.workItemTypeName = workItemTypeName;
    }

    @Column(name = "WORK_ITEM_TYPE_ID")
    private Long workItemTypeId;
    public Long getWorkItemTypeId() {
        return workItemTypeId;
    }
    public void setWorkItemTypeId(Long workItemTypeId) {
        this.workItemTypeId = workItemTypeId;
    }

    @Column(name = "CAT_TASK_CODE")
    private String catTaskCode;
    @Column(name = "WORK_ITEM_CODE")
    private String workItemCode;

    public String getCatTaskCode() {
        return catTaskCode;
    }

    public void setCatTaskCode(String catTaskCode) {
        this.catTaskCode = catTaskCode;
    }

    public String getWorkItemCode() {
        return workItemCode;
    }

    public void setWorkItemCode(String workItemCode) {
        this.workItemCode = workItemCode;
    }

    @Override
    public CntAppendixJobBO toModel() {
        CntAppendixJobBO cntAppendixJobBO = new CntAppendixJobBO();
        cntAppendixJobBO.setCntWorkItemTaskHSQTId(this.getCntWorkItemTaskHSQTId());
        cntAppendixJobBO.setCntContractId(this.getCntContractId());
        cntAppendixJobBO.setCntContractCode(this.getCntContractCode());
        cntAppendixJobBO.setWorkItemId(this.getWorkItemId());
        cntAppendixJobBO.setWorkItemName(this.getWorkItemName());
        cntAppendixJobBO.setCatTaskId(this.getCatTaskId());
        cntAppendixJobBO.setCatTaskName(this.getCatTaskName());
        cntAppendixJobBO.setCatUnitId(this.getCatUnitId());
        cntAppendixJobBO.setCatUnitName(this.getCatUnitName());
        cntAppendixJobBO.setPrice(this.getPrice());
        cntAppendixJobBO.setQuantity(this.getQuantity());
        cntAppendixJobBO.setDescription(this.getDescription());
        cntAppendixJobBO.setStatus(this.getStatus());
        cntAppendixJobBO.setCreatedDate(this.getCreatedDate());
        cntAppendixJobBO.setCreatedUserId(this.getCreatedUserId());
        cntAppendixJobBO.setCreatedGroupId(this.getCreatedGroupId());
        cntAppendixJobBO.setUpdatedDate(this.getUpdatedDate());
        cntAppendixJobBO.setUpdatedUserId(this.getUpdatedUserId());
        cntAppendixJobBO.setUpdateGroupId(this.getUpdateGroupId());
        cntAppendixJobBO.setWorkItemTypeName(this.getWorkItemTypeName());
        cntAppendixJobBO.setWorkItemTypeId(this.getWorkItemTypeId());
        cntAppendixJobBO.setCatTaskCode(this.getCatTaskCode());
        cntAppendixJobBO.setWorkItemCode(this.getWorkItemCode());
        return cntAppendixJobBO;
    }

    @Override
    public Long getFWModelId() {
        return cntWorkItemTaskHSQTId;
    }

    @Override
    public String catchName() {
        return getCntWorkItemTaskHSQTId().toString();
    }


}
