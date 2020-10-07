package com.viettel.coms.bo;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import com.viettel.coms.dto.manufacturingVT_DTO;
import com.viettel.service.base.model.BaseFWModelImpl;

@Entity
@Table(name = "GOODS_PLAN")
public class manufacturingVTBO extends BaseFWModelImpl{

//	@Override
//	public BaseFWDTOImpl toDTO() {
//		// TODO Auto-generated method stub
//		return null;
//	}
	
	private Long createdUserId;
	private Date updatedDate;
	private Long updatedUserId;
    private Date createdDate;
    private Long status;
    private String baseContent;
    private String performContent;
    private Long goodsPlanId;
    private String code;
    private String name;
    private Long signState;
    
    
    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
    @Parameter(name = "sequence", value = "GOODS_PLAN_SEQ")})
    @Column(name = "GOODS_PLAN_ID", length = 22)
	public Long getGoodsPlanId() {
		return goodsPlanId;
	}
	public void setGoodsPlanId(Long goodsPlanId) {
		this.goodsPlanId = goodsPlanId;
	}
	@Column(name = "CREATED_DATE", length = 22)
	public Date getCreatedDate() {
		return createdDate;
	}
	public void setCreatedDate(Date createdDate) {
		this.createdDate = createdDate;
	}
	@Column(name = "STATUS", length = 22)
	public Long getStatus() {
		return status;
	}
	public void setStatus(Long status) {
		this.status = status;
	}
	@Column(name = "BASE_CONTENT", length = 22)
	public String getBaseContent() {
		return baseContent;
	}
	public void setBaseContent(String baseContent) {
		this.baseContent = baseContent;
	}
	@Column(name = "PERFORM_CONTENT", length = 22)
	public String getPerformContent() {
		return performContent;
	}
	public void setPerformContent(String performContent) {
		this.performContent = performContent;
	}
	@Column(name = "CREATED_USER_ID", length = 22)
	public Long getCreatedUserId() {
		return createdUserId;
	}
	public void setCreatedUserId(Long createdUserId) {
		this.createdUserId = createdUserId;
	}
	@Column(name = "UPDATED_DATE", length = 22)
	public Date getUpdatedDate() {
		return updatedDate;
	}
	public void setUpdatedDate(Date updatedDate) {
		this.updatedDate = updatedDate;
	}
	@Column(name = "UPDATED_USER_ID", length = 22)
	public Long getUpdatedUserId() {
		return updatedUserId;
	}
	public void setUpdatedUserId(Long updatedUserId) {
		this.updatedUserId = updatedUserId;
	}
	
	@Column(name = "CODE", length = 22)
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	@Column(name = "NAME", length = 22)
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	@Column(name = "SIGN_STATE", length = 22)
	public Long getSignState() {
		return signState;
	}
	public void setSignState(Long signState) {
		this.signState = signState;
	}
	@Override
    public manufacturingVT_DTO toDTO() {
		manufacturingVT_DTO manufacturingvt_DTO = new manufacturingVT_DTO();
        // set cac gia tri
		manufacturingvt_DTO.setGoodsPlanId(this.goodsPlanId);
		manufacturingvt_DTO.setCode(this.code);
		manufacturingvt_DTO.setName(this.name);
		manufacturingvt_DTO.setSignState(this.signState);
		manufacturingvt_DTO.setStatus(this.status);
        manufacturingvt_DTO.setBaseContent(this.baseContent);
        manufacturingvt_DTO.setPerformContent(this.performContent);
        
        
        manufacturingvt_DTO.setCreatedUserId(this.createdUserId);
        manufacturingvt_DTO.setUpdatedDate(this.updatedDate);
        manufacturingvt_DTO.setUpdatedUserId(this.updatedUserId);
        return manufacturingvt_DTO;
    }

}
