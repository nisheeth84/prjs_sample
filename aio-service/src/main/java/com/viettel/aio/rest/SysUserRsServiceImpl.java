package com.viettel.aio.rest;

import com.viettel.aio.business.SysUserBusinessImpl;
import com.viettel.aio.dto.SysUserDTO;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import javax.ws.rs.core.Response;
import java.util.List;

/**
 * @author hailh10
 */
 
public class SysUserRsServiceImpl implements SysUserRsService {

	protected final Logger log = Logger.getLogger(SysUserRsService.class);
	@Autowired
	SysUserBusinessImpl sysUserBusinessImpl;

//	@Override
//	public Response doSearch(SysUserDTO obj) {
//		List<SysUserDTO> ls = sysUserBusinessImpl.doSearch(obj);
//		if (ls == null) {
//			return Response.status(Response.Status.BAD_REQUEST).build();
//		} else {
//			DataListDTO data = new DataListDTO();
//			data.setData(ls);
//			data.setTotal(obj.getTotalRecord());
//			data.setSize(ls.size());
//			data.setStart(1);
//			return Response.ok(data).build();
//		}
//	}
//
//	@Override
//	public Response getById(Long id) {
//		SysUserDTO obj = (SysUserDTO) sysUserBusinessImpl.getById(id);
//		if (obj == null) {
//			return Response.status(Response.Status.BAD_REQUEST).build();
//		} else {
//			return Response.ok(obj).build();
//		}
//	}
	@Override
	public Response getForAutoComplete(SysUserDTO obj) {
		List<SysUserDTO> results = sysUserBusinessImpl.getForAutoComplete(obj);
//		if (obj.getIsSize()){
//			SysUserDTO moreObject = new SysUserDTO();
//			moreObject.setSysUserId(0l);;
//			
//			results.add(moreObject);
//		}
		return Response.ok(results).build();
	}
	
}
