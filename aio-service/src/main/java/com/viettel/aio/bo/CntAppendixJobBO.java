package com.viettel.aio.bo;

import com.viettel.aio.dto.CntAppendixJobDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;
import java.util.Date;

@SuppressWarnings("serial")
@Entity(name = "com.viettel.aio.bo.CntAppendixJobBO")
@Table(name = "CNT_CONSTR_WORK_ITEM_TASK_HCQT")

public class CntAppendixJobBO extends BaseFWModelImpl {
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
    public CntAppendixJobDTO toDTO() {
        CntAppendixJobDTO cntAppendixJobDTO = new CntAppendixJobDTO();
        cntAppendixJobDTO.setCntWorkItemTaskHSQTId(this.getCntWorkItemTaskHSQTId());
        cntAppendixJobDTO.setCntContractId(this.getCntContractId());
        cntAppendixJobDTO.setCntContractCode(this.getCntContractCode());
        cntAppendixJobDTO.setWorkItemId(this.getWorkItemId());
        cntAppendixJobDTO.setWorkItemName(this.getWorkItemName());
        cntAppendixJobDTO.setCatTaskId(this.getCatTaskId());
        cntAppendixJobDTO.setCatTaskName(this.getCatTaskName());
        cntAppendixJobDTO.setCatUnitId(this.getCatUnitId());
        cntAppendixJobDTO.setCatUnitName(this.getCatUnitName());
        cntAppendixJobDTO.setPrice(this.getPrice());
        cntAppendixJobDTO.setQuantity(this.getQuantity());
        cntAppendixJobDTO.setDescription(this.getDescription());
        cntAppendixJobDTO.setStatus(this.getStatus());
        cntAppendixJobDTO.setCreatedDate(this.getCreatedDate());
        cntAppendixJobDTO.setCreatedUserId(this.getCreatedUserId());
        cntAppendixJobDTO.setCreatedGroupId(this.getCreatedGroupId());
        cntAppendixJobDTO.setUpdatedDate(this.getUpdatedDate());
        cntAppendixJobDTO.setUpdatedUserId(this.getUpdatedUserId());
        cntAppendixJobDTO.setUpdateGroupId(this.getUpdateGroupId());
        cntAppendixJobDTO.setWorkItemTypeName(this.getWorkItemTypeName());
        cntAppendixJobDTO.setWorkItemTypeId(this.getWorkItemTypeId());
        cntAppendixJobDTO.setWorkItemTypeId(this.getWorkItemTypeId());
        cntAppendixJobDTO.setCatTaskCode(this.getCatTaskCode());
        cntAppendixJobDTO.setWorkItemCode(this.getWorkItemCode());
        return cntAppendixJobDTO;

    }
}
