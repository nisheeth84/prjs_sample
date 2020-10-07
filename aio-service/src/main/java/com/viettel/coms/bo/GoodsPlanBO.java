package com.viettel.coms.bo;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import com.viettel.coms.dto.GoodsPlanDTO;
import com.viettel.service.base.dto.BaseFWDTOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;

@Entity
@Table(name = "GOODS_PLAN")
/**
*
* @author: Hoangnh38
* @version: 1.0
* @since: 1.0
*/
public class GoodsPlanBO extends BaseFWModelImpl{
	private Long goodsPlanId;
	private String code;
	private String name;
	private String baseContent;
	private String performContent;
	private Date createdDate;
	private Long createdUserId;
	private Date updateDate;
	private Long updateUserId;
	private String status;
	private String signState;
	
	@Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
    @Parameter(name = "sequence", value = "GOODS_PLAN_SEQ")})
    @Column(name = "GOODS_PLAN_ID", length = 10)
	public Long getGoodsPlanId() {
		return goodsPlanId;
	}
	public void setGoodsPlanId(Long goodsPlanId) {
		this.goodsPlanId = goodsPlanId;
	}
	
	@Column(name = "CODE")
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	
	@Column(name = "NAME")
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	
	@Column(name = "BASE_CONTENT")
	public String getBaseContent() {
		return baseContent;
	}
	public void setBaseContent(String baseContent) {
		this.baseContent = baseContent;
	}
	
	@Column(name = "PERFORM_CONTENT")
	public String getPerformContent() {
		return performContent;
	}
	public void setPerformContent(String performContent) {
		this.performContent = performContent;
	}
	
	@Column(name = "CREATED_DATE")
	public Date getCreatedDate() {
		return createdDate;
	}
	public void setCreatedDate(Date createdDate) {
		this.createdDate = createdDate;
	}
	
	@Column(name = "CREATED_USER_ID", length = 10)
	public Long getCreatedUserId() {
		return createdUserId;
	}
	public void setCreatedUserId(Long createdUserId) {
		this.createdUserId = createdUserId;
	}
	
	@Column(name = "UPDATED_DATE")
	public Date getUpdateDate() {
		return updateDate;
	}
	public void setUpdateDate(Date updateDate) {
		this.updateDate = updateDate;
	}
	
	@Column(name = "UPDATED_USER_ID", length = 10)
	public Long getUpdateUserId() {
		return updateUserId;
	}
	public void setUpdateUserId(Long updateUserId) {
		this.updateUserId = updateUserId;
	}
	
	@Column(name = "STATUS", length = 1)
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	
	@Column(name = "SIGN_STATE", length = 1)
	public String getSignState() {
		return signState;
	}
	public void setSignState(String signState) {
		this.signState = signState;
	}
	@Override
    public GoodsPlanDTO toDTO() {
		GoodsPlanDTO goodsPlanDTO = new GoodsPlanDTO();
		goodsPlanDTO.setGoodsPlanId(this.goodsPlanId);
		goodsPlanDTO.setCode(this.code);
		goodsPlanDTO.setName(this.name);
		goodsPlanDTO.setBaseContent(this.baseContent);
		goodsPlanDTO.setPerformContent(this.performContent);
		goodsPlanDTO.setCreatedDate(this.createdDate);
		goodsPlanDTO.setCreatedUserId(this.createdUserId);
		goodsPlanDTO.setUpdateDate(this.updateDate);
		goodsPlanDTO.setUpdateUserId(this.updateUserId);
		goodsPlanDTO.setStatus(this.status);
		goodsPlanDTO.setSignState(this.signState);
		return goodsPlanDTO;
	}
	
	
}
