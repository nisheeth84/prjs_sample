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
public class RpConstructionDTO extends WorkItemDTO {

	/**
	 *
	 */
	private static final long serialVersionUID = 1L;
	private Long asSignHadoverId;
	private String sysgroupname;
	private String Catprovincecode;
	private String Catstattionhousecode;
	private String Cntcontractcode;
	private String Companyassigndate;
	private String Outofdatereceived;
	private String description;
	private Long sysGroupId;
	private Long catProvinceId;
	private Long catStattionHouseId;
	private Long cntContractId;
	private String cntContractCode;
	private String catProvinceName;
	private String catProvinceCode;
	private String stationCode;
	private String yearComplete;
    private String monthComplete;
    private String dateComplete;
    private String monthYear;
    @JsonSerialize(using = JsonDateSerializerDate.class)
	@JsonDeserialize(using = JsonDateDeserializer.class)
    private Date dateFrom;
    @JsonSerialize(using = JsonDateSerializerDate.class)
	@JsonDeserialize(using = JsonDateDeserializer.class)
    private Date dateTo;
    private Date dateDo;
    private Long columnHeight;
    private Long numberCo;
    private String houseTypeName;
    private String groundingTypeName;
    private String departmentAssignDate;
    private Long outOfDateStartDate;
    private String haveWorkItemName;
    private Date startingDate;
    private String constructorName;
    private String constructorName1;
    private String constructorName2;
    private String constructionCode;
    private Integer countDateComplete;
    private Integer countCatstationCode;
    private Integer countWorkItemName;
    private Double totalQuantity;
    private String catstationCode;
    private Integer countConstructionCode;
    private Long receivedStatus;
    private Long constructionState;
    private Long completionRecordState;
    private Long outOfdate;
    private Long department;
    private Long outOfDateStart;
    private Long stationType;
    private String sysGroupCode;
    private String catStattionHouseCode;
    private Date  completeCompletionRecord;
    private Date completeDate;
//    hoanm1_20190117_start
    private String cntContractCodeBGMB;
    private String outofdatereceivedBGMB;	
    private Long HeightTM;
    private Long numberCoTM;
    private String houseTypeNameTM;
    private Long HeightDD;
    private Long numberCoDD;
    private String houseTypeNameDD;
    private String workItemOutStanding;
    private String approvedCompleteDate;
    
//    hoanm1_20190117_end
    
	public String getApprovedCompleteDate() {
		return approvedCompleteDate;
	}

	public void setApprovedCompleteDate(String approvedCompleteDate) {
		this.approvedCompleteDate = approvedCompleteDate;
	}

	public String getWorkItemOutStanding() {
		return workItemOutStanding;
	}

	public void setWorkItemOutStanding(String workItemOutStanding) {
		this.workItemOutStanding = workItemOutStanding;
	}

	public Long getHeightTM() {
		return HeightTM;
	}

	public void setHeightTM(Long heightTM) {
		HeightTM = heightTM;
	}

	public Long getNumberCoTM() {
		return numberCoTM;
	}

	public void setNumberCoTM(Long numberCoTM) {
		this.numberCoTM = numberCoTM;
	}

	public String getHouseTypeNameTM() {
		return houseTypeNameTM;
	}

	public void setHouseTypeNameTM(String houseTypeNameTM) {
		this.houseTypeNameTM = houseTypeNameTM;
	}

	public Long getHeightDD() {
		return HeightDD;
	}

	public void setHeightDD(Long heightDD) {
		HeightDD = heightDD;
	}

	public Long getNumberCoDD() {
		return numberCoDD;
	}

	public void setNumberCoDD(Long numberCoDD) {
		this.numberCoDD = numberCoDD;
	}

	public String getHouseTypeNameDD() {
		return houseTypeNameDD;
	}

	public void setHouseTypeNameDD(String houseTypeNameDD) {
		this.houseTypeNameDD = houseTypeNameDD;
	}

