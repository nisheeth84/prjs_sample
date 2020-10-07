package com.viettel.aio.business;

import com.viettel.aio.dto.SysUserDTO;

import java.util.List;

/**
 * @author hailh10
 */

public interface SysUserBusiness {

//	SysUserDTO findByLoginName(String name);
//
//	List<SysUserDTO> doSearch(SysUserDTO obj);
	
	List<SysUserDTO> getForAutoComplete(SysUserDTO query);
}
