package com.viettel.coms.dto;

import java.util.Date;
import java.util.List;

import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import com.viettel.erp.utils.JsonDateDeserializer;
import com.viettel.erp.utils.JsonDateSerializerDate;

public class ConstructionDetailDTO extends ConstructionDTO {
	/**
	 *
	 */
	private static final long serialVersionUID = 1L;
	private List<String> listStatus;
	private List<String> listCatConstructionType;
	private List<String> obstructedStateList;
	// chinhpxn20180620
	private List<ConstructionReturnDTO> listConstructionReturn;
	// chinhpxn20180620
	private List<WorkItemDetailDTO> listWorkItem;
	private List<StockTransGeneralDTO> listSynStockTrans;
	private List<StockTransGeneralDTO> listStockTrans;
	private List<ConstructionTaskDetailDTO> listConsTask;
	private List<ConstructionMerchandiseDTO> listTP;
	private ConstructionAcceptanceCertDTO certDTO;
	private String catContructionTypeName;
	private String statuVuong;
	private Long catContructionTypeId;
	private Long constructionTaskId;
	// private Long catStationId;
	private String catStationCode;
	private String sysGroupName;
	private String workItemCodeorType;
	private String catProvince;
	private Long constructionId;
	private String constructionCode;
	//HuyPQ-start
	@JsonSerialize(using = JsonDateSerializerDate.class)
	@JsonDeserialize(using = JsonDateDeserializer.class)
	private Date dateFrom;
	@JsonSerialize(using = JsonDateSerializerDate.class)
	@JsonDeserialize(using = JsonDateDeserializer.class)
	private Date dateTo;
	
	private List<ConstructionDetailDTO> lstDataDetailCheck;
	
	public List<ConstructionDetailDTO> getLstDataDetailCheck() {
		return lstDataDetailCheck;
	}

