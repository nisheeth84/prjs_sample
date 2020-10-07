package com.viettel.coms.bo;

import com.viettel.coms.dto.AssignHandoverDTO;
import com.viettel.service.base.dto.BaseFWDTOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.Date;

//VietNT_20181210_created
@Entity
@Table(name = "ASSIGN_HANDOVER")
public class AssignHandoverBO extends BaseFWModelImpl {

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @org.hibernate.annotations.Parameter(name = "sequence", value = "ASSIGN_HANDOVER_SEQ")})
    @Column(name = "ASSIGN_HANDOVER_ID", length = 11)
    private Long assignHandoverId;

    @Column(name = "SYS_GROUP_ID", length = 11)
    private Long sysGroupId;

    @Column(name = "SYS_GROUP_CODE", length = 50)
    private String sysGroupCode;

    @Column(name = "SYS_GROUP_NAME", length = 50)
    private String sysGroupName;

    @Column(name = "CAT_PROVINCE_ID", length = 10)
    private Long catProvinceId;

    @Column(name = "CAT_PROVINCE_CODE", length = 50)
    private String catProvinceCode;

    @Column(name = "CAT_STATION_HOUSE_ID", length = 10)
    private Long catStationHouseId;

    @Column(name = "CAT_STATION_HOUSE_CODE", length = 50)
    private String catStationHouseCode;

    @Column(name = "CAT_STATION_ID", length = 10)
    private Long catStationId;

    @Column(name = "CAT_STATION_CODE", length = 50)
    private String catStationCode;

    @Column(name = "CONSTRUCTION_ID", length = 10)
    private Long constructionId;

    @Column(name = "CONSTRUCTION_CODE", length = 50)
    private String constructionCode;

    @Column(name = "CNT_CONTRACT_ID", length = 10)
    private Long cntContractId;

    @Column(name = "CNT_CONTRACT_CODE", length = 50)
    private String cntContractCode;

    @Column(name = "IS_DESIGN", length = 2)
    private Long isDesign;

    @Column(name = "COMPANY_ASSIGN_DATE", length = 22)
    private Date companyAssignDate;

    @Column(name = "CREATE_DATE", length = 22)
    private Date createDate;

    @Column(name = "CREATE_USER_ID", length = 10)
    private Long createUserId;

    @Column(name = "UPDATE_DATE", length = 22)
    private Date updateDate;

    @Column(name = "UPDATE_USER_ID", length = 10)
    private Long updateUserId;

    @Column(name = "STATUS", length = 2)
    private Long status;

    @Column(name = "PERFORMENT_ID", length = 10)
    private Long performentId;

    //VietNT_20181220_start
