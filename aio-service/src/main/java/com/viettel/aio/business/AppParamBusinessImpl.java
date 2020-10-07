package com.viettel.aio.business;

import com.viettel.aio.bo.AppParamBO;
import com.viettel.aio.dao.AppParamDAO;
import com.viettel.aio.dto.AppParamDTO;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import com.viettel.service.base.dto.DataListDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("AIOappParamBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class AppParamBusinessImpl extends BaseFWBusinessImpl<AppParamDAO, AppParamDTO, AppParamBO> implements AppParamBusiness {

	@Autowired
	private AppParamDAO appParamDAO;
	
	@Override
	public List<AppParamDTO> doSearch(AppParamDTO obj) {
		List<AppParamDTO> ls = appParamDAO.doSearch(obj);
		DataListDTO data = new DataListDTO();
		data.setData(ls);
		data.setTotal(obj.getTotalRecord());
		data.setSize(obj.getPageSize());
		data.setStart(1);
		return ls;
	}


}