	public String getOutofdatereceivedBGMB() {
		return outofdatereceivedBGMB;
	}

	public void setOutofdatereceivedBGMB(String outofdatereceivedBGMB) {
		this.outofdatereceivedBGMB = outofdatereceivedBGMB;
	}

	public String getCntContractCodeBGMB() {
		return cntContractCodeBGMB;
	}

	public void setCntContractCodeBGMB(String cntContractCodeBGMB) {
		this.cntContractCodeBGMB = cntContractCodeBGMB;
	}

	public Date getCompleteDate() {
		return completeDate;
	}

	public void setCompleteDate(Date completeDate) {
		this.completeDate = completeDate;
	}

	public Date getCompleteCompletionRecord() {
		return completeCompletionRecord;
	}

	public void setCompleteCompletionRecord(Date completeCompletionRecord) {
		this.completeCompletionRecord = completeCompletionRecord;
	}

	public String getSysGroupCode() {
		return sysGroupCode;
	}

	public void setSysGroupCode(String sysGroupCode) {
		this.sysGroupCode = sysGroupCode;
	}

	public String getCatStattionHouseCode() {
		return catStattionHouseCode;
	}

	public void setCatStattionHouseCode(String catStattionHouseCode) {
		this.catStattionHouseCode = catStattionHouseCode;
	}

	public Long getStationType() {
		return stationType;
	}

	public void setStationType(Long stationType) {
		this.stationType = stationType;
	}

	public Long getOutOfDateStart() {
		return outOfDateStart;
	}

	public void setOutOfDateStart(Long outOfDateStart) {
		this.outOfDateStart = outOfDateStart;
	}

	public Long getDepartment() {
		return department;
	}

	public void setDepartment(Long department) {
		this.department = department;
	}

	public Long getOutOfdate() {
		return outOfdate;
	}

	public void setOutOfdate(Long outOfdate) {
		this.outOfdate = outOfdate;
	}

	public Long getCompletionRecordState() {
		return completionRecordState;
	}

	public void setCompletionRecordState(Long completionRecordState) {
		this.completionRecordState = completionRecordState;
	}

	public Long getConstructionState() {
		return constructionState;
	}

	public void setConstructionState(Long constructionState) {
		this.constructionState = constructionState;
	}

	public Long getReceivedStatus() {
		return receivedStatus;
	}

	public void setReceivedStatus(Long receivedStatus) {
		this.receivedStatus = receivedStatus;
	}

	public String getCatstationCode() {
		return catstationCode;
	}

	public void setCatstationCode(String catstationCode) {
		this.catstationCode = catstationCode;
	}

	public Integer getCountConstructionCode() {
		return countConstructionCode;
	}

	public void setCountConstructionCode(Integer countConstructionCode) {
		this.countConstructionCode = countConstructionCode;
	}

	public String getConstructionCode() {
		return constructionCode;
	}

