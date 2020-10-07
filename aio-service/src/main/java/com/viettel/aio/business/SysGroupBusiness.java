package com.viettel.aio.business;

import com.viettel.aio.dto.SysGroupDTO;

import java.util.List;

/**
 * @author hailh10
 */

public interface SysGroupBusiness {

//	SysGroupDTO findByCode(String value);
//
//	SysGroupDTO findByCodeForImport(String value) ;
//
	List<SysGroupDTO> doSearch(SysGroupDTO obj);
	
	List<SysGroupDTO> getForAutoComplete(SysGroupDTO query);
	
//	List<SysGroupDTO> getForComboBox(SysGroupDTO query);
}
