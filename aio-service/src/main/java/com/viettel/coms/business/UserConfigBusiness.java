package com.viettel.coms.business;

import com.viettel.coms.dto.UserConfigDTO;

public interface UserConfigBusiness {
	
	UserConfigDTO findByUser(String value);
	
	public void saveObject(UserConfigDTO obj);

	public void updateObject(UserConfigDTO obj);
	
	public UserConfigDTO findBySysUserId(Long sysUserId);
	
	public UserConfigDTO getSysUser(String email);
}
