/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.aio.rest;

import com.viettel.aio.business.AppParamBusinessImpl;
import com.viettel.aio.dto.AppParamDTO;
import com.viettel.service.base.dto.DataListDTO;
import org.springframework.beans.factory.annotation.Autowired;

import javax.ws.rs.core.Response;
import java.util.List;

public class AppParamRsServiceImpl implements AppParamRsService {

	@Autowired
	AppParamBusinessImpl appParamRsServiceImpl;
	
	@Override
	public Response doSearch(AppParamDTO obj) {
		List<AppParamDTO> ls = appParamRsServiceImpl.doSearch(obj);
		if (ls == null) {
			return Response.status(Response.Status.BAD_REQUEST).build();
		} else {
			DataListDTO data = new DataListDTO();
			data.setData(ls);
			data.setTotal(obj.getTotalRecord());
			data.setSize(ls.size());
			data.setStart(1);
			return Response.ok(data).build();
		}
	}

	@Override
	public Response getForAutoComplete(AppParamDTO obj) {
		List<AppParamDTO> ls = appParamRsServiceImpl.doSearch(obj);
		return Response.ok(ls).build();
	}

}
