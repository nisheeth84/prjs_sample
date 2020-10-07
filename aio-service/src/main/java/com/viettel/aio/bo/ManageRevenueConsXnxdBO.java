package com.viettel.aio.bo;

import com.viettel.aio.dto.ManageRevenueConsXnxdDTO;
import com.viettel.service.base.dto.BaseFWDTOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@SuppressWarnings("serial")
@Entity(name = "com.viettel.aio.bo.ManageRevenueConsXnxdBO")
@Table(name = "MANAGE_REVENUE_CONS_XNXD")
public class ManageRevenueConsXnxdBO extends BaseFWModelImpl {

	@Id
	@GeneratedValue(generator = "sequence")
	@GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
			@Parameter(name = "sequence", value = "MANAGE_REVENUE_CONS_XNXD_SEQ") })
	@Column(name = "MANAGE_REVENUE_CONS_XNXD_ID", length = 10)
	private Long manageRevenueConsXnxdId;
	@Column(name = "CNT_CONTRACT_ID", length = 10)
	private Long cntContractId;
	@Column(name = "CNT_CONTRACT_CODE")
	private String cntContractCode;
	@Column(name = "YEAR", length = 5)
	private Long year;
	@Column(name = "MONTH_1", length = 30)
	private Long month1;
	@Column(name = "MONTH_2", length = 30)
	private Long month2;
	@Column(name = "MONTH_3", length = 30)
	private Long month3;
	@Column(name = "MONTH_4", length = 30)
	private Long month4;
	@Column(name = "MONTH_5", length = 30)
	private Long month5;
	@Column(name = "MONTH_6", length = 30)
	private Long month6;
	@Column(name = "MONTH_7", length = 30)
	private Long month7;
	@Column(name = "MONTH_8", length = 30)
	private Long month8;
	@Column(name = "MONTH_9", length = 30)
	private Long month9;
	@Column(name = "MONTH_10", length = 30)
	private Long month10;
	@Column(name = "MONTH_11", length = 30)
	private Long month11;
	@Column(name = "MONTH_12", length = 30)
	private Long month12;
	@Column(name = "PROFIT_RATE", length = 5)
	private Double profitRate;
	@Column(name = "COEFFICIENT", length = 5)
	private Double coefficient;
	@Column(name = "DESCRIPTION")
	private String description;

	public Long getManageRevenueConsXnxdId() {
		return manageRevenueConsXnxdId;
	}

	public void setManageRevenueConsXnxdId(Long manageRevenueConsXnxdId) {
		this.manageRevenueConsXnxdId = manageRevenueConsXnxdId;
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

	public Long getYear() {
		return year;
	}

	public void setYear(Long year) {
		this.year = year;
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

	public Double getProfitRate() {
		return profitRate;
	}

	public void setProfitRate(Double profitRate) {
		this.profitRate = profitRate;
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

	@Override
	public BaseFWDTOImpl toDTO() {
		// TODO Auto-generated method stub
		ManageRevenueConsXnxdDTO dto = new ManageRevenueConsXnxdDTO();
		dto.setManageRevenueConsXnxdId(this.getManageRevenueConsXnxdId());
		dto.setCntContractId(this.getCntContractId());
		dto.setCntContractCode(this.getCntContractCode());
		dto.setYear(this.getYear());
		dto.setMonth1(this.getMonth1());
		dto.setMonth2(this.getMonth2());
		dto.setMonth3(this.getMonth3());
		dto.setMonth4(this.getMonth4());
		dto.setMonth5(this.getMonth5());
		dto.setMonth6(this.getMonth6());
		dto.setMonth7(this.getMonth7());
		dto.setMonth8(this.getMonth8());
		dto.setMonth9(this.getMonth9());
		dto.setMonth10(this.getMonth10());
		dto.setMonth11(this.getMonth11());
		dto.setMonth12(this.getMonth12());
		dto.setProfitRate(this.getProfitRate());
		dto.setCoefficient(this.getCoefficient());
		dto.setDescription(this.getDescription());
		return dto;
	}

}