//    @Column(name = "EMAIL", length = 50)
//    private String email;
    //VietNT_end

    @Column(name = "DEPARTMENT_ASSIGN_DATE", length = 22)
    private Date departmentAssignDate;

    @Column(name = "RECEIVED_STATUS", length = 2)
    private Long receivedStatus;

    @Column(name = "OUT_OF_DATE_RECEIVED", length = 10)
    private Long outOfDateReceived;

    @Column(name = "OUT_OF_DATE_START_DATE", length = 10)
    private Long outOfDateStartDate;

    @Column(name = "RECEIVED_OBSTRUCT_DATE", length = 22)
    private Date receivedObstructDate;

    @Column(name = "RECEIVED_OBSTRUCT_CONTENT", length = 20)
    private String receivedObstructContent;

    @Column(name = "RECEIVED_GOODS_DATE", length = 22)
    private Date receivedGoodsDate;

    @Column(name = "RECEIVED_GOODS_CONTENT", length = 20)
    private String receivedGoodsContent;

    @Column(name = "RECEIVED_DATE", length = 22)
    private Date receivedDate;

    @Column(name = "DELIVERY_CONSTRUCTION_DATE", length = 22)
    private Date deliveryConstructionDate;

    @Column(name = "PERFORMENT_CONSTRUCTION_ID", length = 10)
    private Long performentConstructionId;

    @Column(name = "PERFORMENT_CONSTRUCTION_NAME", length = 50)
    private String performentConstructionName;

    @Column(name = "SUPERVISOR_CONSTRUCTION_ID", length = 10)
    private Long supervisorConstructionId;

    @Column(name = "SUPERVISOR_CONSTRUCTION_NAME", length = 50)
    private String supervisorConstructionName;

    @Column(name = "STARTING_DATE", length = 22)
    private Date startingDate;

    @Column(name = "CONSTRUCTION_STATUS", length = 2)
    private Long constructionStatus;

    @Column(name = "COLUMN_HEIGHT", length = 10)
    private Long columnHeight;

    @Column(name = "STATION_TYPE", length = 2)
    private Long stationType;

    @Column(name = "NUMBER_CO", length = 2)
    private Long numberCo;

    @Column(name = "HOUSE_TYPE_ID", length = 10)
    private Long houseTypeId;

    @Column(name = "HOUSE_TYPE_NAME", length = 20)
    private String houseTypeName;

    @Column(name = "GROUNDING_TYPE_ID", length = 10)
    private Long groundingTypeId;

    @Column(name = "GROUNDING_TYPE_NAME", length = 20)
    private String groundingTypeName;

    @Column(name = "HAVE_WORK_ITEM_NAME", length = 20)
    private String haveWorkItemName;

    @Column(name = "IS_FENCE", length = 2)
    private Long isFence;

    @Column(name = "OUT_OF_DATE_CONSTRUCTION", length = 2)
    private Long outOfDateConstruction;

    @Column(name = "PARTNER_NAME", length = 50)
    private String partnerName;

    @Override
    public AssignHandoverDTO toDTO() {
        AssignHandoverDTO dto = new AssignHandoverDTO();
        dto.setAssignHandoverId(this.getAssignHandoverId());
        dto.setSysGroupId(this.getSysGroupId());
        dto.setSysGroupCode(this.getSysGroupCode());
        dto.setCatProvinceId(this.getCatProvinceId());
        dto.setCatProvinceCode(this.getCatProvinceCode());
        dto.setCatStationHouseId(this.getCatStationHouseId());
        dto.setCatStationHouseCode(this.getCatStationHouseCode());
        dto.setCatStationId(this.getCatStationId());
        dto.setCatStationCode(this.getCatStationCode());
        dto.setConstructionId(this.getConstructionId());
        dto.setConstructionCode(this.getConstructionCode());
        dto.setCntContractId(this.getCntContractId());
        dto.setCntContractCode(this.getCntContractCode());
        dto.setIsDesign(this.getIsDesign());
        dto.setCompanyAssignDate(this.getCompanyAssignDate());
        dto.setCreateDate(this.getCreateDate());
        dto.setCreateUserId(this.getCreateUserId());
        dto.setUpdateDate(this.getUpdateDate());
        dto.setUpdateUserId(this.getUpdateUserId());
        dto.setStatus(this.getStatus());
        dto.setPerformentId(this.getPerformentId());
        dto.setDepartmentAssignDate(this.getDepartmentAssignDate());
        dto.setReceivedStatus(this.getReceivedStatus());
        dto.setOutOfDateReceived(this.getOutOfDateReceived());
        dto.setOutOfDateStartDate(this.getOutOfDateStartDate());
        dto.setReceivedObstructDate(this.getReceivedObstructDate());
        dto.setReceivedObstructContent(this.getReceivedObstructContent());
        dto.setReceivedGoodsDate(this.getReceivedGoodsDate());
        dto.setReceivedGoodsContent(this.getReceivedGoodsContent());
        dto.setReceivedDate(this.getReceivedDate());
        dto.setDeliveryConstructionDate(this.getDeliveryConstructionDate());
        dto.setPerformentConstructionId(this.getPerformentConstructionId());
        dto.setPerformentConstructionName(this.getPerformentConstructionName());
        dto.setSupervisorConstructionId(this.getSupervisorConstructionId());
        dto.setSupervisorConstructionName(this.getSupervisorConstructionName());
        dto.setStartingDate(this.getStartingDate());
        dto.setConstructionStatus(this.getConstructionStatus());
        dto.setColumnHeight(this.getColumnHeight());
        dto.setStationType(this.getStationType());
        dto.setNumberCo(this.getNumberCo());
        dto.setHouseTypeId(this.getHouseTypeId());
        dto.setHouseTypeName(this.getHouseTypeName());
        dto.setGroundingTypeId(this.getGroundingTypeId());
        dto.setGroundingTypeName(this.getGroundingTypeName());
        dto.setHaveWorkItemName(this.getHaveWorkItemName());
        dto.setIsFence(this.getIsFence());
        dto.setSysGroupName(this.getSysGroupName());
        dto.setPartnerName(this.getPartnerName());
        //VietNT_20181220_start
//        dto.setEmail(this.getEmail());
        //VietNT_end
        dto.setOutOfDateConstruction(this.getOutOfDateConstruction());
        return dto;
    }

    public String getPartnerName() {
        return partnerName;
    }

    public void setPartnerName(String partnerName) {
        this.partnerName = partnerName;
    }

    public Long getOutOfDateConstruction() {
        return outOfDateConstruction;
    }

    public void setOutOfDateConstruction(Long outOfDateConstruction) {
        this.outOfDateConstruction = outOfDateConstruction;
    }

    public String getSysGroupName() {
        return sysGroupName;
    }


    public void setSysGroupName(String sysGroupName) {
        this.sysGroupName = sysGroupName;
    }

