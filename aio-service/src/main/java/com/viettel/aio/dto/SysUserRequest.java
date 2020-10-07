package com.viettel.aio.dto;

import com.viettel.asset.dto.AuthenticationInfo;
import com.viettel.asset.dto.BaseWsRequest;
import com.viettel.passport.Authen;
import com.viettel.passport.AuthenResponse;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class SysUserRequest extends BaseWsRequest {
    private long sysUserId;
    private long departmentId;
    private String sysGroupId;
    private int flag;
    private String dataImage;
    private String nameImage;
    private String name;
    private String authorities;
    private AuthenticationInfo authenticationInfo;

	public AuthenticationInfo getAuthenticationInfo() {
		return authenticationInfo;
	}

	public void setAuthenticationInfo(AuthenticationInfo authenticationInfo) {
		this.authenticationInfo = authenticationInfo;
	}

	public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getNameImage() {
        return nameImage;
    }

    public void setNameImage(String nameImage) {
        this.nameImage = nameImage;
    }

    public String getDataImage() {
        return dataImage;
    }

    public void setDataImage(String dataImage) {
        this.dataImage = dataImage;
    }

    public int getFlag() {
        return flag;
    }

    public void setFlag(int flag) {
        this.flag = flag;
    }

    public String getSysGroupId() {
        return sysGroupId;
    }

    public void setSysGroupId(String sysGroupId) {
        this.sysGroupId = sysGroupId;
    }

    public long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(long departmentId) {
        this.departmentId = departmentId;
    }

    public long getSysUserId() {
        return sysUserId;
    }

    public void setSysUserId(long sysUserId) {
        this.sysUserId = sysUserId;
    }

    public String getAuthorities() {
        return authorities;
    }

    public void setAuthorities(String authorities) {
        this.authorities = authorities;
    }
}
