package com.viettel.coms.dto;

import java.util.Date;
import java.util.List;

import javax.xml.bind.annotation.XmlRootElement;

import com.viettel.erp.utils.JsonDateDeserializer;
import com.viettel.erp.utils.JsonDateSerializerDate;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import com.viettel.cat.dto.ConstructionImageInfo;
import com.viettel.coms.bo.AssignHandoverBO;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

//VietNT_20181210_created
@XmlRootElement(name = "ASSIGN_HANDOVERBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class AssignHandoverDTO extends ComsBaseFWDTO<AssignHandoverBO> {

    private Long assignHandoverId;

    private Long sysGroupId;

    private String sysGroupCode;

    private String sysGroupName;

    private Long catProvinceId;

    private String catProvinceCode;

    private Long catStationHouseId;

    private String catStationHouseCode;

    private Long catStationId;

    private String catStationCode;

    private Long constructionId;

    private String constructionCode;

    private Long cntContractId;

    private String cntContractCode;

    private Long isDesign;

    private Date companyAssignDate;

    private Date createDate;

    private Long createUserId;

    private Date updateDate;

    private Long updateUserId;

    private Long status;

    private Long performentId;

//VietNT_20181220_start
//    private String email;
//VietNT_end

    private Date departmentAssignDate;

    private Long receivedStatus;

    private Long outOfDateReceived;

    private Long outOfDateStartDate;

    private Date receivedObstructDate;

    private String receivedObstructContent;

    private Date receivedGoodsDate;

    private String receivedGoodsContent;

    private Date receivedDate;

    private Date deliveryConstructionDate;

    private Long performentConstructionId;

    private String performentConstructionName;

    private Long supervisorConstructionId;

    private String supervisorConstructionName;

    private Date startingDate;

    private Long constructionStatus;

    private Long columnHeight;

    private Long stationType;

    private Long numberCo;

    private Long houseTypeId;

    private String houseTypeName;

    private Long groundingTypeId;

    private String groundingTypeName;

    private String haveWorkItemName;

    private Long isFence;

    private String partnerName;

    //VietNT_20181218_start
    private Long outOfDateConstruction;
    //VietNT_end
    
    private List<UtilAttachDocumentDTO> utilAttachDocumentDTO;
    // dto only
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date dateFrom;

    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date dateTo;

    private List<String> listCatConstructionType;

    private UtilAttachDocumentDTO fileDesign;

    //VietNT_20181218_start
    // assignHandoverCN dto only
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date dateDeptFrom;

    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date dateDeptTo;

    private List<String> constructionCodeList;

    private List<Long> receivedStatusList;

    private List<Long> constructionStatusList;

    private boolean isReceivedObstruct;

    private boolean isReceivedGoods;

    private String email;

    private String phoneNumber;

    private String fullName;

    private List<Long> assignHandoverIdList;

    public String getPartnerName() {
        return partnerName;
    }

    public void setPartnerName(String partnerName) {
        this.partnerName = partnerName;
    }

    public List<Long> getAssignHandoverIdList() {
        return assignHandoverIdList;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public void setAssignHandoverIdList(List<Long> assignHandoverIdList) {
        this.assignHandoverIdList = assignHandoverIdList;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public boolean getIsReceivedObstruct() {
        return isReceivedObstruct;
    }

    public void setIsReceivedObstruct(boolean receivedObstruct) {
        isReceivedObstruct = receivedObstruct;
    }

    public boolean getIsReceivedGoods() {
        return isReceivedGoods;
    }

    public void setIsReceivedGoods(boolean receivedGoods) {
        isReceivedGoods = receivedGoods;
    }

    public Long getOutOfDateConstruction() {
        return outOfDateConstruction;
    }

    public void setOutOfDateConstruction(Long outOfDateConstruction) {
        this.outOfDateConstruction = outOfDateConstruction;
    }

    public Date getDateDeptFrom() {
        return dateDeptFrom;
    }

    public void setDateDeptFrom(Date dateDeptFrom) {
        this.dateDeptFrom = dateDeptFrom;
    }

    public Date getDateDeptTo() {
        return dateDeptTo;
    }

    public void setDateDeptTo(Date dateDeptTo) {
        this.dateDeptTo = dateDeptTo;
    }

    public List<String> getConstructionCodeList() {
        return constructionCodeList;
    }

    public void setConstructionCodeList(List<String> constructionCodeList) {
        this.constructionCodeList = constructionCodeList;
    }

    public List<Long> getReceivedStatusList() {
        return receivedStatusList;
    }

    public void setReceivedStatusList(List<Long> receivedStatusList) {
        this.receivedStatusList = receivedStatusList;
    }

    public List<Long> getConstructionStatusList() {
        return constructionStatusList;
    }

    public void setConstructionStatusList(List<Long> constructionStatusList) {
        this.constructionStatusList = constructionStatusList;
    }
    //VietNT_end

	String [] statusHandover;
	
	public String[] getStatusHandover() {
		return statusHandover;
	}

	public void setStatusHandover(String[] statusHandover) {
		this.statusHandover = statusHandover;
	}

    @Override
    public Long getFWModelId() {
        return this.getAssignHandoverId();
    }

    @Override
    public String catchName() {
        return this.getAssignHandoverId().toString();
    }

    @Override
    public AssignHandoverBO toModel() {
        AssignHandoverBO bo = new AssignHandoverBO();
        bo.setAssignHandoverId(this.getAssignHandoverId());
        bo.setSysGroupId(this.getSysGroupId());
        bo.setSysGroupCode(this.getSysGroupCode());
        bo.setCatProvinceId(this.getCatProvinceId());
        bo.setCatProvinceCode(this.getCatProvinceCode());
        bo.setCatStationHouseId(this.getCatStationHouseId());
        bo.setCatStationHouseCode(this.getCatStationHouseCode());
        bo.setCatStationId(this.getCatStationId());
        bo.setCatStationCode(this.getCatStationCode());
        bo.setConstructionId(this.getConstructionId());
        bo.setConstructionCode(this.getConstructionCode());
        bo.setCntContractId(this.getCntContractId());
        bo.setCntContractCode(this.getCntContractCode());
        bo.setIsDesign(this.getIsDesign());
        bo.setCompanyAssignDate(this.getCompanyAssignDate());
        bo.setCreateDate(this.getCreateDate());
        bo.setCreateUserId(this.getCreateUserId());
        bo.setUpdateDate(this.getUpdateDate());
        bo.setUpdateUserId(this.getUpdateUserId());
        bo.setStatus(this.getStatus());
        bo.setPerformentId(this.getPerformentId());
        bo.setDepartmentAssignDate(this.getDepartmentAssignDate());
        bo.setReceivedStatus(this.getReceivedStatus());
        bo.setOutOfDateReceived(this.getOutOfDateReceived());
        bo.setOutOfDateStartDate(this.getOutOfDateStartDate());
        bo.setReceivedObstructDate(this.getReceivedObstructDate());
        bo.setReceivedObstructContent(this.getReceivedObstructContent());
        bo.setReceivedGoodsDate(this.getReceivedGoodsDate());
        bo.setReceivedGoodsContent(this.getReceivedGoodsContent());
        bo.setReceivedDate(this.getReceivedDate());
        bo.setDeliveryConstructionDate(this.getDeliveryConstructionDate());
        bo.setPerformentConstructionId(this.getPerformentConstructionId());
        bo.setPerformentConstructionName(this.getPerformentConstructionName());
        bo.setSupervisorConstructionId(this.getSupervisorConstructionId());
        bo.setSupervisorConstructionName(this.getSupervisorConstructionName());
        bo.setStartingDate(this.getStartingDate());
        bo.setConstructionStatus(this.getConstructionStatus());
        bo.setColumnHeight(this.getColumnHeight());
        bo.setStationType(this.getStationType());
        bo.setNumberCo(this.getNumberCo());
        bo.setHouseTypeId(this.getHouseTypeId());
        bo.setHouseTypeName(this.getHouseTypeName());
        bo.setGroundingTypeId(this.getGroundingTypeId());
        bo.setGroundingTypeName(this.getGroundingTypeName());
        bo.setHaveWorkItemName(this.getHaveWorkItemName());
        bo.setIsFence(this.getIsFence());
        bo.setSysGroupName(this.getSysGroupName());
        //VietNT_20181220_start
//        bo.setEmail(this.getEmail());
        //VietNT_end
        bo.setOutOfDateConstruction(this.getOutOfDateConstruction());
        return bo;
    }

//    public String getFilePath() {
//        return filePath;
//    }
//
//    public void setFilePath(String filePath) {
//        this.filePath = filePath;
//    }

    public UtilAttachDocumentDTO getFileDesign() {
        return fileDesign;
    }

    public void setFileDesign(UtilAttachDocumentDTO fileDesign) {
        this.fileDesign = fileDesign;
    }

    public Date getDateFrom() {
        return dateFrom;
    }

    public void setDateFrom(Date dateFrom) {
        this.dateFrom = dateFrom;
    }

    public Date getDateTo() {
        return dateTo;
    }

    public void setDateTo(Date dateTo) {
        this.dateTo = dateTo;
    }

    public List<String> getListCatConstructionType() {
        return listCatConstructionType;
    }

    public void setListCatConstructionType(List<String> listCatConstructionType) {
        this.listCatConstructionType = listCatConstructionType;
    }

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

    public String getSysGroupName() {
        return sysGroupName;
    }

    public void setSysGroupName(String sysGroupName) {
        this.sysGroupName = sysGroupName;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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

	public List<UtilAttachDocumentDTO> getUtilAttachDocumentDTO() {
		return utilAttachDocumentDTO;
	}

	public void setUtilAttachDocumentDTO(
			List<UtilAttachDocumentDTO> utilAttachDocumentDTO) {
		this.utilAttachDocumentDTO = utilAttachDocumentDTO;
	}
    
	
	/**hoangnh start 16012019**/
	private List<ConstructionImageInfo> constructionImageInfo;
	private String isReceivedGoodsStr;
	private String isReceivedObstructStr;
	private String isFenceStr;
	private String isACStr;

	public String getIsACStr() {
	return isACStr;
	}
	public void setIsACStr(String isACStr) {
	this.isACStr = isACStr;
	}

	
	
	public String getIsReceivedGoodsStr() {
		return isReceivedGoodsStr;
	}

	public void setIsReceivedGoodsStr(String isReceivedGoodsStr) {
		this.isReceivedGoodsStr = isReceivedGoodsStr;
	}

	public String getIsReceivedObstructStr() {
		return isReceivedObstructStr;
	}

	public void setIsReceivedObstructStr(String isReceivedObstructStr) {
		this.isReceivedObstructStr = isReceivedObstructStr;
	}

	public String getIsFenceStr() {
		return isFenceStr;
	}

	public void setIsFenceStr(String isFenceStr) {
		this.isFenceStr = isFenceStr;
	}

	public List<ConstructionImageInfo> getConstructionImageInfo() {
		return constructionImageInfo;
	}

	public void setConstructionImageInfo(
			List<ConstructionImageInfo> constructionImageInfo) {
		this.constructionImageInfo = constructionImageInfo;
	}
	/**hoangnh end 16012019**/
    
}
