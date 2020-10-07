package com.viettel.coms.dto;

import com.viettel.erp.utils.JsonDateDeserializer;
import com.viettel.erp.utils.JsonDateSerializerDate;
import com.viettel.utils.CustomJsonDateDeserializer;
import com.viettel.utils.CustomJsonDateSerializer;

import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import java.util.Date;
import java.util.List;

public class ConstructionTaskDetailDTO extends ConstructionTaskDTO {

    private List<String> listStatus;
    private List<String> listCompleteState;
    private List<Long> ListConstructionId;
    private List<Long> listDetailMonthPlanId;
    private List<String> monthList;
    private String catStationCode;
    private String approveUserName;
	private Long typeHSHC;
//    hoanm1_20181219_start
    private String dateCompleteTC;
    
    public String getDateCompleteTC() {
		return dateCompleteTC;
	}
	public void setDateCompleteTC(String dateCompleteTC) {
		this.dateCompleteTC = dateCompleteTC;
	}
//	hoanm1_20181219_end
	//    hoanm1_20181215_start
    private Double totalPlanQuantity;
    
	public Double getTotalPlanQuantity() {
		return totalPlanQuantity;
	}
//	hoanm1_20181215_end
	public void setTotalPlanQuantity(Double totalPlanQuantity) {
		this.totalPlanQuantity = totalPlanQuantity;
	}

	//    hoanm1_20181203_start
    private String catStationHouseCode; 
    private String approceCompleteDescription ;
    public String getCatStationHouseCode() {
		return catStationHouseCode;
	}

	public void setCatStationHouseCode(String catStationHouseCode) {
		this.catStationHouseCode = catStationHouseCode;
	}

	public String getApproceCompleteDescription() {
		return approceCompleteDescription;
	}

	public void setApproceCompleteDescription(String approceCompleteDescription) {
		this.approceCompleteDescription = approceCompleteDescription;
	}
//	hoanm1_20181203_end

    //VietNT_20181226_start
    private Long assignHandoverId;

    public Long getAssignHandoverId() {
        return assignHandoverId;
    }

    public void setAssignHandoverId(Long assignHandoverId) {
        this.assignHandoverId = assignHandoverId;
    }
    //VietNT_end
    public Long getTypeHSHC() {
        return typeHSHC;
    }

    public void setTypeHSHC(Long typeHSHC) {
        this.typeHSHC = typeHSHC;
    }
   
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
    @JsonSerialize(using = CustomJsonDateSerializer.class)
    private Date dateFrom;
    @JsonDeserialize(using = CustomJsonDateDeserializer.class)
    @JsonSerialize(using = CustomJsonDateSerializer.class)
    private Date dateTo;
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
	private String constructionCode;
    private String constructionType;
    private String cntContract;
    private String themImplementPercent;
    private String performerName;
    private String supervisorName;
    private String directorName;
    private String startDateStr;
    private String endDateStr;
    private String provinceName;
    private String constructionName;
    private String consAppRevenueState;
    private List<String> listAppRevenueState;
    private String approveRevenueDescription;
    private Double consAppRevenueValue;
    private Double consAppRevenueValueDB;
    private String workItemCode;

    private Long quantitySum;
    private Long gponCount;
    private Long gponSum;
    private Long leCount;
    private Long leSum;
    private Long tuyenCount;
    private Long tuyenSum;
    private Long btsSum;
    private Long btsCount;
    private Double pheduyetValue;
    private String catConstructionTypeName;
    private Long catConstructionTypeId;
    private String userName;
    private String sysName;

    private String dateComplete;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date receiveRecordsDate;
    private Long catProvinceId;
    private String catProvinceCode;
    private String catProvinceName;
    //tan start 20181105
//    private Long sysGroupID;
//    private Long constructionTaskID;
//    private Long constructionID;
    //end
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

    public Date getReceiveRecordsDate() {
        return receiveRecordsDate;
    }

    public void setReceiveRecordsDate(Date receiveRecordsDate) {
        this.receiveRecordsDate = receiveRecordsDate;
    }

    // chinhpxn20180711_start
    private Long sysGroupIdTC;

    public Long getSysGroupIdTC() {
        return sysGroupIdTC;
    }

    public void setSysGroupIdTC(Long sysGroupIdTC) {
        this.sysGroupIdTC = sysGroupIdTC;
    }
//	chinhpxn20180711_end

    // chinhpxn20180723_start
    private Long taskCount;

    public Long getTaskCount() {
        return taskCount;
    }

    public void setTaskCount(Long taskCount) {
        this.taskCount = taskCount;
    }
    // chinhpxn20180723_end

    public String getDateComplete() {
        return dateComplete;
    }

