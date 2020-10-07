package com.viettel.coms.business;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import com.viettel.coms.bo.UserConfigBO;
import com.viettel.coms.dao.UserConfigDAO;
import com.viettel.coms.dto.UserConfigDTO;
import com.viettel.service.base.business.BaseFWBusinessImpl;

@Service("userConfigBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class UserConfigBusinessImpl  extends BaseFWBusinessImpl<UserConfigDAO, UserConfigDTO, UserConfigBO> implements UserConfigBusiness {
	@Autowired
	private UserConfigDAO userConfigDAO;
	
	public UserConfigBusinessImpl() {
		tModel = new UserConfigBO();
		tDAO = userConfigDAO;
	}
	
	@Override
	public UserConfigDTO findByUser(String value) {
		return userConfigDAO.findByUser(value);
	}
	
	@Override
	public UserConfigDTO findBySysUserId(Long sysUserId) {
		return userConfigDAO.findBySysUserId(sysUserId);
	}
	
	@Override
	public void saveObject(UserConfigDTO obj) {
		userConfigDAO.saveObject(obj.toModel());
	}
	
	@Override
	public void updateObject(UserConfigDTO obj) {
		userConfigDAO.updateObject(obj.toModel());
	}
	
	@Override
	public UserConfigDTO getSysUser(String email) {
		return userConfigDAO.getSysUser(email);
	}
}
