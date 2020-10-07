package com.viettel.aio.dto;

import com.viettel.aio.bo.AIOOrderCompanyBO;
import com.viettel.coms.dto.ComsBaseFWDTO;
import com.viettel.erp.utils.JsonDateDeserializer;
import com.viettel.erp.utils.JsonDateSerializerDate;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import javax.persistence.Column;
import javax.xml.bind.annotation.XmlRootElement;
import java.util.Date;
import java.util.List;

//VietNT_20190903_create
@XmlRootElement(name = "AIO_ORDER_COMPANYBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class AIOOrderCompanyDTO extends ComsBaseFWDTO<AIOOrderCompanyBO> {

    private Long orderCompanyId;
    private String orderCompanyCode;
    private Long status;
    private Long signState;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date createdDate;
    private Long createdId;
    private String cancelDescription;
    private Long cancelUserId;

    // dto only
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date startDate;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date endDate;

    private String sysUserName;
    private String sysUserCode;
    private String sysGroupCode;
    private String createdDateStr;
    private List<Long> idList;
    private List<AIOOrderCompanyDetailDTO> detailDTOS;
//    private List<Long> orderDetailIdList;


    public List<Long> getIdList() {
        return idList;
    }

    public void setIdList(List<Long> idList) {
        this.idList = idList;
    }

    public List<AIOOrderCompanyDetailDTO> getDetailDTOS() {
        return detailDTOS;
    }

    public void setDetailDTOS(List<AIOOrderCompanyDetailDTO> detailDTOS) {
        this.detailDTOS = detailDTOS;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public String getSysUserName() {
        return sysUserName;
    }

    public void setSysUserName(String sysUserName) {
        this.sysUserName = sysUserName;
    }

    public String getSysUserCode() {
        return sysUserCode;
    }

    public void setSysUserCode(String sysUserCode) {
        this.sysUserCode = sysUserCode;
    }

    public String getSysGroupCode() {
        return sysGroupCode;
    }

    public void setSysGroupCode(String sysGroupCode) {
        this.sysGroupCode = sysGroupCode;
    }

    public String getCreatedDateStr() {
        return createdDateStr;
    }

    public void setCreatedDateStr(String createdDateStr) {
        this.createdDateStr = createdDateStr;
    }

    public Long getOrderCompanyId() {
        return orderCompanyId;
    }

    public void setOrderCompanyId(Long orderCompanyId) {
        this.orderCompanyId = orderCompanyId;
    }

    public String getOrderCompanyCode() {
        return orderCompanyCode;
    }

    public void setOrderCompanyCode(String orderCompanyCode) {
        this.orderCompanyCode = orderCompanyCode;
    }

    public Long getStatus() {
        return status;
    }

    public void setStatus(Long status) {
        this.status = status;
    }

    public Long getSignState() {
        return signState;
    }

    public void setSignState(Long signState) {
        this.signState = signState;
    }

    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    public Long getCreatedId() {
        return createdId;
    }

    public void setCreatedId(Long createdId) {
        this.createdId = createdId;
    }

    public String getCancelDescription() {
        return cancelDescription;
    }

    public void setCancelDescription(String cancelDescription) {
        this.cancelDescription = cancelDescription;
    }

    public Long getCancelUserId() {
        return cancelUserId;
    }

    public void setCancelUserId(Long cancelUserId) {
        this.cancelUserId = cancelUserId;
    }

    @Override
    public AIOOrderCompanyBO toModel() {
        AIOOrderCompanyBO bo = new AIOOrderCompanyBO();
        bo.setOrderCompanyId(this.getOrderCompanyId());
        bo.setOrderCompanyCode(this.getOrderCompanyCode());
        bo.setStatus(this.getStatus());
        bo.setSignState(this.getSignState());
        bo.setCreatedDate(this.getCreatedDate());
        bo.setCreatedUser(this.createdUser);
        bo.setUpdateDate(this.updateDate);
        bo.setUpdateUser(this.updateUser);
        return bo;
    }

    @Override
    public Long getFWModelId() {
        return orderCompanyId;
    }

    @Override
    public String catchName() {
        return orderCompanyId.toString();
    }
    
    //Huypq-20190924-start
    private Long createdUser;
    private Date updateDate;
    private Long updateUser;

	public Long getCreatedUser() {
		return createdUser;
	}

	public void setCreatedUser(Long createdUser) {
		this.createdUser = createdUser;
	}

	public Date getUpdateDate() {
		return updateDate;
	}

	public void setUpdateDate(Date updateDate) {
		this.updateDate = updateDate;
	}

	public Long getUpdateUser() {
		return updateUser;
	}

	public void setUpdateUser(Long updateUser) {
		this.updateUser = updateUser;
	}
    
    
    //Huy-end
}
