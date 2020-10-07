package com.viettel.aio.bo;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

import com.viettel.aio.dto.AIOMonthPlanDTO;
import com.viettel.service.base.dto.BaseFWDTOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;

@Entity
@Table(name = "AIO_MONTH_PLAN")
public class AIOMonthPlanBO extends BaseFWModelImpl {
	
	@Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @org.hibernate.annotations.Parameter(name = "sequence", value = "AIO_MONTH_PLAN_SEQ")})
	@Column(name = "AIO_MONTH_PLAN_ID", length = 10)
	private Long aioMonthPlanId;
	@Column(name = "DESCRIPTION")
	private String description;
	@Column(name = "MONTH")
	private String month;
	@Column(name = "STATUS")
	private String status;
	@Column(name = "YEAR")
	private String year;
	
	public Long getAioMonthPlanId() {
		return aioMonthPlanId;
	}



	public void setAioMonthPlanId(Long aioMonthPlanId) {
		this.aioMonthPlanId = aioMonthPlanId;
	}



	public String getDescription() {
		return description;
	}



	public void setDescription(String description) {
		this.description = description;
	}



	public String getMonth() {
		return month;
	}



	public void setMonth(String month) {
		this.month = month;
	}



	public String getStatus() {
		return status;
	}



	public void setStatus(String status) {
		this.status = status;
	}



	public String getYear() {
		return year;
	}



	public void setYear(String year) {
		this.year = year;
	}



	@Override
	public AIOMonthPlanDTO toDTO() {
		// TODO Auto-generated method stub
		AIOMonthPlanDTO aIOMonthPlanDTO = new AIOMonthPlanDTO();
		aIOMonthPlanDTO.setAioMonthPlanId(this.aioMonthPlanId);
		aIOMonthPlanDTO.setMonth(this.month);
		aIOMonthPlanDTO.setYear(this.year);
		aIOMonthPlanDTO.setDescription(this.description);
		aIOMonthPlanDTO.setStatus(this.status);
		return aIOMonthPlanDTO;
	}
	
}
