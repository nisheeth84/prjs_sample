package com.viettel.aio.dto;

import com.viettel.aio.bo.ManageRevenueConsXnxdBO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import javax.xml.bind.annotation.XmlRootElement;
import java.util.List;

@SuppressWarnings("serial")
@XmlRootElement(name = "MANAGE_REVENUE_CONS_XNXDBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class ManageRevenueConsXnxdDTO extends ComsBaseFWDTO<ManageRevenueConsXnxdBO> {

	private Long manageRevenueConsXnxdId;
	private Long year;
	private Long cntContractId;
	private String cntContractCode;
	private String content;
	private Long catPartnerId;
	private String catPartnerName;
	private Long cntContractPrice;
	private String structureFilter;
	private Double coefficient;
	private String description;
	private Double profitRate;
	private Long accumulateYearAgo;
	private Long month1;
	private Long month2;
	private Long month3;
	private Long month4;
	private Long month5;
	private Long month6;
	private Long month7;
	private Long month8;
	private Long month9;
	private Long month10;
	private Long month11;
	private Long month12;
	private Long sourceRevenueRest;
	private Long totalQuantityYear;
	private Long accumulateRevenue;
	private Long valueQuantityNotRevenue;
	private Long profit;

	public Long getSourceRevenueRest() {
		return sourceRevenueRest;
	}

	public void setSourceRevenueRest(Long sourceRevenueRest) {
		this.sourceRevenueRest = sourceRevenueRest;
	}

	public Long getTotalQuantityYear() {
		return totalQuantityYear;
	}

	public void setTotalQuantityYear(Long totalQuantityYear) {
		this.totalQuantityYear = totalQuantityYear;
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


	public Long getProfit() {
		return profit;
	}

	public void setProfit(Long profit) {
		this.profit = profit;
	}

	public Long getManageRevenueConsXnxdId() {
		return manageRevenueConsXnxdId;
	}

	public void setManageRevenueConsXnxdId(Long manageRevenueConsXnxdId) {
		this.manageRevenueConsXnxdId = manageRevenueConsXnxdId;
	}

	public Long getYear() {
		return year;
	}

	public void setYear(Long year) {
		this.year = year;
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

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Double getProfitRate() {
		return profitRate;
	}

	public void setProfitRate(Double profitRate) {
		this.profitRate = profitRate;
	}

	public Long getAccumulateYearAgo() {
		return accumulateYearAgo;
	}

	public void setAccumulateYearAgo(Long accumulateYearAgo) {
		this.accumulateYearAgo = accumulateYearAgo;
	}

	public Long getMonth1() {
		return month1;
	}

	public void setMonth1(Long month1) {
		this.month1 = month1;
	}

	public Long getMonth2() {
		return month2;
	}

	public void setMonth2(Long month2) {
		this.month2 = month2;
	}

	public Long getMonth3() {
		return month3;
	}

	public void setMonth3(Long month3) {
		this.month3 = month3;
	}

	public Long getMonth4() {
		return month4;
	}

	public void setMonth4(Long month4) {
		this.month4 = month4;
	}

	public Long getMonth5() {
		return month5;
	}

	public void setMonth5(Long month5) {
		this.month5 = month5;
	}

	public Long getMonth6() {
		return month6;
	}

	public void setMonth6(Long month6) {
		this.month6 = month6;
	}

	public Long getMonth7() {
		return month7;
	}

	public void setMonth7(Long month7) {
		this.month7 = month7;
	}

	public Long getMonth8() {
		return month8;
	}

	public void setMonth8(Long month8) {
		this.month8 = month8;
	}

	public Long getMonth9() {
		return month9;
	}

	public void setMonth9(Long month9) {
		this.month9 = month9;
	}

	public Long getMonth10() {
		return month10;
	}

	public void setMonth10(Long month10) {
		this.month10 = month10;
	}

	public Long getMonth11() {
		return month11;
	}

	public void setMonth11(Long month11) {
		this.month11 = month11;
	}

	public Long getMonth12() {
		return month12;
	}

	public void setMonth12(Long month12) {
		this.month12 = month12;
	}

	private List<Long> listStructure;
	
	
	public List<Long> getListStructure() {
		return listStructure;
	}

	public void setListStructure(List<Long> listStructure) {
		this.listStructure = listStructure;
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
	public ManageRevenueConsXnxdBO toModel() {
		// TODO Auto-generated method stub
		ManageRevenueConsXnxdBO bo = new ManageRevenueConsXnxdBO();
		bo.setManageRevenueConsXnxdId(this.getManageRevenueConsXnxdId());
		bo.setCntContractId(this.getCntContractId());
		bo.setCntContractCode(this.getCntContractCode());
		bo.setYear(this.getYear());
		bo.setMonth1(this.getMonth1());
		bo.setMonth2(this.getMonth2());
		bo.setMonth3(this.getMonth3());
		bo.setMonth4(this.getMonth4());
		bo.setMonth5(this.getMonth5());
		bo.setMonth6(this.getMonth6());
		bo.setMonth7(this.getMonth7());
		bo.setMonth8(this.getMonth8());
		bo.setMonth9(this.getMonth9());
		bo.setMonth10(this.getMonth10());
		bo.setMonth11(this.getMonth11());
		bo.setMonth12(this.getMonth12());
//		bo.setProfitRate(this.getProfitRate());
//		bo.setCoefficient(this.getCoefficient());
		bo.setDescription(this.getDescription());
		return bo;
	}

}
