package com.viettel.aio.business;

import com.viettel.aio.bo.SysGroupBO;
import com.viettel.aio.dao.SysGroupDAO;
import com.viettel.aio.dto.SysGroupDTO;
import com.viettel.service.base.business.BaseFWBusinessImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Service;

import java.util.List;


@Service("AIOsysGroupBusinessImpl")
@Scope(proxyMode = ScopedProxyMode.TARGET_CLASS)
public class SysGroupBusinessImpl extends BaseFWBusinessImpl<SysGroupDAO, SysGroupDTO, SysGroupBO> implements SysGroupBusiness {

    @Autowired
    private SysGroupDAO sysGroupDAO;
     
    public SysGroupBusinessImpl() {
        tModel = new SysGroupBO();
        tDAO = sysGroupDAO;
    }

    @Override
    public SysGroupDAO gettDAO() {
        return sysGroupDAO;
    }
	
//	@Override
//	public SysGroupDTO findByCode(String value) {
//		return sysGroupDAO.findByCode(value);
//	}
//
	@Override
	public List<SysGroupDTO> doSearch(SysGroupDTO obj) {
		return sysGroupDAO.doSearch(obj);
	}
	
	@Override
	public List<SysGroupDTO> getForAutoComplete(SysGroupDTO query) {
		return sysGroupDAO.getForAutoComplete(query);
	}

	
//	public SysGroupDTO getById(Long id) {
//		return sysGroupDAO.getById(id);
//	}
//
//	@Override
//	public List<SysGroupDTO> getForComboBox(SysGroupDTO query) {
//		return sysGroupDAO.getForComboBox(query);
//	}
//
//	@Override
//	public SysGroupDTO findByCodeForImport(String value) {
//		return sysGroupDAO.findByCodeForImport(value);
//	}
}
