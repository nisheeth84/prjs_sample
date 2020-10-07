package com.viettel.aio.bo;

import com.viettel.aio.dto.ManageQuantityConsXnxdDTO;
import com.viettel.service.base.dto.BaseFWDTOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@SuppressWarnings("serial")
@Entity(name = "com.viettel.aio.bo.ManageQuantityConsXnxdBO")
@Table(name = "MANAGE_QUANTITY_CONS_XNXD")
public class ManageQuantityConsXnxdBO extends BaseFWModelImpl {

	@Id
	@GeneratedValue(generator = "sequence")
	@GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
			@Parameter(name = "sequence", value = "MANAGE_QUANTITY_CONS_XNXD_SEQ") })
	@Column(name = "MANAGE_QUANTITY_CONS_XNXD_ID", length = 10)
	private Long manageQuantityConsXnxdId;
	@Column(name = "CNT_CONTRACT_CODE")
	private String cntContractCode;
	@Column(name = "TASK_ID", length = 10)
	private Long taskId;
	@Column(name = "TASK_NAME")
	private String taskName;
	@Column(name = "TASK_MASS_NOW", length = 20)
	private Double taskMassNow;
	@Column(name = "TASK_PRICE", length = 10)
	private Long taskPrice;
	@Column(name = "TOTAL_PRICE_NOW", length = 30)
	private Long totalPriceNow;
	@Column(name = "YEAR", length = 5)
	private Long year;
	@Column(name = "MONTH", length = 5)
	private Long month;
	@Column(name = "WEEK", length = 1)
	private Long week;
	@Column(name = "CNT_CONTRACT_ID", length = 1)
	private Long cntContractId;

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
	public BaseFWDTOImpl toDTO() {
		ManageQuantityConsXnxdDTO dto = new ManageQuantityConsXnxdDTO();
		dto.setManageQuantityConsXnxdId(this.getManageQuantityConsXnxdId());
		dto.setCntContractCode(this.getCntContractCode());
		dto.setTaskId(this.getTaskId());
		dto.setTaskName(this.getTaskName());
		dto.setTaskMassNow(this.getTaskMassNow());
		dto.setTaskPrice(this.getTaskPrice());
		dto.setTotalPriceNow(this.getTotalPriceNow());
		dto.setYear(this.getYear());
		dto.setMonth(this.getMonth());
		dto.setWeek(this.getWeek());
		dto.setCntContractId(this.cntContractId);
		return dto;
	}

}
