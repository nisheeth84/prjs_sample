package com.viettel.wms.bo;

import com.viettel.service.base.dto.BaseFWDTOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;
import com.viettel.wms.dto.SignVofficeDetailDTO;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@Entity
@Table(name = "SIGN_VOFFICE_DETAIL")
public class SignVofficeDetailBO extends BaseFWModelImpl {

	@Id
	@GeneratedValue(generator = "sequence")
	@GenericGenerator(name = "sequence", strategy = "sequence", parameters = { @Parameter(name = "sequence", value = "SIGN_VOFFICE_DETAIL_SEQ") })
	@Column(name = "SIGN_VOFFICE_DETAIL_ID", length = 22)
	private java.lang.Long signVofficeDetailId;
	@Column(name = "ODRER_TYPE", length = 2)
	private java.lang.Long odrerType;
	@Column(name = "ORDER_NAME", length = 100)
	private java.lang.String orderName;
	@Column(name = "ROLE_ID", length = 22)
	private java.lang.Long roleId;
	@Column(name = "ROLE_NAME", length = 100)
	private java.lang.String roleName;
	@Column(name = "SIGN_VOFFICE_ID", length = 22)
	private java.lang.Long signVofficeId;
	@Column(name = "SYS_USER_ID", length = 22)
	private java.lang.Long sysUserId;
	@Column(name = "OBJECT_ID", length = 22)
	private java.lang.Long objectId;
	@Column(name = "BUSS_TYPE_ID", length = 22)
	private java.lang.Long bussTypeId;

	public java.lang.Long getObjectId() {
		return objectId;
	}

	public void setObjectId(java.lang.Long objectId) {
		this.objectId = objectId;
	}

	public SignVofficeDetailBO() {
		setColId("signVofficeDetailId");
		setColName("signVofficeDetailId");
		setUniqueColumn(new String[] { "signVofficeDetailId" });
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

	@Override
	public BaseFWDTOImpl toDTO() {
		SignVofficeDetailDTO signVofficeDetailDTO = new SignVofficeDetailDTO();
		signVofficeDetailDTO.setSignVofficeDetailId(this.signVofficeDetailId);
		signVofficeDetailDTO.setOrderName(this.orderName);
		signVofficeDetailDTO.setOdrerType(this.odrerType);
		signVofficeDetailDTO.setRoleId(this.roleId);
		signVofficeDetailDTO.setRoleName(this.roleName);
		signVofficeDetailDTO.setSignVofficeId(this.signVofficeId);
		signVofficeDetailDTO.setSysUserId(this.sysUserId);
		signVofficeDetailDTO.setBussTypeId(this.bussTypeId);
		return signVofficeDetailDTO;

	}

}
