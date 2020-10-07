package com.viettel.coms.dto;

import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.annotate.JsonProperty;

import com.viettel.coms.bo.UserConfigBO;
import com.viettel.wms.dto.wmsBaseDTO;

@SuppressWarnings("serial")
@XmlRootElement(name = "USERCONFIGBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class UserConfigDTO extends wmsBaseDTO<UserConfigBO>{
	private java.lang.Long userConfigId;
	private java.lang.Long sysUserId;
	private java.lang.String vofficePass;
	private java.lang.String vofficeUser;
	
	@Override
	public UserConfigBO toModel() {
		UserConfigBO userConfigBO = new UserConfigBO();
		userConfigBO.setUserConfigId(this.userConfigId);
		userConfigBO.setSysUserId(this.sysUserId);
		userConfigBO.setVofficePass(this.vofficePass);
		userConfigBO.setVofficeUser(this.vofficeUser);
		return userConfigBO;
	}

	@Override
	public Long getFWModelId() {
		return userConfigId;
	}

	@Override
	public String catchName() {
		return getUserConfigId().toString();
	}

	@JsonProperty("userConfigId")
	public java.lang.Long getUserConfigId() {
		return userConfigId;
	}

	public void setUserConfigId(java.lang.Long userConfigId) {
		this.userConfigId = userConfigId;
	}

	@JsonProperty("sysUserId")
	public java.lang.Long getSysUserId() {
		return sysUserId;
	}

	public void setSysUserId(java.lang.Long sysUserId) {
		this.sysUserId = sysUserId;
	}

	@JsonProperty("vofficePass")
	public java.lang.String getVofficePass() {
		return vofficePass;
	}

	public void setVofficePass(java.lang.String vofficePass) {
		this.vofficePass = vofficePass;
	}

	@JsonProperty("vofficeUser")
	public java.lang.String getVofficeUser() {
		return vofficeUser;
	}

	public void setVofficeUser(java.lang.String vofficeUser) {
		this.vofficeUser = vofficeUser;
	}
}
