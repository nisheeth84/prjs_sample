package com.viettel.coms.dto;

import com.viettel.erp.utils.JsonDateDeserializer;
import com.viettel.erp.utils.JsonDateSerializerDate;
import com.viettel.utils.CustomJsonDateDeserializer;
import com.viettel.utils.CustomJsonDateSerializer;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import java.util.Date;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class WorkItemDetailDTO extends WorkItemDTO {

    /**
     *
     */
    private static final long serialVersionUID = 1L;
    private String groupLevel;
    private String constructionStatus;
    private String yearComplete;
    private String monthComplete;
    private String dateComplete;
    private String statusConstruction;
    private Double approveCompleteValue;
    private Date approveCompleteDate;
    private String monthYear;
    private String sanLuongP;
    private List<Long> listStatus;
    //	hungnx 20180625 start
    private String taskName;
    private String workItemName;
    private Double amount;
    private String confirm;
    private Long sysUserId;
    @JsonDeserialize(using = CustomJsonDateDeserializer.class)
    @JsonSerialize(using = CustomJsonDateSerializer.class)
    private Date dateFrom;
    @JsonDeserialize(using = CustomJsonDateDeserializer.class)
    @JsonSerialize(using = CustomJsonDateSerializer.class)
    private Date dateTo;
    @JsonDeserialize(using = CustomJsonDateDeserializer.class)
    @JsonSerialize(using = CustomJsonDateSerializer.class)
    private Date dateDo;
    private String quantityByDate;
    private String obstructedState;
    private Long constructionTaskId;
    private List<ConstructionTaskDailyDTO> constructionTaskDailyLst;
    private String constructionTypeName;
    private List<Long> confirmLst;
    private Double amountConstruction;
    private String statusConstructionTask;
    private Long catTaskId;
    private Integer countDateComplete;
    private Integer countCatstationCode;
    private Integer countWorkItemName;
    private Integer countConstructionCode;
    private Double totalQuantity;
    private String path;

	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
    @JsonSerialize(using = CustomJsonDateSerializer.class)
    private Date completeDate;

    public Date getCompleteDate() {
        return completeDate;
    }

    public void setCompleteDate(Date completeDate) {
        this.completeDate = completeDate;
    }

    private Long performerId;

    public Long getPerformerId() {
        return performerId;
    }

    public void setPerformerId(Long performerId) {
        this.performerId = performerId;
    }
//    hoanm1_20180905_start
    private java.util.Date endingDate;
    

    public java.util.Date getEndingDate() {
		return endingDate;
	}

	public void setEndingDate(java.util.Date endingDate) {
		this.endingDate = endingDate;
	}
//	hoanm1_20180905_end
	// chinhpxn20180719_start
    private Double oldQuantity;

    public Double getOldQuantity() {
        return oldQuantity;
    }

    public void setOldQuantity(Double oldQuantity) {
        this.oldQuantity = oldQuantity;
    }
//	chinhpxn20180719_end

//	hungnx 20180625 end

    //	hoanm1_20180724_start
    private Long sysGroupIdSMS;

    public Long getSysGroupIdSMS() {
        return sysGroupIdSMS;
    }

    public void setSysGroupIdSMS(Long sysGroupIdSMS) {
        this.sysGroupIdSMS = sysGroupIdSMS;
    }

    //	hoanm1_20180724_end
    public List<Long> getListStatus() {
        return listStatus;
    }

    public void setListStatus(List<Long> listStatus) {
        this.listStatus = listStatus;
    }

    public String getSanLuongP() {
        return sanLuongP;
    }

    public void setSanLuongP(String sanLuongP) {
        this.sanLuongP = sanLuongP;
    }

    public String getMonthYear() {
        return monthYear;
    }

    public void setMonthYear(String monthYear) {
        this.monthYear = monthYear;
    }

    public Double getApproveCompleteValue() {
        return approveCompleteValue;
    }

    public void setApproveCompleteValue(Double approveCompleteValue) {
        this.approveCompleteValue = approveCompleteValue;
    }

    public Date getApproveCompleteDate() {
        return approveCompleteDate;
    }

    public void setApproveCompleteDate(Date approveCompleteDate) {
        this.approveCompleteDate = approveCompleteDate;
    }

    public String getStatusConstruction() {
        return statusConstruction;
    }

    public void setStatusConstruction(String statusConstruction) {
        this.statusConstruction = statusConstruction;
    }

    private Long stt;

    public Long getStt() {
        return stt;
    }

    public void setStt(Long stt) {
        this.stt = stt;
    }

    public String getDateComplete() {
        return dateComplete;
    }

    public void setDateComplete(String dateComplete) {
        this.dateComplete = dateComplete;
    }

    public String getYearComplete() {
        return yearComplete;
    }

    public void setYearComplete(String yearComplete) {
        this.yearComplete = yearComplete;
    }

    public String getMonthComplete() {
        return monthComplete;
    }

    public void setMonthComplete(String monthComplete) {
        this.monthComplete = monthComplete;
    }

    public String getConstructionStatus() {
        return constructionStatus;
    }

    public void setConstructionStatus(String constructionStatus) {
        this.constructionStatus = constructionStatus;
    }

    public String getGroupLevel() {
        return groupLevel;
    }

    public void setGroupLevel(String groupLevel) {
        this.groupLevel = groupLevel;
    }

    private List<WorkItemDetailDTO> listWorkItem;

    public List<WorkItemDetailDTO> getListWorkItem() {
        return listWorkItem;
    }

    public void setListWorkItem(List<WorkItemDetailDTO> listWorkItem) {
        this.listWorkItem = listWorkItem;
    }

    private String cntContractCode;
    private String description;
    private String constructorName;
    private String constructorName1;
    private String constructorName2;
    private String supervisorName;
    private String performerName;
    private String sourceType;
    private String deployType;
    private String catProvinceCode;
    private Long catProvinceId;

    public Long getCatProvinceId() {
        return catProvinceId;
    }

    public void setCatProvinceId(Long catProvinceId) {
        this.catProvinceId = catProvinceId;
    }

    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date dateBD;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date dateKT;

    public Date getDateBD() {
        return dateBD;
    }

    public void setDateBD(Date dateBD) {
        this.dateBD = dateBD;
    }

    public Date getDateKT() {
        return dateKT;
    }

    public void setDateKT(Date dateKT) {
        this.dateKT = dateKT;
    }

    // @JsonSerialize(using = JsonDateSerializerDate.class)
//	@JsonDeserialize(using = JsonDateDeserializer.class)
    private Date startDate;
    //	@JsonSerialize(using = JsonDateSerializerDate.class)
//	@JsonDeserialize(using = JsonDateDeserializer.class)
    private Date endDate;

    private String catWorkItemType;
    private Double price;
    private Double workDay;
    private String catStationCode;
    private String sysGroupName;
    private Long catConstructionTypeId;
    private Long sysGroupId;
    private String constructionCode;
    private Long month;
    private Long year;
    private String catstationCode;
    private String sysGroupName1;
    private List<String> monthList;
    private String provinceCode;
    private String totalPrice;

    private String catWorkItemTypeName;
    private String cntContract;
    private String sysName;
    private String userName;

    // chinhpxn 20180608 start
    private String catConstructionTypeName;
    // chinhpxn 20180608 end

    //Huypq-20181105-start
    private Long workItemPartDay;
    private Long workItemConsDay;
    private Long workItemSumDay;
    private Long workItemPartMonth;
    private Long workItemConsMonth;
    private Long workItemSumMonth;
    private Double quantityPartDay;
    private Double quantityConsDay;
    private Double quantitySumDay;
    private Double quantityPartMonth;
    private Double quantityConsMonth;
    private Double quantitySumMonth;
    private String fillCatProvince;
    
    public String getFillCatProvince() {
		return fillCatProvince;
	}

	public void setFillCatProvince(String fillCatProvince) {
		this.fillCatProvince = fillCatProvince;
	}

	public Long getWorkItemPartDay() {
		return workItemPartDay;
	}

	public void setWorkItemPartDay(Long workItemPartDay) {
		this.workItemPartDay = workItemPartDay;
	}

	public Long getWorkItemConsDay() {
		return workItemConsDay;
	}

	public void setWorkItemConsDay(Long workItemConsDay) {
		this.workItemConsDay = workItemConsDay;
	}

	public Long getWorkItemSumDay() {
		return workItemSumDay;
	}

	public void setWorkItemSumDay(Long workItemSumDay) {
		this.workItemSumDay = workItemSumDay;
	}

	public Long getWorkItemPartMonth() {
		return workItemPartMonth;
	}

	public void setWorkItemPartMonth(Long workItemPartMonth) {
		this.workItemPartMonth = workItemPartMonth;
	}

	public Long getWorkItemConsMonth() {
		return workItemConsMonth;
	}

	public void setWorkItemConsMonth(Long workItemConsMonth) {
		this.workItemConsMonth = workItemConsMonth;
	}

	public Long getWorkItemSumMonth() {
		return workItemSumMonth;
	}

	public void setWorkItemSumMonth(Long workItemSumMonth) {
		this.workItemSumMonth = workItemSumMonth;
	}

	public Double getQuantityPartDay() {
		return quantityPartDay;
	}

	public void setQuantityPartDay(Double quantityPartDay) {
		this.quantityPartDay = quantityPartDay;
	}

	public Double getQuantityConsDay() {
		return quantityConsDay;
	}

	public void setQuantityConsDay(Double quantityConsDay) {
		this.quantityConsDay = quantityConsDay;
	}

	public Double getQuantitySumDay() {
		return quantitySumDay;
	}

	public void setQuantitySumDay(Double quantitySumDay) {
		this.quantitySumDay = quantitySumDay;
	}

	public Double getQuantityPartMonth() {
		return quantityPartMonth;
	}

	public void setQuantityPartMonth(Double quantityPartMonth) {
		this.quantityPartMonth = quantityPartMonth;
	}

	public Double getQuantityConsMonth() {
		return quantityConsMonth;
	}

	public void setQuantityConsMonth(Double quantityConsMonth) {
		this.quantityConsMonth = quantityConsMonth;
	}

	public Double getQuantitySumMonth() {
		return quantitySumMonth;
	}

	public void setQuantitySumMonth(Double quantitySumMonth) {
		this.quantitySumMonth = quantitySumMonth;
	}

	//Huypq-20181105-end
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

    private List<UtilAttachDocumentDTO> listImage;

    public List<UtilAttachDocumentDTO> getListImage() {
        return listImage;
    }

    public void setListImage(List<UtilAttachDocumentDTO> listImage) {
        this.listImage = listImage;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCntContractCode() {
        return cntContractCode;
    }

    public void setCntContractCode(String cntContractCode) {
        this.cntContractCode = cntContractCode;
    }

    public String getCatProvinceCode() {
        return catProvinceCode;
    }

    public void setCatProvinceCode(String catProvinceCode) {
        this.catProvinceCode = catProvinceCode;
    }

    public String getSourceType() {
        return sourceType;
    }

    public void setSourceType(String sourceType) {
        this.sourceType = sourceType;
    }

    public String getDeployType() {
        return deployType;
    }

    public void setDeployType(String deployType) {
        this.deployType = deployType;
    }

    public String getPerformerName() {
        return performerName;
    }

    public void setPerformerName(String performerName) {
        this.performerName = performerName;
    }

    public List<String> getMonthList() {
        return monthList;
    }

    public void setMonthList(List<String> monthList) {
        this.monthList = monthList;
    }

    public String getCatstationCode() {
        return catstationCode;
    }

    public void setCatstationCode(String catstationCode) {
        this.catstationCode = catstationCode;
    }

    public String getSysGroupName1() {
        return sysGroupName1;
    }

    public void setSysGroupName1(String sysGroupName1) {
        this.sysGroupName1 = sysGroupName1;
    }

    public Long getMonth() {
        return month;
    }

    public void setMonth(Long month) {
        this.month = month;
    }

    public Long getYear() {
        return year;
    }

    public void setYear(Long year) {
        this.year = year;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public String getCatWorkItemTypeName() {
        return catWorkItemTypeName;
    }

    public void setCatWorkItemTypeName(String catWorkItemTypeName) {
        this.catWorkItemTypeName = catWorkItemTypeName;
    }

    public String getSysGroupName() {
        return sysGroupName;
    }

    public void setSysGroupName(String sysGroupName) {
        this.sysGroupName = sysGroupName;
    }

    public Long getSysGroupId() {
        return sysGroupId;
    }

    public void setSysGroupId(Long sysGroupId) {
        this.sysGroupId = sysGroupId;
    }

    public String getCntContract() {
        return cntContract;
    }

    public void setCntContract(String cntContract) {
        this.cntContract = cntContract;
    }

    public String getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(String totalPrice) {
        this.totalPrice = totalPrice;
    }

    public String getProvinceCode() {
        return provinceCode;
    }

    public void setProvinceCode(String provinceCode) {
        this.provinceCode = provinceCode;
    }

    public String getCatStationCode() {
        return catStationCode;
    }

    public void setCatStationCode(String catStationCode) {
        this.catStationCode = catStationCode;
    }

    public Long getCatConstructionTypeId() {
        return catConstructionTypeId;
    }

    public void setCatConstructionTypeId(Long catConstructionTypeId) {
        this.catConstructionTypeId = catConstructionTypeId;
    }

    private List<CatCommonDTO> workItemTypeList;
    private List<String> workItemDetailList;

    public List<String> getWorkItemDetailList() {
        return workItemDetailList;
    }

    public void setWorkItemDetailList(List<String> workItemDetailList) {
        this.workItemDetailList = workItemDetailList;
    }

    public static long getSerialversionuid() {
        return serialVersionUID;
    }

    public String getConstructionCode() {
        return constructionCode;
    }

    public void setConstructionCode(String constructionCode) {
        this.constructionCode = constructionCode;
    }

    public List<CatCommonDTO> getWorkItemTypeList() {
        return workItemTypeList;
    }

    public void setWorkItemTypeList(List<CatCommonDTO> workItemTypeList) {
        this.workItemTypeList = workItemTypeList;
    }

    public String getConstructorName() {
        return constructorName;

    }

    public void setConstructorName(String constructorName) {
        this.constructorName = constructorName;
    }

    public String getConstructorName1() {
        return constructorName1;
    }

    public void setConstructorName1(String constructorName1) {
        this.constructorName1 = constructorName1;
    }

    public String getConstructorName2() {
        return constructorName2;
    }

    public void setConstructorName2(String constructorName2) {
        this.constructorName2 = constructorName2;
    }

    public String getSupervisorName() {
        return supervisorName;
    }

    public void setSupervisorName(String supervisorName) {
        this.supervisorName = supervisorName;
    }

    public String getCatWorkItemType() {
        return catWorkItemType;
    }

    public void setCatWorkItemType(String catWorkItemType) {
        this.catWorkItemType = catWorkItemType;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Double getWorkDay() {
        return workDay;
    }

    public void setWorkDay(Double workDay) {
        this.workDay = workDay;
    }

    public String getCatConstructionTypeName() {
        return catConstructionTypeName;
    }

    public void setCatConstructionTypeName(String catConstructionTypeName) {
        this.catConstructionTypeName = catConstructionTypeName;
    }

    //	hungnx 20180625 start
    public String getTaskName() {
        return taskName;
    }

    public void setTaskName(String taskName) {
        this.taskName = taskName;
    }

    public String getWorkItemName() {
        return workItemName;
    }

    public void setWorkItemName(String workItemName) {
        this.workItemName = workItemName;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getConfirm() {
        return confirm;
    }

    public void setConfirm(String confirm) {
        this.confirm = confirm;
    }

    public Long getSysUserId() {
        return sysUserId;
    }

    public void setSysUserId(Long sysUserId) {
        this.sysUserId = sysUserId;
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

    public Date getDateDo() {
        return dateDo;
    }

    public void setDateDo(Date dateDo) {
        this.dateDo = dateDo;
    }

    public String getQuantityByDate() {
        return quantityByDate;
    }

    public void setQuantityByDate(String quantityByDate) {
        this.quantityByDate = quantityByDate;
    }

    public String getObstructedState() {
        return obstructedState;
    }

    public void setObstructedState(String obstructedState) {
        this.obstructedState = obstructedState;
    }

    public Long getConstructionTaskId() {
        return constructionTaskId;
    }

    public void setConstructionTaskId(Long constructionTaskId) {
        this.constructionTaskId = constructionTaskId;
    }

    public List<ConstructionTaskDailyDTO> getConstructionTaskDailyLst() {
        return constructionTaskDailyLst;
    }

    public void setConstructionTaskDailyLst(List<ConstructionTaskDailyDTO> constructionTaskDailyLst) {
        this.constructionTaskDailyLst = constructionTaskDailyLst;
    }

    public String getConstructionTypeName() {
        return constructionTypeName;
    }

    public void setConstructionTypeName(String constructionTypeName) {
        this.constructionTypeName = constructionTypeName;
    }

    public List<Long> getConfirmLst() {
        return confirmLst;
    }

    public void setConfirmLst(List<Long> confirmLst) {
        this.confirmLst = confirmLst;
    }

    public Double getAmountConstruction() {
        return amountConstruction;
    }

    public void setAmountConstruction(Double amountConstruction) {
        this.amountConstruction = amountConstruction;
    }

    public String getStatusConstructionTask() {
        return statusConstructionTask;
    }

    public void setStatusConstructionTask(String statusConstructionTask) {
        this.statusConstructionTask = statusConstructionTask;
    }

    public Long getCatTaskId() {
        return catTaskId;
    }

    public void setCatTaskId(Long catTaskId) {
        this.catTaskId = catTaskId;
    }

    public Integer getCountDateComplete() {
        return countDateComplete;
    }

    public void setCountDateComplete(Integer countDateComplete) {
        this.countDateComplete = countDateComplete;
    }

    public Integer getCountCatstationCode() {
        return countCatstationCode;
    }

    public void setCountCatstationCode(Integer countCatstationCode) {
        this.countCatstationCode = countCatstationCode;
    }

    public Integer getCountWorkItemName() {
        return countWorkItemName;
    }

    public void setCountWorkItemName(Integer countWorkItemName) {
        this.countWorkItemName = countWorkItemName;
    }

    public Integer getCountConstructionCode() {
        return countConstructionCode;
    }

    public void setCountConstructionCode(Integer countConstructionCode) {
        this.countConstructionCode = countConstructionCode;
    }

    public Double getTotalQuantity() {
        return totalQuantity;
    }

    public void setTotalQuantity(Double totalQuantity) {
        this.totalQuantity = totalQuantity;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }
//	hungnx 20180625 end
}
