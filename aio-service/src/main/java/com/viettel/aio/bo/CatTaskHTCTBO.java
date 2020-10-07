/* 
* Copyright 2011 Viettel Telecom. All rights reserved. 
* VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms. 
 */
package com.viettel.aio.bo;

import com.viettel.aio.dto.CatTaskHTCTDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@Entity
@Table(name = "CAT_TASK_HTCT")
/**
 *
 * @author: ThuanNHT
 * @version: 1.0
 * @since: 1.0
 */
public class CatTaskHTCTBO extends BaseFWModelImpl {

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
	private Long taskOrder;
//	hungnx 20180621 start
	private String quantityByDate;
//	hungnx 20180621 end

	@Column(name = "UPDATED_USER", length = 22)
	public Long getUpdatedUser() {
		return updatedUser;
	}

	public void setUpdatedUser(Long updatedUser) {
		this.updatedUser = updatedUser;
	}

	@Id
	@GeneratedValue(generator = "sequence")
	@GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
			@Parameter(name = "sequence", value = "CAT_TASK_HTCT_SEQ") })
	@Column(name = "CAT_TASK_ID", length = 22)
	public Long getCatTaskId() {
		return catTaskId;
	}

	public void setCatTaskId(Long catTaskId) {
		this.catTaskId = catTaskId;
	}

	@Column(name = "CAT_UNIT_ID", length = 22)
	public Long getCatUnitId() {
		return catUnitId;
	}

	public void setCatUnitId(Long catUnitId) {
		this.catUnitId = catUnitId;
	}

	@Column(name = "CAT_WORK_ITEM_TYPE_ID", length = 22)
	public Long getCatWorkItemTypeId() {
		return catWorkItemTypeId;
	}

	public void setCatWorkItemTypeId(Long catWorkItemTypeId) {
		this.catWorkItemTypeId = catWorkItemTypeId;
	}

	@Column(name = "NAME", length = 400)
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "DESCRIPTION", length = 2000)
	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	@Column(name = "CODE", length = 100)
	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	@Column(name = "STATUS", length = 2)
	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	@Column(name = "CREATED_DATE", length = 7)
	public java.util.Date getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(java.util.Date createdDate) {
		this.createdDate = createdDate;
	}

	@Column(name = "UPDATED_DATE", length = 7)
	public java.util.Date getUpdatedDate() {
		return updatedDate;
	}

	public void setUpdatedDate(java.util.Date updatedDate) {
		this.updatedDate = updatedDate;
	}

	@Column(name = "CREATED_USER", length = 22)
	public Long getCreatedUser() {
		return createdUser;
	}

	public void setCreatedUser(Long createdUser) {
		this.createdUser = createdUser;
	}

	@Column(name = "TASK_ORDER", length = 10)
	public Long getTaskOrder() {
		return taskOrder;
	}

	public void setTaskOrder(Long taskOrder) {
		this.taskOrder = taskOrder;
	}

	@Override
	public CatTaskHTCTDTO toDTO() {
		CatTaskHTCTDTO catTaskDTO = new CatTaskHTCTDTO();
		// set cac gia tri
		catTaskDTO.setUpdatedUser(this.updatedUser);
		catTaskDTO.setCatTaskId(this.catTaskId);
		catTaskDTO.setCatUnitId(this.catUnitId);
		catTaskDTO.setCatWorkItemTypeId(this.catWorkItemTypeId);
		catTaskDTO.setName(this.name);
		catTaskDTO.setDescription(this.description);
		catTaskDTO.setCode(this.code);
		catTaskDTO.setStatus(this.status);
		catTaskDTO.setCreatedDate(this.createdDate);
		catTaskDTO.setUpdatedDate(this.updatedDate);
		catTaskDTO.setCreatedUser(this.createdUser);
		catTaskDTO.setTaskOrder(this.taskOrder);
		catTaskDTO.setQuantityByDate(quantityByDate);
		return catTaskDTO;
	}

	@Column(name = "QUANTITY_BY_DATE", length = 2)
	public String getQuantityByDate() {
		return quantityByDate;
	}

	public void setQuantityByDate(String quantityByDate) {
		this.quantityByDate = quantityByDate;
	}
}