//VietNT_20181220_start
//    public String getEmail() {
//        return email;
//    }
//    public void setEmail(String email) {
//        this.email = email;
//    }
//VietNT_end


    public Long getAssignHandoverId() {
        return assignHandoverId;
    }

    public void setAssignHandoverId(Long assignHandoverId) {
        this.assignHandoverId = assignHandoverId;
    }

    public Long getSysGroupId() {
        return sysGroupId;
    }

    public void setSysGroupId(Long sysGroupId) {
        this.sysGroupId = sysGroupId;
    }

    public String getSysGroupCode() {
        return sysGroupCode;
    }

    public void setSysGroupCode(String sysGroupCode) {
        this.sysGroupCode = sysGroupCode;
    }

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

    public Long getCatStationHouseId() {
        return catStationHouseId;
    }

    public void setCatStationHouseId(Long catStationHouseId) {
        this.catStationHouseId = catStationHouseId;
    }

    public String getCatStationHouseCode() {
        return catStationHouseCode;
    }

    public void setCatStationHouseCode(String catStationHouseCode) {
        this.catStationHouseCode = catStationHouseCode;
    }

    public Long getCatStationId() {
        return catStationId;
    }

    public void setCatStationId(Long catStationId) {
        this.catStationId = catStationId;
    }

    public String getCatStationCode() {
        return catStationCode;
    }

    public void setCatStationCode(String catStationCode) {
        this.catStationCode = catStationCode;
    }

    public Long getConstructionId() {
        return constructionId;
    }

    public void setConstructionId(Long constructionId) {
        this.constructionId = constructionId;
    }

    public String getConstructionCode() {
        return constructionCode;
    }

    public void setConstructionCode(String constructionCode) {
        this.constructionCode = constructionCode;
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

    public Long getIsDesign() {
        return isDesign;
    }

    public void setIsDesign(Long isDesign) {
        this.isDesign = isDesign;
    }

    public Date getCompanyAssignDate() {
        return companyAssignDate;
    }

    public void setCompanyAssignDate(Date companyAssignDate) {
        this.companyAssignDate = companyAssignDate;
    }

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

    public Long getCreateUserId() {
        return createUserId;
    }

    public void setCreateUserId(Long createUserId) {
        this.createUserId = createUserId;
    }

    public Date getUpdateDate() {
        return updateDate;
    }

    public void setUpdateDate(Date updateDate) {
        this.updateDate = updateDate;
    }

    public Long getUpdateUserId() {
        return updateUserId;
    }

    public void setUpdateUserId(Long updateUserId) {
        this.updateUserId = updateUserId;
    }

    public Long getStatus() {
        return status;
    }

    public void setStatus(Long status) {
        this.status = status;
    }

    public Long getPerformentId() {
        return performentId;
    }

    public void setPerformentId(Long performentId) {
        this.performentId = performentId;
    }

    public Date getDepartmentAssignDate() {
        return departmentAssignDate;
    }

    public void setDepartmentAssignDate(Date departmentAssignDate) {
        this.departmentAssignDate = departmentAssignDate;
    }

    public Long getReceivedStatus() {
        return receivedStatus;
    }

    public void setReceivedStatus(Long receivedStatus) {
        this.receivedStatus = receivedStatus;
    }

    public Long getOutOfDateReceived() {
        return outOfDateReceived;
    }

    public void setOutOfDateReceived(Long outOfDateReceived) {
        this.outOfDateReceived = outOfDateReceived;
    }

    public Long getOutOfDateStartDate() {
        return outOfDateStartDate;
    }

    public void setOutOfDateStartDate(Long outOfDateStartDate) {
        this.outOfDateStartDate = outOfDateStartDate;
    }

    public Date getReceivedObstructDate() {
        return receivedObstructDate;
    }

    public void setReceivedObstructDate(Date receivedObstructDate) {
        this.receivedObstructDate = receivedObstructDate;
    }

    public String getReceivedObstructContent() {
        return receivedObstructContent;
    }

    public void setReceivedObstructContent(String receivedObstructContent) {
        this.receivedObstructContent = receivedObstructContent;
    }

    public Date getReceivedGoodsDate() {
        return receivedGoodsDate;
    }

    public void setReceivedGoodsDate(Date receivedGoodsDate) {
        this.receivedGoodsDate = receivedGoodsDate;
    }

    public String getReceivedGoodsContent() {
        return receivedGoodsContent;
    }

    public void setReceivedGoodsContent(String receivedGoodsContent) {
        this.receivedGoodsContent = receivedGoodsContent;
    }

    public Date getReceivedDate() {
        return receivedDate;
    }

    public void setReceivedDate(Date receivedDate) {
        this.receivedDate = receivedDate;
    }

    public Date getDeliveryConstructionDate() {
        return deliveryConstructionDate;
    }

    public void setDeliveryConstructionDate(Date deliveryConstructionDate) {
        this.deliveryConstructionDate = deliveryConstructionDate;
    }

    public Long getPerformentConstructionId() {
        return performentConstructionId;
    }

    public void setPerformentConstructionId(Long performentConstructionId) {
        this.performentConstructionId = performentConstructionId;
    }

    public String getPerformentConstructionName() {
        return performentConstructionName;
    }

    public void setPerformentConstructionName(String performentConstructionName) {
        this.performentConstructionName = performentConstructionName;
    }

    public Long getSupervisorConstructionId() {
        return supervisorConstructionId;
    }

    public void setSupervisorConstructionId(Long supervisorConstructionId) {
        this.supervisorConstructionId = supervisorConstructionId;
    }

    public String getSupervisorConstructionName() {
        return supervisorConstructionName;
    }

    public void setSupervisorConstructionName(String supervisorConstructionName) {
        this.supervisorConstructionName = supervisorConstructionName;
    }

    public Date getStartingDate() {
        return startingDate;
    }

    public void setStartingDate(Date startingDate) {
        this.startingDate = startingDate;
    }

    public Long getConstructionStatus() {
        return constructionStatus;
    }

    public void setConstructionStatus(Long constructionStatus) {
        this.constructionStatus = constructionStatus;
    }

    public Long getColumnHeight() {
        return columnHeight;
    }

    public void setColumnHeight(Long columnHeight) {
        this.columnHeight = columnHeight;
    }

    public Long getStationType() {
        return stationType;
    }

    public void setStationType(Long stationType) {
        this.stationType = stationType;
    }

    public Long getNumberCo() {
        return numberCo;
    }

    public void setNumberCo(Long numberCo) {
        this.numberCo = numberCo;
    }

    public Long getHouseTypeId() {
        return houseTypeId;
    }

    public void setHouseTypeId(Long houseTypeId) {
        this.houseTypeId = houseTypeId;
    }

    public String getHouseTypeName() {
        return houseTypeName;
    }

    public void setHouseTypeName(String houseTypeName) {
        this.houseTypeName = houseTypeName;
    }

    public Long getGroundingTypeId() {
        return groundingTypeId;
    }

    public void setGroundingTypeId(Long groundingTypeId) {
        this.groundingTypeId = groundingTypeId;
    }

    public String getGroundingTypeName() {
        return groundingTypeName;
    }

    public void setGroundingTypeName(String groundingTypeName) {
        this.groundingTypeName = groundingTypeName;
    }

    public String getHaveWorkItemName() {
        return haveWorkItemName;
    }

    public void setHaveWorkItemName(String haveWorkItemName) {
        this.haveWorkItemName = haveWorkItemName;
    }

    public Long getIsFence() {
        return isFence;
    }

    public void setIsFence(Long isFence) {
        this.isFence = isFence;
    }
}