    public void setDateComplete(String dateComplete) {
        this.dateComplete = dateComplete;
    }

    public String getApproveUserName() {
        return approveUserName;
    }

    public void setApproveUserName(String approveUserName) {
        this.approveUserName = approveUserName;
    }

    public List<String> getMonthList() {
        return monthList;
    }

    public void setMonthList(List<String> monthList) {
        this.monthList = monthList;
    }

    private Long stt;
    private String dateBatDau;
    private String dateKetThuc;

    public String getDateBatDau() {
        return dateBatDau;
    }

    public void setDateBatDau(String dateBatDau) {
        this.dateBatDau = dateBatDau;
    }

    public String getDateKetThuc() {
        return dateKetThuc;
    }

    public void setDateKetThuc(String dateKetThuc) {
        this.dateKetThuc = dateKetThuc;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getSysName() {
        return sysName;
    }

    public void setSysName(String sysName) {
        this.sysName = sysName;
    }

    private List<WorkItemDetailDTO> listWorkItemForExport;

    public List<String> getListAppRevenueState() {
        return listAppRevenueState;
    }

    public void setListAppRevenueState(List<String> listAppRevenueState) {
        this.listAppRevenueState = listAppRevenueState;
    }

    public List<WorkItemDetailDTO> getListWorkItemForExport() {
        return listWorkItemForExport;
    }

    public void setListWorkItemForExport(List<WorkItemDetailDTO> listWorkItemForExport) {
        this.listWorkItemForExport = listWorkItemForExport;
    }

    public String getCatConstructionTypeName() {
        return catConstructionTypeName;
    }

    public void setCatConstructionTypeName(String catConstructionTypeName) {
        this.catConstructionTypeName = catConstructionTypeName;
    }

    public Long getCatConstructionTypeId() {
        return catConstructionTypeId;
    }

    public void setCatConstructionTypeId(Long catConstructionTypeId) {
        this.catConstructionTypeId = catConstructionTypeId;
    }

    public Double getConsAppRevenueValueDB() {
        return consAppRevenueValueDB;
    }

    public void setConsAppRevenueValueDB(Double consAppRevenueValueDB) {
        this.consAppRevenueValueDB = consAppRevenueValueDB;
    }

    public Double getPheduyetValue() {
        return pheduyetValue;
    }

    public void setPheduyetValue(Double pheduyetValue) {
        this.pheduyetValue = pheduyetValue;
    }

    private String tt;

    public String getApproveRevenueDescription() {
        return approveRevenueDescription;
    }

    public void setApproveRevenueDescription(String approveRevenueDescription) {
        this.approveRevenueDescription = approveRevenueDescription;
    }

    private String completeValue;
    private String constructionStatus;
    private Long performerIdDetail;
    private Date monthYear;

    //VietNT_20181228_start
    private Long constructorId;

    public Long getConstructorId() {
        return constructorId;
    }

    public void setConstructorId(Long constructorId) {
        this.constructorId = constructorId;
    }

    //VietNT_end
    //VietNT_20190117_start
    private Long receivedStatus;

    public Long getReceivedStatus() {
        return receivedStatus;
    }

    public void setReceivedStatus(Long receivedStatus) {
        this.receivedStatus = receivedStatus;
    }
    //VietNT_end

    //nhantv 180816 begin them list de them nhieu hang muc vao cong viec
    private List<ConstructionTaskDetailDTO> childDTOList;

    public List<ConstructionTaskDetailDTO> getChildDTOList() {
        return childDTOList;
    }

    public void setChildDTOList(List<ConstructionTaskDetailDTO> childDTOList) {
        this.childDTOList = childDTOList;
    }
    //nhantv 180816 begin

    public Date getMonthYear() {
        return monthYear;
    }

    public void setMonthYear(Date monthYear) {
        this.monthYear = monthYear;
    }

    public String getConstructionStatus() {
        return constructionStatus;
    }

    public void setConstructionStatus(String constructionStatus) {
        this.constructionStatus = constructionStatus;
    }

    public String getCompleteValue() {
        return completeValue;
    }

    public void setCompleteValue(String completeValue) {
        this.completeValue = completeValue;
    }

    public List<Long> getListDetailMonthPlanId() {
        return listDetailMonthPlanId;
    }

    public void setListDetailMonthPlanId(List<Long> listDetailMonthPlanId) {
        this.listDetailMonthPlanId = listDetailMonthPlanId;
    }

    public String getConsAppRevenueState() {
        return consAppRevenueState;
    }

    public void setConsAppRevenueState(String consAppRevenueState) {
        this.consAppRevenueState = consAppRevenueState;
    }

    public Double getConsAppRevenueValue() {
        return consAppRevenueValue;
    }

    public void setConsAppRevenueValue(Double consAppRevenueValue) {
        this.consAppRevenueValue = consAppRevenueValue;
    }

    public String getTt() {
        return tt;
    }

    public void setTt(String tt) {
        this.tt = tt;
    }

    public Long getQuantitySum() {
        return quantitySum != null ? quantitySum / 1000000 : 0;
    }

    public void setQuantitySum(Long quantitySum) {
        this.quantitySum = quantitySum;
    }

    public Long getGponCount() {
        return gponCount;
    }

    public void setGponCount(Long gponCount) {
        this.gponCount = gponCount;
    }

    public Long getGponSum() {
        return gponSum != null ? gponSum / 1000000 : 0;
    }

    public void setGponSum(Long gponSum) {
        this.gponSum = gponSum;
    }

    public Long getLeCount() {
        return leCount;
    }

    public void setLeCount(Long leCount) {
        this.leCount = leCount;
    }

    public Long getLeSum() {
        return leSum != null ? leSum / 1000000 : 0;
    }

    public void setLeSum(Long leSum) {
        this.leSum = leSum;
    }

    public Long getTuyenCount() {
        return tuyenCount;
    }

    public void setTuyenCount(Long tuyenCount) {
        this.tuyenCount = tuyenCount;
    }

    public Long getTuyenSum() {
        return tuyenSum != null ? tuyenSum / 1000000 : 0;
    }

    public void setTuyenSum(Long tuyenSum) {
        this.tuyenSum = tuyenSum;
    }

    public Long getBtsSum() {
        return btsSum;
    }

    public void setBtsSum(Long btsSum) {
        this.btsSum = btsSum != null ? btsSum / 1000000 : 0;
    }

    public Long getBtsCount() {
        return btsCount;
    }

    public void setBtsCount(Long btsCount) {
        this.btsCount = btsCount;
    }

    public String getWorkItemCode() {
        return workItemCode;
    }

    public void setWorkItemCode(String workItemCode) {
        this.workItemCode = workItemCode;
    }

    public String getProvinceName() {
        return provinceName;
    }

    public void setProvinceName(String provinceName) {
        this.provinceName = provinceName;
    }

    public String getConstructionName() {
        return constructionName;
    }

    public void setConstructionName(String constructionName) {
        this.constructionName = constructionName;
    }

    public String getStartDateStr() {
        return startDateStr;
    }

    public void setStartDateStr(String startDateStr) {
        this.startDateStr = startDateStr;
    }

    public String getEndDateStr() {
        return endDateStr;
    }

    public void setEndDateStr(String endDateStr) {
        this.endDateStr = endDateStr;
    }

    private String approveCompleteState;

    public String getApproveCompleteState() {
        return approveCompleteState;
    }

    public void setApproveCompleteState(String approveCompleteState) {
        this.approveCompleteState = approveCompleteState;
    }

    public String getDirectorName() {
        return directorName;
    }

    public void setDirectorName(String directorName) {
        this.directorName = directorName;
    }

    private String isObstructedName;
    private Double price;

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    private String errorFilePath;

    public String getErrorFilePath() {
        return errorFilePath;
    }

    public void setErrorFilePath(String errorFilePath) {
        this.errorFilePath = errorFilePath;
    }

    public String getSupervisorName() {
        return supervisorName;
    }

    public void setSupervisorName(String supervisorName) {
        this.supervisorName = supervisorName;
    }

    private Date completeDate;
    private Date approveCompleteDate;
    private Date completionTime;
    private String isObstructed;

    private String detailMonthPlanName;
    private String sysGroupName;

    public Date getApproveCompleteDate() {
        return approveCompleteDate;
    }

    public void setApproveCompleteDate(Date approveCompleteDate) {
        this.approveCompleteDate = approveCompleteDate;
    }

    public String getDetailMonthPlanName() {
        return detailMonthPlanName;
    }

    public void setDetailMonthPlanName(String detailMonthPlanName) {
        this.detailMonthPlanName = detailMonthPlanName;
    }

    public String getSysGroupName() {
        return sysGroupName;
    }

    public void setSysGroupName(String sysGroupName) {
        this.sysGroupName = sysGroupName;
    }

    public String getIsObstructedName() {
        return isObstructedName;
    }

    public void setIsObstructedName(String isObstructedName) {
        this.isObstructedName = isObstructedName;
    }

    public String getPerformerName() {
        return performerName;
    }

    public void setPerformerName(String performerName) {
        this.performerName = performerName;
    }

    public String getCatStationCode() {
        return catStationCode;
    }

    public void setCatStationCode(String catStationCode) {
        this.catStationCode = catStationCode;
    }

    public String getConstructionCode() {
        return constructionCode;
    }

    public void setConstructionCode(String constructionCode) {
        this.constructionCode = constructionCode;
    }

    public String getConstructionType() {
        return constructionType;
    }

    public void setConstructionType(String constructionType) {
        this.constructionType = constructionType;
    }

    public String getCntContract() {
        return cntContract;
    }

    public void setCntContract(String cntContract) {
        this.cntContract = cntContract;
    }

    public String getThemImplementPercent() {
        return themImplementPercent;
    }

    public void setThemImplementPercent(String themImplementPercent) {
        this.themImplementPercent = themImplementPercent;
    }

    public Date getCompleteDate() {
        return completeDate;
    }

    public void setCompleteDate(Date completeDate) {
        this.completeDate = completeDate;
    }

    public Date getCompletionTime() {
        return completionTime;
    }

    public void setCompletionTime(Date completionTime) {
        this.completionTime = completionTime;
    }

    public String getIsObstructed() {
        return isObstructed;
    }

    public void setIsObstructed(String isObstructed) {
        this.isObstructed = isObstructed;
    }

    public List<String> getListStatus() {
        return listStatus;
    }

    public void setListStatus(List<String> listStatus) {
        this.listStatus = listStatus;
    }

    public List<String> getListCompleteState() {
        return listCompleteState;
    }

    public void setListCompleteState(List<String> listCompleteState) {
        this.listCompleteState = listCompleteState;
    }

    public List<Long> getListConstructionId() {
        return ListConstructionId;
    }

    public void setListConstructionId(List<Long> listConstructionId) {
        ListConstructionId = listConstructionId;
    }

    public Long getPerformerIdDetail() {
        return performerIdDetail;
    }

    public void setPerformerIdDetail(Long performerIdDetail) {
        this.performerIdDetail = performerIdDetail;
    }

    public Long getStt() {
        return stt;
    }

    public void setStt(Long stt) {
        this.stt = stt;
    }
//    hoanm1_20180906_start
    private Double totalQuantity;

	public Double getTotalQuantity() {
		return totalQuantity;
	}

	public void setTotalQuantity(Double totalQuantity) {
		this.totalQuantity = totalQuantity;
	}
//	hoanm1_20180906_end
	private Double completeValueTotal;
	private Double consAppRevenueValueTotal;
	private Double consAppRevenueValueDBTotal;

	public Double getCompleteValueTotal() {
		return completeValueTotal;
	}

	public void setCompleteValueTotal(Double completeValueTotal) {
		this.completeValueTotal = completeValueTotal;
	}

	public Double getConsAppRevenueValueTotal() {
		return consAppRevenueValueTotal;
	}

	public void setConsAppRevenueValueTotal(Double consAppRevenueValueTotal) {
		this.consAppRevenueValueTotal = consAppRevenueValueTotal;
	}

	public Double getConsAppRevenueValueDBTotal() {
		return consAppRevenueValueDBTotal;
	}

	public void setConsAppRevenueValueDBTotal(Double consAppRevenueValueDBTotal) {
		this.consAppRevenueValueDBTotal = consAppRevenueValueDBTotal;
	}
//	tungtt_20181207_start
	 private Long rpHshcId;

	 public Long getRpHshcId() {
			return rpHshcId;
	 }

	public void setRpHshcId(Long rpHshcId) {
			this.rpHshcId = rpHshcId;
	}
//	tungtt_20181207_end
//	public Long getSysGroupID() {
//		return sysGroupID;
//	}
//
//	public void setSysGroupID(Long sysGroupID) {
//		this.sysGroupID = sysGroupID;
//	}
//
//	public Long getConstructionTaskID() {
//		return constructionTaskID;
//	}
//
//	public void setConstructionTaskID(Long constructionTaskID) {
//		this.constructionTaskID = constructionTaskID;
//	}
//
//	public Long getConstructionID() {
//		return constructionID;
//	}
//
//	public void setConstructionID(Long constructionID) {
//		this.constructionID = constructionID;
//	}
	
//	tungtt_20181129_start
	 private String completeValuePlan;
	 
//	 private Date completeUpdatedDate;
//
//	public Date getCompleteUpdatedDate() {
//		return completeUpdatedDate;
//	}
//
//	public void setCompleteUpdatedDate(Date completeUpdatedDate) {
//		this.completeUpdatedDate = completeUpdatedDate;
//	}

	public String getCompleteValuePlan() {
		return completeValuePlan;
	}

	public void setCompleteValuePlan(String completeValuePlan) {
		this.completeValuePlan = completeValuePlan;
	}
//	tungtt_20181129_end

}
