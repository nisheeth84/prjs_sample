package com.viettel.aio.bo;

import com.viettel.aio.dto.AIOMonthPlanDTO;
import com.viettel.aio.dto.AIOStaffPlainDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "AIO_STAFF_PLAN")
public class AIOStaffPlanBO extends BaseFWModelImpl {
	@Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @org.hibernate.annotations.Parameter(name = "sequence", value = "AIO_STAFF_PLAN_SEQ")})
	@Column(name = "STAFF_PLAN_ID", length = 10)
	private Long aioStaffPlanId;
	@Column(name = "DESCRIPTION")
	private String description;
	@Column(name = "MONTH")
	private String month;
	@Column(name = "YEAR")
	private String year;
	@Column(name = "STATUS")
	private Long status;
	@Column(name = "SYS_GROUP_ID")
	private Long sysGroupId;
	@Column(name = "SYS_GROUP_CODE")
	private String sysGroupCode;
	@Column(name = "SYS_GROUP_NAME")
	private String sysGroupName;
	@Column(name = "CREATED_USER")
	private Long createdUser;
	@Column(name = "CREATED_DATE")
	private Date createdDate;
	@Column(name = "UPDATE_USER")
	private Long updateUser;
	@Column(name = "UPDATE_DATE")
	private Date updateDate;

	public Long getCreatedUser() {
		return createdUser;
	}

	public void setCreatedUser(Long createdUser) {
		this.createdUser = createdUser;
	}

	public Date getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(Date createdDate) {
		this.createdDate = createdDate;
	}

	public Long getUpdateUser() {
		return updateUser;
	}

	public void setUpdateUser(Long updateUser) {
		this.updateUser = updateUser;
	}

	public Date getUpdateDate() {
		return updateDate;
	}

	public void setUpdateDate(Date updateDate) {
		this.updateDate = updateDate;
	}

	public Long getAioStaffPlanId() {
		return aioStaffPlanId;
	}

	public void setAioStaffPlanId(Long aioStaffPlanId) {
		this.aioStaffPlanId = aioStaffPlanId;
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

	public String getYear() {
		return year;
	}

	public void setYear(String year) {
		this.year = year;
	}

	public Long getStatus() {
		return status;
	}

	public void setStatus(Long status) {
		this.status = status;
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

	@Override
	public AIOStaffPlainDTO toDTO() {
		// TODO Auto-generated method stub
		AIOStaffPlainDTO dto = new AIOStaffPlainDTO();
		dto.setAioStaffPlanId(this.getAioStaffPlanId());
		dto.setSysGroupId(this.getSysGroupId());
		dto.setMonth(this.getMonth());
		dto.setYear(this.getYear());
		dto.setDescription(this.getDescription());
		dto.setStatus(this.getStatus());
		dto.setSysGroupCode(this.getSysGroupCode());
		dto.setSysGroupName(this.getSysGroupName());
		return dto;
	}
	
}
