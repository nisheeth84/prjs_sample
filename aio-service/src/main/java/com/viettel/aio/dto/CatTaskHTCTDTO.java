/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.aio.dto;

import com.viettel.aio.bo.CatTaskHTCTBO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import javax.xml.bind.annotation.XmlRootElement;


/**
 *
 * @author thuannht
 */
@JsonIgnoreProperties(ignoreUnknown = true)
@XmlRootElement(name = "CAT_TASK_HTCTBO")
public class CatTaskHTCTDTO extends ComsBaseFWDTO<CatTaskHTCTBO> {

	private Long updatedUser;
	private Long catTaskId;
	private Long catUnitId;
	private Long catWorkItemTypeId;
	private String name;
	private String description;
	private String code;
	private String status;
	private java.util.Date createdDate;
	private java.util.Date updatedDate;
	private Long createdUser;
	private String catWorkItemTypeName;
	private String catUnitName;
	private Long taskOrder;
//	hungnx 20180621 start
	private String quantityByDate;
//	hungnx 20180621 end

	private Long catProvinceId ;


	public Long getCatProvinceId() {
		return catProvinceId;
	}

	public void setCatProvinceId(Long catProvinceId) {
		this.catProvinceId = catProvinceId;
	}

	@Override
	public CatTaskHTCTBO toModel() {
		CatTaskHTCTBO catTaskBO = new CatTaskHTCTBO();
		catTaskBO.setUpdatedUser(this.updatedUser);
		catTaskBO.setCatTaskId(this.catTaskId);
		catTaskBO.setCatUnitId(this.catUnitId);
		catTaskBO.setCatWorkItemTypeId(this.catWorkItemTypeId);
		catTaskBO.setName(this.name);
		catTaskBO.setDescription(this.description);
		catTaskBO.setCode(this.code);
		catTaskBO.setStatus(this.status);
		catTaskBO.setCreatedDate(this.createdDate);
		catTaskBO.setUpdatedDate(this.updatedDate);
		catTaskBO.setCreatedUser(this.createdUser);
		catTaskBO.setTaskOrder(this.taskOrder);
		catTaskBO.setQuantityByDate(this.quantityByDate);
		return catTaskBO;
	}

	public String getCatWorkItemTypeName() {
		return catWorkItemTypeName;
	}

	public void setCatWorkItemTypeName(String catWorkItemTypeName) {
		this.catWorkItemTypeName = catWorkItemTypeName;
	}

	public String getCatUnitName() {
		return catUnitName;
	}

	public void setCatUnitName(String catUnitName) {
		this.catUnitName = catUnitName;
	}

	public Long getUpdatedUser() {
		return updatedUser;
	}

	public void setUpdatedUser(Long updatedUser) {
		this.updatedUser = updatedUser;
	}

	@Override
	public Long getFWModelId() {
		return catTaskId;
	}

	@Override
	public String catchName() {
		return getCatTaskId().toString();
	}

	public Long getCatTaskId() {
		return catTaskId;
	}

	public void setCatTaskId(Long catTaskId) {
		this.catTaskId = catTaskId;
	}

	public Long getCatUnitId() {
		return catUnitId;
	}

	public void setCatUnitId(Long catUnitId) {
		this.catUnitId = catUnitId;
	}

	public Long getCatWorkItemTypeId() {
		return catWorkItemTypeId;
	}

	public void setCatWorkItemTypeId(Long catWorkItemTypeId) {
		this.catWorkItemTypeId = catWorkItemTypeId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public java.util.Date getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(java.util.Date createdDate) {
		this.createdDate = createdDate;
	}

	public java.util.Date getUpdatedDate() {
		return updatedDate;
	}

	public void setUpdatedDate(java.util.Date updatedDate) {
		this.updatedDate = updatedDate;
	}

	public Long getCreatedUser() {
		return createdUser;
	}

	public void setCreatedUser(Long createdUser) {
		this.createdUser = createdUser;
	}

	public Long getTaskOrder() {
		return taskOrder;
	}

	public void setTaskOrder(Long taskOrder) {
		this.taskOrder = taskOrder;
	}

	public String getQuantityByDate() {
		return quantityByDate;
	}

	public void setQuantityByDate(String quantityByDate) {
		this.quantityByDate = quantityByDate;
	}

}
