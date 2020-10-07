package com.viettel.aio.dto;

import com.viettel.aio.bo.ManageQuantityConsXnxdBO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import javax.xml.bind.annotation.XmlRootElement;
import java.util.List;

@SuppressWarnings("serial")
@XmlRootElement(name = "MANAGE_QUANTITY_CONS_XNXDBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class ManageQuantityConsXnxdDTO extends ComsBaseFWDTO<ManageQuantityConsXnxdBO> {

	private Long manageQuantityConsXnxdId;
	private String cntContractCode;
	private Long taskId;
	private String taskName;
	private Double taskMassNow;
	private Long taskPrice;
	private Long totalPriceNow;
	private Long year;
	private Long month;
	private Long week;
	private Long cntContractId;
	private List<CntContractTaskXNXDDTO> listTaskXnxd;
	private Double coefficient;
	private String content;
	private Long catPartnerId;
	private String catPartnerName;
	private Long cntContractPrice;
	private String structureFilter;
	private String descriptionXnxd;
	private Long totalQuantityYearDt;
	private Long accumulateRevenue;
	private Long valueQuantityNotRevenue;
	private Long valueRevenueRest;

	public Long getTotalQuantityYearDt() {
		return totalQuantityYearDt;
	}

	public void setTotalQuantityYearDt(Long totalQuantityYearDt) {
		this.totalQuantityYearDt = totalQuantityYearDt;
	}

	public Long getAccumulateRevenue() {
		return accumulateRevenue;
	}

	public void setAccumulateRevenue(Long accumulateRevenue) {
		this.accumulateRevenue = accumulateRevenue;
	}

	public Long getValueQuantityNotRevenue() {
		return valueQuantityNotRevenue;
	}

	public void setValueQuantityNotRevenue(Long valueQuantityNotRevenue) {
		this.valueQuantityNotRevenue = valueQuantityNotRevenue;
	}

	public Long getValueRevenueRest() {
		return valueRevenueRest;
	}

	public void setValueRevenueRest(Long valueRevenueRest) {
		this.valueRevenueRest = valueRevenueRest;
	}

	public String getDescriptionXnxd() {
		return descriptionXnxd;
	}

	public void setDescriptionXnxd(String descriptionXnxd) {
		this.descriptionXnxd = descriptionXnxd;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public Long getCatPartnerId() {
		return catPartnerId;
	}

	public void setCatPartnerId(Long catPartnerId) {
		this.catPartnerId = catPartnerId;
	}

	public String getCatPartnerName() {
		return catPartnerName;
	}

	public void setCatPartnerName(String catPartnerName) {
		this.catPartnerName = catPartnerName;
	}

	public Long getCntContractPrice() {
		return cntContractPrice;
	}

	public void setCntContractPrice(Long cntContractPrice) {
		this.cntContractPrice = cntContractPrice;
	}

	public String getStructureFilter() {
		return structureFilter;
	}

	public void setStructureFilter(String structureFilter) {
		this.structureFilter = structureFilter;
	}

	public Double getCoefficient() {
		return coefficient;
	}

	public void setCoefficient(Double coefficient) {
		this.coefficient = coefficient;
	}

	public List<CntContractTaskXNXDDTO> getListTaskXnxd() {
		return listTaskXnxd;
	}

	public void setListTaskXnxd(List<CntContractTaskXNXDDTO> listTaskXnxd) {
		this.listTaskXnxd = listTaskXnxd;
	}

	public Long getCntContractId() {
		return cntContractId;
	}

	public void setCntContractId(Long cntContractId) {
		this.cntContractId = cntContractId;
	}

	public Long getManageQuantityConsXnxdId() {
		return manageQuantityConsXnxdId;
	}

	public void setManageQuantityConsXnxdId(Long manageQuantityConsXnxdId) {
		this.manageQuantityConsXnxdId = manageQuantityConsXnxdId;
	}

	public String getCntContractCode() {
		return cntContractCode;
	}

	public void setCntContractCode(String cntContractCode) {
		this.cntContractCode = cntContractCode;
	}

	public Long getTaskId() {
		return taskId;
	}

	public void setTaskId(Long taskId) {
		this.taskId = taskId;
	}

	public String getTaskName() {
		return taskName;
	}

	public void setTaskName(String taskName) {
		this.taskName = taskName;
	}

	public Double getTaskMassNow() {
		return taskMassNow;
	}

	public void setTaskMassNow(Double taskMassNow) {
		this.taskMassNow = taskMassNow;
	}

	public Long getTaskPrice() {
		return taskPrice;
	}

	public void setTaskPrice(Long taskPrice) {
		this.taskPrice = taskPrice;
	}

	public Long getTotalPriceNow() {
		return totalPriceNow;
	}

	public void setTotalPriceNow(Long totalPriceNow) {
		this.totalPriceNow = totalPriceNow;
	}

	public Long getYear() {
		return year;
	}

	public void setYear(Long year) {
		this.year = year;
	}

	public Long getMonth() {
		return month;
	}

	public void setMonth(Long month) {
		this.month = month;
	}

	public Long getWeek() {
		return week;
	}

	public void setWeek(Long week) {
		this.week = week;
	}

	@Override
	public String catchName() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Long getFWModelId() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public ManageQuantityConsXnxdBO toModel() {
		ManageQuantityConsXnxdBO bo = new ManageQuantityConsXnxdBO();
		bo.setManageQuantityConsXnxdId(this.getManageQuantityConsXnxdId());
		bo.setCntContractCode(this.getCntContractCode());
		bo.setTaskId(this.getTaskId());
		bo.setTaskName(this.getTaskName());
		bo.setTaskMassNow(this.getTaskMassNow());
		bo.setTaskPrice(this.getTaskPrice());
		bo.setTotalPriceNow(this.getTotalPriceNow());
		bo.setYear(this.getYear());
		bo.setMonth(this.getMonth());
		bo.setWeek(this.getWeek());
		bo.setCntContractId(this.cntContractId);
		return bo;
	}

	private Long accumulateYearAgo;
	private Long sourceQuantityYearNow;
	private Long valueQuantityMonth1;
	private Long valueQuantityMonth2;
	private Long valueQuantityMonth3;
	private Long valueQuantityMonth4;
	private Long valueQuantityMonth5;
	private Long valueQuantityMonth6;
	private Long valueQuantityMonth7;
	private Long valueQuantityMonth8;
	private Long valueQuantityMonth9;
	private Long valueQuantityMonth10;
	private Long valueQuantityMonth11;
	private Long valueQuantityMonth12;
	private Long totalQuantityYear;
	private Long accumulateQuantity;
	private Long valueQuantityRest;

	public Long getValueQuantityMonth1() {
		return valueQuantityMonth1;
	}

	public void setValueQuantityMonth1(Long valueQuantityMonth1) {
		this.valueQuantityMonth1 = valueQuantityMonth1;
	}

	public Long getValueQuantityMonth2() {
		return valueQuantityMonth2;
	}

	public void setValueQuantityMonth2(Long valueQuantityMonth2) {
		this.valueQuantityMonth2 = valueQuantityMonth2;
	}

	public Long getValueQuantityMonth3() {
		return valueQuantityMonth3;
	}

	public void setValueQuantityMonth3(Long valueQuantityMonth3) {
		this.valueQuantityMonth3 = valueQuantityMonth3;
	}

	public Long getValueQuantityMonth4() {
		return valueQuantityMonth4;
	}

	public void setValueQuantityMonth4(Long valueQuantityMonth4) {
		this.valueQuantityMonth4 = valueQuantityMonth4;
	}

	public Long getValueQuantityMonth5() {
		return valueQuantityMonth5;
	}

	public void setValueQuantityMonth5(Long valueQuantityMonth5) {
		this.valueQuantityMonth5 = valueQuantityMonth5;
	}

	public Long getValueQuantityMonth6() {
		return valueQuantityMonth6;
	}

	public void setValueQuantityMonth6(Long valueQuantityMonth6) {
		this.valueQuantityMonth6 = valueQuantityMonth6;
	}

	public Long getValueQuantityMonth7() {
		return valueQuantityMonth7;
	}

	public void setValueQuantityMonth7(Long valueQuantityMonth7) {
		this.valueQuantityMonth7 = valueQuantityMonth7;
	}

	public Long getValueQuantityMonth8() {
		return valueQuantityMonth8;
	}

	public void setValueQuantityMonth8(Long valueQuantityMonth8) {
		this.valueQuantityMonth8 = valueQuantityMonth8;
	}

	public Long getValueQuantityMonth9() {
		return valueQuantityMonth9;
	}

	public void setValueQuantityMonth9(Long valueQuantityMonth9) {
		this.valueQuantityMonth9 = valueQuantityMonth9;
	}

	public Long getValueQuantityMonth10() {
		return valueQuantityMonth10;
	}

	public void setValueQuantityMonth10(Long valueQuantityMonth10) {
		this.valueQuantityMonth10 = valueQuantityMonth10;
	}

	public Long getValueQuantityMonth11() {
		return valueQuantityMonth11;
	}

	public void setValueQuantityMonth11(Long valueQuantityMonth11) {
		this.valueQuantityMonth11 = valueQuantityMonth11;
	}

	public Long getValueQuantityMonth12() {
		return valueQuantityMonth12;
	}

	public void setValueQuantityMonth12(Long valueQuantityMonth12) {
		this.valueQuantityMonth12 = valueQuantityMonth12;
	}

	public Long getAccumulateYearAgo() {
		return accumulateYearAgo;
	}

	public void setAccumulateYearAgo(Long accumulateYearAgo) {
		this.accumulateYearAgo = accumulateYearAgo;
	}

	public Long getSourceQuantityYearNow() {
		return sourceQuantityYearNow;
	}

	public void setSourceQuantityYearNow(Long sourceQuantityYearNow) {
		this.sourceQuantityYearNow = sourceQuantityYearNow;
	}

	public Long getTotalQuantityYear() {
		return totalQuantityYear;
	}

	public void setTotalQuantityYear(Long totalQuantityYear) {
		this.totalQuantityYear = totalQuantityYear;
	}

	public Long getAccumulateQuantity() {
		return accumulateQuantity;
	}

	public void setAccumulateQuantity(Long accumulateQuantity) {
		this.accumulateQuantity = accumulateQuantity;
	}

	public Long getValueQuantityRest() {
		return valueQuantityRest;
	}

	public void setValueQuantityRest(Long valueQuantityRest) {
		this.valueQuantityRest = valueQuantityRest;
	}

	private List<Long> listStructure;

	public List<Long> getListStructure() {
		return listStructure;
	}

	public void setListStructure(List<Long> listStructure) {
		this.listStructure = listStructure;
	}
	
}
