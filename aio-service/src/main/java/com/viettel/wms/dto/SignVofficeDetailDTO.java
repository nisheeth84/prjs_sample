package com.viettel.wms.dto;

import com.viettel.wms.bo.SignVofficeDetailBO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name = "SIGN_VOFFICE_DETAILBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class SignVofficeDetailDTO extends wmsBaseDTO<SignVofficeDetailBO> {

    private java.lang.Long signVofficeDetailId;
    private java.lang.Long odrerType;
    private java.lang.String orderName;
    private java.lang.Long roleId;
    private java.lang.String roleName;
    private java.lang.Long signVofficeId;
    private java.lang.Long sysUserId;
    private java.lang.String sysUserName;
    private java.lang.Long bussTypeId;

    @Override
    public String catchName() {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public Long getFWModelId() {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public SignVofficeDetailBO toModel() {
        SignVofficeDetailBO signVofficeDetailBO = new SignVofficeDetailBO();
        signVofficeDetailBO.setSignVofficeDetailId(this.signVofficeDetailId);
        signVofficeDetailBO.setOrderName(this.orderName);
        signVofficeDetailBO.setOdrerType(this.odrerType);
        signVofficeDetailBO.setRoleId(this.roleId);
        signVofficeDetailBO.setRoleName(this.roleName);
        signVofficeDetailBO.setSignVofficeId(this.signVofficeId);
        signVofficeDetailBO.setSysUserId(this.sysUserId);
        signVofficeDetailBO.setBussTypeId(this.bussTypeId);
        return signVofficeDetailBO;
    }

    public java.lang.Long getSignVofficeDetailId() {
        return signVofficeDetailId;
    }

    public void setSignVofficeDetailId(java.lang.Long signVofficeDetailId) {
        this.signVofficeDetailId = signVofficeDetailId;
    }


    public java.lang.Long getOdrerType() {
		return odrerType;
	}

	public void setOdrerType(java.lang.Long odrerType) {
		this.odrerType = odrerType;
	}

	public java.lang.String getOrderName() {
		return orderName;
	}

	public void setOrderName(java.lang.String orderName) {
		this.orderName = orderName;
	}

	public java.lang.Long getBussTypeId() {
		return bussTypeId;
	}

	public void setBussTypeId(java.lang.Long bussTypeId) {
		this.bussTypeId = bussTypeId;
	}

	public java.lang.Long getRoleId() {
        return roleId;
    }

    public void setRoleId(java.lang.Long roleId) {
        this.roleId = roleId;
    }

    public java.lang.String getRoleName() {
        return roleName;
    }

    public void setRoleName(java.lang.String roleName) {
        this.roleName = roleName;
    }

    public java.lang.Long getSignVofficeId() {
        return signVofficeId;
    }

    public void setSignVofficeId(java.lang.Long signVofficeId) {
        this.signVofficeId = signVofficeId;
    }

    public java.lang.Long getSysUserId() {
        return sysUserId;
    }

    public void setSysUserId(java.lang.Long sysUserId) {
        this.sysUserId = sysUserId;
    }

    public java.lang.String getSysUserName() {
        return sysUserName;
    }

    public void setSysUserName(java.lang.String sysUserName) {
        this.sysUserName = sysUserName;
    }

}
