package com.viettel.coms.bo;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import com.viettel.coms.dto.UserConfigDTO;
import com.viettel.service.base.model.BaseFWModelImpl;


@SuppressWarnings("serial")
@Entity(name = "com.viettel.kcs.bo.UserConfigBO")
@Table(name = "USER_CONFIG")
public class UserConfigBO extends BaseFWModelImpl{
	private java.lang.Long userConfigId;
	private java.lang.Long sysUserId;
	private java.lang.String vofficePass;
	private java.lang.String vofficeUser;
	
	@Id
	@GeneratedValue(generator = "sequence")
	@GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
	@Parameter(name = "sequence", value = "USER_CONFIG_SEQ") })
	@Column(name = "USER_CONFIG_ID", length = 22, nullable = false)
	public java.lang.Long getUserConfigId() {
		return userConfigId;
	}

	public void setUserConfigId(java.lang.Long userConfigId) {
		this.userConfigId = userConfigId;
	}
	
	@Column(name = "SYS_USER_ID", length = 22)
	public java.lang.Long getSysUserId() {
		return sysUserId;
	}

	public void setSysUserId(java.lang.Long sysUserId) {
		this.sysUserId = sysUserId;
	}

	@Column(name = "VOFFICE_PASS", length = 1000)
	public java.lang.String getVofficePass() {
		return vofficePass;
	}

	public void setVofficePass(java.lang.String vofficePass) {
		this.vofficePass = vofficePass;
	}

	@Column(name = "VOFFICE_USER", length = 400)
	public java.lang.String getVofficeUser() {
		return vofficeUser;
	}

	public void setVofficeUser(java.lang.String vofficeUser) {
		this.vofficeUser = vofficeUser;
	}

	@Override
	public UserConfigDTO toDTO() {
		UserConfigDTO userConfigDTO = new UserConfigDTO();
		userConfigDTO.setUserConfigId(this.userConfigId);
		userConfigDTO.setSysUserId(this.sysUserId);
		userConfigDTO.setVofficePass(this.vofficePass);
		userConfigDTO.setVofficeUser(this.vofficeUser);
		return userConfigDTO;
	}
}
