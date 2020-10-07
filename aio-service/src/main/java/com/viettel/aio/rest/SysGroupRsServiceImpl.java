package com.viettel.aio.rest;

import com.viettel.aio.business.SysGroupBusinessImpl;
import com.viettel.aio.dto.SysGroupDTO;
import com.viettel.erp.dto.DataListDTO;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.List;

/**
 * @author hailh10
 */

public class SysGroupRsServiceImpl implements SysGroupRsService {

	protected final Logger log = Logger.getLogger(SysGroupRsService.class);
	@Autowired
	SysGroupBusinessImpl sysGroupBusinessImpl;

	@Override
	public Response doSearch(SysGroupDTO obj) {
		List<SysGroupDTO> ls = sysGroupBusinessImpl.doSearch(obj);
		if (ls == null) {
			return Response.status(Response.Status.BAD_REQUEST).build();
		} else {
			DataListDTO data = new DataListDTO();
			data.setData(ls);
			data.setTotal(obj.getTotalRecord());
			data.setSize(obj.getPageSize());
			data.setStart(1);
			return Response.ok(data).build();
		}
	}
//
//	@Override
//	public Response getById(Long id) {
//		SysGroupDTO obj = (SysGroupDTO) sysGroupBusinessImpl.getById(id);
//		if (obj == null) {
//			return Response.status(Response.Status.BAD_REQUEST).build();
//		} else {
//			return Response.ok(obj).build();
//		}
//	}




	@Override
	public Response getForAutoComplete(SysGroupDTO obj) {
		List<String>groupLevelLst = new ArrayList<String>();
		groupLevelLst.add("1");
		groupLevelLst.add("2");
		obj.setGroupLevelLst(groupLevelLst);
		List<SysGroupDTO> results = sysGroupBusinessImpl.getForAutoComplete(obj);
		return Response.ok(results).build();
	}

//	@Override
//	public Response getForComboBox(SysGroupDTO obj) {
//		List<SysGroupDTO> results = sysGroupBusinessImpl.getForComboBox(obj);
//		return Response.ok(results).build();
//	}

}