	public void setConstructionCode(String constructionCode) {
		this.constructionCode = constructionCode;
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

	public Double getTotalQuantity() {
		return totalQuantity;
	}

	public void setTotalQuantity(Double totalQuantity) {
		this.totalQuantity = totalQuantity;
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

	public Date getStartingDate() {
		return startingDate;
	}

	public void setStartingDate(Date startingDate) {
		this.startingDate = startingDate;
	}

	public String getHaveWorkItemName() {
		return haveWorkItemName;
	}

	public void setHaveWorkItemName(String haveWorkItemName) {
		this.haveWorkItemName = haveWorkItemName;
	}

	public String getDepartmentAssignDate() {
		return departmentAssignDate;
	}

	public void setDepartmentAssignDate(String departmentAssignDate) {
		this.departmentAssignDate = departmentAssignDate;
	}

	

	public Long getOutOfDateStartDate() {
		return outOfDateStartDate;
	}

	public void setOutOfDateStartDate(Long outOfDateStartDate) {
		this.outOfDateStartDate = outOfDateStartDate;
	}

	

	public Long getColumnHeight() {
		return columnHeight;
	}

	public void setColumnHeight(Long columnHeight) {
		this.columnHeight = columnHeight;
	}

	public Long getNumberCo() {
		return numberCo;
	}

	public void setNumberCo(Long numberCo) {
		this.numberCo = numberCo;
	}

	public String getHouseTypeName() {
		return houseTypeName;
	}

	public void setHouseTypeName(String houseTypeName) {
		this.houseTypeName = houseTypeName;
	}

	public String getGroundingTypeName() {
		return groundingTypeName;
	}

	public void setGroundingTypeName(String groundingTypeName) {
		this.groundingTypeName = groundingTypeName;
	}

	public String getCatProvinceCode() {
		return catProvinceCode;
	}

	public void setCatProvinceCode(String catProvinceCode) {
		this.catProvinceCode = catProvinceCode;
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

	public String getMonthYear() {
		return monthYear;
	}

	public void setMonthYear(String monthYear) {
		this.monthYear = monthYear;
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

	public String getDateComplete() {
		return dateComplete;
	}

	public void setDateComplete(String dateComplete) {
		this.dateComplete = dateComplete;
	}

	public String getCatProvinceName() {
		return catProvinceName;
	}

	public void setCatProvinceName(String catProvinceName) {
		this.catProvinceName = catProvinceName;
	}

	public String getStationCode() {
		return stationCode;
	}

	public void setStationCode(String stationCode) {
		this.stationCode = stationCode;
	}

	public String getCntContractCode() {
		return cntContractCode;
	}

	public void setCntContractCode(String cntContractCode) {
		this.cntContractCode = cntContractCode;
	}

	public Long getCntContractId() {
		return cntContractId;
	}

	public void setCntContractId(Long cntContractId) {
		this.cntContractId = cntContractId;
	}

	public Long getCatStattionHouseId() {
		return catStattionHouseId;
	}

	public void setCatStattionHouseId(Long catStattionHouseId) {
		this.catStattionHouseId = catStattionHouseId;
	}

	public Long getCatProvinceId() {
		return catProvinceId;
	}

	public void setCatProvinceId(Long catProvinceId) {
		this.catProvinceId = catProvinceId;
	}

	public Long getSysGroupId() {
		return sysGroupId;
	}

	public void setSysGroupId(Long sysGroupId) {
		this.sysGroupId = sysGroupId;
	}

	public Long getAsSignHadoverId() {
		return asSignHadoverId;
	}

	public void setAsSignHadoverId(Long asSignHadoverId) {
		this.asSignHadoverId = asSignHadoverId;
	}

	public String getSysgroupname() {
		return sysgroupname;
	}

	public void setSysgroupname(String sysgroupname) {
		this.sysgroupname = sysgroupname;
	}

	public String getCatprovincecode() {
		return Catprovincecode;
	}

	public void setCatprovincecode(String catprovincecode) {
		Catprovincecode = catprovincecode;
	}

	public String getCatstattionhousecode() {
		return Catstattionhousecode;
	}

	public void setCatstattionhousecode(String catstattionhousecode) {
		Catstattionhousecode = catstattionhousecode;
	}

	public String getCntcontractcode() {
		return Cntcontractcode;
	}

	public void setCntcontractcode(String cntcontractcode) {
		Cntcontractcode = cntcontractcode;
	}

	public String getCompanyassigndate() {
		return Companyassigndate;
	}

	public void setCompanyassigndate(String companyassigndate) {
		Companyassigndate = companyassigndate;
	}

	public String getOutofdatereceived() {
		return Outofdatereceived;
	}

	public void setOutofdatereceived(String outofdatereceived) {
		Outofdatereceived = outofdatereceived;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

//	hungnx 20180625 end
}
