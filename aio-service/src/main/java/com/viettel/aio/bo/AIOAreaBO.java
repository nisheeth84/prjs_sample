package com.viettel.aio.bo;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

import com.viettel.aio.dto.AIOAreaDTO;
import com.viettel.service.base.dto.BaseFWDTOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;

@Entity
@Table(name = "AIO_AREA")
public class AIOAreaBO extends BaseFWModelImpl{

	@Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @org.hibernate.annotations.Parameter(name = "sequence", value = "AIO_AREA_SEQ")})
	@Column(name = "AREA_ID", length = 10)
	private Long areaId;
	@Column(name = "CODE")
	private String code;
	@Column(name = "NAME")
	private String name;
	@Column(name = "PARENT_ID")
	private Long parentId;
	@Column(name = "STATUS")
	private String status;
	@Column(name = "PATH")
	private String path;
	@Column(name = "EFFECT_DATE")
	private Date effectDate;
	@Column(name = "END_DATE")
	private Date endDate;
	@Column(name = "AREA_NAME_LEVEL1")
	private String areaNameLevel1;
	@Column(name = "AREA_NAME_LEVEL2")
	private String areaNameLevel2;
	@Column(name = "AREA_NAME_LEVEL3")
	private String areaNameLevel3;
	@Column(name = "AREA_ORDER")
	private String areaOrder;
	@Column(name = "AREA_LEVEL")
	private String areaLevel;
	@Column(name = "SYS_USER_ID")
	private Long sysUserId;
	@Column(name = "EMPLOYEE_CODE")
	private String employeeCode;
	@Column(name = "FULL_NAME")
	private String fullName;
	@Column(name = "PROVINCE_ID")
	private Long provinceId;
	//VietNT_12/08/2019_start
	@Column(name = "SALE_SYS_USER_ID")
	private Long saleSysUserId;
	@Column(name = "SALE_EMPLOYEE_CODE")
	private String saleEmployeeCode;
	@Column(name = "SALE_FULL_NAME")
	private String saleFullName;
	//VietNT_end

	public Long getSaleSysUserId() {
		return saleSysUserId;
	}

	public void setSaleSysUserId(Long saleSysUserId) {
		this.saleSysUserId = saleSysUserId;
	}

	public String getSaleEmployeeCode() {
		return saleEmployeeCode;
	}

	public void setSaleEmployeeCode(String saleEmployeeCode) {
		this.saleEmployeeCode = saleEmployeeCode;
	}

	public String getSaleFullName() {
		return saleFullName;
	}

	public void setSaleFullName(String saleFullName) {
		this.saleFullName = saleFullName;
	}

	public Long getAreaId() {
		return areaId;
	}

	public void setAreaId(Long areaId) {
		this.areaId = areaId;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Long getParentId() {
		return parentId;
	}

	public void setParentId(Long parentId) {
		this.parentId = parentId;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	public Date getEffectDate() {
		return effectDate;
	}

	public void setEffectDate(Date effectDate) {
		this.effectDate = effectDate;
	}

	public Date getEndDate() {
		return endDate;
	}

	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}

	public String getAreaNameLevel1() {
		return areaNameLevel1;
	}

	public void setAreaNameLevel1(String areaNameLevel1) {
		this.areaNameLevel1 = areaNameLevel1;
	}

	public String getAreaNameLevel2() {
		return areaNameLevel2;
	}

	public void setAreaNameLevel2(String areaNameLevel2) {
		this.areaNameLevel2 = areaNameLevel2;
	}

	public String getAreaNameLevel3() {
		return areaNameLevel3;
	}

	public void setAreaNameLevel3(String areaNameLevel3) {
		this.areaNameLevel3 = areaNameLevel3;
	}

	public String getAreaOrder() {
		return areaOrder;
	}

	public void setAreaOrder(String areaOrder) {
		this.areaOrder = areaOrder;
	}

	public String getAreaLevel() {
		return areaLevel;
	}

	public void setAreaLevel(String areaLevel) {
		this.areaLevel = areaLevel;
	}

	public Long getSysUserId() {
		return sysUserId;
	}

	public void setSysUserId(Long sysUserId) {
		this.sysUserId = sysUserId;
	}

	public String getEmployeeCode() {
		return employeeCode;
	}

	public void setEmployeeCode(String employeeCode) {
		this.employeeCode = employeeCode;
	}

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public Long getProvinceId() {
		return provinceId;
	}

	public void setProvinceId(Long provinceId) {
		this.provinceId = provinceId;
	}

	@Override
	public AIOAreaDTO toDTO() {
		AIOAreaDTO dto = new AIOAreaDTO();
		dto.setAreaId(this.getAreaId());
		dto.setCode(this.getCode());
		dto.setName(this.getName());
		dto.setParentId(this.getParentId());
		dto.setStatus(this.getStatus());
		dto.setPath(this.getPath());
		dto.setEffectDate(this.getEffectDate());
		dto.setEndDate(this.getEndDate());
		dto.setAreaNameLevel1(this.getAreaNameLevel1());
		dto.setAreaNameLevel2(this.getAreaNameLevel2());
		dto.setAreaNameLevel3(this.getAreaNameLevel3());
		dto.setAreaOrder(this.getAreaOrder());
		dto.setAreaLevel(this.getAreaLevel());
		dto.setSysUserId(this.getSysUserId());
		dto.setEmployeeCode(this.getEmployeeCode());
		dto.setFullName(this.getFullName());
		dto.setProvinceId(this.getProvinceId());
		return dto;
	}

}
