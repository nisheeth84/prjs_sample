package com.viettel.coms.dto;

import java.util.Date;

public class CatWorkItemTypeDTO {
	private Long catWorkItemTypeId;
	private String code;
	private String name;
	private String status;
	private String description;
	private Long catConstructionTypeId;
	private Date createdDate;
	private Date updateDate;
	private String createdUser;
	private String updateUser;
	private String itemOrder;
	private String tab;
	private Date quantityByDate;
	private Long catWorkItemGroupId;
	private String type;

	public Long getCatWorkItemTypeId() {
		return catWorkItemTypeId;
	}

	public void setCatWorkItemTypeId(Long catWorkItemTypeId) {
		this.catWorkItemTypeId = catWorkItemTypeId;
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

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Long getCatConstructionTypeId() {
		return catConstructionTypeId;
	}

	public void setCatConstructionTypeId(Long catConstructionTypeId) {
		this.catConstructionTypeId = catConstructionTypeId;
	}

	public Date getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(Date createdDate) {
		this.createdDate = createdDate;
	}

	public Date getUpdateDate() {
		return updateDate;
	}

	public void setUpdateDate(Date updateDate) {
		this.updateDate = updateDate;
	}

	public String getCreatedUser() {
		return createdUser;
	}

	public void setCreatedUser(String createdUser) {
		this.createdUser = createdUser;
	}

	public String getUpdateUser() {
		return updateUser;
	}

	public void setUpdateUser(String updateUser) {
		this.updateUser = updateUser;
	}

	public String getItemOrder() {
		return itemOrder;
	}

	public void setItemOrder(String itemOrder) {
		this.itemOrder = itemOrder;
	}

	public String getTab() {
		return tab;
	}

	public void setTab(String tab) {
		this.tab = tab;
	}

	public Date getQuantityByDate() {
		return quantityByDate;
	}

	public void setQuantityByDate(Date quantityByDate) {
		this.quantityByDate = quantityByDate;
	}

	public Long getCatWorkItemGroupId() {
		return catWorkItemGroupId;
	}

	public void setCatWorkItemGroupId(Long catWorkItemGroupId) {
		this.catWorkItemGroupId = catWorkItemGroupId;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

}