	public void setLstDataDetailCheck(List<ConstructionDetailDTO> lstDataDetailCheck) {
		this.lstDataDetailCheck = lstDataDetailCheck;
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
	private String maVttb;
	private String tenVttb;
	private String donViTinh;
	private Double slXuat;
	private Double slNghiemThu;
	private Double slThuHoi;
	private Double slConLai;
	private List<ConstructionDetailDTO> listDataVTA;
	private List<ConstructionDetailDTO> listDataTBA;
	private List<ConstructionDetailDTO> listDataVTB;
	private List<ConstructionDetailDTO> listDataTBB;
	private String serial;
	private Double tongSlNghiemThu;
	private Double merchandiseQuantity;
	private Long workItemId;
	private List<Long> listWorkItemId;
	private Long constructionMerchandiseId;
    private String goodsName;
    private String goodsCode;
    private String goodsUnitName;
    private String merchanType;
    private Long goodsId;
    private Long merEntityId;
    private Double remainCount;
    private String goodsIsSerial;
    private String serialMerchan;
    private List<ConstructionDetailDTO> listDataMerchandise;
    private Long synStockTransId;
    private Long synStockTransDetailId;
    private List<WorkItemDTO> listDataWorkItem;
    private List<WorkItemDTO> listDataWorkItemTBB;
    private List<ConstructionDetailDTO> listDataMerchandiseTBB;
    private List<ConstructionDetailDTO> listDataMerByGoodsId;
    private String text;
    
    
	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public List<ConstructionDetailDTO> getListDataMerByGoodsId() {
		return listDataMerByGoodsId;
	}

	public void setListDataMerByGoodsId(List<ConstructionDetailDTO> listDataMerByGoodsId) {
		this.listDataMerByGoodsId = listDataMerByGoodsId;
	}

	public List<ConstructionDetailDTO> getListDataMerchandiseTBB() {
		return listDataMerchandiseTBB;
	}

	public void setListDataMerchandiseTBB(List<ConstructionDetailDTO> listDataMerchandiseTBB) {
		this.listDataMerchandiseTBB = listDataMerchandiseTBB;
	}

	public List<WorkItemDTO> getListDataWorkItemTBB() {
		return listDataWorkItemTBB;
	}

	public void setListDataWorkItemTBB(List<WorkItemDTO> listDataWorkItemTBB) {
		this.listDataWorkItemTBB = listDataWorkItemTBB;
	}

	public List<WorkItemDTO> getListDataWorkItem() {
		return listDataWorkItem;
	}

	public void setListDataWorkItem(List<WorkItemDTO> listDataWorkItem) {
		this.listDataWorkItem = listDataWorkItem;
	}

	public Long getSynStockTransId() {
		return synStockTransId;
	}

	public void setSynStockTransId(Long synStockTransId) {
		this.synStockTransId = synStockTransId;
	}

	public Long getSynStockTransDetailId() {
		return synStockTransDetailId;
	}

	public void setSynStockTransDetailId(Long synStockTransDetailId) {
		this.synStockTransDetailId = synStockTransDetailId;
	}

	public List<ConstructionDetailDTO> getListDataVTB() {
		return listDataVTB;
	}

	public void setListDataVTB(List<ConstructionDetailDTO> listDataVTB) {
		this.listDataVTB = listDataVTB;
	}

	public List<ConstructionDetailDTO> getListDataTBB() {
		return listDataTBB;
	}

	public void setListDataTBB(List<ConstructionDetailDTO> listDataTBB) {
		this.listDataTBB = listDataTBB;
	}

	public List<ConstructionDetailDTO> getListDataMerchandise() {
		return listDataMerchandise;
	}

	public void setListDataMerchandise(List<ConstructionDetailDTO> listDataMerchandise) {
		this.listDataMerchandise = listDataMerchandise;
	}

	public String getMerchanType() {
		return merchanType;
	}

	public void setMerchanType(String merchanType) {
		this.merchanType = merchanType;
	}

	public String getSerialMerchan() {
		return serialMerchan;
	}

	public void setSerialMerchan(String serialMerchan) {
		this.serialMerchan = serialMerchan;
	}

	public String getGoodsName() {
		return goodsName;
	}

	public void setGoodsName(String goodsName) {
		this.goodsName = goodsName;
	}

	public String getGoodsCode() {
		return goodsCode;
	}

	public void setGoodsCode(String goodsCode) {
		this.goodsCode = goodsCode;
	}

	public String getGoodsUnitName() {
		return goodsUnitName;
	}

	public void setGoodsUnitName(String goodsUnitName) {
		this.goodsUnitName = goodsUnitName;
	}

	public Long getGoodsId() {
		return goodsId;
	}

	public void setGoodsId(Long goodsId) {
		this.goodsId = goodsId;
	}

	public Long getMerEntityId() {
		return merEntityId;
	}

	public void setMerEntityId(Long merEntityId) {
		this.merEntityId = merEntityId;
	}

	public Double getRemainCount() {
		return remainCount;
	}

	public void setRemainCount(Double remainCount) {
		this.remainCount = remainCount;
	}

	public String getGoodsIsSerial() {
		return goodsIsSerial;
	}

	public void setGoodsIsSerial(String goodsIsSerial) {
		this.goodsIsSerial = goodsIsSerial;
	}

	public List<Long> getListWorkItemId() {
		return listWorkItemId;
	}

	public void setListWorkItemId(List<Long> listWorkItemId) {
		this.listWorkItemId = listWorkItemId;
	}

	public Long getConstructionMerchandiseId() {
		return constructionMerchandiseId;
	}

	public void setConstructionMerchandiseId(Long constructionMerchandiseId) {
		this.constructionMerchandiseId = constructionMerchandiseId;
	}

	public Double getMerchandiseQuantity() {
		return merchandiseQuantity;
	}

	public void setMerchandiseQuantity(Double merchandiseQuantity) {
		this.merchandiseQuantity = merchandiseQuantity;
	}

	public Long getWorkItemId() {
		return workItemId;
	}

	public void setWorkItemId(Long workItemId) {
		this.workItemId = workItemId;
	}

	public String getSerial() {
		return serial;
	}

	public void setSerial(String serial) {
		this.serial = serial;
	}

	public List<ConstructionDetailDTO> getListDataVTA() {
		return listDataVTA;
	}

	public void setListDataVTA(List<ConstructionDetailDTO> listDataVTA) {
		this.listDataVTA = listDataVTA;
	}

	public List<ConstructionDetailDTO> getListDataTBA() {
		return listDataTBA;
	}

	public void setListDataTBA(List<ConstructionDetailDTO> listDataTBA) {
		this.listDataTBA = listDataTBA;
	}

	public String getMaVttb() {
		return maVttb;
	}

	public void setMaVttb(String maVttb) {
		this.maVttb = maVttb;
	}

	public String getTenVttb() {
		return tenVttb;
	}

	public void setTenVttb(String tenVttb) {
		this.tenVttb = tenVttb;
	}

	public String getDonViTinh() {
		return donViTinh;
	}

	public void setDonViTinh(String donViTinh) {
		this.donViTinh = donViTinh;
	}

	
	public Double getSlXuat() {
		return slXuat;
	}

	public void setSlXuat(Double slXuat) {
		this.slXuat = slXuat;
	}

	public Double getSlNghiemThu() {
		return slNghiemThu;
	}

	public void setSlNghiemThu(Double slNghiemThu) {
		this.slNghiemThu = slNghiemThu;
	}

	public Double getSlThuHoi() {
		return slThuHoi;
	}

	public void setSlThuHoi(Double slThuHoi) {
		this.slThuHoi = slThuHoi;
	}

	public Double getSlConLai() {
		return slConLai;
	}

	public void setSlConLai(Double slConLai) {
		this.slConLai = slConLai;
	}

	public Double getTongSlNghiemThu() {
		return tongSlNghiemThu;
	}

	public void setTongSlNghiemThu(Double tongSlNghiemThu) {
		this.tongSlNghiemThu = tongSlNghiemThu;
	}
	//HuyPQ-end
	//	hoanm1_20181220_start
	private String valueComplete;
	
	public String getValueComplete() {
		return valueComplete;
	}

	public void setValueComplete(String valueComplete) {
		this.valueComplete = valueComplete;
	}
//	hoanm1_20181220_end
	// TungTT_20181129 start
//	private String sysUserId;
	private Date completeUpdateDate;
	private Long rpHshcId;
	private Long completeUserUpdate;
	// private Date
    //VietNT_20190122_start
    private Long catStationHouseId;

    public Long getCatStationHouseId() {
        return catStationHouseId;
    }

    public void setCatStationHouseId(Long catStationHouseId) {
        this.catStationHouseId = catStationHouseId;
    }

    //VietNT_end

    //VietNT_20190105_start
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date receivedDate;
    private Long assignHandoverId;
    private Long isDesign;
    private Long objectId;
    private Long cntContractId;

    public Date getReceivedDate() {
        return receivedDate;
    }

    public void setReceivedDate(Date receivedDate) {
        this.receivedDate = receivedDate;
    }

    public Long getObjectId() {
        return objectId;
    }

    public void setObjectId(Long objectId) {
        this.objectId = objectId;
    }

    public Long getCntContractId() {
        return cntContractId;
    }

    public void setCntContractId(Long cntContractId) {
        this.cntContractId = cntContractId;
    }

    public Long getIsDesign() {
        return isDesign;
    }

    public void setIsDesign(Long isDesign) {
        this.isDesign = isDesign;
    }

    public Long getAssignHandoverId() {
        return assignHandoverId;
    }

    public void setAssignHandoverId(Long assignHandoverId) {
        this.assignHandoverId = assignHandoverId;
    }
    //VietNT_end

	public Long getRpHshcId() {
		return rpHshcId;
	}

	public Long getCompleteUserUpdate() {
		return completeUserUpdate;
	}

	public void setCompleteUserUpdate(Long completeUserUpdate) {
		this.completeUserUpdate = completeUserUpdate;
	}

	public void setRpHshcId(Long rpHshcId) {
		this.rpHshcId = rpHshcId;
	}

	public Date getCompleteUpdateDate() {
		return completeUpdateDate;
	}

	public void setCompleteUpdateDate(Date completeUpdateDate) {
		this.completeUpdateDate = completeUpdateDate;
	}

//	public String getSysUserId() {
//		return sysUserId;
//	}
//
//	public void setSysUserId(String sysUserId) {
//		this.sysUserId = sysUserId;
//	}

	// TungTT_20181129 end
	private List<String> constructionCodeLst;

    
    
    public List<String> getConstructionCodeLst() {
		return constructionCodeLst;
	}

	public void setConstructionCodeLst(List<String> constructionCodeLst) {
		this.constructionCodeLst = constructionCodeLst;
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


    private Long catProvinceId;
    private String catProvinceCode;
    private String catProvinceName;
//    //HuyPq-start
//    private String sysGroupId;
//
//	public String getSysGroupId() {
//		return sysGroupId;
//	}
//
//	public void setSysGroupId(String sysGroupId) {
//		this.sysGroupId = sysGroupId;
//	}
//
//	//HuyPQ-end
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

    private String description;

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    // chinhpxn20180630_start
    private Long taskType;
    // chinhpxn20180630_end

    // chinhpxn20180620
    public List<ConstructionReturnDTO> getListConstructionReturn() {
        return listConstructionReturn;
    }

    public void setListConstructionReturn(List<ConstructionReturnDTO> listConstructionReturn) {
        this.listConstructionReturn = listConstructionReturn;
    }
    // chinhpxn20180620

    // chinhpxn20180630_start
    public Long getTaskType() {
        return taskType;
    }

    public void setTaskType(Long taskType) {
        this.taskType = taskType;
    }
    // chinhpxn20180630_end

    //	hungnx_06062018_start
    private String catStationHouseCode;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date startingDateFrom;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date startingDateTo;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date completeDateFrom;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date completeDateTo;
    private List<String> stationCodeLst;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date groundPlanDate;
    private String quantityByDate;
    private Integer countTaskDailyConfirmed;
    //	hungnx_08062018_end
    private String cntContractCode;
    private List<StockTransGeneralDTO> listDsvtDto;
    private ConstructionMerchandiseDTO merchandiseDto;
    private List<ConstructionMerchandiseDTO> listDSTP;
    private List<StockTransGeneralDTO> listDSVTBB;
    private Double consAppRevenueValue;

    private String requestGroupName;
    private Long requestGroupId;
    private String receiveGroupName;
    private Long receiveGroupId;

   
    public String getReceiveGroupName() {
        return receiveGroupName;
    }

    public void setReceiveGroupName(String receiveGroupName) {
        this.receiveGroupName = receiveGroupName;
    }

    public Long getReceiveGroupId() {
        return receiveGroupId;
    }

    public void setReceiveGroupId(Long receiveGroupId) {
        this.receiveGroupId = receiveGroupId;
    }

    public String getRequestGroupName() {
        return requestGroupName;
    }

    public void setRequestGroupName(String requestGroupName) {
        this.requestGroupName = requestGroupName;
    }

    public Long getRequestGroupId() {
        return requestGroupId;
    }

    public void setRequestGroupId(Long requestGroupId) {
        this.requestGroupId = requestGroupId;
    }

    private String Lstatus;
    private String Lstatus1;

    public Double getConsAppRevenueValue() {
        return consAppRevenueValue;
    }

    public void setConsAppRevenueValue(Double consAppRevenueValue) {
        this.consAppRevenueValue = consAppRevenueValue;
    }

    public List<ConstructionMerchandiseDTO> getListTP() {
        return listTP;
    }

    public void setListTP(List<ConstructionMerchandiseDTO> listTP) {
        this.listTP = listTP;
    }

    public String getStatuVuong() {
        return statuVuong;
    }

    public void setStatuVuong(String statuVuong) {
        this.statuVuong = statuVuong;
    }

    public static long getSerialversionuid() {
        return serialVersionUID;
    }

    public String getDirectorName() {
        return directorName;
    }

    public void setDirectorName(String directorName) {
        this.directorName = directorName;
    }

    public String getSupervisorName() {
        return supervisorName;
    }

    public void setSupervisorName(String supervisorName) {
        this.supervisorName = supervisorName;
    }

    private String directorName;
    private String supervisorName;

    public List<ConstructionTaskDetailDTO> getListConsTask() {
        return listConsTask;
    }

    public void setListConsTask(List<ConstructionTaskDetailDTO> listConsTask) {
        this.listConsTask = listConsTask;
    }

    public Long getConstructionTaskId() {
        return constructionTaskId;
    }

    public void setConstructionTaskId(Long constructionTaskId) {
        this.constructionTaskId = constructionTaskId;
    }

    public String getSysGroupName() {
        return sysGroupName;
    }

    public void setSysGroupName(String sysGroupName) {
        this.sysGroupName = sysGroupName;

    }

    public String getCatProvince() {
        return catProvince;
    }

    public void setCatProvince(String catProvince) {
        this.catProvince = catProvince;
    }

    public Long getCatContructionTypeId() {
        return catContructionTypeId;
    }

    public void setCatContructionTypeId(Long catContructionTypeId) {
        this.catContructionTypeId = catContructionTypeId;
    }

    List<UtilAttachDocumentDTO> listFileVuong;
    List<UtilAttachDocumentDTO> listFileBGMB;
    List<UtilAttachDocumentDTO> listFileStart;
    List<UtilAttachDocumentDTO> listFileMerchandise;
    List<UtilAttachDocumentDTO> listFileHSHC;
    List<UtilAttachDocumentDTO> listFileDT;
    //nhantv 25092018 begin
    List<UtilAttachDocumentDTO> listFileConstrLicence;
    List<UtilAttachDocumentDTO> listFileConstrDesign;
    //nhantv 25092018 end
    private String cntContract;
    private String provinceCode;
    private String provinceName;
    private String catConstructionTypeCode;
    private Double quantity;
    private Double workItemQuantity;
    private String workItemName;
    private String workItemStatus;
    private String workItemCode;

    public Double getWorkItemQuantity() {
        return workItemQuantity;
    }

    public void setWorkItemQuantity(Double workItemQuantity) {
        this.workItemQuantity = workItemQuantity;
    }

    public String getWorkItemName() {
        return workItemName;
    }

    public void setWorkItemName(String workItemName) {
        this.workItemName = workItemName;
    }

    public String getWorkItemStatus() {
        return workItemStatus;
    }

    public void setWorkItemStatus(String workItemStatus) {
        this.workItemStatus = workItemStatus;
    }

    public String getWorkItemCode() {
        return workItemCode;
    }

    public void setWorkItemCode(String workItemCode) {
        this.workItemCode = workItemCode;
    }

    public String getCntContractCode() {
        return cntContractCode;
    }

    public void setCntContractCode(String cntContractCode) {
        this.cntContractCode = cntContractCode;
    }

    public List<StockTransGeneralDTO> getListSynStockTrans() {
        return listSynStockTrans;
    }

    public void setListSynStockTrans(List<StockTransGeneralDTO> listSynStockTrans) {
        this.listSynStockTrans = listSynStockTrans;
    }

    public List<StockTransGeneralDTO> getListStockTrans() {
        return listStockTrans;
    }

    public void setListStockTrans(List<StockTransGeneralDTO> listStockTrans) {
        this.listStockTrans = listStockTrans;
    }

    public ConstructionAcceptanceCertDTO getCertDTO() {
        return certDTO;
    }

    public void setCertDTO(ConstructionAcceptanceCertDTO certDTO) {
        this.certDTO = certDTO;
    }

    public String getProvinceName() {
        return provinceName;
    }

    public void setProvinceName(String provinceName) {
        this.provinceName = provinceName;
    }

    public Double getQuantity() {
        return quantity;
    }

    public void setQuantity(Double quantity) {
        this.quantity = quantity;
    }

    public String getCatConstructionTypeCode() {
        return catConstructionTypeCode;
    }

    public void setCatConstructionTypeCode(String catConstructionTypeCode) {
        this.catConstructionTypeCode = catConstructionTypeCode;
    }

    public String getProvinceCode() {
        return provinceCode;
    }

    public void setProvinceCode(String provinceCode) {
        this.provinceCode = provinceCode;
    }

    public String getCntContract() {
        return cntContract;
    }

    public void setCntContract(String cntContract) {
        this.cntContract = cntContract;
    }

    public List<WorkItemDetailDTO> getListWorkItem() {
        return listWorkItem;
    }

    public void setListWorkItem(List<WorkItemDetailDTO> listWorkItem) {
        this.listWorkItem = listWorkItem;
    }

    public List<UtilAttachDocumentDTO> getListFileMerchandise() {
        return listFileMerchandise;
    }

    public void setListFileMerchandise(List<UtilAttachDocumentDTO> listFileMerchandise) {
        this.listFileMerchandise = listFileMerchandise;
    }

    public List<UtilAttachDocumentDTO> getListFileVuong() {
        return listFileVuong;
    }

    public void setListFileVuong(List<UtilAttachDocumentDTO> listFileVuong) {
        this.listFileVuong = listFileVuong;
    }

    public List<UtilAttachDocumentDTO> getListFileBGMB() {
        return listFileBGMB;
    }

    public void setListFileBGMB(List<UtilAttachDocumentDTO> listFileBGMB) {
        this.listFileBGMB = listFileBGMB;
    }

    public List<UtilAttachDocumentDTO> getListFileDT() {
        return listFileDT;
    }

    public void setListFileDT(List<UtilAttachDocumentDTO> listFileDT) {
        this.listFileDT = listFileDT;
    }

    public List<UtilAttachDocumentDTO> getListFileHSHC() {
        return listFileHSHC;
    }

    public void setListFileHSHC(List<UtilAttachDocumentDTO> listFileHSHC) {
        this.listFileHSHC = listFileHSHC;
    }

    public List<UtilAttachDocumentDTO> getListFileStart() {
        return listFileStart;
    }

    public void setListFileStart(List<UtilAttachDocumentDTO> listFileStart) {
        this.listFileStart = listFileStart;
    }

    public String getCatContructionTypeName() {
        return catContructionTypeName;
    }

    public void setCatContructionTypeName(String catContructionTypeName) {
        this.catContructionTypeName = catContructionTypeName;
    }

    public String getCatStationCode() {
        return catStationCode;
    }

    public void setCatStationCode(String catStationCode) {
        this.catStationCode = catStationCode;
    }

    public List<String> getListStatus() {
        return listStatus;
    }

    public void setListStatus(List<String> listStatus) {
        this.listStatus = listStatus;
    }

    public List<String> getListCatConstructionType() {
        return listCatConstructionType;
    }

    public void setListCatConstructionType(List<String> listCatConstructionType) {
        this.listCatConstructionType = listCatConstructionType;
    }

    public List<String> getObstructedStateList() {
        return obstructedStateList;
    }

    public void setObstructedStateList(List<String> obstructedState) {
        this.obstructedStateList = obstructedState;
    }

    public String getWorkItemCodeorType() {
        return workItemCodeorType;
    }

    public void setWorkItemCodeorType(String workItemCodeorType) {
        this.workItemCodeorType = workItemCodeorType;
    }

    public List<StockTransGeneralDTO> getListDsvtDto() {
        return listDsvtDto;
    }

    public void setListDsvtDto(List<StockTransGeneralDTO> listDsvtDto) {
        this.listDsvtDto = listDsvtDto;
    }

    public ConstructionMerchandiseDTO getMerchandiseDto() {
        return merchandiseDto;
    }

    public void setMerchandiseDto(ConstructionMerchandiseDTO merchandiseDto) {
        this.merchandiseDto = merchandiseDto;
    }

    public List<ConstructionMerchandiseDTO> getListDSTP() {
        return listDSTP;
    }

    public void setListDSTP(List<ConstructionMerchandiseDTO> listDSTP) {
        this.listDSTP = listDSTP;
    }

    public List<StockTransGeneralDTO> getListDSVTBB() {
        return listDSVTBB;
    }

    public void setListDSVTBB(List<StockTransGeneralDTO> listDSVTBB) {
        this.listDSVTBB = listDSVTBB;
    }

    public String getLstatus() {
        return Lstatus;
    }

    public void setLstatus(String lstatus) {
        Lstatus = lstatus;
    }

    public String getLstatus1() {
        return Lstatus1;
    }

    public void setLstatus1(String lstatus1) {
        Lstatus1 = lstatus1;
    }

    public String getCatStationHouseCode() {
        return catStationHouseCode;
    }

    public void setCatStationHouseCode(String catStationHouseCode) {
        this.catStationHouseCode = catStationHouseCode;
    }

    public Date getStartingDateFrom() {
        return startingDateFrom;
    }

    public void setStartingDateFrom(Date startingDateFrom) {
        this.startingDateFrom = startingDateFrom;
    }

    public Date getStartingDateTo() {
        return startingDateTo;
    }

    public void setStartingDateTo(Date startingDateTo) {
        this.startingDateTo = startingDateTo;
    }

    public Date getCompleteDateFrom() {
        return completeDateFrom;
    }

    public void setCompleteDateFrom(Date completeDateFrom) {
        this.completeDateFrom = completeDateFrom;
    }

    public Date getCompleteDateTo() {
        return completeDateTo;
    }

    public void setCompleteDateTo(Date completeDateTo) {
        this.completeDateTo = completeDateTo;
    }

    public List<String> getStationCodeLst() {
        return stationCodeLst;
    }

    public void setStationCodeLst(List<String> stationCodeLst) {
        this.stationCodeLst = stationCodeLst;
    }

    public Date getGroundPlanDate() {
        return groundPlanDate;
    }

    public void setGroundPlanDate(Date groundPlanDate) {
        this.groundPlanDate = groundPlanDate;
    }

    public String getQuantityByDate() {
        return quantityByDate;
    }

    public void setQuantityByDate(String quantityByDate) {
        this.quantityByDate = quantityByDate;
    }

    public Integer getCountTaskDailyConfirmed() {
        return countTaskDailyConfirmed;
    }

    public void setCountTaskDailyConfirmed(Integer countTaskDailyConfirmed) {
        this.countTaskDailyConfirmed = countTaskDailyConfirmed;
    }

	public List<UtilAttachDocumentDTO> getListFileConstrLicence() {
		return listFileConstrLicence;
	}

	public void setListFileConstrLicence(
			List<UtilAttachDocumentDTO> listFileConstrLicence) {
		this.listFileConstrLicence = listFileConstrLicence;
	}

	public List<UtilAttachDocumentDTO> getListFileConstrDesign() {
		return listFileConstrDesign;
	}

	public void setListFileConstrDesign(
			List<UtilAttachDocumentDTO> listFileConstrDesign) {
		this.listFileConstrDesign = listFileConstrDesign;
	}

//	public Long getCatStationId() {
//		return catStationId;
//	}
//
//	public void setCatStationId(Long catStationId) {
//		this.catStationId = catStationId;
//	}
	
}
